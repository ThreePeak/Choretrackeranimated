import React from 'react';
import { ChoreLog, Member, Chore } from '../types';
import { getRelativeTime } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveActivityFeedProps {
    logs: ChoreLog[];
    members: Member[];
    chores: Chore[];
    maxItems?: number;
}

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({
    logs,
    members,
    chores,
    maxItems = 10
}) => {
    // Show most recent logs first
    const recentLogs = [...logs].slice(0, maxItems);

    return (
        <div className="space-y-2">
            <AnimatePresence>
                {recentLogs.map((log, index) => {
                    const member = members.find(m => m.id === log.memberId);
                    const chore = chores.find(c => c.id === log.choreId);

                    if (!member || !chore) return null;

                    return (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 p-3 bg-gray-800/40 border border-gray-700/50 rounded-lg hover:bg-gray-800/60 transition-colors"
                        >
                            {/* Activity indicator */}
                            <div className="flex-shrink-0">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            </div>

                            {/* Member avatar */}
                            {member.avatar && (
                                <div className="text-2xl flex-shrink-0">
                                    {member.avatar}
                                </div>
                            )}

                            {/* Activity description */}
                            <div className="flex-1 min-w-0">
                                <span className="text-sm text-gray-300">
                                    <span className="font-bold text-white">{member.name}</span>
                                    {' '}completed{' '}
                                    <span className="text-blue-400 font-medium">{chore.name}</span>
                                </span>
                                {log.isManual && (
                                    <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                                        MANUAL
                                    </span>
                                )}
                            </div>

                            {/* Time ago */}
                            <div className="text-xs text-gray-500 flex-shrink-0">
                                {getRelativeTime(log.timestamp)}
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {logs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📭</div>
                    <div className="text-sm">No activity yet. Complete a chore to get started!</div>
                </div>
            )}
        </div>
    );
};
