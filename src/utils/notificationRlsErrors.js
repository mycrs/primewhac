/**
 * Duyuru admin — RLS / API hata metinleri (SQL deploy öncesi anlamlı geri bildirim).
 */

const RLS_CODE = '42501';

export function isNotificationRlsError(error) {
  if (!error) return false;
  if (error.code === RLS_CODE) return true;
  const msg = String(error.message || '').toLowerCase();
  return msg.includes('row-level security') || msg.includes('permission denied');
}

export function formatNotificationDbError(error, apiError) {
  if (isNotificationRlsError(error)) {
    return (
      apiError ||
      'Kayıt reddedildi (RLS). Yerelde: npm run dev:all. Yayında: docs/supabase-notifications-rls.sql (önce customers-rls.sql).'
    );
  }
  return apiError || error?.message || 'İşlem başarısız';
}

export function formatNotificationApiError(apiError) {
  if (!apiError) return null;
  const lower = String(apiError).toLowerCase();
  if (lower.includes('service_role')) {
    return `${apiError} — .env içine SUPABASE_SERVICE_ROLE_KEY ekleyin veya yalnızca Supabase RLS SQL'ini çalıştırın.`;
  }
  if (lower.includes('admin yetkisi')) {
    return `${apiError} — admin_users tablosunda e-postanız is_admin=true olmalı.`;
  }
  return apiError;
}

function isMissingColumnError(error, column) {
  const msg = String(error?.message || '').toLowerCase();
  return msg.includes('column') && msg.includes(String(column).toLowerCase());
}

/** theme sütunu yoksa payload'dan çıkar (SQL öncesi uyumluluk) */
export function stripNotificationThemeIfNeeded(payload, error) {
  if (!isMissingColumnError(error, 'theme')) return { payload, stripped: false };
  const next = { ...payload };
  delete next.theme;
  return { payload: next, stripped: true };
}
