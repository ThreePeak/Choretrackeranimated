import React from 'react';
import { Lightbulb, Clock } from 'lucide-react';
import { Chore, ChoreLog } from '../types';

interface SmartSuggestionsProps {
    chores: Chore[];
    logs: ChoreLog[];
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({ chores, logs }) => {
    // Generate smart recommendations
    const recommendations = chores
        .map(chore => {
            const lastLog = logs
                .filter(log => log.choreId === chore.id)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

            if (!lastLog) {
                return {
                    chore,
                    reason: 'Never done',
                    priority: 'HIGH' as const,
                    hoursSince: Infinity
                };
            }

            const hoursSince = (Date.now() - new Date(lastLog.timestamp).getTime()) / (1000 * 60 * 60);

            let priority: 'HIGH' | 'MED' | 'LOW' = 'LOW';
            if (hoursSince > 168) priority = 'HIGH';  // > 1 week
            else if (hoursSince > 72) priority = 'MED';  // > 3 days

            return {
                chore,
                reason: `Not done in ${Math.floor(hoursSince / 24)} days, It's been ${Math.floor(hoursSince)} hours`,
                priority,
                hoursSince
            };
        })
        .filter(r => r.hoursSince > 48)  // Only show if not done in 2+ days
        .sort((a, b) => b.hoursSince - a.hoursSince)
        .slice(0, 3);

    if (recommendations.length === 0) {
        return null;
    }

    return (
        <div className="card-3d bg-gray-800/40 border border-blue-500/30 rounded-2xl p-5">
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Lightbulb size={12} /> Smart Suggestions
            </h3>

            <div className="space-y-3">
                {recommendations.map(({ chore, reason, priority }) => (
                    <div
                        key={chore.id}
                        className="bg-gray-900/50 border border-gray-700 rounded-xl p-3 hover:border-blue-500/50 transition-all cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold text-white">{chore.name}</h4>
                            <span
                                className={`px-2 py-1 rounded text-[10px] font-bold ${priority === 'HIGH'
                                        ? 'bg-red-500/20 text-red-400'
                                        : priority === 'MED'
                                            ? 'bg-orange-500/20 text-orange-400'
                                            : 'bg-blue-500/20 text-blue-400'
                                    }`}
                            >
                                {priority}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock size={12} />
                            <span>{reason}</span>
                        </div>
                        {chore.estMinutes && (
                            <div className="text-xs text-gray-500 mt-1">{chore.estMinutes} minutes</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
