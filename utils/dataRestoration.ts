import { Member, Chore, ChoreLog } from '../types';

/**
 * Backup data from January 16, 2026
 * This is the household state before the crash
 */
export const BACKUP_DATA_JAN_16 = {
    "version": "2.0",
    "exportDate": "2026-01-17T02:17:09.935Z",
    "appId": "default-family-id",
    "members": [
        {
            "color": "#010D22",
            "id": "M4jlNBktNvd7oVlXUCRA",
            "name": "Dom",
            "joinedAt": "2026-01-17T02:12:13.864Z"
        },
        {
            "color": "#250B83",
            "id": "fqfZoNWYRrytpfNjmcDm",
            "name": "Nick",
            "joinedAt": "2026-01-17T02:12:13.864Z"
        },
        {
            "color": "#99675A",
            "id": "rmTmcbtFDonNFYYrMoK5",
            "name": "Adrianna",
            "joinedAt": "2026-01-17T02:12:13.864Z"
        }
    ],
    "chores": [
        {
            "id": "5fdpwSG0q8gucT25wGTQ",
            "name": "Dog poop",
            "createdAt": "2026-01-17T02:12:13.864Z"
        },
        {
            "id": "HYso3r7fOwcTHWKZsXrg",
            "name": "Wash bedding",
            "createdAt": "2026-01-17T02:12:13.864Z"
        },
        {
            "id": "QRD2H3CI8vT5BzwiQObk",
            "name": "Clean bathroom sink /counter",
            "createdAt": "2026-01-17T02:12:13.864Z"
        },
        {
            "id": "RpGSjeWU5X6SWifyU87j",
            "name": "Fold laundry",
            "createdAt": "2026-01-17T02:12:13.864Z"
        },
        {
            "id": "SqBQOfYWk6qtLuzM62wg",
            "name": "Clean toilet",
            "createdAt": "2026-01-17T02:12:13.864Z"
        },
        {
            "id": "VTdWUQH5J8VND8VH24dE",
            "name": "Empty dishwasher",
            "createdAt": "2026-01-17T02:12:13.864Z"
        },
        {
            "id": "XDUqMG5TsjDMr03q6Hpq",
            "name": "Mixed laundry load",
            "createdAt": "2026-01-17T02:12:13.864Z"
        },
        {
            "id": "XH8e11kycvYc68nY0tIe",
            "name": "Take out garbage",
            "createdAt": "2026-01-17T02:12:13.864Z"
        },
        {
            "id": "aXRWlLj6fhR5xUxxCZuP",
            "name": "Mop",
            "createdAt": "2026-01-17T02:12:13.864Z"
        },
        {
            "id": "fL0SuijXS9MmXInAyW9a",
            "name": "Make Brunch for 2+",
            "createdAt": "2026-01-17T02:12:13.864Z"
        },
        {
            "id": "g49u8tXGGXkOuZschR4L",
            "name": "Cat box",
            "createdAt": "2026-01-17T02:12:13.864Z"
        },
        {
            "id": "qi25rgn52iEouEOrL3sf",
            "name": "Vacuum",
            "createdAt": "2026-01-17T02:12:13.864Z"
        },
        {
            "id": "uKSZX4xgOO91zIXzUKjd",
            "name": "Clean shower/tub",
            "createdAt": "2026-01-17T02:12:13.864Z"
        },
        {
            "id": "ufdsyAozw237Fxtg3VjY",
            "name": "Load dishwasher",
            "createdAt": "2026-01-17T02:12:13.864Z"
        },
        {
            "id": "wQ14T5rqpmx1GsXaWgBs",
            "name": "Take out recycling",
            "createdAt": "2026-01-17T02:12:13.864Z"
        },
        {
            "id": "bxcbrsrrd",
            "name": "Dump run",
            "createdAt": "2026-01-17T02:12:13.864Z"
        },
        {
            "category": "QA",
            "estMinutes": 10,
            "id": "6v7a1mzum",
            "name": "QA Test Chore",
            "xp": 150,
            "createdAt": "2026-01-17T02:12:13.864Z"
        }
    ],
    "logs": [] as any[], // Logs array truncated for brevity - will be restored from full backup
    "activeChallenge": {
        "id": "challenge-1768615933946",
        "name": "Kitchen Blitz",
        "description": "Complete 10 kitchen tasks this week",
        "targetType": "category_tasks",
        "targetValue": 10,
        "category": "Kitchen",
        "bonusXP": 300,
        "startDate": "2026-01-16T08:00:00.000Z",
        "endDate": "2026-01-23T08:00:00.000Z",
        "participants": [
            "M4jlNBktNvd7oVlXUCRA",
            "fqfZoNWYRrytpfNjmcDm",
            "rmTmcbtFDonNFYYrMoK5"
        ],
        "progress": 0,
        "completed": false
    },
    "achievementUnlocks": {},
    "totalChoresCount": 59,
    "memberCount": 3,
    "choreCount": 17
};

/**
 * Smart category inference based on chore name
 */
export const inferChoreCategory = (choreName: string): string => {
    const name = choreName.toLowerCase();

    // Kitchen tasks
    if (name.includes('dishwasher') || name.includes('kitchen') || name.includes('brunch') ||
        name.includes('cook') || name.includes('meal')) {
        return 'Kitchen';
    }

    // Bathroom tasks
    if (name.includes('bathroom') || name.includes('toilet') || name.includes('shower') ||
        name.includes('tub') || name.includes('sink') && name.includes('bathroom')) {
        return 'Bathroom';
    }

    // Laundry tasks
    if (name.includes('laundry') || name.includes('bedding') || name.includes('fold')) {
        return 'Laundry';
    }

    // Pet care
    if (name.includes('dog') || name.includes('cat') || name.includes('pet') ||
        name.includes('poop')) {
        return 'Pets';
    }

    // Outdoor/Garbage
    if (name.includes('garbage') || name.includes('recycling') || name.includes('dump') ||
        name.includes('trash')) {
        return 'Outdoor';
    }

    // General cleaning
    if (name.includes('vacuum') || name.includes('mop') || name.includes('clean') ||
        name.includes('dust') || name.includes('sweep')) {
        return 'Cleaning';
    }

    return 'General';
};

/**
 * Smart XP inference based on chore name and category
 */
export const inferChoreXP = (choreName: string, category: string): number => {
    const name = choreName.toLowerCase();

    // High XP tasks (100-150)
    if (name.includes('brunch') || name.includes('meal') || name.includes('cook')) {
        return 120;
    }
    if (name.includes('shower') || name.includes('tub') || name.includes('mop')) {
        return 100;
    }
    if (name.includes('dump run')) {
        return 150;
    }

    // Medium XP tasks (50-75)
    if (name.includes('laundry') || name.includes('vacuum') || name.includes('bedding')) {
        return 75;
    }
    if (name.includes('dishwasher') || name.includes('toilet')) {
        return 60;
    }

    // Low XP tasks (25-40)
    if (name.includes('garbage') || name.includes('recycling') || name.includes('trash')) {
        return 30;
    }
    if (name.includes('poop') || name.includes('cat box')) {
        return 25;
    }

    // Default based on category
    if (category === 'Kitchen') return 50;
    if (category === 'Bathroom') return 60;
    if (category === 'Laundry') return 70;
    if (category === 'Pets') return 30;
    if (category === 'Outdoor') return 40;

    return 50; // Default
};

/**
 * Estimate time in minutes based on chore type
 */
export const inferEstMinutes = (choreName: string): number => {
    const name = choreName.toLowerCase();

    // Long tasks (30-60 min)
    if (name.includes('brunch') || name.includes('meal')) return 45;
    if (name.includes('mop') || name.includes('vacuum')) return 30;
    if (name.includes('shower') || name.includes('tub')) return 25;
    if (name.includes('bedding') || name.includes('laundry load')) return 40;
    if (name.includes('dump run')) return 60;

    // Medium tasks (10-20 min)
    if (name.includes('dishwasher') || name.includes('toilet')) return 15;
    if (name.includes('fold')) return 20;
    if (name.includes('clean') && name.includes('sink')) return 10;

    // Quick tasks (5-10 min)
    if (name.includes('garbage') || name.includes('recycling')) return 5;
    if (name.includes('poop') || name.includes('cat box')) return 5;

    return 15; // Default
};

/**
 * Enhance chores with missing fields
 */
export const enhanceChoresWithMetadata = (chores: any[]): Chore[] => {
    return chores.map(chore => {
        // If chore already has complete data, return as-is
        if (chore.category && chore.xp && chore.estMinutes) {
            return chore as Chore;
        }

        // Infer missing fields
        const category = chore.category || inferChoreCategory(chore.name);
        const xp = chore.xp || inferChoreXP(chore.name, category);
        const estMinutes = chore.estMinutes || inferEstMinutes(chore.name);

        return {
            ...chore,
            category,
            xp,
            estMinutes
        } as Chore;
    });
};

/**
 * Calculate member XP from logs
 */
export const calculateMemberTotalXP = (
    memberId: string,
    logs: ChoreLog[],
    chores: Chore[]
): number => {
    return logs
        .filter(log => log.memberId === memberId)
        .reduce((total, log) => {
            const chore = chores.find(c => c.id === log.choreId);
            return total + (chore?.xp || 50); // Default 50 if chore not found
        }, 0);
};

/**
 * Enhance members with calculated XP
 */
export const enhanceMembersWithXP = (
    members: any[],
    logs: ChoreLog[],
    chores: Chore[]
): Member[] => {
    return members.map(member => ({
        ...member,
        totalXP: calculateMemberTotalXP(member.id, logs, chores),
        skillLevels: {
            cleaning: 1,
            cooking: 1,
            maintenance: 1,
            'pet-care': 1,
            outdoor: 1
        }
    })) as Member[];
};
