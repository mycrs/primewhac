/** Tahmin edilmesi zor admin paneli ve giriş yolları */
export const ADMIN_BASE_PATH = '/yonetim';
export const ADMIN_LOGIN_PATH = '/yonetim/giris';

/**
 * @param {string} [subPath] örn. "customers", "/customers" → /yonetim/customers
 */
export function adminPath(subPath = '') {
  const s = String(subPath || '').replace(/^\/+/, '');
  return s ? `${ADMIN_BASE_PATH}/${s}` : ADMIN_BASE_PATH;
}

export function isAdminAppPath(pathname) {
  if (!pathname || typeof pathname !== 'string') return false;
  return pathname === ADMIN_BASE_PATH || pathname.startsWith(`${ADMIN_BASE_PATH}/`);
}

export const ADMIN_LAST_ACTIVITY_KEY_PREFIX = 'admin_last_activity';

export function adminLastActivityStorageKey(userId) {
  return userId ? `${ADMIN_LAST_ACTIVITY_KEY_PREFIX}_${userId}` : ADMIN_LAST_ACTIVITY_KEY_PREFIX;
}
