import { Theme, ThemePreset } from '../types';

// Preset Themes
export const THEMES: Record<ThemePreset, Theme> = {
    dark: {
        id: 'dark',
        name: 'Dark Mode',
        preset: 'dark',
        colors: {
            primary: '#3B82F6',
            secondary: '#8B5CF6',
            accent: '#EC4899',
            background: '#0F172A',
            surface: '#1E293B',
            text: '#F1F5F9',
            textSecondary: '#94A3B8',
            border: '#334155',
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6',
        },
    },
    light: {
        id: 'light',
        name: 'Light Mode',
        preset: 'light',
        colors: {
            primary: '#2563EB',
            secondary: '#7C3AED',
            accent: '#DB2777',
            background: '#F8FAFC',
            surface: '#FFFFFF',
            text: '#0F172A',
            textSecondary: '#64748B',
            border: '#E2E8F0',
            success: '#059669',
            warning: '#D97706',
            error: '#DC2626',
            info: '#2563EB',
        },
    },
    midnight: {
        id: 'midnight',
        name: 'Midnight',
        preset: 'midnight',
        colors: {
            primary: '#6366F1',
            secondary: '#A78BFA',
            accent: '#F472B6',
            background: '#020617',
            surface: '#0C1222',
            text: '#E0E7FF',
            textSecondary: '#A5B4FC',
            border: '#1E293B',
            success: '#34D399',
            warning: '#FBBF24',
            error: '#F87171',
            info: '#818CF8',
        },
    },
    pastel: {
        id: 'pastel',
        name: 'Pastel Dreams',
        preset: 'pastel',
        colors: {
            primary: '#A78BFA',
            secondary: '#FBCFE8',
            accent: '#FCD34D',
            background: '#FAF5FF',
            surface: '#FFFFFF',
            text: '#1F2937',
            textSecondary: '#6B7280',
            border: '#E9D5FF',
            success: '#6EE7B7',
            warning: '#FDE047',
            error: '#FCA5A5',
            info: '#C4B5FD',
        },
    },
    'high-contrast': {
        id: 'high-contrast',
        name: 'High Contrast',
        preset: 'high-contrast',
        colors: {
            primary: '#FFFFFF',
            secondary: '#F0F0F0',
            accent: '#FFFF00',
            background: '#000000',
            surface: '#1A1A1A',
            text: '#FFFFFF',
            textSecondary: '#CCCCCC',
            border: '#444444',
            success: '#00FF00',
            warning: '#FFFF00',
            error: '#FF0000',
            info: '#00FFFF',
        },
    },
};

// Apply theme to DOM
export const applyTheme = (theme: Theme) => {
    const root = document.documentElement;

    Object.entries(theme.colors).forEach(([key, value]) => {
        const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVarName, value);
    });

    // Store in localStorage
    localStorage.setItem('theme', theme.id);
};

// Get saved theme
export const getSavedTheme = (): Theme => {
    const savedThemeId = localStorage.getItem('theme') as ThemePreset | null;
    return savedThemeId && THEMES[savedThemeId] ? THEMES[savedThemeId] : THEMES.dark;
};

// Theme transition animation
export const animateThemeTransition = () => {
    document.documentElement.classList.add('theme-transition');
    setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
    }, 300);
};
