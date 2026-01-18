import React from 'react';
import { ChoreSkill } from '../types';
import { SkillProgressBar } from './SkillProgressBar';
import { ArrowLeft, Trophy, Star } from 'lucide-react';

interface SkillsDashboardProps {
    memberName: string;
    skillLevels: Record<ChoreSkill, number>;
    totalXP: number;
    onBack: () => void;
}

const skillIcons: Record<ChoreSkill, string> = {
    'cleaning': '🧹',
    'cooking': '👨‍🍳',
    'maintenance': '🔧',
    'pet-care': '🐾',
    'outdoor': '🌳'
};

const skillColors: Record<ChoreSkill, string> = {
    'cleaning': '#3b82f6',
    'cooking': '#f59e0b',
    'maintenance': '#8b5cf6',
    'pet-care': '#ec4899',
    'outdoor': '#10b981'
};

export const SkillsDashboard: React.FC<SkillsDashboardProps> = ({
    memberName,
    skillLevels,
    totalXP,
    onBack
}) => {
    const overallLevel = Math.floor(totalXP / 100) + 1;

    // Calculate skill rankings
    const sortedSkills = (Object.entries(skillLevels) as [ChoreSkill, number][])
        .sort((a, b) => b[1] - a[1]);

    const topSkill = sortedSkills[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors border border-gray-700"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-yellow-400" />
                        <h1 className="text-4xl font-black">{memberName}'s Skills</h1>
                    </div>
                    <div className="w-32" />
                </div>

                {/* Overall Stats Card */}
                <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 rounded-3xl p-6 mb-8 border border-purple-500/30 backdrop-blur-sm">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-gray-400 text-sm uppercase tracking-wide mb-1">Overall Level</div>
                            <div className="flex items-center justify-center gap-2">
                                <Star className="text-yellow-400" size={24} />
                                <div className="text-4xl font-black">{overallLevel}</div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-gray-400 text-sm uppercase tracking-wide mb-1">Total XP</div>
                            <div className="text-4xl font-black text-purple-400">{totalXP}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-gray-400 text-sm uppercase tracking-wide mb-1">Top Skill</div>
                            <div className="text-2xl font-bold flex items-center justify-center gap-2">
                                <span>{skillIcons[topSkill[0]]}</span>
                                <span className="capitalize">{topSkill[0].replace('-', ' ')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills Grid */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Star className="text-yellow-400" />
                        Skill Breakdown
                    </h2>

                    {(Object.entries(skillLevels) as [ChoreSkill, number][]).map(([skill, level]) => {
                        const xpForThisSkill = level * 100; // Simplified calculation
                        const xpToNextLevel = (level + 1) * 100;

                        return (
                            <div
                                key={skill}
                                className="bg-gray-900/60 border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div
                                        className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-lg"
                                        style={{ backgroundColor: skillColors[skill] + '20', border: `2px solid ${skillColors[skill]}40` }}
                                    >
                                        {skillIcons[skill]}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold capitalize">{skill.replace('-', ' ')}</h3>
                                        <p className="text-sm text-gray-400">Level {level} • {xpForThisSkill} XP earned</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black" style={{ color: skillColors[skill] }}>
                                            #{sortedSkills.findIndex(s => s[0] === skill) + 1}
                                        </div>
                                        <div className="text-xs text-gray-500">Rank</div>
                                    </div>
                                </div>

                                <SkillProgressBar
                                    skill={skill}
                                    level={level}
                                    currentXP={xpForThisSkill}
                                    xpToNextLevel={xpToNextLevel}
                                    totalChoresCompleted={level * 10}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Progress Info */}
                <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/30 rounded-2xl">
                    <p className="text-sm text-gray-300 text-center">
                        💡 <strong>Tip:</strong> Complete chores in different categories to level up specific skills!
                    </p>
                </div>
            </div>
        </div>
    );
};
