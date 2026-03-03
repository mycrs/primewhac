/** Takım adını URL dostu slug'a çevir */
export function slugify(str) {
  if (!str || typeof str !== 'string') return '';
  const tr = { ç: 'c', ğ: 'g', ş: 's', ü: 'u', ö: 'o', ı: 'i', Ç: 'c', Ğ: 'g', Ş: 's', Ü: 'u', Ö: 'o', İ: 'i' };
  return str
    .toLowerCase()
    .split('')
    .map((c) => tr[c] || c)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Maç için benzersiz slug: galatasaray-vs-fenerbahce-2025-03-15 */
export function makeMatchSlug(home, away, date) {
  const h = slugify(home);
  const a = slugify(away);
  const d = (date || '').replace(/-/g, '-');
  return `${h}-vs-${a}-${d}`;
}

/** Slug'dan date ve takım ipuçlarını çıkar. Örn: galatasaray-vs-fenerbahce-2025-03-15 */
export function parseMatchSlug(slug) {
  const raw = (slug || '').trim();
  const vsIdx = raw.indexOf('-vs-');
  if (vsIdx < 0) return null;
  const homeHint = raw.slice(0, vsIdx);
  const rest = raw.slice(vsIdx + 4);
  const restParts = rest.split('-');
  if (restParts.length < 4) return null;
  const date = restParts.slice(-3).join('-');
  const awayHint = restParts.slice(0, -3).join('-');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return { homeHint, awayHint, date };
}
