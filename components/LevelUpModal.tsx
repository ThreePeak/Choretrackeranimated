import React from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, Star, TrendingUp } from 'lucide-react';
import { Confetti } from './Confetti';

interface LevelUpModalProps {
    memberName: string;
    newLevel: number;
    totalXP: number;
    totalChores: number;
    onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
    memberName,
    newLevel,
    totalXP,
    totalChores,
    onClose
}) => {
    return (
        <>
            <Confetti show={true} />
            <motion.div
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 rounded-3xl p-8 max-w-md w-full border border-purple-500/30 relative overflow-hidden"
                    initial={{ scale: 0.5, rotateY: -180 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    exit={{ scale: 0.5, rotateY: 180 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Animated background glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 animate-pulse" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
                    >
                        <X size={20} className="text-white/80" />
                    </button>

                    <div className="relative z-10 text-center">
                        {/* Level Up Icon */}
                        <motion.div
                            className="inline-block mb-4"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        >
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl">
                                <Trophy size={40} className="text-white" />
                            </div>
                        </motion.div>

                        {/* Level Up Text */}
                        <motion.h2
                            className="text-4xl font-black text-white mb-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            LEVEL UP!
                        </motion.h2>

                        <motion.p
                            className="text-xl text-purple-200 mb-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {memberName}
                        </motion.p>

                        {/* New Level Display */}
                        <motion.div
                            className="inline-block mb-6"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                        >
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20">
                                <div className="flex items-center gap-2 justify-center">
                                    <Star className="text-yellow-400" size={24} />
                                    <span className="text-5xl font-black text-white">Level {newLevel}</span>
                                    <Star className="text-yellow-400" size={24} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            className="grid grid-cols-2 gap-4 mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <TrendingUp className="text-emerald-400 mx-auto mb-2" size={20} />
                                <div className="text-2xl font-bold text-white">{totalXP}</div>
                                <div className="text-xs text-gray-300">Total XP</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <Trophy className="text-blue-400 mx-auto mb-2" size={20} />
                                <div className="text-2xl font-bold text-white">{totalChores}</div>
                                <div className="text-xs text-gray-300">Chores Done</div>
                            </div>
                        </motion.div>

                        {/* Close Button */}
                        <motion.button
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Amazing! 🎉
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};
