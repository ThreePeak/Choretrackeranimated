import { supabase } from '../supabaseClient';
import { Member, Chore, ChoreLog, MemberAchievement } from '../types';

/**
 * Data Service Layer - Abstracts all Supabase database operations
 * This keeps database logic separate from UI components
 */

// ========== LOAD DATA ==========

export const loadAllData = async () => {
    try {
        // Fetch all data in parallel
        const [membersRes, choresRes, logsRes, achievementsRes] = await Promise.all([
            supabase.from('members').select('*').order('created_at', { ascending: true }),
            supabase.from('chores').select('*').order('order_index', { ascending: true }),
            supabase.from('chore_logs').select('*').order('timestamp', { ascending: false }),
            supabase.from('member_achievements').select('*'),
        ]);

        // Check for errors
        if (membersRes.error) throw membersRes.error;
        if (choresRes.error) throw choresRes.error;
        if (logsRes.error) throw logsRes.error;
        if (achievementsRes.error) throw achievementsRes.error;

        // Transform Supabase data to app format
        const members: Member[] = (membersRes.data || []).map(m => ({
            id: m.id,
            name: m.name,
            color: m.color,
            joinedAt: m.joined_at,
            avatar: m.avatar,
            bio: m.bio,
            preferredChores: m.preferred_chores || [],
            skillLevels: m.skill_levels || {},
            totalXP: m.total_xp || 0,
        }));

        const chores: Chore[] = (choresRes.data || []).map(c => ({
            id: c.id,
            name: c.name,
            createdAt: c.created_at,
            order: c.order_index,
            category: c.category,
            xp: c.xp,
            estMinutes: c.est_minutes,
            difficulty: c.difficulty,
            skill: c.skill,
        }));

        const logs: ChoreLog[] = (logsRes.data || []).map(l => ({
            id: l.id,
            choreId: l.chore_id,
            memberId: l.member_id,
            timestamp: l.timestamp,
            isManual: l.is_manual,
        }));

        const achievements: MemberAchievement[] = (achievementsRes.data || []).map(a => ({
            memberId: a.member_id,
            achievementId: a.achievement_id,
            unlockedAt: new Date(a.unlocked_at),
            progress: parseFloat(a.progress),
        }));

        return { members, chores, logs, achievements, success: true };
    } catch (error) {
        console.error('❌ Failed to load data from Supabase:', error);
        return { members: [], chores: [], logs: [], achievements: [], success: false, error };
    }
};

// ========== SAVE DATA ==========

export const saveMembers = async (members: Member[]) => {
    try {
        // Transform to Supabase format
        const data = members.map(m => ({
            id: m.id,
            name: m.name,
            color: m.color,
            joined_at: m.joinedAt,
            avatar: m.avatar,
            bio: m.bio,
            preferred_chores: m.preferredChores || [],
            skill_levels: m.skillLevels || {},
            total_xp: m.totalXP || 0,
        }));

        // Upsert (insert or update)
        const { error } = await supabase
            .from('members')
            .upsert(data, { onConflict: 'id' });

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('❌ Failed to save members:', error);
        return { success: false, error };
    }
};

export const saveChores = async (chores: Chore[]) => {
    try {
        const data = chores.map(c => ({
            id: c.id,
            name: c.name,
            category: c.category,
            xp: c.xp,
            est_minutes: c.estMinutes,
            difficulty: c.difficulty,
            skill: c.skill,
            order_index: c.order,
            created_at: c.createdAt,
        }));

        const { error } = await supabase
            .from('chores')
            .upsert(data, { onConflict: 'id' });

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('❌ Failed to save chores:', error);
        return { success: false, error };
    }
};

export const saveLogs = async (logs: ChoreLog[]) => {
    try {
        const data = logs.map(l => ({
            id: l.id,
            chore_id: l.choreId,
            member_id: l.memberId,
            timestamp: l.timestamp,
            is_manual: l.isManual,
        }));

        const { error } = await supabase
            .from('chore_logs')
            .upsert(data, { onConflict: 'id' });

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('❌ Failed to save logs:', error);
        return { success: false, error };
    }
};

export const saveMemberAchievements = async (achievements: MemberAchievement[]) => {
    try {
        const data = achievements.map(a => ({
            member_id: a.memberId,
            achievement_id: a.achievementId,
            unlocked_at: a.unlockedAt,
            progress: a.progress,
        }));

        const { error } = await supabase
            .from('member_achievements')
            .upsert(data, { onConflict: 'member_id,achievement_id' });

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('❌ Failed to save achievements:', error);
        return { success: false, error };
    }
};

// ========== DELETE OPERATIONS ==========

export const deleteMember = async (memberId: string) => {
    try {
        const { error } = await supabase
            .from('members')
            .delete()
            .eq('id', memberId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('❌ Failed to delete member:', error);
        return { success: false, error };
    }
};

export const deleteChore = async (choreId: string) => {
    try {
        const { error } = await supabase
            .from('chores')
            .delete()
            .eq('id', choreId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('❌ Failed to delete chore:', error);
        return { success: false, error };
    }
};

// ========== BATCH OPERATIONS ==========

export const saveAllData = async (
    members: Member[],
    chores: Chore[],
    logs: ChoreLog[],
    achievements: MemberAchievement[]
) => {
    try {
        // Save all data in parallel
        const results = await Promise.all([
            saveMembers(members),
            saveChores(chores),
            saveLogs(logs),
            saveMemberAchievements(achievements),
        ]);

        const allSuccess = results.every(r => r.success);
        return { success: allSuccess };
    } catch (error) {
        console.error('❌ Failed to save all data:', error);
        return { success: false, error };
    }
};

export const clearAllData = async () => {
    try {
        await Promise.all([
            supabase.from('chore_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
            supabase.from('member_achievements').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
            supabase.from('chores').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
            supabase.from('members').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        ]);
        return { success: true };
    } catch (error) {
        console.error('❌ Failed to clear all data:', error);
        return { success: false, error };
    }
};
