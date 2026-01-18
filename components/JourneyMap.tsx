import React from 'react';
import { JourneyNode } from '../utils/journey';
import { Map, Users } from 'lucide-react';

interface JourneyMapProps {
    nodes: JourneyNode[];
    members: Array<{ id: string; name: string; }>;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({ nodes, members }) => {
    if (nodes.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                <Map size={48} className="mx-auto mb-2 opacity-50" />
                <p>Your household journey will appear here as you complete chores!</p>
            </div>
        );
    }

    // Show only the 5 most recent nodes
    const recentNodes = nodes.slice(-5).reverse();

    return (
        <div className="relative">
            {/* Journey Path SVG */}
            <svg className="absolute left-8 top-0 h-full w-1" style={{ zIndex: 0 }}>
                <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="100%"
                    stroke="url(#journeyGradient)"
                    strokeWidth="2"
                    className="journey-path"
                />
                <defs>
                    <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Journey Nodes */}
            <div className="space-y-6 relative z-10">
                {recentNodes.map((node, index) => {
                    const participantNames = node.participants
                        .map(id => members.find(m => m.id === id)?.name || 'Unknown')
                        .slice(0, 3)
                        .join(', ');

                    return (
                        <div key={node.id} className="flex items-start gap-4">
                            <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shrink-0 ${node.milestone
                                        ? 'bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/50'
                                        : 'bg-gradient-to-br from-blue-500 to-purple-500'
                                    }`}
                            >
                                {node.icon}
                            </div>

                            <div className="flex-1 bg-gray-800/40 border border-gray-700 rounded-xl p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h4 className="font-bold text-white">{node.title}</h4>
                                        <p className="text-sm text-gray-400">{node.description}</p>
                                    </div>
                                    <span className="text-xs text-yellow-400 font-bold">+{node.xpEarned} XP</span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Users size={12} />
                                    <span>{participantNames}</span>
                                    <span className="ml-auto">{node.date.toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {nodes.length > 5 && (
                <div className="text-center text-sm text-gray-500 mt-4">
                    Showing 5 of {nodes.length} milestones
                </div>
            )}
        </div>
    );
};
