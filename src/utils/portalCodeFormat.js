/** Kalıcı format: QRZ-XXXX (4 rakam) */
export const PORTAL_CODE_REGEX = /^QRZ-\d{4}$/;

export function normalizePortalCode(raw) {
  const t = String(raw || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '');
  if (/^QRZ\d{4}$/.test(t)) return `QRZ-${t.slice(3)}`;
  return t;
}

export function isValidPortalCodeFormat(raw) {
  return PORTAL_CODE_REGEX.test(normalizePortalCode(raw));
}
