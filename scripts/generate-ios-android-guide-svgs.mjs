import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const iosDir = path.join(root, 'public/guides/ios');
const androidDir = path.join(root, 'public/guides/android');

fs.mkdirSync(iosDir, { recursive: true });
fs.mkdirSync(androidDir, { recursive: true });

function write(filePath, content) {
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
}

function baseSvg(bg, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" fill="none">
  <rect width="640" height="360" rx="16" fill="${bg}"/>
  ${body}
</svg>`;
}

function phoneShell(inner, stroke = '#334155') {
  return `
  <rect x="210" y="20" width="220" height="320" rx="32" fill="#0f0f0f" stroke="${stroke}" stroke-width="2"/>
  <rect x="280" y="32" width="80" height="7" rx="3.5" fill="#262626"/>
  <rect x="228" y="52" width="184" height="272" rx="8" fill="#111827"/>
  ${inner}`;
}

function iosApps() {
  return {
    next: { label: 'NEXT+', badge: 'N+', accent: '#CBD5E1', accentDark: '#64748B', header: '#1E293B', btn: '#475569' },
    castora: { label: 'CASTORA', badge: '▶', badgeBg: '#2563EB', accent: '#C4B5FD', accentDark: '#7C3AED', header: '#2E1065', btn: '#7C3AED' },
    '9xtream': { label: '9Xtream', badge: '9X', accent: '#7DD3FC', accentDark: '#0EA5E9', header: '#0C4A6E', btn: '#0284C7' },
  };
}

function genIosApp(appKey, cfg) {
  const p = (name, body) => write(path.join(iosDir, `${appKey}-${name}.svg`), body);

  p('store', baseSvg('#0a0a0a', `
  ${phoneShell(`
    <rect x="228" y="52" width="184" height="36" fill="${cfg.header}"/>
    <text x="320" y="75" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="11" font-weight="700">App Store</text>
    <rect x="240" y="100" width="72" height="72" rx="16" fill="#007AFF"/>
    <path d="M268 118v36l28-18z" fill="#fff"/>
    <text x="320" y="192" text-anchor="middle" fill="${cfg.accent}" font-family="Arial,sans-serif" font-size="10" font-weight="700">Today</text>
    <rect x="248" y="208" width="144" height="56" rx="10" fill="#1f2937" stroke="${cfg.accentDark}" stroke-opacity="0.5"/>
    <text x="320" y="240" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="12" font-weight="700">App Store acin</text>
    <circle cx="272" cy="318" r="6" fill="${cfg.accentDark}"/>
    <circle cx="320" cy="318" r="6" fill="#334155"/>
    <circle cx="368" cy="318" r="6" fill="#334155"/>
  `, cfg.accentDark)}`));

  p('search', baseSvg('#0a0a0a', `
  ${phoneShell(`
    <rect x="240" y="68" width="160" height="32" rx="10" fill="#1f2937" stroke="${cfg.accentDark}" stroke-opacity="0.6"/>
    <circle cx="258" cy="84" r="7" stroke="${cfg.accent}" stroke-width="2" fill="none"/>
    <line x1="263" y1="89" x2="268" y2="94" stroke="${cfg.accent}" stroke-width="2"/>
    <text x="278" y="88" fill="#64748b" font-family="Arial,sans-serif" font-size="11">Ara</text>
    <text x="320" y="130" text-anchor="middle" fill="${cfg.accent}" font-family="Arial,sans-serif" font-size="11" font-weight="700">Search sekmesi</text>
    <rect x="248" y="148" width="144" height="40" rx="8" fill="#111827" stroke="#334155"/>
    <text x="320" y="173" text-anchor="middle" fill="#94a3b8" font-family="Arial,sans-serif" font-size="12">${cfg.label}</text>
    <rect x="248" y="200" width="144" height="88" rx="10" fill="#1f2937"/>
    <text x="320" y="252" text-anchor="middle" fill="#64748b" font-family="Arial,sans-serif" font-size="10">Arama sonuclari</text>
  `, cfg.accentDark)}`));

  p('find', baseSvg('#0a0a0a', `
  ${phoneShell(`
    <rect x="248" y="78" width="56" height="56" rx="14" fill="${cfg.badgeBg || cfg.header}"/>
    <text x="276" y="114" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="${cfg.badge.length > 2 ? '14' : '18'}" font-weight="800">${cfg.badge}</text>
    <text x="320" y="152" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="800">${cfg.label}</text>
    <text x="320" y="172" text-anchor="middle" fill="#64748b" font-family="Arial,sans-serif" font-size="10">Resmi uygulama</text>
    <rect x="268" y="188" width="104" height="32" rx="16" fill="${cfg.btn}"/>
    <text x="320" y="209" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="12" font-weight="700">Al</text>
    <rect x="248" y="232" width="144" height="48" rx="8" fill="#111827" stroke="${cfg.accentDark}" stroke-opacity="0.4"/>
    <text x="320" y="260" text-anchor="middle" fill="${cfg.accent}" font-family="Arial,sans-serif" font-size="10">App Store · Ucretsiz</text>
  `, cfg.accentDark)}`));

  p('install', baseSvg('#0a0a0a', `
  ${phoneShell(`
    <rect x="248" y="78" width="56" height="56" rx="14" fill="${cfg.badgeBg || cfg.header}"/>
    <text x="276" y="114" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="${cfg.badge.length > 2 ? '14' : '18'}" font-weight="800">${cfg.badge}</text>
    <text x="320" y="158" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="13" font-weight="700">${cfg.label}</text>
    <rect x="268" y="172" width="104" height="36" rx="18" fill="#334155"/>
    <text x="320" y="195" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="12" font-weight="700">Yukleniyor...</text>
    <circle cx="320" cy="230" r="14" stroke="${cfg.accentDark}" stroke-width="3" fill="none" stroke-dasharray="20 12"/>
    <text x="320" y="268" text-anchor="middle" fill="#64748b" font-family="Arial,sans-serif" font-size="10">Face ID ile onaylayin</text>
  `, cfg.accentDark)}`));

  p('open', baseSvg('#0a0a0a', `
  ${phoneShell(`
    <rect x="248" y="90" width="56" height="56" rx="14" fill="${cfg.badgeBg || cfg.header}"/>
    <text x="276" y="126" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="${cfg.badge.length > 2 ? '14' : '18'}" font-weight="800">${cfg.badge}</text>
    <text x="320" y="168" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="13" font-weight="700">Ac</text>
    <rect x="256" y="182" width="128" height="36" rx="10" fill="${cfg.btn}"/>
    <text x="320" y="205" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="12" font-weight="700">Uygulamayi Baslat</text>
    <text x="320" y="248" text-anchor="middle" fill="#64748b" font-family="Arial,sans-serif" font-size="10">Ana ekrandan da acabilirsiniz</text>
  `, cfg.accentDark)}`));

  const serverValue = appKey === 'castora' ? '8811' : (appKey === '9xtream' ? 'http://sunucu:port' : 'Sunucu URL');

  p('login', baseSvg('#0a0a0a', `
  <rect x="40" y="24" width="560" height="48" rx="10" fill="${cfg.header}"/>
  <text x="56" y="54" fill="${cfg.accent}" font-family="Arial,sans-serif" font-size="14" font-weight="800">${cfg.label} · Giris</text>
  <rect x="40" y="88" width="560" height="48" rx="10" fill="#111827" stroke="#334155"/>
  <text x="56" y="110" fill="#64748b" font-family="Arial,sans-serif" font-size="11">SERVER / URL</text>
  <text x="56" y="128" fill="${appKey === 'castora' ? '#A78BFA' : '#E2E8F0'}" font-family="Arial,sans-serif" font-size="16" font-weight="800">${serverValue}</text>
  <rect x="40" y="148" width="560" height="48" rx="10" fill="#111827" stroke="#334155"/>
  <text x="56" y="170" fill="#64748b" font-family="Arial,sans-serif" font-size="11">USERNAME</text>
  <text x="56" y="188" fill="#E2E8F0" font-family="Arial,sans-serif" font-size="14">kullanici_adi</text>
  <rect x="40" y="208" width="560" height="48" rx="10" fill="#111827" stroke="#334155"/>
  <text x="56" y="230" fill="#64748b" font-family="Arial,sans-serif" font-size="11">PASSWORD</text>
  <text x="56" y="248" fill="#E2E8F0" font-family="Arial,sans-serif" font-size="14">********</text>
  ${appKey === 'next' ? `<rect x="40" y="268" width="260" height="44" rx="10" fill="#111827" stroke="#334155"/>
  <text x="56" y="296" fill="#64748b" font-family="Arial,sans-serif" font-size="11">M3U URL (alternatif)</text>` : ''}
  `));

  p('add', baseSvg('#0a0a0a', `
  <rect x="40" y="32" width="560" height="52" rx="12" fill="${cfg.header}"/>
  <text x="56" y="64" fill="#fff" font-family="Arial,sans-serif" font-size="15" font-weight="800">${appKey === 'next' ? 'Playlist Kaydet' : appKey === 'castora' ? 'Add User / Login' : 'Add Playlist'}</text>
  <rect x="40" y="100" width="560" height="56" rx="10" fill="#111827" stroke="${cfg.accentDark}" stroke-opacity="0.5"/>
  <text x="56" y="124" fill="#64748b" font-family="Arial,sans-serif" font-size="11">PLAYLIST ADI</text>
  <text x="56" y="146" fill="#E2E8F0" font-family="Arial,sans-serif" font-size="14">QruzeTV</text>
  <rect x="40" y="168" width="200" height="44" rx="10" fill="${cfg.btn}"/>
  <text x="140" y="196" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="800">${appKey === 'castora' ? 'Login' : 'Kaydet'}</text>
  <rect x="252" y="168" width="348" height="44" rx="10" fill="#111827" stroke="#334155"/>
  <text x="268" y="196" fill="#94a3b8" font-family="Arial,sans-serif" font-size="12">Kanallar indiriliyor...</text>
  <rect x="40" y="228" width="560" height="88" rx="12" fill="#1f2937"/>
  <text x="320" y="268" text-anchor="middle" fill="${cfg.accent}" font-family="Arial,sans-serif" font-size="12">EPG ve kanal listesi yukleniyor</text>
  <text x="320" y="288" text-anchor="middle" fill="#64748b" font-family="Arial,sans-serif" font-size="10">2-5 dakika surebilir</text>
  `));

  p('watch', baseSvg('#0a0a0a', `
  <rect x="40" y="28" width="360" height="200" rx="12" fill="#000" stroke="${cfg.accentDark}" stroke-opacity="0.6"/>
  <polygon points="200,108 200,148 240,128" fill="${cfg.accentDark}" fill-opacity="0.9"/>
  <text x="420" y="60" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="700">Live TV</text>
  <rect x="420" y="72" width="180" height="28" rx="6" fill="#111827" stroke="#334155"/>
  <rect x="420" y="108" width="180" height="28" rx="6" fill="#111827" stroke="#334155"/>
  <rect x="420" y="144" width="180" height="28" rx="6" fill="${cfg.header}" stroke="${cfg.accentDark}"/>
  <text x="430" y="162" fill="${cfg.accent}" font-family="Arial,sans-serif" font-size="11">Spor HD</text>
  <text x="56" y="260" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="700">Movies · Series</text>
  <text x="56" y="282" fill="#64748b" font-family="Arial,sans-serif" font-size="11">Favori kanallarinizi isaretleyin</text>
  `));

  p('final', baseSvg('#0a0a0a', `
  <rect x="48" y="40" width="544" height="280" rx="16" fill="#111827" stroke="${cfg.accentDark}" stroke-opacity="0.45"/>
  <rect x="72" y="64" width="48" height="48" rx="12" fill="${cfg.badgeBg || cfg.header}"/>
  <text x="96" y="94" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="16" font-weight="800">${cfg.badge}</text>
  <text x="136" y="88" fill="#fff" font-family="Arial,sans-serif" font-size="16" font-weight="800">Giris bilgileriniz</text>
  <text x="136" y="108" fill="#64748b" font-family="Arial,sans-serif" font-size="11">WhatsApp / e-posta ile gonderildi</text>
  <rect x="72" y="128" width="496" height="40" rx="8" fill="#0f172a" stroke="#334155"/>
  <text x="88" y="153" fill="#E2E8F0" font-family="Arial,sans-serif" font-size="13">Kullanici + Sifre + ${appKey === 'castora' ? '8811' : 'Sunucu URL'}</text>
  <rect x="72" y="184" width="220" height="44" rx="10" fill="${cfg.btn}"/>
  <text x="182" y="212" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="800">Giris Yap</text>
  <text x="320" y="260" text-anchor="middle" fill="${cfg.accent}" font-family="Arial,sans-serif" font-size="12">Size verdigimiz bilgileri eksiksiz girin</text>
  `));
}

function genAndroidQruze(variant) {
  const isPhone = variant === 'phone';
  const prefix = `qruze-${variant}`;
  const p = (name, body) => write(path.join(androidDir, `${prefix}-${name}.svg`), body);
  const accent = isPhone ? '#e50914' : '#22C55E';
  const header = isPhone ? '#1a0a0a' : '#052e16';
  const storeLabel = isPhone ? 'APK · Telefon' : 'Downloader · Android TV';

  p('store', baseSvg('#0a0a0a', `
  <rect x="0" y="0" width="640" height="54" fill="${header}"/>
  <text x="24" y="34" fill="${accent}" font-family="Arial,sans-serif" font-size="13" font-weight="700">${storeLabel}</text>
  <rect x="32" y="72" width="576" height="100" rx="14" fill="#111827" stroke="${accent}" stroke-opacity="0.35"/>
  <rect x="48" y="88" width="64" height="64" rx="16" fill="#000" stroke="${accent}"/>
  <text x="68" y="130" fill="${accent}" font-family="Arial,sans-serif" font-size="22" font-weight="800">Q</text>
  <text x="128" y="118" fill="#fff" font-family="Arial,sans-serif" font-size="20" font-weight="800">Qruze Player</text>
  <text x="128" y="142" fill="#94a3b8" font-family="Arial,sans-serif" font-size="12">${isPhone ? 'APK linki acin' : 'Downloader acin'}</text>
  `));

  p('search', baseSvg('#0a0a0a', `
  <rect x="40" y="40" width="560" height="52" rx="12" fill="#111827" stroke="${accent}" stroke-opacity="0.5"/>
  <circle cx="68" cy="66" r="10" stroke="${accent}" stroke-width="2" fill="none"/>
  <line x1="75" y1="73" x2="82" y2="80" stroke="${accent}" stroke-width="2"/>
  <text x="96" y="72" fill="#fff" font-family="Arial,sans-serif" font-size="18" font-weight="600">${isPhone ? 'APK indirme linki' : 'Qruze Player APK URL'}</text>
  <rect x="40" y="112" width="560" height="160" rx="12" fill="#1f2937"/>
  <text x="320" y="200" text-anchor="middle" fill="#64748b" font-family="Arial,sans-serif" font-size="13">Arama sonucu · Resmi uygulama</text>
  `));

  p('find', baseSvg('#0a0a0a', `
  <rect x="40" y="48" width="120" height="120" rx="24" fill="#000" stroke="${accent}" stroke-width="2"/>
  <text x="100" y="118" text-anchor="middle" fill="${accent}" font-family="Arial,sans-serif" font-size="36" font-weight="800">Q</text>
  <text x="180" y="100" fill="#fff" font-family="Arial,sans-serif" font-size="24" font-weight="800">Qruze Player</text>
  <text x="180" y="128" fill="#94a3b8" font-family="Arial,sans-serif" font-size="13">IPTV Media Player</text>
  <rect x="180" y="140" width="96" height="32" rx="8" fill="${accent}"/>
  <text x="228" y="161" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="12" font-weight="700">Yukle</text>
  `));

  p('install', baseSvg('#0a0a0a', `
  <rect x="200" y="80" width="240" height="200" rx="16" fill="#111827" stroke="${accent}" stroke-opacity="0.4"/>
  <text x="320" y="140" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="16" font-weight="700">Yukleniyor...</text>
  <rect x="240" y="160" width="160" height="12" rx="6" fill="#1f2937"/>
  <rect x="240" y="160" width="100" height="12" rx="6" fill="${accent}"/>
  <text x="320" y="220" text-anchor="middle" fill="#64748b" font-family="Arial,sans-serif" font-size="11">Kurulum tamamlaninca Ac</text>
  `));

  p('open', baseSvg('#0a0a0a', `
  <rect x="240" y="60" width="160" height="160" rx="28" fill="#000" stroke="${accent}" stroke-width="2"/>
  <text x="320" y="155" text-anchor="middle" fill="${accent}" font-family="Arial,sans-serif" font-size="48" font-weight="800">Q</text>
  <rect x="260" y="240" width="120" height="40" rx="10" fill="${accent}"/>
  <text x="320" y="265" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="700">Ac</text>
  `));

  p('login', baseSvg('#0a0a0a', `
  <rect x="40" y="24" width="560" height="48" rx="10" fill="${header}"/>
  <text x="56" y="54" fill="${accent}" font-family="Arial,sans-serif" font-size="14" font-weight="800">Qruze Player · Xtream / M3U</text>
  <rect x="40" y="88" width="560" height="48" rx="10" fill="#111827" stroke="#334155"/>
  <text x="56" y="118" fill="#E2E8F0" font-family="Arial,sans-serif" font-size="14">Sunucu · Kullanici · Sifre</text>
  <rect x="40" y="148" width="560" height="48" rx="10" fill="#111827" stroke="#334155"/>
  <text x="56" y="178" fill="#64748b" font-family="Arial,sans-serif" font-size="13">M3U URL (alternatif)</text>
  `));

  p('add', baseSvg('#0a0a0a', `
  <rect x="40" y="40" width="560" height="56" rx="12" fill="${header}"/>
  <text x="56" y="74" fill="#fff" font-family="Arial,sans-serif" font-size="16" font-weight="800">Add User / Login</text>
  <rect x="40" y="112" width="200" height="48" rx="10" fill="${accent}"/>
  <text x="140" y="142" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="800">Kaydet</text>
  <text x="320" y="200" text-anchor="middle" fill="#64748b" font-family="Arial,sans-serif" font-size="12">Kanal listesi indiriliyor</text>
  `));

  p('watch', baseSvg('#0a0a0a', `
  <rect x="40" y="40" width="400" height="220" rx="12" fill="#000" stroke="${accent}" stroke-opacity="0.5"/>
  <polygon points="220,130 220,170 260,150" fill="${accent}"/>
  <text x="480" y="80" fill="#fff" font-family="Arial,sans-serif" font-size="14">Live TV</text>
  <text x="480" y="120" fill="#64748b" font-family="Arial,sans-serif" font-size="12">Movies</text>
  <text x="480" y="150" fill="#64748b" font-family="Arial,sans-serif" font-size="12">Series</text>
  `));

  p('final', baseSvg('#0a0a0a', `
  <rect x="48" y="48" width="544" height="264" rx="16" fill="#111827" stroke="${accent}" stroke-opacity="0.4"/>
  <text x="320" y="100" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="18" font-weight="800">Giris Yapin</text>
  <text x="320" y="130" text-anchor="middle" fill="#94a3b8" font-family="Arial,sans-serif" font-size="12">Size verdigimiz bilgileri girin</text>
  <rect x="120" y="160" width="400" height="44" rx="10" fill="${accent}"/>
  <text x="320" y="188" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="800">Qruze Player Ac</text>
  `));
}

const apps = iosApps();
Object.entries(apps).forEach(([key, cfg]) => genIosApp(key, cfg));
genAndroidQruze('tv');
genAndroidQruze('phone');

console.log('Generated iOS and Android guide SVGs');
