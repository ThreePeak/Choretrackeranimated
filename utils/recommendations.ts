import { Chore, ChoreLog, Member } from '../types';
import { getTimestamp } from '../utils';

export interface ChoreRecommendation {
    chore: Chore;
    urgency: 'high' | 'medium' | 'low';
    reason: string;
    daysSinceLastDone: number;
    recommendedMember?: Member;
}

/**
 * Generate smart chore recommendations based on completion history
 */
export const generateRecommendations = (
    chores: Chore[],
    logs: ChoreLog[],
    members: Member[]
): ChoreRecommendation[] => {
    const recommendations: ChoreRecommendation[] = [];
    const now = Date.now();

    chores.forEach(chore => {
        const choreLogs = logs.filter(l => l.choreId === chore.id);

        if (choreLogs.length === 0) {
            // Never done - high priority
            recommendations.push({
                chore,
                urgency: 'high',
                reason: 'Never completed',
                daysSinceLastDone: Infinity,
                recommendedMember: members[0] // Suggest first member
            });
            return;
        }

        // Calculate average frequency (days between completions)
        const sortedLogs = choreLogs.sort((a, b) =>
            getTimestamp(b.timestamp) - getTimestamp(a.timestamp)
        );

        const lastDone = sortedLogs[0];
        const daysSinceLast = (now - getTimestamp(lastDone.timestamp)) / (1000 * 60 * 60 * 24);

        if (choreLogs.length >= 2) {
            // Calculate average frequency
            let totalDays = 0;
            for (let i = 0; i < sortedLogs.length - 1; i++) {
                const diff = getTimestamp(sortedLogs[i].timestamp) - getTimestamp(sortedLogs[i + 1].timestamp);
                totalDays += diff / (1000 * 60 * 60 * 24);
            }
            const avgFrequency = totalDays / (sortedLogs.length - 1);

            // Determine urgency based on how overdue it is
            const overdueFactor = daysSinceLast / avgFrequency;

            if (overdueFactor >= 1.5) {
                // Find member who does this chore best
                const memberCounts: Record<string, number> = {};
                choreLogs.forEach(log => {
                    memberCounts[log.memberId] = (memberCounts[log.memberId] || 0) + 1;
                });
                const bestMemberId = Object.keys(memberCounts).reduce((a, b) =>
                    memberCounts[a] > memberCounts[b] ? a : b
                );
                const recommendedMember = members.find(m => m.id === bestMemberId);

                recommendations.push({
                    chore,
                    urgency: overdueFactor >= 2 ? 'high' : 'medium',
                    reason: `Usually done every ${Math.round(avgFrequency)} days. It's been ${Math.round(daysSinceLast)} days.`,
                    daysSinceLastDone: Math.round(daysSinceLast),
                    recommendedMember
                });
            }
        }
    });

    // Sort by urgency and days since last done
    return recommendations.sort((a, b) => {
        const urgencyOrder = { high: 0, medium: 1, low: 2 };
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
            return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        }
        return b.daysSinceLastDone - a.daysSinceLastDone;
    }).slice(0, 5); // Return top 5 recommendations
};
