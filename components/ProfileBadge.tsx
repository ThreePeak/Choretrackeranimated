import React from 'react';
import { Trophy, Flame, Star, Target, Award } from 'lucide-react';

export type BadgeType = 'chore_master' | 'streak_king' | 'skill_expert' | 'level_milestone' | 'perfectionist';
export type BadgeRarity = 'bronze' | 'silver' | 'gold' | 'platinum';

interface Badge {
    id: string;
    type: BadgeType;
    name: string;
    description: string;
    rarity: BadgeRarity;
    icon: React.ReactNode;
}

interface ProfileBadgeProps {
    badge: Badge;
    size?: 'sm' | 'md' | 'lg';
}

const rarityColors: Record<BadgeRarity, string> = {
    bronze: 'from-orange-700 to-orange-900',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-400 to-yellow-600',
    platinum: 'from-purple-400 to-blue-500'
};

const rarityBorders: Record<BadgeRarity, string> = {
    bronze: 'border-orange-500/50',
    silver: 'border-gray-400/50',
    gold: 'border-yellow-400/50',
    platinum: 'border-purple-400/50'
};

export const ProfileBadge: React.FC<ProfileBadgeProps> = ({ badge, size = 'md' }) => {
    const sizes = {
        sm: 'w-12 h-12',
        md: 'w-16 h-16',
        lg: 'w-20 h-20'
    };

    const iconSizes = {
        sm: 20,
        md: 28,
        lg: 36
    };

    return (
        <div className="group relative inline-block">
            <div
                className={`${sizes[size]} rounded-full bg-gradient-to-br ${rarityColors[badge.rarity]} flex items-center justify-center border-2 ${rarityBorders[badge.rarity]} shadow-lg transition-transform group-hover:scale-110`}
            >
                {React.cloneElement(badge.icon as React.ReactElement, {
                    size: iconSizes[size],
                    className: 'text-white drop-shadow-lg'
                })}
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-2xl border border-gray-700">
                    <div className="font-bold mb-1">{badge.name}</div>
                    <div className="text-gray-400">{badge.description}</div>
                    <div className={`mt-1 text-[10px] uppercase font-black ${badge.rarity === 'platinum' ? 'text-purple-400' :
                            badge.rarity === 'gold' ? 'text-yellow-400' :
                                badge.rarity === 'silver' ? 'text-gray-300' :
                                    'text-orange-400'
                        }`}>
                        {badge.rarity}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Utility function to generate badges based on member stats
export const generateBadges = (stats: {
    totalChores: number;
    streakDays: number;
    level: number;
    topSkillLevel: number;
    perfectDays: number;
}): Badge[] => {
    const badges: Badge[] = [];

    // Chore Master badges
    if (stats.totalChores >= 500) {
        badges.push({
            id: 'chore_master_platinum',
            type: 'chore_master',
            name: 'Chore Legend',
            description: '500+ chores completed',
            rarity: 'platinum',
            icon: <Trophy />
        });
    } else if (stats.totalChores >= 250) {
        badges.push({
            id: 'chore_master_gold',
            type: 'chore_master',
            name: 'Chore Champion',
            description: '250+ chores completed',
            rarity: 'gold',
            icon: <Trophy />
        });
    } else if (stats.totalChores >= 100) {
        badges.push({
            id: 'chore_master_silver',
            type: 'chore_master',
            name: 'Chore Expert',
            description: '100+ chores completed',
            rarity: 'silver',
            icon: <Trophy />
        });
    } else if (stats.totalChores >= 50) {
        badges.push({
            id: 'chore_master_bronze',
            type: 'chore_master',
            name: 'Chore Enthusiast',
            description: '50+ chores completed',
            rarity: 'bronze',
            icon: <Trophy />
        });
    }

    // Streak badges
    if (stats.streakDays >= 30) {
        badges.push({
            id: 'streak_platinum',
            type: 'streak_king',
            name: 'Unstoppable',
            description: '30+ day streak',
            rarity: 'platinum',
            icon: <Flame />
        });
    } else if (stats.streakDays >= 14) {
        badges.push({
            id: 'streak_gold',
            type: 'streak_king',
            name: 'On Fire',
            description: '14+ day streak',
            rarity: 'gold',
            icon: <Flame />
        });
    } else if (stats.streakDays >= 7) {
        badges.push({
            id: 'streak_silver',
            type: 'streak_king',
            name: 'Consistent',
            description: '7+ day streak',
            rarity: 'silver',
            icon: <Flame />
        });
    }

    // Level milestones
    if (stats.level >= 20) {
        badges.push({
            id: 'level_platinum',
            type: 'level_milestone',
            name: 'Master',
            description: 'Reached level 20',
            rarity: 'platinum',
            icon: <Star />
        });
    } else if (stats.level >= 10) {
        badges.push({
            id: 'level_gold',
            type: 'level_milestone',
            name: 'Veteran',
            description: 'Reached level 10',
            rarity: 'gold',
            icon: <Star />
        });
    } else if (stats.level >= 5) {
        badges.push({
            id: 'level_silver',
            type: 'level_milestone',
            name: 'Rising Star',
            description: 'Reached level 5',
            rarity: 'silver',
            icon: <Star />
        });
    }

    // Skill expert badges
    if (stats.topSkillLevel >= 10) {
        badges.push({
            id: 'skill_expert',
            type: 'skill_expert',
            name: 'Skill Master',
            description: 'Level 10 in a skill',
            rarity: 'gold',
            icon: <Target />
        });
    }

    // Perfectionist  
    if (stats.perfectDays >= 10) {
        badges.push({
            id: 'perfectionist',
            type: 'perfectionist',
            name: 'Perfectionist',
            description: '10+ perfect days',
            rarity: 'gold',
            icon: <Award />
        });
    }

    return badges;
};
