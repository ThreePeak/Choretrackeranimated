// Migration script to add categories to existing chores in Firebase
// Run this once to update existing data without losing logs

import { database, ref, get, set } from './firebase';

const CHORE_CATEGORY_MAP: Record<string, string> = {
    'Cat box': 'Pets',
    'Dog poop': 'Pets',
    'Empty dishwasher': 'Kitchen',
    'Load dishwasher': 'Kitchen',
    'Make Brunch for 2+': 'Kitchen',
    'Mixed laundry load': 'Laundry',
    'Fold laundry': 'Laundry',
    'Wash bedding': 'Laundry',
    'Clean toilet': 'Bathroom',
    'Clean shower/tub': 'Bathroom',
    'Clean bathroom sink /counter': 'Bathroom',
    'Clean bathroom sink/counter': 'Bathroom',
    'Vacuum': 'Cleaning',
    'Mop': 'Cleaning',
    'Take out garbage': 'Waste',
    'Take out recycling': 'Waste',
    'Dump run': 'Waste',
    'QA Test Chore': 'General'
};

const CHORE_ORDER_MAP: Record<string, number> = {
    'Cat box': 1,
    'Dog poop': 2,
    'Empty dishwasher': 3,
    'Load dishwasher': 4,
    'Make Brunch for 2+': 5,
    'Mixed laundry load': 6,
    'Fold laundry': 7,
    'Wash bedding': 8,
    'Clean toilet': 9,
    'Clean shower/tub': 10,
    'Clean bathroom sink /counter': 11,
    'Clean bathroom sink/counter': 11,
    'Vacuum': 12,
    'Mop': 13,
    'Take out garbage': 14,
    'Take out recycling': 15,
    'Dump run': 16
};

export const migrateChoreCategories = async (appId: string = 'default-family-id'): Promise<void> => {
    try {
        console.log('Starting chore category migration...');

        const dataRef = ref(database, `chore_data/${appId}`);
        const snapshot = await get(dataRef);

        if (!snapshot.exists()) {
            console.log('No data found to migrate');
            return;
        }

        const data = snapshot.val();
        const { chores, members, logs } = data;

        if (!chores || !Array.isArray(chores)) {
            console.log('No chores found');
            return;
        }

        console.log(`Found ${chores.length} chores to migrate`);

        // Update chores with categories and order
        const updatedChores = chores.map(chore => {
            const category = CHORE_CATEGORY_MAP[chore.name] || 'General';
            const order = CHORE_ORDER_MAP[chore.name];

            return {
                ...chore,
                category,
                ...(order && { order })
            };
        });

        // Save back to Firebase - preserving logs and members
        await set(dataRef, {
            members: members || [],
            chores: updatedChores,
            logs: logs || []
        });

        console.log('Migration complete!');
        console.log(`Updated ${updatedChores.length} chores with categories`);
        console.log(`Logs preserved: ${logs?.length || 0}`);
        console.log(`Members preserved: ${members?.length || 0}`);

    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
};

// Auto-run migration on import if in browser
if (typeof window !== 'undefined') {
    console.log('Migration script loaded. Call migrateChoreCategories() to update your data.');
}
