import { supabase } from '@/lib/customSupabaseClient';
import { stripNotificationThemeIfNeeded } from '@/utils/notificationRlsErrors';

async function runWithThemeFallback(operation, payload) {
  let current = payload;
  let result = await operation(current);
  if (!result.error) return result;

  const stripped = stripNotificationThemeIfNeeded(current, result.error);
  if (!stripped.stripped) return result;

  current = stripped.payload;
  return operation(current);
}

export async function insertNotificationRow(payload) {
  return runWithThemeFallback(
    (p) => supabase.from('notifications').insert([p]).select(),
    payload,
  );
}

export async function updateNotificationRow(id, payload) {
  return runWithThemeFallback(
    (p) => supabase.from('notifications').update(p).eq('id', id).select(),
    payload,
  );
}
