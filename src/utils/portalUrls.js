/**
 * IPTV portal M3U / Xtream — şifre yalnızca istemcide kullanılır, kaydedilmez.
 */

/** Yönetimden girilen müşteri paneli URL’si — protokol yoksa https eklenir */
export function normalizeExternalPanelHref(input) {
  const raw = String(input || '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

export function buildPortalXtreamHost(serverUrl, serverPort) {
  const u = (serverUrl || '').trim().replace(/\/+$/, '');
  const p = String(serverPort || '').trim();
  if (!u) return '';
  const pathPart = u.replace(/^https?:\/\//i, '');
  const hasPort = /:\d{2,5}(?:\/|$)/.test(pathPart);
  if (p && !hasPort) return `${u}:${p}`;
  return u;
}

/**
 * @returns Boş string: serverUrl yok/blank, username yok veya host çıkarılamazsa (M3U üretilemez).
 */
export function buildPortalM3uUrl(serverUrl, serverPort, username, password) {
  const host = buildPortalXtreamHost(serverUrl, serverPort);
  if (!host || !username) return '';
  const qs = new URLSearchParams({
    username: String(username),
    password: String(password),
    type: 'm3u',
    output: 'ts',
  });
  return `${host}/get.php?${qs.toString()}`;
}
