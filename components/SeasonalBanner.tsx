import React from 'react';
import { Sparkles } from 'lucide-react';

interface SeasonalBannerProps {
    event: {
        name: string;
        description: string;
        timeRemaining: string;
        xpBonus: number;
    };
    onShare?: () => void;
}

export const SeasonalBanner: React.FC<SeasonalBannerProps> = ({ event, onShare }) => {
    return (
        <div className="relative bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 border border-purple-500/50 rounded-2xl p-4 mb-6 overflow-hidden">
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

            <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Sparkles className="text-yellow-400 animate-pulse" size={24} />
                    <div>
                        <h3 className="font-bold text-white text-lg">{event.name}</h3>
                        <p className="text-sm text-purple-200">{event.description}</p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-xs text-purple-300 uppercase tracking-wider">{event.timeRemaining}</div>
                    <div className="text-sm font-bold text-yellow-400">+{event.xpBonus}% XP Bonus!</div>
                </div>
            </div>

            {onShare && (
                <button
                    onClick={onShare}
                    className="absolute top-3 right-3 px-3 py-1 bg-purple-500/50 hover:bg-purple-500 rounded-lg text-xs font-bold text-white transition-all"
                >
                    Share
                </button>
            )}
        </div>
    );
};
