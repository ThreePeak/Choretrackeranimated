import React from 'react';
import { motion } from 'framer-motion';
import { ChoreSkill } from '../types';
import { getSkillTitle } from '../utils/leveling';
import { fadeIn } from '../utils/animations';

interface SkillProgressBarProps {
    skill: ChoreSkill;
    level: number;
    currentXP: number;
    xpToNextLevel: number;
    totalChoresCompleted: number;
}

export const SkillProgressBar: React.FC<SkillProgressBarProps> = ({
    skill,
    level,
    currentXP,
    xpToNextLevel,
    totalChoresCompleted
}) => {
    const percentage = (currentXP / xpToNextLevel) * 100;
    const title = getSkillTitle(skill, level);

    const skillIcons: Record<ChoreSkill, string> = {
        cleaning: '🧹',
        cooking: '👨‍🍳',
        maintenance: '🔧',
        'pet-care': '🐾',
        outdoor: '🌳',
    };

    const skillColors: Record<ChoreSkill, string> = {
        cleaning: 'blue',
        cooking: 'orange',
        maintenance: 'gray',
        'pet-care': 'pink',
        outdoor: 'green',
    };

    const color = skillColors[skill];

    return (
        <motion.div
            className="skill-progress-bar bg-gray-800/40 rounded-xl p-4 border border-gray-700"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{skillIcons[skill]}</span>
                    <div>
                        <h4 className="font-bold text-white capitalize">{skill.replace('-', ' ')}</h4>
                        <p className="text-xs text-gray-400">{title}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black text-white">Lv {level}</div>
                    <div className="text-xs text-gray-500">{totalChoresCompleted} chores</div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-3 bg-gray-900 rounded-full overflow-hidden">
                <motion.div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r from-${color}-500 to-${color}-400 rounded-full`}
                    style={{
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, var(--color-${color === 'blue' ? 'primary' : 'accent'}) 0%, var(--color-secondary) 100%)`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </div>

            <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>{currentXP} XP</span>
                <span>{xpToNextLevel} XP to next level</span>
            </div>
        </motion.div>
    );
};
