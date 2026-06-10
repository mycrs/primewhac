/**
 * Statik ülke telefon kodları (CDN yok).
 * Popüler ülkeler seçicide üstte gösterilir.
 */
export const PHONE_COUNTRIES = [
  { iso: 'TR', flag: '🇹🇷', name: 'Türkiye', dial: '+90' },
  { iso: 'DE', flag: '🇩🇪', name: 'Almanya', dial: '+49' },
  { iso: 'AT', flag: '🇦🇹', name: 'Avusturya', dial: '+43' },
  { iso: 'NL', flag: '🇳🇱', name: 'Hollanda', dial: '+31' },
  { iso: 'BE', flag: '🇧🇪', name: 'Belçika', dial: '+32' },
  { iso: 'FR', flag: '🇫🇷', name: 'Fransa', dial: '+33' },
  { iso: 'GB', flag: '🇬🇧', name: 'Birleşik Krallık', dial: '+44' },
  { iso: 'CH', flag: '🇨🇭', name: 'İsviçre', dial: '+41' },
  { iso: 'US', flag: '🇺🇸', name: 'ABD', dial: '+1' },
  { iso: 'CA', flag: '🇨🇦', name: 'Kanada', dial: '+1' },
  { iso: 'IT', flag: '🇮🇹', name: 'İtalya', dial: '+39' },
  { iso: 'ES', flag: '🇪🇸', name: 'İspanya', dial: '+34' },
  { iso: 'PT', flag: '🇵🇹', name: 'Portekiz', dial: '+351' },
  { iso: 'GR', flag: '🇬🇷', name: 'Yunanistan', dial: '+30' },
  { iso: 'SE', flag: '🇸🇪', name: 'İsveç', dial: '+46' },
  { iso: 'NO', flag: '🇳🇴', name: 'Norveç', dial: '+47' },
  { iso: 'DK', flag: '🇩🇰', name: 'Danimarka', dial: '+45' },
  { iso: 'FI', flag: '🇫🇮', name: 'Finlandiya', dial: '+358' },
  { iso: 'PL', flag: '🇵🇱', name: 'Polonya', dial: '+48' },
  { iso: 'CZ', flag: '🇨🇿', name: 'Çekya', dial: '+420' },
  { iso: 'HU', flag: '🇭🇺', name: 'Macaristan', dial: '+36' },
  { iso: 'RO', flag: '🇷🇴', name: 'Romanya', dial: '+40' },
  { iso: 'BG', flag: '🇧🇬', name: 'Bulgaristan', dial: '+359' },
  { iso: 'HR', flag: '🇭🇷', name: 'Hırvatistan', dial: '+385' },
  { iso: 'RS', flag: '🇷🇸', name: 'Sırbistan', dial: '+381' },
  { iso: 'BA', flag: '🇧🇦', name: 'Bosna-Hersek', dial: '+387' },
  { iso: 'MK', flag: '🇲🇰', name: 'Kuzey Makedonya', dial: '+389' },
  { iso: 'AL', flag: '🇦🇱', name: 'Arnavutluk', dial: '+355' },
  { iso: 'XK', flag: '🇽🇰', name: 'Kosova', dial: '+383' },
  { iso: 'CY', flag: '🇨🇾', name: 'Kıbrıs', dial: '+357' },
  { iso: 'MT', flag: '🇲🇹', name: 'Malta', dial: '+356' },
  { iso: 'IE', flag: '🇮🇪', name: 'İrlanda', dial: '+353' },
  { iso: 'LU', flag: '🇱🇺', name: 'Lüksemburg', dial: '+352' },
  { iso: 'IS', flag: '🇮🇸', name: 'İzlanda', dial: '+354' },
  { iso: 'RU', flag: '🇷🇺', name: 'Rusya', dial: '+7' },
  { iso: 'UA', flag: '🇺🇦', name: 'Ukrayna', dial: '+380' },
  { iso: 'AZ', flag: '🇦🇿', name: 'Azerbaycan', dial: '+994' },
  { iso: 'GE', flag: '🇬🇪', name: 'Gürcistan', dial: '+995' },
  { iso: 'IQ', flag: '🇮🇶', name: 'Irak', dial: '+964' },
  { iso: 'IR', flag: '🇮🇷', name: 'İran', dial: '+98' },
  { iso: 'SA', flag: '🇸🇦', name: 'Suudi Arabistan', dial: '+966' },
  { iso: 'AE', flag: '🇦🇪', name: 'BAE', dial: '+971' },
  { iso: 'EG', flag: '🇪🇬', name: 'Mısır', dial: '+20' },
  { iso: 'IL', flag: '🇮🇱', name: 'İsrail', dial: '+972' },
  { iso: 'AU', flag: '🇦🇺', name: 'Avustralya', dial: '+61' },
  { iso: 'NZ', flag: '🇳🇿', name: 'Yeni Zelanda', dial: '+64' },
  { iso: 'JP', flag: '🇯🇵', name: 'Japonya', dial: '+81' },
  { iso: 'KR', flag: '🇰🇷', name: 'Güney Kore', dial: '+82' },
  { iso: 'CN', flag: '🇨🇳', name: 'Çin', dial: '+86' },
  { iso: 'IN', flag: '🇮🇳', name: 'Hindistan', dial: '+91' },
  { iso: 'BR', flag: '🇧🇷', name: 'Brezilya', dial: '+55' },
  { iso: 'MX', flag: '🇲🇽', name: 'Meksika', dial: '+52' },
  { iso: 'AR', flag: '🇦🇷', name: 'Arjantin', dial: '+54' },
];

const POPULAR_ISOS = ['TR', 'DE', 'AT', 'NL', 'BE', 'FR', 'GB', 'CH'];

/** Popüler üstte, kalanlar ada göre (tr) */
export function getPhoneCountriesSorted() {
  const pop = POPULAR_ISOS.map((iso) => PHONE_COUNTRIES.find((c) => c.iso === iso)).filter(Boolean);
  const popSet = new Set(POPULAR_ISOS);
  const rest = PHONE_COUNTRIES.filter((c) => !popSet.has(c.iso)).sort((a, b) =>
    a.name.localeCompare(b.name, 'tr'),
  );
  return [...pop, ...rest];
}

export function findCountryByDial(dial) {
  return PHONE_COUNTRIES.find((c) => c.dial === dial) || null;
}

export function getDialForIso(iso) {
  return PHONE_COUNTRIES.find((c) => c.iso === iso)?.dial ?? '+90';
}

/** Aynı dial birden fazla ülkede varsa (örn. +1) seçici için varsayılan iso */
export function preferredIsoForDial(dial) {
  const matches = PHONE_COUNTRIES.filter((c) => c.dial === dial);
  if (matches.length === 0) return 'TR';
  if (matches.length === 1) return matches[0].iso;
  if (dial === '+1') return 'US';
  return matches[0].iso;
}
