import React from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import { Member, ChoreLog } from '../types';

interface FamilyRosterProps {
    members: Member[];
    logs: ChoreLog[];
    onViewSkills: (memberId: string) => void;
}

export const FamilyRoster: React.FC<FamilyRosterProps> = ({ members, logs, onViewSkills }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Trophy size={12} /> Family Roster
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {members.map(member => {
                    const memberLogs = logs.filter(log => log.memberId === member.id);
                    const totalXP = (member as any).totalXP || 0;
                    const level = Math.floor(totalXP / 100) + 1;
                    const xpProgress = totalXP % 100;

                    return (
                        <div
                            key={member.id}
                            className="card-3d bg-gray-800/40 border border-gray-700 rounded-2xl p-5 hover:border-blue-500/50 transition-all"
                        >
                            {/* Avatar */}
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                                    style={{ backgroundColor: member.color }}
                                >
                                    {(member as any).avatar || member.name[0]}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white">{member.name}</h4>
                                    <div className="text-sm text-gray-400">Level {level}</div>
                                </div>
                            </div>

                            {/* XP Progress */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-400">XP Progress</span>
                                    <span className="text-blue-400">{xpProgress} / 100</span>
                                </div>
                                <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                                        style={{ width: `${xpProgress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                                <div className="bg-gray-900/50 rounded-lg p-2">
                                    <div className="text-gray-500">Total XP</div>
                                    <div className="font-bold text-white">{totalXP.toLocaleString()}</div>
                                </div>
                                <div className="bg-gray-900/50 rounded-lg p-2">
                                    <div className="text-gray-500">Tasks</div>
                                    <div className="font-bold text-white">{memberLogs.length}</div>
                                </div>
                            </div>

                            {/* View Skills Button */}
                            <button
                                onClick={() => onViewSkills(member.id)}
                                className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg font-bold text-blue-400 text-sm transition-all flex items-center justify-center gap-2"
                            >
                                <TrendingUp size={14} />
                                View Skills
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
