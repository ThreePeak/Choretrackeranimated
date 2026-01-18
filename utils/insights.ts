import { ChoreLog, Member } from '../types';
import { getTimestamp } from '../utils';

export interface Insight {
    type: 'warning' | 'info' | 'success';
    icon: string;
    message: string;
    priority: number; // 1-10, higher = more important
}

/**
 * Generate predictive insights based on household data
 */
export const generateInsights = (
    logs: ChoreLog[],
    members: Member[]
): Insight[] => {
    const insights: Insight[] = [];
    const now = Date.now();

    // Get logs from last 7 days
    const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const lastWeekLogs = logs.filter(l => getTimestamp(l.timestamp) >= weekAgo);

    // Get logs from last 30 days
    const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
    const lastMonthLogs = logs.filter(l => getTimestamp(l.timestamp) >= monthAgo);

    // Fatigue Detection
    if (members.length > 1) {
        const avgTasksPerMember = lastWeekLogs.length / members.length;

        members.forEach(member => {
            const memberTasks = lastWeekLogs.filter(l => l.memberId === member.id).length;

            if (memberTasks > avgTasksPerMember * 1.8) {
                const percentageMore = Math.round(((memberTasks / avgTasksPerMember) - 1) * 100);
                insights.push({
                    type: 'warning',
                    icon: '⚠️',
                    message: `${member.name} has completed ${memberTasks} tasks this week, ${percentageMore}% more than average. Watch for burnout!`,
                    priority: 8
                });
            } else if (memberTasks < avgTasksPerMember * 0.5 && avgTasksPerMember > 2) {
                insights.push({
                    type: 'info',
                    icon: '📊',
                    message: `${member.name} could help more - only ${memberTasks} tasks this week (avg: ${Math.round(avgTasksPerMember)})`,
                    priority: 6
                });
            }
        });
    }

    // Monthly Projection
    if (lastMonthLogs.length > 0) {
        const daysElapsed = Math.max(1, (now - getTimestamp(lastMonthLogs[lastMonthLogs.length - 1].timestamp)) / (24 * 60 * 60 * 1000));
        const tasksPerDay = lastMonthLogs.length / daysElapsed;
        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        const daysRemaining = daysInMonth - new Date().getDate();
        const projectedTotal = Math.round(lastMonthLogs.length + (tasksPerDay * daysRemaining));

        if (projectedTotal > lastMonthLogs.length * 1.2) {
            insights.push({
                type: 'success',
                icon: '📈',
                message: `On track for ${projectedTotal} tasks this month! Up from last month.`,
                priority: 5
            });
        } else {
            insights.push({
                type: 'info',
                icon: '📊',
                message: `Projected ${projectedTotal} tasks for this month based on current pace.`,
                priority: 4
            });
        }
    }

    // Streak Praise
    const today = new Date().toDateString();
    const yesterday = new Date(now - (24 * 60 * 60 * 1000)).toDateString();
    const todayHasLogs = logs.some(l => new Date(getTimestamp(l.timestamp)).toDateString() === today);
    const yesterdayHasLogs = logs.some(l => new Date(getTimestamp(l.timestamp)).toDateString() === yesterday);

    if (todayHasLogs && yesterdayHasLogs) {
        insights.push({
            type: 'success',
            icon: '🔥',
            message: 'Great job! Chores completed for 2+ days in a row!',
            priority: 7
        });
    }

    // Idle Warning
    const lastLog = logs.length > 0 ? logs[0] : null;
    if (lastLog) {
        const daysSinceLastLog = (now - getTimestamp(lastLog.timestamp)) / (24 * 60 * 60 * 1000);
        if (daysSinceLastLog > 3) {
            insights.push({
                type: 'warning',
                icon: '💤',
                message: `It's been ${Math.round(daysSinceLastLog)} days since last chore. Time to get back on track!`,
                priority: 9
            });
        }
    }

    // Sort by priority
    return insights.sort((a, b) => b.priority - a.priority).slice(0, 5); // Top 5 insights
};
