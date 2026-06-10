/**
 * Portal RPC henüz deploy edilmediyse (SQL çalıştırılmamış) kullanıcıya anlamlı mesaj.
 */

const NOT_DEPLOYED_CODES = new Set(['PGRST202', '42883']);

export const PORTAL_RPC_DEPLOY_DOC = 'docs/supabase-customer-portal.sql';
export const PORTAL_PASSWORD_DEPLOY_DOC = 'docs/supabase-save-portal-password.sql';

/** Ziyaretçi satır içi mesaj — lookup */
export const PORTAL_RPC_NOT_DEPLOYED_HINT =
  'Portal sorgusu şu an kullanılamıyor. Paket veya destek için WhatsApp üzerinden bize ulaşabilirsiniz.';

/** Ziyaretçi — şifre kaydı */
export const PORTAL_PASSWORD_NOT_DEPLOYED_HINT =
  'Şifre sunucuya kaydedilemedi (portal henüz yapılandırılmamış olabilir). Şifrenizi not alın; destek için WhatsApp kullanın.';

export function isPortalRpcNotDeployedError(error) {
  if (!error) return false;
  const code = String(error.code || '');
  if (NOT_DEPLOYED_CODES.has(code)) return true;
  const msg = String(error.message || '').toLowerCase();
  return (
    msg.includes('could not find the function') ||
    msg.includes('lookup_customer_portal') ||
    msg.includes('save_portal_customer_password')
  );
}

export function isPortalMissingColumnError(error) {
  if (!error) return false;
  const msg = String(error.message || '').toLowerCase();
  return msg.includes('iptv_password') && (msg.includes('column') || msg.includes('does not exist'));
}

export function formatPortalLookupError(error) {
  if (isPortalRpcNotDeployedError(error)) return PORTAL_RPC_NOT_DEPLOYED_HINT;
  if (isPortalMissingColumnError(error)) {
    return 'Portal yapılandırması eksik (iptv_password kolonu). Destek için WhatsApp üzerinden bize ulaşabilirsiniz.';
  }
  return null;
}

export function formatPortalSavePasswordError(error) {
  if (isPortalRpcNotDeployedError(error)) return PORTAL_PASSWORD_NOT_DEPLOYED_HINT;
  if (isPortalMissingColumnError(error)) {
    return 'Şifre kolonu henüz tanımlı değil. Şifrenizi kaydedin; yönetici SQL migration çalıştırmalı.';
  }
  return null;
}
