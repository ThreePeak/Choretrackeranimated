// Animation variants for framer-motion

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } },
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

export const bounceIn = {
    hidden: { opacity: 0, scale: 0.3 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 15,
        },
    },
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

// Button hover animation
export const buttonHover = {
    scale: 1.05,
    transition: { duration: 0.2 },
};

export const buttonTap = {
    scale: 0.95,
    transition: { duration: 0.1 },
};

// Confetti particle animation
export const confettiParticle = () => ({
    hidden: {
        opacity: 0,
        y: 0,
        x: 0,
        rotate: 0,
    },
    visible: {
        opacity: [1, 1, 0],
        y: [0, -100, -200],
        x: (Math.random() - 0.5) * 200,
        rotate: Math.random() * 720,
        transition: {
            duration: 1.5,
            ease: 'easeOut',
        },
    },
});

// Card Flip Animation
export const cardFlip = {
    initial: { rotateY: 0, scale: 1 },
    flip: {
        rotateY: 180,
        scale: 0.95,
        transition: { duration: 0.6, ease: 'easeInOut' }
    },
    flipBack: {
        rotateY: 0,
        scale: 1,
        transition: { duration: 0.6, ease: 'easeInOut' }
    }
};

// Spring Physics Configurations
export const springConfigs = {
    gentle: { type: 'spring' as const, stiffness: 100, damping: 15 },
    bouncy: { type: 'spring' as const, stiffness: 300, damping: 20 },
    stiff: { type: 'spring' as const, stiffness: 400, damping: 30 },
    modal: { type: 'spring' as const, stiffness: 260, damping: 20 },
};
