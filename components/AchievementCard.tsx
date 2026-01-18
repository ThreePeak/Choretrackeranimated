import React from 'react';
import { Achievement, MemberAchievement } from '../types';
import { ACHIEVEMENT_ICON_MAP, TIER_COLORS } from '../achievements';
import { Lock, Sparkles } from 'lucide-react';

interface AchievementCardProps {
    achievement: Achievement;
    memberAchievement?: MemberAchievement;
    progress: number;
    onClick?: () => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
    achievement,
    memberAchievement,
    progress,
    onClick
}) => {
    const isUnlocked = memberAchievement !== undefined;
    const tierStyle = TIER_COLORS[achievement.tier];
    const IconComponent = ACHIEVEMENT_ICON_MAP[achievement.icon] || Sparkles;

    return (
        <div
            onClick={onClick}
            className={`
        relative p-4 rounded-xl border-2 cursor-pointer
        transition-all duration-300 hover:scale-105
        ${isUnlocked ? tierStyle.bg : 'bg-gray-900/40'}
        ${isUnlocked ? tierStyle.border : 'border-gray-700/50'}
        ${isUnlocked ? tierStyle.glow : ''}
        ${isUnlocked ? 'shadow-lg' : 'opacity-60'}
      `}
        >
            {/* Unlock Animation Overlay */}
            {isUnlocked && (
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent animate-pulse" />
                </div>
            )}

            {/* Icon */}
            <div className="flex items-center gap-3 mb-3">
                <div className={`
          p-3 rounded-lg
          ${isUnlocked ? tierStyle.bg : 'bg-gray-800'}
          ${isUnlocked ? tierStyle.border : 'border-gray-700'}
          border-2
        `}>
                    {isUnlocked ? (
                        <IconComponent className={`w-6 h-6 ${tierStyle.text}`} />
                    ) : (
                        <Lock className="w-6 h-6 text-gray-500" />
                    )}
                </div>

                {/* Tier Badge */}
                <div className={`
          px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
          ${isUnlocked ? tierStyle.bg : 'bg-gray-800'}
          ${isUnlocked ? tierStyle.text : 'text-gray-500'}
        `}>
                    {achievement.tier}
                </div>
            </div>

            {/* Achievement Name */}
            <h3 className={`
        font-bold text-lg mb-1
        ${isUnlocked ? 'text-white' : 'text-gray-400'}
      `}>
                {achievement.name}
            </h3>

            {/* Description */}
            <p className={`
        text-sm mb-3
        ${isUnlocked ? 'text-gray-300' : 'text-gray-500'}
      `}>
                {achievement.description}
            </p>

            {/* Progress Bar (for locked achievements) */}
            {!isUnlocked && progress > 0 && (
                <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Unlock Date (for unlocked achievements) */}
            {isUnlocked && memberAchievement && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Sparkles className="w-3 h-3" />
                    <span>
                        Unlocked {new Date(memberAchievement.unlockedAt).toLocaleDateString()}
                    </span>
                </div>
            )}

            {/* Reward XP */}
            <div className={`
        mt-3 pt-3 border-t flex items-center justify-between
        ${isUnlocked ? 'border-gray-700' : 'border-gray-800'}
      `}>
                <span className="text-xs text-gray-400 uppercase tracking-wide">Reward</span>
                <div className="flex items-center gap-1">
                    <Sparkles className={`w-4 h-4 ${isUnlocked ? tierStyle.text : 'text-gray-500'}`} />
                    <span className={`font-bold ${isUnlocked ? tierStyle.text : 'text-gray-500'}`}>
                        +{achievement.rewardXP} XP
                    </span>
                </div>
            </div>
        </div>
    );
};
