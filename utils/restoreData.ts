import { database, ref, set } from '../firebase';
import { BACKUP_DATA_JAN_16, enhanceChoresWithMetadata, enhanceMembersWithXP } from './dataRestoration';
import { BACKUP_LOGS } from '../backupLogs';

/**
 * Restore household data from backup JSON
 */
export const restoreBackupData = async (appId: string) => {
  try {
    console.log('Starting data restoration for appId:', appId);

    // Enhance chores with missing metadata
    const enhancedChores = enhanceChoresWithMetadata(BACKUP_DATA_JAN_16.chores);

    // Enhance members with calculated XP from logs
    const enhancedMembers = enhanceMembersWithXP(
      BACKUP_DATA_JAN_16.members,
      BACKUP_LOGS as any[],
      enhancedChores
    );

    // Restore to localStorage (since app uses localStorage)
    const dataToRestore = {
      members: enhancedMembers,
      chores: enhancedChores,
      logs: BACKUP_LOGS
    };

    localStorage.setItem(`chore_data_${appId}`, JSON.stringify(dataToRestore));

    console.log('Data restoration complete!');
    console.log('Members:', enhancedMembers.length);
    console.log('Chores:', enhancedChores.length);
    console.log('Logs:', BACKUP_LOGS.length);

    return {
      success: true,
      message: `Restored ${enhancedMembers.length} members, ${enhancedChores.length} chores, ${BACKUP_LOGS.length} logs`
    };
  } catch (error) {
    console.error('Error restoring data:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
