import { ChoreLog, Chore, Member } from '../types';
import { getTimestamp } from '../utils';

export interface RecurringSchedule {
    id: string;
    choreId: string;
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    enabled: boolean;
    lastNotified?: Date;
    nextDue?: Date;
    preferredMember?: string;
}

/**
 * Check if a schedule should trigger a notification
 */
export const shouldNotify = (schedule: RecurringSchedule, now: Date = new Date()): boolean => {
    if (!schedule.enabled) return false;

    // Don't notify if already notified in last hour
    if (schedule.lastNotified) {
        const hoursSinceNotification = (now.getTime() - schedule.lastNotified.getTime()) / (1000 * 60 * 60);
        if (hoursSinceNotification < 1) return false;
    }

    if (!schedule.nextDue) return false;

    return now.getTime() >= schedule.nextDue.getTime();
};

/**
 * Calculate next due date based on frequency
 */
export const calculateNextDue = (
    schedule: RecurringSchedule,
    lastCompletion?: Date
): Date => {
    const base = lastCompletion || new Date();
    const nextDue = new Date(base);

    switch (schedule.frequency) {
        case 'daily':
            nextDue.setDate(nextDue.getDate() + 1);
            break;
        case 'weekly':
            nextDue.setDate(nextDue.getDate() + 7);
            break;
        case 'biweekly':
            nextDue.setDate(nextDue.getDate() + 14);
            break;
        case 'monthly':
            nextDue.setMonth(nextDue.getMonth() + 1);
            break;
    }

    return nextDue;
};

/**
 * Get schedules that need attention
 */
export const getOverdueSchedules = (
    schedules: RecurringSchedule[],
    chores: Chore[],
    now: Date = new Date()
): Array<RecurringSchedule & { chore: Chore }> => {
    return schedules
        .filter(schedule => schedule.enabled && schedule.nextDue && now.getTime() > schedule.nextDue.getTime())
        .map(schedule => ({
            ...schedule,
            chore: chores.find(c => c.id === schedule.choreId)!
        }))
        .filter(item => item.chore); // Filter out any schedules for deleted chores
};

/**
 * Request browser notification permission and show notification
 */
export const showChoreNotification = async (chore: Chore, member?: Member): Promise<void> => {
    if (!('Notification' in window)) {
        console.log('Browser does not support notifications');
        return;
    }

    if (Notification.permission === 'default') {
        await Notification.requestPermission();
    }

    if (Notification.permission === 'granted') {
        const notification = new Notification('Chore Reminder', {
            body: member
                ? `${member.name}, it's time to: ${chore.name}`
                : `Don't forget: ${chore.name}`,
            icon: '/icon.png',
            badge: '/badge.png',
            tag: `chore-${chore.id}`,
            requireInteraction: false
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }
};
