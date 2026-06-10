const NOTIFICATION_FIELDS = [
  'title', 'message', 'link', 'theme', 'type', 'color', 'active', 'start_date', 'end_date',
];

export function pickNotificationPayload(body) {
  const src = body && typeof body === 'object' ? body : {};
  const out = {};
  for (const key of NOTIFICATION_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(src, key)) out[key] = src[key];
  }
  return out;
}

function isMissingThemeColumn(error) {
  const msg = String(error?.message || '').toLowerCase();
  return msg.includes('column') && msg.includes('theme');
}

export function stripThemeFromPayload(payload) {
  const next = { ...payload };
  delete next.theme;
  return next;
}

/** theme sütunu yoksa bir kez theme'siz yeniden dene (SQL öncesi yerel dev). */
export async function insertNotificationWithFallback(supabase, payload) {
  let { data, error } = await supabase.from('notifications').insert([payload]).select().single();
  if (error && isMissingThemeColumn(error) && 'theme' in payload) {
    ({ data, error } = await supabase
      .from('notifications')
      .insert([stripThemeFromPayload(payload)])
      .select()
      .single());
  }
  return { data, error };
}

export async function updateNotificationWithFallback(supabase, id, payload) {
  let { data, error } = await supabase.from('notifications').update(payload).eq('id', id).select().single();
  if (error && isMissingThemeColumn(error) && 'theme' in payload) {
    ({ data, error } = await supabase
      .from('notifications')
      .update(stripThemeFromPayload(payload))
      .eq('id', id)
      .select()
      .single());
  }
  return { data, error };
}
