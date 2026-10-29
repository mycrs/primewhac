/**
 * Fixturedownload liglerinden takım isimleri → site_content.team_logos birleştirme (ortak modül).
 */

const FIXTURE_BASE = 'https://fixturedownload.com/feed/json';
const FETCH_TIMEOUT_MS = 25000;

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

const CURRENT_SEASON = '2026';

export const FOOTBALL_LEAGUES = [
  { slug: `super-lig-${CURRENT_SEASON}`, name: 'Türkiye Ligi' },
  { slug: `epl-${CURRENT_SEASON}`, name: 'İngiltere Ligi' },
  { slug: `la-liga-${CURRENT_SEASON}`, name: 'İspanya Ligi' },
  { slug: `champions-league-${CURRENT_SEASON}`, name: 'Avrupa Kupası' },
  { slug: `bundesliga-${CURRENT_SEASON}`, name: 'Almanya Ligi' },
  { slug: `serie-a-${CURRENT_SEASON}`, name: 'İtalya Ligi' },
];

export const BASKETBALL_LEAGUES = [
  { slug: 'nba-2025', name: 'NBA' },
  { slug: 'wnba-2025', name: 'WNBA' },
  { slug: 'nbl-2026', name: 'NBL' },
  { slug: 'nbl-2025', name: 'NBL' },
];

export const ALL_SYNC_LEAGUES = [...FOOTBALL_LEAGUES, ...BASKETBALL_LEAGUES];

async function fetchWithTimeout(url) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(id);
  }
}

function pickTeamName(raw) {
  if (raw == null) return null;
  if (typeof raw === 'string') {
    const t = raw.trim();
    return t || null;
  }
  if (typeof raw === 'object' && raw.name) {
    const t = String(raw.name).trim();
    return t || null;
  }
  return null;
}

/**
 * @param {{ slug: string, name: string }} league
 * @param {(line: string) => void} [log]
 * @returns {Promise<{ names: Set<string>, matchCount: number }>}
 */
export async function collectTeamsFromLeague(league, log = () => {}) {
  const url = `${FIXTURE_BASE}/${league.slug}`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) {
    log(`  [${league.name}] HTTP ${res.status} — atlandı`);
    return { names: new Set(), matchCount: 0 };
  }
  let data;
  try {
    data = await res.json();
  } catch (e) {
    log(`  [${league.name}] JSON hatası — ${e.message}`);
    return { names: new Set(), matchCount: 0 };
  }
  const list = Array.isArray(data) ? data : (data.matches || []);
  const names = new Set();
  for (const m of list) {
    const h = pickTeamName(m.HomeTeam ?? m.homeTeam) || pickTeamName(m.team1);
    const a = pickTeamName(m.AwayTeam ?? m.awayTeam) || pickTeamName(m.team2);
    if (h) names.add(h);
    if (a) names.add(a);
  }
  log(`  [${league.name}] ${names.size} takım (${list.length} kayıt)`);
  return { names, matchCount: list.length };
}

export async function fetchExistingTeamLogos(supabase) {
  const { data, error } = await supabase.from('site_content').select('value').eq('key', 'team_logos').maybeSingle();
  if (error) {
    return { entries: [], error: error.message };
  }
  let val = data?.value;
  if (typeof val === 'string') {
    try {
      val = JSON.parse(val);
    } catch {
      return { entries: [], error: null };
    }
  }
  const entries = val?.entries ?? (Array.isArray(val) ? val : []);
  const list = Array.isArray(entries) ? entries.filter((e) => e && e.name) : [];
  return { entries: list, error: null };
}

export function mergeTeamLogoEntries(existingEntries, scrapedNames) {
  const byNorm = new Map();

  for (const e of existingEntries) {
    const n = normalizeTeamName(e.name);
    if (!n) continue;
    byNorm.set(n, {
      name: e.name,
      url: typeof e.url === 'string' ? e.url : '',
      aliases: Array.isArray(e.aliases) ? e.aliases : [],
    });
  }

  for (const name of scrapedNames) {
    const n = normalizeTeamName(name);
    if (!n) continue;
    if (!byNorm.has(n)) {
      byNorm.set(n, { name, url: '', aliases: [] });
    }
  }

  return [...byNorm.values()].sort((a, b) => a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' }));
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabaseService
 * @param {{ delayMs?: number, log?: (s: string) => void, upsert?: boolean }} opts
 */
export async function runSyncTeamLogos(supabaseService, opts = {}) {
  const delayMs = opts.delayMs ?? 400;
  const log = opts.log ?? (() => {});
  const upsert = opts.upsert !== false;

  const lines = [];
  const push = (s) => {
    lines.push(s);
    log(s);
  };

  push('[sync-team-logos] Liglerden takımlar çekiliyor...');
  const scraped = new Set();
  const leagueStats = [];

  for (const league of ALL_SYNC_LEAGUES) {
    push(`→ ${league.name} (${league.slug})`);
    const { names, matchCount } = await collectTeamsFromLeague(league, push);
    names.forEach((n) => scraped.add(n));
    leagueStats.push({ league: league.name, slug: league.slug, teamCount: names.size, matchCount });
    await new Promise((r) => setTimeout(r, delayMs));
  }

  push(`Toplam benzersiz takım (string): ${scraped.size}`);

  const { entries: existing, error: readErr } = await fetchExistingTeamLogos(supabaseService);
  if (readErr) push(`Uyarı: mevcut kayıt okunamadı: ${readErr}`);
  else push(`Mevcut kayıt: ${existing.length} satır`);

  const entries = mergeTeamLogoEntries(existing, scraped);
  push(`Birleşik liste: ${entries.length} satır`);

  const payload = { entries };

  if (!upsert) {
    return {
      ok: true,
      entryCount: entries.length,
      scrapedCount: scraped.size,
      leagueStats,
      logs: lines,
      payload,
    };
  }

  const row = {
    key: 'team_logos',
    value: payload,
    updated_at: new Date().toISOString(),
  };

  let { error } = await supabaseService.from('site_content').upsert(row, { onConflict: 'key' });
  if (error && /updated_at|column/i.test(error.message)) {
    const retry = await supabaseService
      .from('site_content')
      .upsert({ key: 'team_logos', value: payload }, { onConflict: 'key' });
    error = retry.error;
    if (!error) push('Not: updated_at sütunu yok; key+value ile kaydedildi.');
  }
  if (error) {
    const err = new Error(error.message);
    err.code = error.code;
    err.details = error.details;
    err.hint = error.hint;
    throw err;
  }

  push('✓ site_content.team_logos güncellendi.');

  return {
    ok: true,
    entryCount: entries.length,
    scrapedCount: scraped.size,
    leagueStats,
    logs: lines,
    payload,
  };
}
