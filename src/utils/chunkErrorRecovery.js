/**
 * chunkErrorRecovery.js
 *
 * Dinamik import / chunk yükleme hatalarında OTOMATİK kurtarma.
 *
 * Sorunun kökü: Statik hosting'de (Hostinger) yeni deploy sırasında veya
 * tarayıcıda eski HTML açık kaldığında, HTML'in işaret ettiği hash'li chunk
 * sunucuda (henüz) bulunamayabilir → "Failed to fetch dynamically imported
 * module". Kullanıcının "Tekrar Dene"ye basmasını beklemeden, taze HTML
 * alacak şekilde sayfayı kendimiz yeniden yükleriz.
 *
 * Döngü koruması: 60 saniyelik pencerede en fazla 2 otomatik yeniden yükleme.
 * Başarılı chunk yüklemesinde sayaç sıfırlanır (lazyWithRetry).
 */

const RELOAD_PARAM = '__app_reload';
const GUARD_KEY = '__chunk_reload_guard_v1';
const WINDOW_MS = 60 * 1000;
const MAX_AUTO_RELOADS = 2;

function readGuardTimestamps() {
  try {
    const raw = window.sessionStorage.getItem(GUARD_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((t) => Number.isFinite(t)) : [];
  } catch {
    return [];
  }
}

function writeGuardTimestamps(list) {
  try {
    window.sessionStorage.setItem(GUARD_KEY, JSON.stringify(list));
  } catch {
    /* yoksay */
  }
}

/** Chunk'lar sorunsuz yüklendiğinde çağrılır — sayaç sıfırlanır. */
export function clearChunkReloadGuard() {
  try {
    window.sessionStorage.removeItem(GUARD_KEY);
  } catch {
    /* yoksay */
  }
}

function lastReloadParamTs() {
  try {
    const ts = Number(new URL(window.location.href).searchParams.get(RELOAD_PARAM));
    return Number.isFinite(ts) && ts > 0 ? ts : 0;
  } catch {
    return 0;
  }
}

/**
 * Chunk hatasında güvenli otomatik yeniden yükleme dener.
 * @returns {boolean} true → yeniden yükleme tetiklendi (sayfa birazdan gider)
 */
export function attemptChunkErrorRecovery() {
  if (typeof window === 'undefined') return false;
  // Gerçekten çevrimdışıysa yeniden yükleme anlamsız; hata ekranı kalsın.
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return false;

  const now = Date.now();

  // Bu URL zaten az önce otomatik/manuel yeniden yüklendiyse tekrar deneme.
  if (now - lastReloadParamTs() < WINDOW_MS) return false;

  const recent = readGuardTimestamps().filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_AUTO_RELOADS) return false;

  recent.push(now);
  writeGuardTimestamps(recent);

  const url = new URL(window.location.href);
  url.searchParams.set(RELOAD_PARAM, String(now));
  window.location.replace(url.toString());
  return true;
}

/**
 * Vite build çıktısında modulepreload/dinamik import hataları
 * 'vite:preloadError' event'i ile yayınlanır. Event'i yutmuyoruz
 * (preventDefault yok) — ErrorBoundary yine devreye girebilir;
 * biz sadece kurtarmayı tetikliyoruz.
 */
export function installChunkErrorRecovery() {
  if (typeof window === 'undefined') return;
  window.addEventListener('vite:preloadError', () => {
    attemptChunkErrorRecovery();
  });
}
