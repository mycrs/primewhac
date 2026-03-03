
import { supabase } from '@/lib/customSupabaseClient';

export const downloadBackup = async () => {
  try {
    const backupData = {};
    const tables = ['site_content', 'packages', 'blog_posts', 'setup_pages'];

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*');
      if (!error && data) {
        backupData[table] = data;
      }
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `site_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    return { success: true };
  } catch (error) {
    console.error('Backup failed:', error);
    return { success: false, error };
  }
};
