/**
 * Maçın hangi "program günü" sekmesinde gösterileceği (YYYY-MM-DD).
 * fixturedownload bazı Türkiye Ligi haftalarını (2026 Nisan sonu) 1 gün ileri yazıyor;
 * Mackolik / TFF ile hizalamak için bu aralıkta UTC gününden 1 çıkarılır.
 */

function subtractOneCalendarDayUtc(ymd) {
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return dt.toISOString().slice(0, 10);
}

/**
 * @param {string} utcDay - DateUtc metninin YYYY-MM-DD öneki
 * @param {string} leagueSlug
 */
export function programUtcDayForFixtureLeague(utcDay, leagueSlug) {
  if (
    leagueSlug === 'super-lig-2025'
    && utcDay >= '2026-04-05'
    && utcDay <= '2026-05-31'
  ) {
    return subtractOneCalendarDayUtc(utcDay);
  }
  return utcDay;
}

/**
 * @param {object} m - fixturedownload maç objesi
 * @param {string} dateStr - seçilen gün
 * @param {string} [leagueSlug] - lig slug (Türkiye Ligi düzeltmesi için)
 */
export function matchBelongsToProgramDay(m, dateStr, leagueSlug = '') {
  const raw = (m.DateUtc || m.date || '').toString().trim();
  if (!raw) return false;
  const utcDay = raw.split(' ')[0].split('T')[0];
  const programDay = programUtcDayForFixtureLeague(utcDay, leagueSlug);
  return programDay === dateStr;
}
