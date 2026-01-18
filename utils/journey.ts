import { ChoreLog, Member } from '../types';
import { getTimestamp } from '../utils';

export interface JourneyNode {
    id: string;
    date: Date;
    title: string;
    description: string;
    icon: string;
    participants: string[];  // Member IDs
    xpEarned: number;
    milestone?: boolean;
}

/**
 * Generate a visual journey map from chore completion history
 * Groups completions into milestones and achievements
 */
export const generateJourneyMap = (
    logs: ChoreLog[],
    members: Member[]
): JourneyNode[] => {
    const sortedLogs = [...logs].sort((a, b) => getTimestamp(a.timestamp) - getTimestamp(b.timestamp));

    const journeyNodes: JourneyNode[] = [];
    const groupSize = 10; // Group every 10 completions

    for (let i = 0; i < sortedLogs.length; i += groupSize) {
        const groupLogs = sortedLogs.slice(i, Math.min(i + groupSize, sortedLogs.length));
        const firstLog = groupLogs[0];
        const lastLog = groupLogs[groupLogs.length - 1];

        // Get unique participants in this group
        const participantIds = Array.from(new Set(groupLogs.map(l => l.memberId)));

        // Calculate total XP (estimate 100 XP per completion)
        const xpEarned = groupLogs.length * 100;

        // Determine if this is a milestone (every 50 completions)
        const completionNumber = i + groupLogs.length;
        const isMilestone = completionNumber % 50 === 0;

        journeyNodes.push({
            id: `node-${i}`,
            date: new Date(lastLog.timestamp),
            title: isMilestone
                ? `🎉 ${completionNumber} Chores Milestone!`
                : `${groupLogs.length} Tasks Completed`,
            description: isMilestone
                ? `Incredible teamwork reaching ${completionNumber} total chores!`
                : `From ${new Date(firstLog.timestamp).toLocaleDateString()} to ${new Date(lastLog.timestamp).toLocaleDateString()}`,
            icon: isMilestone ? '🏆' : '⭐',
            participants: participantIds,
            xpEarned,
            milestone: isMilestone
        });
    }

    return journeyNodes;
};

/**
 * Generate seasonal event decorations and bonus challenges
 */
export interface SeasonalEvent {
    name: string;
    emoji: string;
    startDate: Date;
    endDate: Date;
    bonusMultiplier: number;  // XP multiplier during event
    theme: string;  // CSS theme name
    specialChores?: string[];  // IDs of chores that get extra bonus
}

export const getCurrentSeasonalEvent = (): SeasonalEvent | null => {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    const day = now.getDate();

    // New Year Resolutions (January)
    if (month === 0) {
        return {
            name: 'New Year Challenge',
            emoji: '🎊',
            startDate: new Date(now.getFullYear(), 0, 1),
            endDate: new Date(now.getFullYear(), 0, 31),
            bonusMultiplier: 2.0,
            theme: 'newyear'
        };
    }

    // Halloween (October)
    if (month === 9) {
        return {
            name: 'Spooky Season',
            emoji: '🎃',
            startDate: new Date(now.getFullYear(), 9, 1),
            endDate: new Date(now.getFullYear(), 9, 31),
            bonusMultiplier: 1.5,
            theme: 'halloween'
        };
    }

    // Winter Holidays (December)
    if (month === 11) {
        return {
            name: 'Winter Wonderland',
            emoji: '❄️',
            startDate: new Date(now.getFullYear(), 11, 1),
            endDate: new Date(now.getFullYear(), 11, 31),
            bonusMultiplier: 2.0,
            theme: 'winter'
        };
    }

    // Spring Cleaning (March-April)
    if (month === 2 || month === 3) {
        return {
            name: 'Spring Cleaning',
            emoji: '🌸',
            startDate: new Date(now.getFullYear(), 2, 1),
            endDate: new Date(now.getFullYear(), 3, 30),
            bonusMultiplier: 1.75,
            theme: 'spring'
        };
    }

    // Summer Fun (July-August)
    if (month === 6 || month === 7) {
        return {
            name: 'Summer Vibes',
            emoji: '☀️',
            startDate: new Date(now.getFullYear(), 6, 1),
            endDate: new Date(now.getFullYear(), 7, 31),
            bonusMultiplier: 1.5,
            theme: 'summer'
        };
    }

    return null;
};

/**
 * Generate health report for household workload balance
 */
export interface HealthMetrics {
    overallHealth: number;  // 0-100
    burnoutRisk: Array<{ memberId: string; riskLevel: 'low' | 'medium' | 'high' }>;
    consistencyScore: number;  // 0-100, how regular is task completion
    participationRate: number;  // % of members actively contributing
    recommendations: string[];
}

export const generateHealthReport = (
    logs: ChoreLog[],
    members: Member[]
): HealthMetrics => {
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const recentLogs = logs.filter(l => now - getTimestamp(l.timestamp) < oneWeek);

    // Calculate per-member task counts
    const taskCounts: Record<string, number> = {};
    members.forEach(m => taskCounts[m.id] = 0);
    recentLogs.forEach(log => {
        taskCounts[log.memberId] = (taskCounts[log.memberId] || 0) + 1;
    });

    // Detect burnout risk (>15 tasks in a week is high risk)
    const burnoutRisk = members.map(m => {
        const count = taskCounts[m.id] || 0;
        return {
            memberId: m.id,
            riskLevel: count > 15 ? 'high' : count > 10 ? 'medium' : 'low'
        } as { memberId: string; riskLevel: 'low' | 'medium' | 'high' };
    });

    // Calculate consistency (are tasks spread evenly across days?)
    const dayBuckets: Record<string, number> = {};
    recentLogs.forEach(log => {
        const day = new Date(log.timestamp).toDateString();
        dayBuckets[day] = (dayBuckets[day] || 0) + 1;
    });
    const avgPerDay = recentLogs.length / 7;
    const variance = Object.values(dayBuckets).reduce((sum, count) => {
        return sum + Math.pow(count - avgPerDay, 2);
    }, 0) / 7;
    const consistencyScore = Math.max(0, Math.min(100, 100 - variance));

    // Participation rate
    const activeMembers = members.filter(m => (taskCounts[m.id] || 0) > 0).length;
    const participationRate = (activeMembers / members.length) * 100;

    // Overall health (weighted average)
    const overallHealth = Math.round(
        (consistencyScore * 0.4) + (participationRate * 0.3) +
        ((burnoutRisk.filter(b => b.riskLevel === 'low').length / members.length) * 100 * 0.3)
    );

    // Generate recommendations
    const recommendations: string[] = [];
    if (overallHealth < 50) {
        recommendations.push('⚠️ Household needs attention - consider redistributing tasks');
    }
    if (participationRate < 70) {
        recommendations.push('👥 Encourage more members to participate');
    }
    if (burnoutRisk.some(b => b.riskLevel === 'high')) {
        const highRiskMembers = burnoutRisk.filter(b => b.riskLevel === 'high');
        recommendations.push(`🔥 ${highRiskMembers.length} member(s) at risk of burnout`);
    }
    if (consistencyScore < 60) {
        recommendations.push('📅 Try to space out chores more evenly throughout the week');
    }

    return {
        overallHealth,
        burnoutRisk,
        consistencyScore,
        participationRate,
        recommendations
    };
};
