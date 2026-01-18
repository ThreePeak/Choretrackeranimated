import React from 'react';
import { motion } from 'framer-motion';
import { Theme, ThemePreset } from '../types';
import { THEMES, applyTheme, animateThemeTransition } from '../utils/themes';
import { fadeIn, slideUp } from '../utils/animations';

interface ThemeSelectorProps {
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
    const handleThemeSelect = (theme: Theme) => {
        animateThemeTransition();
        applyTheme(theme);
        onThemeChange(theme);
    };

    return (
        <motion.div
            className="theme-selector"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
            <h3 className="text-xl font-bold mb-4">Choose Your Theme</h3>

            <div className="theme-grid grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.values(THEMES).map((theme) => (
                    <ThemeCard
                        key={theme.id}
                        theme={theme}
                        isActive={currentTheme.id === theme.id}
                        onClick={() => handleThemeSelect(theme)}
                    />
                ))}
            </div>
        </motion.div>
    );
};

interface ThemeCardProps {
    theme: Theme;
    isActive: boolean;
    onClick: () => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, isActive, onClick }) => {
    return (
        <motion.button
            className={`theme-card relative overflow-hidden rounded-xl p-4 border-2 transition-all ${isActive ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-700 hover:border-gray-600'
                }`}
            style={{ backgroundColor: theme.colors.surface }}
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={slideUp}
        >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm" />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <div
                        className="w-4 h-4 rounded-full border-2"
                        style={{
                            backgroundColor: theme.colors.primary,
                            borderColor: theme.colors.accent
                        }}
                    />
                    <h4 className="font-semibold" style={{ color: theme.colors.text }}>
                        {theme.name}
                    </h4>
                </div>

                {/* Color palette preview */}
                <div className="flex gap-1 mb-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.colors.primary }} />
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.colors.secondary }} />
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.colors.accent }} />
                </div>

                <div className="text-xs opacity-70" style={{ color: theme.colors.textSecondary }}>
                    {isActive ? '✓ Active' : 'Click to apply'}
                </div>
            </div>

            {/* Active indicator glow */}
            {isActive && (
                <motion.div
                    className="absolute inset-0 bg-blue-500/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                />
            )}
        </motion.button>
    );
};
