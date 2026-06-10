/** Güven zedeleyen “numara değişti” tarzı banner metinlerini filtreler. */
export function isTrustDamagingBannerText(text) {
  if (!text || typeof text !== 'string') return false;
  const m = text.toLowerCase();
  return (
    /numara\s*değiş/.test(m)
    || /değişikli.*numara/.test(m)
    || /güncel\s*numara/.test(m)
    || /numaramız\s*değiş/.test(m)
  );
}

export function isTrustDamagingNotification(notification) {
  if (!notification) return false;
  const combined = `${notification.title || ''} ${notification.message || ''}`;
  return isTrustDamagingBannerText(combined);
}
