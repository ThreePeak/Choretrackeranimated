import { ChoreLog, Member } from '../types';

/**
 * Calculate household equity score (0-100)
 * Higher score = more equal distribution of work
 * Lower score = work is unevenly distributed
 */
export const calculateEquityScore = (
    logs: ChoreLog[],
    members: Member[]
): {
    score: number;
    distribution: { memberId: string; name: string; count: number; percentage: number }[];
    isBalanced: boolean;
    recommendation: string;
} => {
    if (members.length === 0 || logs.length === 0) {
        return {
            score: 100,
            distribution: [],
            isBalanced: true,
            recommendation: 'No data available yet'
        };
    }

    // Count tasks per member
    const taskCounts: Record<string, number> = {};
    members.forEach(m => taskCounts[m.id] = 0);
    logs.forEach(log => {
        if (taskCounts[log.memberId] !== undefined) {
            taskCounts[log.memberId]++;
        }
    });

    // Calculate distribution
    const distribution = members.map(m => ({
        memberId: m.id,
        name: m.name,
        count: taskCounts[m.id],
        percentage: (taskCounts[m.id] / logs.length) * 100
    })).sort((a, b) => b.count - a.count);

    // Calculate standard deviation
    const mean = logs.length / members.length;
    const squaredDiffs = Object.values(taskCounts).map(count => Math.pow(count - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / members.length;
    const stdDev = Math.sqrt(variance);

    // Convert to 0-100 score (lower stdDev = higher score)
    // Scale: perfect balance (stdDev = 0) = 100, high imbalance (stdDev = mean) = 0
    const maxStdDev = mean; // Maximum realistic standard deviation
    const score = Math.max(0, Math.min(100, 100 - (stdDev / maxStdDev) * 100));

    // Determine if balanced
    const isBalanced = score >= 70;

    // Generate recommendation
    let recommendation = '';
    if (score >= 90) {
        recommendation = 'Perfect! Work is distributed very evenly.';
    } else if (score >= 70) {
        recommendation = 'Good balance overall.';
    } else if (score >= 50) {
        const lowest = distribution[distribution.length - 1];
        recommendation = `${lowest.name} could take on a few more tasks.`;
    } else {
        const highest = distribution[0];
        const lowest = distribution[distribution.length - 1];
        recommendation = `${highest.name} is doing ${highest.percentage.toFixed(0)}% of tasks. ${lowest.name} should help more.`;
    }

    return {
        score: Math.round(score),
        distribution,
        isBalanced,
        recommendation
    };
};
