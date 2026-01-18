import { DifficultyTier } from '../types';

export const DIFFICULTY_XP_MAP: Record<DifficultyTier, number> = {
    beginner: 10,
    intermediate: 25,
    advanced: 50,
    expert: 100,
    master: 200
};

export const DIFFICULTY_STARS: Record<DifficultyTier, string> = {
    beginner: '⭐',
    intermediate: '⭐⭐',
    advanced: '⭐⭐⭐',
    expert: '⭐⭐⭐⭐',
    master: '⭐⭐⭐⭐⭐'
};

export const DIFFICULTY_COLORS: Record<DifficultyTier, string> = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    intermediate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    advanced: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    expert: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    master: 'bg-red-500/20 text-red-400 border-red-500/30'
};

export const getDifficultyXP = (difficulty?: DifficultyTier): number => {
    if (!difficulty) return 10; // Default to beginner XP
    return DIFFICULTY_XP_MAP[difficulty];
};

export const getDifficultyStars = (difficulty?: DifficultyTier): string => {
    if (!difficulty) return '⭐';
    return DIFFICULTY_STARS[difficulty];
};

export const getDifficultyColor = (difficulty?: DifficultyTier): string => {
    if (!difficulty) return DIFFICULTY_COLORS.beginner;
    return DIFFICULTY_COLORS[difficulty];
};
