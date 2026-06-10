/**
 * Admin duyuru CRUD — /api/admin/notifications (RLS bypass, isteğe bağlı).
 * API yoksa hook'lar doğrudan Supabase'e düşer.
 */

async function parseJson(r) {
  try {
    return await r.json();
  } catch {
    return null;
  }
}

function authHeaders(accessToken, json = false) {
  const h = { Authorization: `Bearer ${accessToken}` };
  if (json) h['Content-Type'] = 'application/json';
  return h;
}

export async function fetchAdminNotifications(accessToken) {
  if (!accessToken) return { notifications: null, error: 'Oturum yok' };
  try {
    const r = await fetch('/api/admin/notifications', { headers: authHeaders(accessToken) });
    const j = await parseJson(r);
    if (r.ok && j?.success && Array.isArray(j.notifications)) {
      return { notifications: j.notifications, error: null };
    }
    return { notifications: null, error: j?.error || r.statusText };
  } catch (e) {
    return { notifications: null, error: e?.message || 'Ağ hatası' };
  }
}

export async function createAdminNotification(accessToken, payload) {
  if (!accessToken) return { ok: false, data: null, error: 'Oturum yok' };
  try {
    const r = await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: authHeaders(accessToken, true),
      body: JSON.stringify(payload),
    });
    const j = await parseJson(r);
    if (r.ok && j?.success && j.notification) return { ok: true, data: j.notification, error: null };
    return { ok: false, data: null, error: j?.error || r.statusText };
  } catch (e) {
    return { ok: false, data: null, error: e?.message || 'Ağ hatası' };
  }
}

export async function updateAdminNotification(accessToken, id, payload) {
  if (!accessToken || !id) return { ok: false, data: null, error: 'Geçersiz istek' };
  try {
    const r = await fetch(`/api/admin/notifications/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: authHeaders(accessToken, true),
      body: JSON.stringify(payload),
    });
    const j = await parseJson(r);
    if (r.ok && j?.success && j.notification) return { ok: true, data: j.notification, error: null };
    return { ok: false, data: null, error: j?.error || r.statusText };
  } catch (e) {
    return { ok: false, data: null, error: e?.message || 'Ağ hatası' };
  }
}

export async function deleteAdminNotification(accessToken, id) {
  if (!accessToken || !id) return { ok: false, error: 'Geçersiz istek' };
  try {
    const r = await fetch(`/api/admin/notifications/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: authHeaders(accessToken),
    });
    const j = await parseJson(r);
    if (r.ok && j?.success) return { ok: true, error: null };
    return { ok: false, error: j?.error || r.statusText };
  } catch (e) {
    return { ok: false, error: e?.message || 'Ağ hatası' };
  }
}
