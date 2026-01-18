import { Achievement } from './types';
import {
    CheckCircle,
    Flame,
    Crown,
    Trophy,
    Star,
    Zap,
    Target,
    Award,
    TrendingUp,
    Coffee,
    Moon,
    Sun,
    Utensils,
    Sparkles,
    Heart,
    Users
} from 'lucide-react';

// Achievement Definitions
export const ACHIEVEMENTS: Achievement[] = [
    // Completion Achievements
    {
        id: 'first_chore',
        name: 'Getting Started',
        description: 'Complete your first chore',
        icon: 'CheckCircle',
        tier: 'bronze',
        category: 'completion',
        requirement: { type: 'chore_count', threshold: 1 },
        rewardXP: 50
    },
    {
        id: 'chores_10',
        name: 'Helping Hand',
        description: 'Complete 10 chores',
        icon: 'Star',
        tier: 'bronze',
        category: 'completion',
        requirement: { type: 'chore_count', threshold: 10 },
        rewardXP: 100
    },
    {
        id: 'chores_50',
        name: 'Hard Worker',
        description: 'Complete 50 chores',
        icon: 'Award',
        tier: 'silver',
        category: 'completion',
        requirement: { type: 'chore_count', threshold: 50 },
        rewardXP: 500
    },
    {
        id: 'chores_100',
        name: 'Chore Champion',
        description: 'Complete 100 chores',
        icon: 'Trophy',
        tier: 'gold',
        category: 'completion',
        requirement: { type: 'chore_count', threshold: 100 },
        rewardXP: 1000
    },
    {
        id: 'chores_500',
        name: 'Legendary Helper',
        description: 'Complete 500 chores',
        icon: 'Crown',
        tier: 'legendary',
        category: 'completion',
        requirement: { type: 'chore_count', threshold: 500 },
        rewardXP: 5000
    },

    // Streak Achievements
    {
        id: 'streak_3',
        name: '3 Day Streak',
        description: 'Complete at least one chore for 3 days in a row',
        icon: 'Flame',
        tier: 'bronze',
        category: 'streak',
        requirement: { type: 'streak_days', threshold: 3 },
        rewardXP: 150
    },
    {
        id: 'streak_7',
        name: 'Week Warrior',
        description: 'Complete at least one chore for 7 days in a row',
        icon: 'Flame',
        tier: 'silver',
        category: 'streak',
        requirement: { type: 'streak_days', threshold: 7 },
        rewardXP: 500
    },
    {
        id: 'streak_30',
        name: 'Month Master',
        description: 'Complete at least one chore for 30 days in a row',
        icon: 'Flame',
        tier: 'gold',
        category: 'streak',
        requirement: { type: 'streak_days', threshold: 30 },
        rewardXP: 3000
    },
    {
        id: 'streak_100',
        name: 'Unstoppable',
        description: 'Complete at least one chore for 100 days in a row',
        icon: 'Flame',
        tier: 'legendary',
        category: 'streak',
        requirement: { type: 'streak_days', threshold: 100 },
        rewardXP: 10000
    },

    // XP Achievements
    {
        id: 'xp_1000',
        name: 'Rising Star',
        description: 'Earn 1,000 total XP',
        icon: 'Sparkles',
        tier: 'bronze',
        category: 'mastery',
        requirement: { type: 'xp_total', threshold: 1000 },
        rewardXP: 100
    },
    {
        id: 'xp_5000',
        name: 'Power Player',
        description: 'Earn 5,000 total XP',
        icon: 'Zap',
        tier: 'silver',
        category: 'mastery',
        requirement: { type: 'xp_total', threshold: 5000 },
        rewardXP: 500
    },
    {
        id: 'xp_10000',
        name: 'Perfectionist',
        description: 'Earn 10,000 total XP',
        icon: 'Target',
        tier: 'gold',
        category: 'mastery',
        requirement: { type: 'xp_total', threshold: 10000 },
        rewardXP: 1000
    },
    {
        id: 'xp_50000',
        name: 'XP Legend',
        description: 'Earn 50,000 total XP',
        icon: 'Crown',
        tier: 'platinum',
        category: 'mastery',
        requirement: { type: 'xp_total', threshold: 50000 },
        rewardXP: 5000
    },

    // Category Master Achievements
    {
        id: 'kitchen_master',
        name: 'Kitchen King',
        description: 'Complete 50 kitchen chores',
        icon: 'Utensils',
        tier: 'gold',
        category: 'mastery',
        requirement: { type: 'category_master', threshold: 50, choreCategory: 'Kitchen' },
        rewardXP: 1000
    },
    {
        id: 'bathroom_master',
        name: 'Bathroom Boss',
        description: 'Complete 30 bathroom chores',
        icon: 'Sparkles',
        tier: 'gold',
        category: 'mastery',
        requirement: { type: 'category_master', threshold: 30, choreCategory: 'Bathroom' },
        rewardXP: 800
    },
    {
        id: 'general_master',
        name: 'General Genius',
        description: 'Complete 40 general chores',
        icon: 'Star',
        tier: 'gold',
        category: 'mastery',
        requirement: { type: 'category_master', threshold: 40, choreCategory: 'General' },
        rewardXP: 900
    },

    // Speed/Single Day Achievements
    {
        id: 'busy_day_5',
        name: 'Busy Bee',
        description: 'Complete 5 chores in a single day',
        icon: 'Zap',
        tier: 'bronze',
        category: 'speed',
        requirement: { type: 'single_day', threshold: 5 },
        rewardXP: 250
    },
    {
        id: 'busy_day_10',
        name: 'Super Productive',
        description: 'Complete 10 chores in a single day',
        icon: 'TrendingUp',
        tier: 'silver',
        category: 'speed',
        requirement: { type: 'single_day', threshold: 10 },
        rewardXP: 750
    },
    {
        id: 'busy_day_15',
        name: 'Turbo Mode',
        description: 'Complete 15 chores in a single day',
        icon: 'Zap',
        tier: 'gold',
        category: 'speed',
        requirement: { type: 'single_day', threshold: 15 },
        rewardXP: 1500
    },

    // Time-based Achievements
    {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Complete a chore before 8 AM (unlocks naturally)',
        icon: 'Sun',
        tier: 'bronze',
        category: 'variety',
        requirement: { type: 'chore_count', threshold: 1 }, // Special logic needed
        rewardXP: 100
    },
    {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Complete a chore after 10 PM (unlocks naturally)',
        icon: 'Moon',
        tier: 'bronze',
        category: 'variety',
        requirement: { type: 'chore_count', threshold: 1 }, // Special logic needed
        rewardXP: 100
    },

    // Team Achievements
    {
        id: 'team_player',
        name: 'Team Player',
        description: 'All family members complete at least one chore in a week (unlocks naturally)',
        icon: 'Users',
        tier: 'silver',
        category: 'collaboration',
        requirement: { type: 'chore_count', threshold: 1 }, // Special logic needed
        rewardXP: 300
    },
    {
        id: 'family_goals',
        name: 'Family Goals',
        description: 'Family completes 100 chores together (unlocks naturally)',
        icon: 'Heart',
        tier: 'gold',
        category: 'collaboration',
        requirement: { type: 'chore_count', threshold: 100 }, // Family total
        rewardXP: 2000
    }
];

// Icon mapping helper
export const ACHIEVEMENT_ICON_MAP: Record<string, any> = {
    CheckCircle,
    Flame,
    Crown,
    Trophy,
    Star,
    Zap,
    Target,
    Award,
    TrendingUp,
    Coffee,
    Moon,
    Sun,
    Utensils,
    Sparkles,
    Heart,
    Users
};

// Tier colors
export const TIER_COLORS = {
    bronze: {
        bg: 'bg-amber-900/20',
        text: 'text-amber-500',
        border: 'border-amber-500/30',
        glow: 'shadow-amber-900/30'
    },
    silver: {
        bg: 'bg-gray-700/20',
        text: 'text-gray-300',
        border: 'border-gray-400/30',
        glow: 'shadow-gray-600/30'
    },
    gold: {
        bg: 'bg-yellow-600/20',
        text: 'text-yellow-400',
        border: 'border-yellow-500/30',
        glow: 'shadow-yellow-600/40'
    },
    platinum: {
        bg: 'bg-cyan-500/20',
        text: 'text-cyan-300',
        border: 'border-cyan-400/30',
        glow: 'shadow-cyan-500/40'
    },
    legendary: {
        bg: 'bg-purple-600/20',
        text: 'text-purple-300',
        border: 'border-purple-500/30',
        glow: 'shadow-purple-600/50'
    }
};

// Helper: Calculate achievement progress for a member
export const calculateAchievementProgress = (
    achievement: Achievement,
    memberLogs: any[],
    memberXP: number,
    members: any[],
    allLogs: any[]
): number => {
    const { type, threshold, choreCategory } = achievement.requirement;

    switch (type) {
        case 'chore_count': {
            if (choreCategory) {
                const categoryLogs = memberLogs.filter(log => {
                    const chore = log.chore; // Assuming chore is populated
                    return chore?.category === choreCategory;
                });
                return Math.min(100, (categoryLogs.length / threshold) * 100);
            }
            return Math.min(100, (memberLogs.length / threshold) * 100);
        }

        case 'xp_total':
            return Math.min(100, (memberXP / threshold) * 100);

        case 'category_master': {
            if (!choreCategory) return 0;
            const categoryLogs = memberLogs.filter(log => {
                const chore = log.chore;
                return chore?.category === choreCategory;
            });
            return Math.min(100, (categoryLogs.length / threshold) * 100);
        }

        case 'streak_days': {
            // Calculate current streak
            const streak = calculateCurrentStreak(memberLogs);
            return Math.min(100, (streak / threshold) * 100);
        }

        case 'single_day': {
            // Find max chores in a single day
            const maxInDay = getMaxChoresInSingleDay(memberLogs);
            return Math.min(100, (maxInDay / threshold) * 100);
        }

        default:
            return 0;
    }
};

// Helper: Calculate current streak
const calculateCurrentStreak = (logs: any[]): number => {
    if (logs.length === 0) return 0;

    const sortedLogs = [...logs].sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateB - dateA; // Descending
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const mostRecentLog = new Date(sortedLogs[0].timestamp);
    mostRecentLog.setHours(0, 0, 0, 0);

    // Streak broken if no activity today or yesterday
    if (mostRecentLog.getTime() < yesterday.getTime()) {
        return 0;
    }

    let streak = 0;
    let currentDate = new Date(today);

    for (let i = 0; i < 365; i++) { // Max 365 days lookback
        const dayLogs = sortedLogs.filter(log => {
            const logDate = new Date(log.timestamp);
            logDate.setHours(0, 0, 0, 0);
            return logDate.getTime() === currentDate.getTime();
        });

        if (dayLogs.length > 0) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
};

// Helper: Max chores in a single day
const getMaxChoresInSingleDay = (logs: any[]): number => {
    const countsByDay: Record<string, number> = {};

    logs.forEach(log => {
        const date = new Date(log.timestamp);
        const dateKey = date.toISOString().split('T')[0];
        countsByDay[dateKey] = (countsByDay[dateKey] || 0) + 1;
    });

    return Math.max(...Object.values(countsByDay), 0);
};
