import { Chore, Member } from '../types';

export interface Challenge {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    targetType: 'total_tasks' | 'total_xp' | 'category_tasks' | 'household_level';
    targetValue: number;
    bonusXP: number;
    participants: string[]; // Member IDs
    progress: number; // Current progress
    completed: boolean;
    category?: string; // For category_tasks type
}

/**
 * Generate weekly challenge based on household data
 */
export const generateWeeklyChallenge = (
    currentWeek: Date,
    members: Member[],
    chores: Chore[]
): Challenge => {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    // Random challenge types
    const challenges = [
        {
            name: 'Weekend Warriors',
            description: 'Complete 20 tasks as a household this weekend',
            targetType: 'total_tasks' as const,
            targetValue: 20,
            bonusXP: 500
        },
        {
            name: 'Kitchen Blitz',
            description: 'Complete 10 kitchen tasks this week',
            targetType: 'category_tasks' as const,
            targetValue: 10,
            category: 'Kitchen',
            bonusXP: 300
        },
        {
            name: 'XP Rush',
            description: 'Earn 1000 XP as a team',
            targetType: 'total_xp' as const,
            targetValue: 1000,
            bonusXP: 750
        },
        {
            name: 'Clean Sweep',
            description: 'Everyone completes at least 5 chores',
            targetType: 'total_tasks' as const,
            targetValue: members.length * 5,
            bonusXP: 600
        }
    ];

    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];

    return {
        id: `challenge-${Date.now()}`,
        ...randomChallenge,
        startDate: startOfWeek,
        endDate: endOfWeek,
        participants: members.map(m => m.id),
        progress: 0,
        completed: false
    };
};

/**
 * Calculate challenge progress
 */
export const calculateChallengeProgress = (
    challenge: Challenge,
    logs: any[],
    chores: Chore[]
): number => {
    const challengeLogs = logs.filter(log => {
        const logTime = new Date(log.timestamp).getTime();
        return logTime >= challenge.startDate.getTime() && logTime <= challenge.endDate.getTime();
    });

    switch (challenge.targetType) {
        case 'total_tasks':
            return challengeLogs.length;

        case 'total_xp':
            return challengeLogs.reduce((sum, log) => {
                const chore = chores.find(c => c.id === log.choreId);
                return sum + (chore?.xp || 0);
            }, 0);

        case 'category_tasks':
            return challengeLogs.filter(log => {
                const chore = chores.find(c => c.id === log.choreId);
                return chore?.category === challenge.category;
            }).length;

        default:
            return 0;
    }
};
