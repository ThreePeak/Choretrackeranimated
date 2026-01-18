import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '../utils/animations';

interface ConfettiProps {
    show: boolean;
    onComplete?: () => void;
}

const COLORS = ['#3B82F6', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6', '#F97316'];

export const Confetti: React.FC<ConfettiProps> = ({ show, onComplete }) => {
    const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 400,
        y: Math.random() * -500 - 100,
        rotate: Math.random() * 720,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 10 + 5,
    }));

    return (
        <AnimatePresence onExitComplete={onComplete}>
            {show && (
                <motion.div
                    className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={fadeIn}
                >
                    {particles.map((particle) => (
                        <motion.div
                            key={particle.id}
                            className="absolute rounded-full"
                            style={{
                                backgroundColor: particle.color,
                                width: particle.size,
                                height: particle.size,
                            }}
                            initial={{
                                x: 0,
                                y: 0,
                                opacity: 1,
                                rotate: 0,
                            }}
                            animate={{
                                x: particle.x,
                                y: particle.y,
                                opacity: 0,
                                rotate: particle.rotate,
                            }}
                            transition={{
                                duration: 2,
                                ease: 'easeOut',
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
