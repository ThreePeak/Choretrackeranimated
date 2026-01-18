import { subDays, subMonths, subYears, startOfDay, format, eachDayOfInterval, getHours, getDay } from 'date-fns';
import { AnalyticsMetrics, ChoreLog, Chore, Member } from '../types';
import { getTimestamp, estimateChoreDuration } from '../utils';

export const calculateAnalytics = (
    logs: ChoreLog[],
    chores: Chore[],
    members: Member[],
    period: 'week' | 'month' | 'year' | 'all'
): AnalyticsMetrics => {
    const now = new Date();
    let startDate: Date;
    let endDate = now;

    // Determine date range
    switch (period) {
        case 'week':
            startDate = startOfDay(subDays(now, 7));
            break;
        case 'month':
            startDate = startOfDay(subMonths(now, 1));
            break;
        case 'year':
            startDate = startOfDay(subYears(now, 1));
            break;
        case 'all':
        default:
            if (logs.length > 0) {
                const timestamps = logs.map(l => getTimestamp(l.timestamp));
                startDate = new Date(Math.min(...timestamps));
            } else {
                startDate = startOfDay(subMonths(now, 1));
            }
    }

    // Filter logs by date range
    const filteredLogs = logs.filter(log => {
        const logTime = getTimestamp(log.timestamp);
        return logTime >= startDate.getTime() && logTime <= endDate.getTime();
    });

    // Calculate previous period for trends
    const periodDuration = endDate.getTime() - startDate.getTime();
    const previousStartDate = new Date(startDate.getTime() - periodDuration);
    const previousLogs = logs.filter(log => {
        const logTime = getTimestamp(log.timestamp);
        return logTime >= previousStartDate.getTime() && logTime < startDate.getTime();
    });

    // Basic metrics
    const totalTasks = filteredLogs.length;
    const totalXP = filteredLogs.reduce((sum, log) => {
        const chore = chores.find(c => c.id === log.choreId);
        return sum + (chore?.xp || 0);
    }, 0);

    const totalHours = filteredLogs.reduce((sum, log) => {
        const chore = chores.find(c => c.id === log.choreId);
        const estMinutes = chore?.estMinutes || estimateChoreDuration(chore?.name || '');
        return sum + (estMinutes / 60);
    }, 0);

    const dayCount = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const avgTasksPerDay = totalTasks / dayCount;
    const avgTasksPerMember = members.length > 0 ? totalTasks / members.length : 0;

    // Category breakdown
    const categoryMap: Record<string, { count: number; xp: number; hours: number }> = {};
    filteredLogs.forEach(log => {
        const chore = chores.find(c => c.id === log.choreId);
        const category = chore?.category || 'General';
        const xp = chore?.xp || 0;
        const estMinutes = chore?.estMinutes || estimateChoreDuration(chore?.name || '');

        if (!categoryMap[category]) {
            categoryMap[category] = { count: 0, xp: 0, hours: 0 };
        }
        categoryMap[category].count++;
        categoryMap[category].xp += xp;
        categoryMap[category].hours += estMinutes / 60;
    });

    const categoryBreakdown = Object.entries(categoryMap).map(([category, data]) => ({
        category,
        ...data
    })).sort((a, b) => b.count - a.count);

    // Member efficiency
    const memberStats: Record<string, { taskCount: number; actualHours: number }> = {};
    members.forEach(m => {
        memberStats[m.id] = { taskCount: 0, actualHours: 0 };
    });

    filteredLogs.forEach(log => {
        if (memberStats[log.memberId]) {
            const chore = chores.find(c => c.id === log.choreId);
            const estMinutes = chore?.estMinutes || estimateChoreDuration(chore?.name || '');
            memberStats[log.memberId].taskCount++;
            memberStats[log.memberId].actualHours += estMinutes / 60;
        }
    });

    const memberEfficiency = members.map(member => ({
        memberId: member.id,
        name: member.name,
        actualHours: memberStats[member.id].actualHours,
        taskCount: memberStats[member.id].taskCount
    })).sort((a, b) => b.taskCount - a.taskCount);

    // Peak hours
    const hourCounts: Record<number, number> = {};
    for (let i = 0; i < 24; i++) hourCounts[i] = 0;

    filteredLogs.forEach(log => {
        const hour = getHours(new Date(getTimestamp(log.timestamp)));
        hourCounts[hour]++;
    });

    const peakHours = Object.entries(hourCounts)
        .map(([hour, count]) => ({ hour: parseInt(hour), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    // Busy days
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayCounts: Record<string, number> = {};
    dayNames.forEach(day => dayCounts[day] = 0);

    filteredLogs.forEach(log => {
        const dayOfWeek = getDay(new Date(getTimestamp(log.timestamp)));
        dayCounts[dayNames[dayOfWeek]]++;
    });

    const busyDays = Object.entries(dayCounts)
        .map(([day, count]) => ({ day, count }))
        .sort((a, b) => b.count - a.count);

    // Completion trend (daily)
    const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });
    const dailyCounts: Record<string, { count: number; xp: number }> = {};

    daysInRange.forEach(date => {
        const dateKey = format(date, 'MMM dd');
        dailyCounts[dateKey] = { count: 0, xp: 0 };
    });

    filteredLogs.forEach(log => {
        const dateKey = format(new Date(getTimestamp(log.timestamp)), 'MMM dd');
        if (dailyCounts[dateKey]) {
            dailyCounts[dateKey].count++;
            const chore = chores.find(c => c.id === log.choreId);
            dailyCounts[dateKey].xp += chore?.xp || 0;
        }
    });

    const completionTrend = Object.entries(dailyCounts).map(([date, data]) => ({
        date,
        count: data.count,
        xp: data.xp
    }));

    // Completion rate (scheduled vs completed - for now, use total as baseline)
    const completionRate = 100; // Will be more meaningful with recurring chores

    // Trends vs previous period
    const previousTotalTasks = previousLogs.length;
    const previousTotalXP = previousLogs.reduce((sum, log) => {
        const chore = chores.find(c => c.id === log.choreId);
        return sum + (chore?.xp || 0);
    }, 0);

    const tasksChange = previousTotalTasks > 0
        ? ((totalTasks - previousTotalTasks) / previousTotalTasks) * 100
        : 0;
    const xpChange = previousTotalXP > 0
        ? ((totalXP - previousTotalXP) / previousTotalXP) * 100
        : 0;

    const previousUniqueMembers = new Set(previousLogs.map(l => l.memberId)).size;
    const currentUniqueMembers = new Set(filteredLogs.map(l => l.memberId)).size;
    const participationChange = previousUniqueMembers > 0
        ? ((currentUniqueMembers - previousUniqueMembers) / previousUniqueMembers) * 100
        : 0;

    return {
        period,
        startDate,
        endDate,
        metrics: {
            totalTasks,
            totalXP,
            totalHours: parseFloat(totalHours.toFixed(1)),
            avgTasksPerDay: parseFloat(avgTasksPerDay.toFixed(1)),
            avgTasksPerMember: parseFloat(avgTasksPerMember.toFixed(1)),
            completionRate,
            categoryBreakdown,
            memberEfficiency,
            peakHours,
            busyDays,
            completionTrend
        },
        trends: {
            tasksChange: parseFloat(tasksChange.toFixed(1)),
            xpChange: parseFloat(xpChange.toFixed(1)),
            participationChange: parseFloat(participationChange.toFixed(1))
        }
    };
};
