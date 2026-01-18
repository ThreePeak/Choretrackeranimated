export interface Member {
  id: string;
  name: string;
  color: string;
  joinedAt?: any;
  avatar?: string; // Emoji avatar
  bio?: string; // Personal motto/bio
  preferredChores?: string[]; // Chore IDs of preferred chores
  skillLevels?: Record<ChoreSkill, number>; // Skill levels for leveling system
  totalXP?: number; // Total XP earned
}

export interface Chore {
  id: string;
  name: string;
  createdAt?: any;
  order?: number;     // For manual sorting
  category?: string;  // For grouping (Kitchen, etc)
  xp: number;         // Gamification value
  estMinutes: number; // Duration estimate
  difficulty?: DifficultyTier; // Difficulty level
  skill?: ChoreSkill; // Associated skill
}

export interface ChoreLog {
  id: string;
  choreId: string;
  memberId: string;
  timestamp: any;
  isManual?: boolean;
}

export interface DistributionItem {
  label: string;
  value: number;
  color: string;
  id: string;
}

export type AppView = 'dashboard' | 'chore_detail' | 'stats' | 'settings' | 'achievements' | 'analytics' | 'history' | 'profile' | 'advanced_analytics';

// Theme System Types
export type ThemePreset = 'dark' | 'light' | 'midnight' | 'pastel' | 'high-contrast';

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  preset: ThemePreset;
}

// Avatar System Types
export type AvatarType = 'photo' | 'generated' | 'default';
export type AvatarFrame = 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Avatar {
  type: AvatarType;
  data: string; // base64 or avatar ID
  frame: AvatarFrame;
}

export interface MemberProfile {
  bio?: string;
  favoriteChores: string[]; // chore IDs
  showcaseAchievements: string[]; // achievement IDs (max 3)
  skillLevels: Record<ChoreSkill, number>;
}

// Difficulty & Leveling Types
export type ChoreSkill = 'cleaning' | 'cooking' | 'maintenance' | 'pet-care' | 'outdoor';
export type DifficultyTier = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';

export interface ChoreDifficulty {
  tier: DifficultyTier;
  skill: ChoreSkill;
  xpMultiplier: number; // 1.0 (beginner) to 5.0 (master)
  minLevel: number; // minimum skill level required
}

export interface SkillProgress {
  skill: ChoreSkill;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalChoresCompleted: number;
}

// Sound & Haptics Types
export interface SoundSettings {
  enabled: boolean;
  volume: number; // 0-100
  uiSounds: boolean;
  achievementSounds: boolean;
  completionSounds: boolean;
  hapticsEnabled: boolean;
}

// Advanced Analytics Types
export interface TimeAnalytics {
  choreId: string;
  averageCompletionMinutes: number;
  fastestCompletion: number;
  slowestCompletion: number;
  totalCompletions: number;
}

export interface ProductivityHeatmap {
  dayOfWeek: number; // 0-6 (Sun-Sat)
  hour: number; // 0-23
  completionCount: number;
  totalXP: number;
}

export interface TrendData {
  date: string; // ISO date
  totalChores: number;
  totalXP: number;
  memberStats: Record<string, { chores: number; xp: number }>;
}


// Achievement System Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  category: 'completion' | 'streak' | 'speed' | 'variety' | 'collaboration' | 'mastery';
  requirement: {
    type: 'chore_count' | 'streak_days' | 'xp_total' | 'category_master' | 'single_day';
    threshold: number;
    choreCategory?: string;
  };
  rewardXP: number;
}

export interface MemberAchievement {
  memberId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number; // 0-100
}

// Analytics Types
export interface AnalyticsMetrics {
  period: 'week' | 'month' | 'year' | 'all';
  startDate: Date;
  endDate: Date;
  metrics: {
    totalTasks: number;
    totalXP: number;
    totalHours: number;
    avgTasksPerDay: number;
    avgTasksPerMember: number;
    completionRate: number;
    categoryBreakdown: { category: string; count: number; xp: number; hours: number }[];
    memberEfficiency: { memberId: string; name: string; actualHours: number; taskCount: number }[];
    peakHours: { hour: number; count: number }[];
    busyDays: { day: string; count: number }[];
    completionTrend: { date: string; count: number; xp: number }[];
  };
  trends: {
    tasksChange: number;
    xpChange: number;
    participationChange: number;
  };
}

// PWA Types
export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
