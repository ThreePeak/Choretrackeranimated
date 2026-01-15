import { MASTER_CHORES } from './constants';

export const generateColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

export const getTimestamp = (t: any): number => {
    if (!t) return 0;
    // Handle Firestore-like timestamp objects
    if (typeof t.toDate === 'function') return t.toDate().getTime();
    // Handle strings or Date objects
    const d = new Date(t);
    return isNaN(d.getTime()) ? 0 : d.getTime();
};

export const formatDate = (timestamp: any): string => {
  if (!timestamp) return '';
  const date = new Date(getTimestamp(timestamp));
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: '2-digit'
  }).format(date);
};

export const getRelativeTime = (timestamp: any): string => {
  if (!timestamp) return 'Never';
  const date = new Date(getTimestamp(timestamp));
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
};

export const getDayName = (dateInput: any): string => {
    const date = new Date(getTimestamp(dateInput));
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
};

export const getHour = (dateInput: any): number => {
    const date = new Date(getTimestamp(dateInput));
    return date.getHours();
};

// Legacy estimator - now used as fallback
export const estimateChoreDuration = (choreName: string): number => {
    const lower = choreName.toLowerCase();
    if (lower.includes('dish') || lower.includes('wash') || lower.includes('clean') || lower.includes('vacuum') || lower.includes('mow')) return 20;
    if (lower.includes('laundry') || lower.includes('fold') || lower.includes('grocer') || lower.includes('cook')) return 30;
    if (lower.includes('trash') || lower.includes('feed') || lower.includes('bed') || lower.includes('mail') || lower.includes('wipe')) return 5;
    if (lower.includes('tidy') || lower.includes('organize')) return 15;
    return 10; // Default average
};

export const getChoreCategory = (choreName: string): string => {
    const lower = choreName.toLowerCase();
    if (lower.includes('kitchen') || lower.includes('dish') || lower.includes('cook') || lower.includes('meal') || lower.includes('fridge')) return 'Kitchen';
    if (lower.includes('bath') || lower.includes('toilet') || lower.includes('shower')) return 'Bathroom';
    if (lower.includes('bed') || lower.includes('laundry') || lower.includes('clothes') || lower.includes('fold')) return 'Bedroom & Laundry';
    if (lower.includes('mow') || lower.includes('garden') || lower.includes('yard') || lower.includes('car')) return 'Outdoor';
    if (lower.includes('dog') || lower.includes('cat') || lower.includes('feed') || lower.includes('pet')) return 'Pets';
    return 'General';
};

export const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Smart Heuristic Calculation for new chores.
 * 1. Checks exact match in Master Data.
 * 2. Checks fuzzy keyword match in Master Data.
 * 3. Falls back to estimation logic.
 */
export const predictChoreValues = (name: string): { xp: number, estMinutes: number, category: string } => {
    const lowerName = name.trim().toLowerCase();

    // 1. Exact Match
    const exactMatch = MASTER_CHORES.find(c => c.name.toLowerCase() === lowerName);
    if (exactMatch) {
        return { 
            xp: exactMatch.xp, 
            estMinutes: exactMatch.estMinutes, 
            category: exactMatch.category 
        };
    }

    // 2. Fuzzy Match (Keywords)
    // We check if the new chore name contains words from a master chore, or vice versa (for partials)
    const fuzzyMatch = MASTER_CHORES.find(c => {
        const masterWords = c.name.toLowerCase().split(' ');
        // Match if any significant word from master chore exists in input
        return masterWords.some(w => w.length > 3 && lowerName.includes(w));
    });

    if (fuzzyMatch) {
        return {
            xp: fuzzyMatch.xp,
            estMinutes: fuzzyMatch.estMinutes,
            category: fuzzyMatch.category
        };
    }

    // 3. Fallback Heuristics
    const estMinutes = estimateChoreDuration(name);
    // Formula: XP = (EstTime * 10) + 50
    const xp = (estMinutes * 10) + 50; 
    const category = getChoreCategory(name);

    return { xp, estMinutes, category };
};