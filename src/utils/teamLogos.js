/**
 * Admin panelinde kayıtlı takım adları ile fikstür (fixturedownload) isimlerini eşleştirir.
 */

const TR_MAP = {
  ı: 'i', İ: 'i', ğ: 'g', Ğ: 'g', ü: 'u', Ü: 'u', ş: 's', Ş: 's', ö: 'o', Ö: 'o', ç: 'c', Ç: 'c',
};

export function normalizeTeamName(name) {
  let s = String(name || '').trim().toLowerCase();
  s = s.replace(/[ıİğĞüÜşŞöÖçÇ]/g, (ch) => TR_MAP[ch] || ch);
  s = s.replace(/\s+/g, ' ');
  s = s.replace(/\b(fc|fk|sc|acf|sk|bk)\b\.?/gi, '').replace(/\s+/g, ' ').trim();
  return s;
}

function parseEntries(config) {
  if (!config) return [];
  if (Array.isArray(config)) return config;
  if (Array.isArray(config.entries)) return config.entries;
  return [];
}

/**
 * @param {string} teamName - fikstürdeki isim
 * @param {Array<{ name: string, url: string, aliases?: string[] }>} entries
 * @returns {string|null}
 */
export function resolveTeamLogoUrl(teamName, entries) {
  const list = Array.isArray(entries) ? entries : parseEntries(entries);
  if (!list.length || !String(teamName || '').trim()) return null;

  const n = normalizeTeamName(teamName);
  if (!n) return null;

  const exact = new Map();
  for (const e of list) {
    if (!e?.url || !e?.name) continue;
    exact.set(normalizeTeamName(e.name), e.url);
    (e.aliases || []).forEach((a) => {
      if (a) exact.set(normalizeTeamName(a), e.url);
    });
  }

  if (exact.has(n)) return exact.get(n);

  for (const [key, url] of exact) {
    if (key.length < 3) continue;
    if (n === key || n.includes(key) || key.includes(n)) return url;
  }

  return null;
}
