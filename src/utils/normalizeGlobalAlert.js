/**
 * Admin Ayarlar (text/link) ile site (message/enabled) şemasını uyumlu tutar.
 * Duyuru banner (NotificationBannerDisplay) ve ExitIntentPopup'a dokunmaz.
 */
export function normalizeGlobalAlert(raw) {
  const src = raw && typeof raw === 'object' ? raw : {};
  const message = String(src.message || src.text || '').trim();
  const link = String(src.link || '').trim() || null;
  const enabled = src.enabled === true;
  return {
    enabled,
    message,
    text: message,
    link,
    type: src.type || 'info',
    closable: src.closable !== false,
  };
}
