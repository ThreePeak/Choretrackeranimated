import React, { useEffect, useState } from 'react';
import { Achievement } from '../types';
import { ACHIEVEMENT_ICON_MAP, TIER_COLORS } from '../achievements';
import { X, Sparkles, Trophy } from 'lucide-react';

interface AchievementUnlockModalProps {
    achievement: Achievement;
    onClose: () => void;
}

export const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({
    achievement,
    onClose
}) => {
    const [isAnimating, setIsAnimating] = useState(true);
    const tierStyle = TIER_COLORS[achievement.tier];
    const IconComponent = ACHIEVEMENT_ICON_MAP[achievement.icon] || Trophy;

    useEffect(() => {
        const timer = setTimeout(() => setIsAnimating(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            {/* Confetti Background Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-2 h-2 rounded-full ${tierStyle.bg} animate-pulse`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            opacity: 0.6
                        }}
                    />
                ))}
            </div>

            {/* Modal Content */}
            <div className={`
        relative max-w-lg w-full rounded-3xl border-4 p-8
        text-center transform transition-all duration-500
        ${tierStyle.bg} ${tierStyle.border} ${tierStyle.glow}
        ${isAnimating ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}
        shadow-2xl
      `}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 hover:bg-black/70 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-300" />
                </button>

                {/* Achievement Unlocked Badge */}
                <div className="mb-6 animate-bounce">
                    <div className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-full
            ${tierStyle.bg} ${tierStyle.border} border-2
          `}>
                        <Sparkles className={`w-5 h-5 ${tierStyle.text} animate-pulse`} />
                        <span className={`font-black uppercase tracking-wider text-sm ${tierStyle.text}`}>
                            Achievement Unlocked!
                        </span>
                        <Sparkles className={`w-5 h-5 ${tierStyle.text} animate-pulse`} />
                    </div>
                </div>

                {/* Large Icon */}
                <div className={`
          inline-block p-8 rounded-3xl mb-6
          ${tierStyle.bg} ${tierStyle.border} border-4
          transform ${isAnimating ? 'scale-0 rotate-360' : 'scale-100 rotate-0'}
          transition-all duration-700 delay-200
        `}>
                    <IconComponent className={`w-20 h-20 ${tierStyle.text}`} />
                </div>

                {/* Tier Badge */}
                <div className={`
          inline-block px-4 py-1 rounded-full mb-4
          ${tierStyle.bg} ${tierStyle.border} border-2
        `}>
                    <span className={`font-bold uppercase text-xs tracking-widest ${tierStyle.text}`}>
                        {achievement.tier}
                    </span>
                </div>

                {/* Achievement Name */}
                <h2 className="text-4xl font-black text-white mb-3 drop-shadow-lg">
                    {achievement.name}
                </h2>

                {/* Description */}
                <p className="text-lg text-gray-300 mb-6">
                    {achievement.description}
                </p>

                {/* Reward */}
                <div className={`
          inline-flex items-center gap-3 px-6 py-3 rounded-xl
          bg-black/50 border-2 ${tierStyle.border}
        `}>
                    <Sparkles className={`w-6 h-6 ${tierStyle.text}`} />
                    <div className="text-left">
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Reward</div>
                        <div className={`text-2xl font-black ${tierStyle.text}`}>
                            +{achievement.rewardXP} XP
                        </div>
                    </div>
                </div>

                {/* Celebrate Button */}
                <button
                    onClick={onClose}
                    className={`
            mt-8 w-full py-4 px-6 rounded-xl font-bold text-lg
            ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border}
            border-2 hover:scale-105 transform transition-all duration-200
            shadow-lg hover:shadow-xl
          `}
                >
                    Awesome! 🎉
                </button>
            </div>
        </div>
    );
};
