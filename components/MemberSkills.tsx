import React from 'react';
import { motion } from 'framer-motion';
import { Member, ChoreLog, Chore } from '../types';
import { SkillProgressBar } from './SkillProgressBar';
import { calculateSkillProgress, getSkillTitle } from '../utils/leveling';
import { fadeIn } from '../utils/animations';

interface MemberSkillsProps {
    member: Member;
    logs: ChoreLog[];
    chores: Chore[];
}

export const MemberSkills: React.FC<MemberSkillsProps> = ({ member, logs, chores }) => {
    const memberLogs = logs.filter(log => log.memberId === member.id);

    // Calculate skill progress for all skills
    const skills = ['cleaning', 'cooking', 'maintenance', 'pet-care', 'outdoor'] as const;
    const skillProgresses = skills.map(skill =>
        calculateSkillProgress(skill, memberLogs, chores)
    );

    // Filter out skills with no progress
    const activeSkills = skillProgresses.filter(sp => sp.totalChoresCompleted > 0);

    if (activeSkills.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>Complete chores to start building skills!</p>
            </div>
        );
    }

    return (
        <motion.div
            className="member-skills space-y-4"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
            <h3 className="text-lg font-bold text-white mb-4">Skill Progress</h3>
            {activeSkills.map((skillProgress) => (
                <SkillProgressBar key={skillProgress.skill} skillProgress={skillProgress} />
            ))}
        </motion.div>
    );
};
