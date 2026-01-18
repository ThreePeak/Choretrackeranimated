import confetti from 'canvas-confetti';

/**
 * Trigger confetti celebration for chore completion
 * Different effects based on XP value and milestones
 */
export const triggerCelebration = (xp: number, milestone?: string) => {
    if (milestone) {
        // Big milestone - sequential fireworks
        fireworks();
    } else if (xp >= 150) {
        // High XP - full confetti burst
        confettiBurst();
    } else if (xp >= 75) {
        // Medium XP - small confetti
        smallConfetti();
    }
    // Low XP chores (< 75) - no animation
};

/**
 * Full screen confetti burst for high XP chores
 */
const confettiBurst = () => {
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999
    };

    function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
        });
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
};

/**
 * Small confetti for medium XP chores
 */
const smallConfetti = () => {
    confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#60a5fa', '#818cf8', '#c084fc'],
        zIndex: 9999
    });

    confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#60a5fa', '#818cf8', '#c084fc'],
        zIndex: 9999
    });
};

/**
 * Fireworks animation for milestones
 */
const fireworks = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Create multiple bursts from random positions
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);
};

/**
 * Success stars animation for achievements
 */
export const celebrateAchievement = () => {
    const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ['star'],
        colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
        zIndex: 9999
    };

    confetti({
        ...defaults,
        particleCount: 50,
        scalar: 1.2,
        shapes: ['star']
    });

    confetti({
        ...defaults,
        particleCount: 25,
        scalar: 0.75,
        shapes: ['circle']
    });
};
