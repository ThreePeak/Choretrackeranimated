import { ChoreSkill, DifficultyTier, ChoreDifficulty, SkillProgress } from '../types';

// XP Multipliers by difficulty
export const DIFFICULTY_MULTIPLIERS: Record<DifficultyTier, number> = {
    beginner: 1.0,
    intermediate: 1.5,
    advanced: 2.0,
    expert: 3.0,
    master: 5.0,
};

// Minimum level requirements
export const DIFFICULTY_LEVEL_REQUIREMENTS: Record<DifficultyTier, number> = {
    beginner: 0,
    intermediate: 5,
    advanced: 10,
    expert: 20,
    master: 35,
};

// XP required per level (exponential growth)
export const getXPForLevel = (level: number): number => {
    return Math.floor(100 * Math.pow(1.5, level));
};

// Calculate skill level from total XP
export const getSkillLevel = (totalXP: number): number => {
    let level = 0;
    let requiredXP = 0;

    while (requiredXP <= totalXP) {
        requiredXP += getXPForLevel(level);
        if (requiredXP > totalXP) break;
        level++;
    }

    return level;
};

// Check if member can access difficulty tier
export const canAccessDifficulty = (skillLevel: number, tier: DifficultyTier): boolean => {
    return skillLevel >= DIFFICULTY_LEVEL_REQUIREMENTS[tier];
};

// Calculate XP for completing a chore with difficulty
export const calculateChoreXP = (baseXP: number, difficulty?: ChoreDifficulty): number => {
    if (!difficulty) return baseXP;
    return Math.floor(baseXP * difficulty.xpMultiplier);
};

// Get skill progress for a member
export const calculateSkillProgress = (
    skill: ChoreSkill,
    completedChores: { skill: ChoreSkill; xp: number }[]
): SkillProgress => {
    const skillChores = completedChores.filter(c => c.skill === skill);
    const totalXP = skillChores.reduce((sum, c) => sum + c.xp, 0);
    const level = getSkillLevel(totalXP);
    const xpForThisLevel = getXPForLevel(level);
    const xpForNextLevel = getXPForLevel(level + 1);
    const xpIntoCurrentLevel = totalXP - Array.from({ length: level }, (_, i) => getXPForLevel(i)).reduce((a, b) => a + b, 0);

    return {
        skill,
        level,
        currentXP: xpIntoCurrentLevel,
        xpToNextLevel: xpForNextLevel,
        totalChoresCompleted: skillChores.length,
    };
};

// Skill titles
export const getSkillTitle = (skill: ChoreSkill, level: number): string => {
    const titles: Record<ChoreSkill, string[]> = {
        cleaning: ['Novice Cleaner', 'Tidy Apprentice', 'Clean Expert', 'Spotless Master', 'Pristine Legend'],
        cooking: ['Kitchen Newbie', 'Home Cook', 'Chef', 'Master Chef', 'Culinary Legend'],
        maintenance: ['Handyperson', 'Fix-it Pro', 'Master Repairer', 'Engineering Expert', 'Maintenance Legend'],
        'pet-care': ['Pet Helper', 'Animal Friend', 'Pet Expert', 'Animal Whisperer', 'Pet Care Legend'],
        outdoor: ['Yard Helper', 'Garden Enthusiast', 'Outdoor Expert', 'Landscape Master', 'Nature Legend'],
    };

    const tierIndex = Math.min(Math.floor(level / 10), 4);
    return titles[skill][tierIndex] || titles[skill][0];
};
