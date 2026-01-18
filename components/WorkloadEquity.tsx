import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { Member, ChoreLog } from '../types';

interface WorkloadEquityProps {
    members: Member[];
    logs: ChoreLog[];
}

export const WorkloadEquity: React.FC<WorkloadEquityProps> = ({ members, logs }) => {
    // Calculate task distribution
    const taskCounts = members.map(member => ({
        member,
        count: logs.filter(log => log.memberId === member.id).length
    }));

    const totalTasks = taskCounts.reduce((sum, m) => sum + m.count, 0);
    const avgTasks = totalTasks / members.length;

    // Calculate equity score (100 = perfect balance)
    const variance = taskCounts.reduce((sum, m) => {
        const diff = m.count - avgTasks;
        return sum + (diff * diff);
    }, 0) / members.length;

    const equityScore = Math.max(0, Math.min(100, 100 - Math.sqrt(variance) * 5));

    const isUnbalanced = equityScore < 70;

    return (
        <div className="card-3d bg-gray-800/40 border border-gray-700 rounded-2xl p-5">
            <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <TrendingUp size={12} /> Workload Equity
            </h3>

            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-5xl font-bold text-white">
                        {Math.round(equityScore)}
                        <span className="text-xl text-gray-400">%</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {isUnbalanced ? 'Needs balancing' : 'Well balanced'}
                    </div>
                </div>

                {isUnbalanced && (
                    <AlertTriangle className="text-orange-400" size={32} />
                )}
            </div>

            <div className="space-y-2">
                {taskCounts
                    .sort((a, b) => b.count - a.count)
                    .map(({ member, count }) => {
                        const percentage = totalTasks > 0 ? ((count / totalTasks) * 100) : 0;
                        return (
                            <div key={member.id}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-300">{member.name}</span>
                                    <span className="text-gray-400">{count} tasks ({percentage.toFixed(0)}%)</span>
                                </div>
                                <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};
