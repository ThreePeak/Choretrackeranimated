export interface Member {
  id: string;
  name: string;
  color: string;
  joinedAt?: any;
}

export interface Chore {
  id: string;
  name: string;
  createdAt?: any;
  order?: number;     // For manual sorting
  category?: string;  // For grouping (Kitchen, etc)
  xp: number;         // Gamification value
  estMinutes: number; // Duration estimate
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

export type AppView = 'dashboard' | 'chore_detail' | 'settings' | 'stats';