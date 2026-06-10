/**
 * Maç içeriği cache / slug dosya adları için (client matchSlug ile uyumlu).
 */

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, '-');
}

/** galatasaray-vs-fenerbahce-2025-03-15 */
export function makeMatchSlug(home, away, date) {
  const h = slugify(home);
  const a = slugify(away);
  const d = (date || '').replace(/-/g, '-');
  return `${h}-vs-${a}-${d}`;
}
