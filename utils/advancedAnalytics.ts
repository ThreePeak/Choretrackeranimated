import { ChoreLog, Member, Chore, ProductivityHeatmap, TimeAnalytics, TrendData } from '../types';

// Calculate average completion time per chore
export const calculateTimeAnalytics = (logs: ChoreLog[], chores: Chore[]): TimeAnalytics[] => {
    const choreStats = new Map<string, { times: number[]; total: number }>();

    logs.forEach(log => {
        const chore = chores.find(c => c.id === log.choreId);
        if (!chore || !chore.estMinutes) return;

        if (!choreStats.has(log.choreId)) {
            choreStats.set(log.choreId, { times: [], total: 0 });
        }

        const stats = choreStats.get(log.choreId)!;
        stats.times.push(chore.estMinutes);
        stats.total++;
    });

    return Array.from(choreStats.entries()).map(([choreId, stats]) => ({
        choreId,
        averageCompletionMinutes: stats.times.reduce((a, b) => a + b, 0) / stats.times.length,
        fastestCompletion: Math.min(...stats.times),
        slowestCompletion: Math.max(...stats.times),
        totalCompletions: stats.total,
    }));
};

// Calculate productivity heatmap
export const calculateProductivityHeatmap = (logs: ChoreLog[], chores: Chore[]): ProductivityHeatmap[] => {
    const heatmap = new Map<string, ProductivityHeatmap>();

    logs.forEach(log => {
        const date = new Date(log.timestamp);
        const dayOfWeek = date.getDay();
        const hour = date.getHours();
        const key = `${dayOfWeek}-${hour}`;

        const chore = chores.find(c => c.id === log.choreId);
        const xp = chore?.xp || 0;

        if (!heatmap.has(key)) {
            heatmap.set(key, {
                dayOfWeek,
                hour,
                completionCount: 0,
                totalXP: 0,
            });
        }

        const cell = heatmap.get(key)!;
        cell.completionCount++;
        cell.totalXP += xp;
    });

    return Array.from(heatmap.values());
};

// Calculate trend data over time
export const calculateTrendData = (
    logs: ChoreLog[],
    members: Member[],
    chores: Chore[],
    days: number = 30
): TrendData[] => {
    const trends: TrendData[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const dayLogs = logs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= date && logDate < nextDate;
        });

        const memberStats: Record<string, { chores: number; xp: number }> = {};
        members.forEach(member => {
            const memberLogs = dayLogs.filter(l => l.memberId === member.id);
            memberStats[member.id] = {
                chores: memberLogs.length,
                xp: memberLogs.reduce((sum, log) => {
                    const chore = chores.find(c => c.id === log.choreId);
                    return sum + (chore?.xp || 0);
                }, 0),
            };
        });

        trends.push({
            date: date.toISOString().split('T')[0],
            totalChores: dayLogs.length,
            totalXP: Object.values(memberStats).reduce((sum, s) => sum + s.xp, 0),
            memberStats,
        });
    }

    return trends;
};

// Forecast future workload
export const forecastWorkload = (trendData: TrendData[], daysAhead: number = 7): number[] => {
    if (trendData.length < 7) return Array(daysAhead).fill(0);

    // Simple moving average forecast
    const recentAvg = trendData.slice(-7).reduce((sum, d) => sum + d.totalChores, 0) / 7;
    const weekBeforeAvg = trendData.slice(-14, -7).reduce((sum, d) => sum + d.totalChores, 0) / 7;

    const trend = recentAvg - weekBeforeAvg;

    return Array.from({ length: daysAhead }, (_, i) =>
        Math.max(0, Math.round(recentAvg + trend * (i + 1)))
    );
};

// Main analytics function that aggregates all analytics
export const calculateAnalytics = (logs: ChoreLog[], members: Member[], chores: Chore[], period: 'week' | 'month' | 'year' | 'all' = 'all') => {
    // Calculate total metrics
    const totalTasks = logs.length;
    const totalXP = logs.reduce((sum, log) => {
        const chore = chores.find(c => c.id === log.choreId);
        return sum + (chore?.xp || 0);
    }, 0);
    const totalHours = logs.reduce((sum, log) => {
        const chore = chores.find(c => c.id === log.choreId);
        return sum + ((chore?.estMinutes || 0) / 60);
    }, 0);

    // Calculate completion trend by date
    const trendMap = new Map<string, { count: number; xp: number }>();
    logs.forEach(log => {
        const date = new Date(log.timestamp).toISOString().split('T')[0];
        if (!trendMap.has(date)) {
            trendMap.set(date, { count: 0, xp: 0 });
        }
        const entry = trendMap.get(date)!;
        entry.count++;
        const chore = chores.find(c => c.id === log.choreId);
        entry.xp += (chore?.xp || 0);
    });
    const completionTrend = Array.from(trendMap.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30); // Last 30 days

    // Category breakdown
    const categoryMap = new Map<string, { count: number; xp: number; hours: number }>();
    logs.forEach(log => {
        const chore = chores.find(c => c.id === log.choreId);
        const category = chore?.category || 'Uncategorized';
        if (!categoryMap.has(category)) {
            categoryMap.set(category, { count: 0, xp: 0, hours: 0 });
        }
        const entry = categoryMap.get(category)!;
        entry.count++;
        entry.xp += (chore?.xp || 0);
        entry.hours += ((chore?.estMinutes || 0) / 60);
    });
    const categoryBreakdown = Array.from(categoryMap.entries())
        .map(([category, data]) => ({ category, ...data }))
        .sort((a, b) => b.count - a.count);

    // Member efficiency with advanced metrics
    const memberEfficiency = members.map(member => {
        const memberLogs = logs.filter(l => l.memberId === member.id);
        const memberXP = memberLogs.reduce((sum, log) => {
            const chore = chores.find(c => c.id === log.choreId);
            return sum + (chore?.xp || 0);
        }, 0);
        const memberHours = memberLogs.reduce((sum, log) => {
            const chore = chores.find(c => c.id === log.choreId);
            return sum + ((chore?.estMinutes || 0) / 60);
        }, 0);

        return {
            name: member.name,
            taskCount: memberLogs.length,
            xp: memberXP,
            xpPerTask: memberLogs.length > 0 ? Math.round(memberXP / memberLogs.length) : 0,
            hoursWorked: memberHours.toFixed(1),
            efficiency: memberHours > 0 ? Math.round(memberXP / memberHours) : 0 // XP per hour
        };
    }).sort((a, b) => b.taskCount - a.taskCount);

    // Peak hours
    const hourMap = new Map<number, number>();
    logs.forEach(log => {
        const hour = new Date(log.timestamp).getHours();
        hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    });
    const peakHours = Array.from(hourMap.entries())
        .map(([hour, count]) => ({ hour, count }))
        .sort((a, b) => b.count - a.count);

    // Busy days  
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayMap = new Map<number, number>();
    logs.forEach(log => {
        const day = new Date(log.timestamp).getDay();
        dayMap.set(day, (dayMap.get(day) || 0) + 1);
    });
    const busyDays = Array.from(dayMap.entries())
        .map(([day, count]) => ({ day: dayNames[day], count }))
        .sort((a, b) => b.count - a.count);

    // Streak calculation
    const sortedDates = Array.from(trendMap.keys()).sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = sortedDates.length - 1; i >= 0; i--) {
        const current = new Date(sortedDates[i]);
        const next = i < sortedDates.length - 1 ? new Date(sortedDates[i + 1]) : new Date();
        const daysDiff = Math.floor((next.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1 || i === sortedDates.length - 1) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
            if (i === sortedDates.length - 1) {
                currentStreak = tempStreak;
            }
        } else {
            tempStreak = 1;
        }
    }

    // Workload forecast
    const avgLast7Days = completionTrend.slice(-7).reduce((sum, d) => sum + d.count, 0) / 7;
    const forecast = Array.from({ length: 7 }, (_, i) => ({
        day: ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'][i],
        predicted: Math.round(avgLast7Days)
    }));

    // Insights & Recommendations
    const insights = [];

    // Most productive member
    const topMember = memberEfficiency[0];
    if (topMember) {
        insights.push({
            type: 'success',
            title: 'Top Performer',
            message: `${topMember.name} has completed ${topMember.taskCount} tasks with ${topMember.efficiency} XP/hour efficiency!`
        });
    }

    // Busiest time insight
    if (peakHours.length > 0) {
        const peakHour = peakHours[0];
        insights.push({
            type: 'info',
            title: 'Peak Productivity',
            message: `Most tasks completed around ${peakHour.hour}:00 (${peakHour.count} tasks)`
        });
    }

    // Streak insight
    if (currentStreak >= 3) {
        insights.push({
            type: 'success',
            title: 'Great Streak!',
            message: `${currentStreak} days in a row! Keep it going!`
        });
    }

    // Workload balance insight
    const maxTasks = Math.max(...memberEfficiency.map(m => m.taskCount));
    const minTasks = Math.min(...memberEfficiency.map(m => m.taskCount));
    if (maxTasks - minTasks > 10 && members.length > 1) {
        insights.push({
            type: 'warning',
            title: 'Workload Imbalance',
            message: `Task distribution is uneven. Consider redistributing for better balance.`
        });
    }

    return {
        metrics: {
            totalTasks,
            totalXP,
            totalHours: totalHours.toFixed(1),
            avgTasksPerDay: (totalTasks / Math.max(1, completionTrend.length)).toFixed(1),
            currentStreak,
            longestStreak,
            completionTrend,
            categoryBreakdown,
            memberEfficiency,
            peakHours,
            busyDays,
            forecast
        },
        trends: {
            tasksChange: completionTrend.length > 1
                ? ((completionTrend[completionTrend.length - 1].count - completionTrend[0].count) / Math.max(1, completionTrend[0].count)) * 100
                : 0,
            xpChange: completionTrend.length > 1
                ? ((completionTrend[completionTrend.length - 1].xp - completionTrend[0].xp) / Math.max(1, completionTrend[0].xp)) * 100
                : 0
        },
        insights
    };
};
