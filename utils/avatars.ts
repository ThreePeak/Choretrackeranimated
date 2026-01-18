// Avatar generation and management
export const AVATAR_OPTIONS = [
    //Animals
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
    // Fantasy
    '🧙', '🧚', '🦄', '🐲', '👻', '🤖', '👽', '🦸', '🧜', '🧛',
    // Objects
    '⭐', '🌟', '✨', '🔥', '🌈', '☀️', '🌙', '⚡', '💎', '🏆'
];

export type AvatarFrame = 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';

export const FRAME_STYLES: Record<AvatarFrame, { border: string; shadow: string; gradient: string }> = {
    none: {
        border: '2px solid transparent',
        shadow: 'none',
        gradient: 'none',
    },
    bronze: {
        border: '3px solid #CD7F32',
        shadow: '0 0 10px rgba(205, 127, 50, 0.5)',
        gradient: 'linear-gradient(135deg, #CD7F32, #8B4513)',
    },
    silver: {
        border: '3px solid #C0C0C0',
        shadow: '0 0 15px rgba(192, 192, 192, 0.6)',
        gradient: 'linear-gradient(135deg, #E8E8E8, #C0C0C0)',
    },
    gold: {
        border: '3px solid #FFD700',
        shadow: '0 0 20px rgba(255, 215, 0, 0.7)',
        gradient: 'linear-gradient(135deg, #FFD700, #FFA500)',
    },
    platinum: {
        border: '3px solid #E5E4E2',
        shadow: '0 0 25px rgba(229, 228, 226, 0.8)',
        gradient: 'linear-gradient(135deg, #FFFFFF, #E5E4E2, #B0C4DE)',
    },
};

// Determine frame based on XP
export const getFrameForXP = (totalXP: number): AvatarFrame => {
    if (totalXP >= 10000) return 'platinum';
    if (totalXP >= 5000) return 'gold';
    if (totalXP >= 2000) return 'silver';
    if (totalXP >= 500) return 'bronze';
    return 'none';
};

// Convert image to base64
export const imageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Random avatar generator
export const getRandomAvatar = (): string => {
    return AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)];
};
