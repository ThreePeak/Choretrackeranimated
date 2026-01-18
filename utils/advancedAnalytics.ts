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
