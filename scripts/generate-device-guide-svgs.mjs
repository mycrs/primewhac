import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function write(dir, name, body) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${name}.svg`), body.trim() + '\n', 'utf8');
}

function baseSvg(bg, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" fill="none">
  <rect width="640" height="360" rx="16" fill="${bg}"/>
  ${body}
</svg>`;
}

function windowChrome(title, accent, inner) {
  return `
  <rect x="32" y="28" width="576" height="304" rx="12" fill="#111827" stroke="${accent}" stroke-opacity="0.35"/>
  <rect x="32" y="28" width="576" height="36" rx="12" fill="#1f2937"/>
  <circle cx="52" cy="46" r="5" fill="#EF4444"/>
  <circle cx="68" cy="46" r="5" fill="#F59E0B"/>
  <circle cx="84" cy="46" r="5" fill="#22C55E"/>
  <text x="320" y="50" text-anchor="middle" fill="#94a3b8" font-family="Arial,sans-serif" font-size="11">${title}</text>
  ${inner}`;
}

function genWindows(dir) {
  const accent = '#0EA5E9';
  const header = '#0C4A6E';

  write(dir, 'browser', baseSvg('#0a0a0a', windowChrome('Chrome / Edge', accent, `
    <rect x="48" y="76" width="544" height="36" rx="8" fill="#0f172a" stroke="#334155"/>
    <text x="64" y="99" fill="#64748b" font-family="Arial,sans-serif" font-size="12">https://</text>
    <rect x="48" y="124" width="544" height="192" rx="8" fill="#0f172a"/>
    <text x="320" y="220" text-anchor="middle" fill="${accent}" font-family="Arial,sans-serif" font-size="14" font-weight="700">Tarayiciyi acin</text>
  `)));

  write(dir, 'download', baseSvg('#0a0a0a', windowChrome('Indirme', accent, `
    <rect x="64" y="92" width="72" height="72" rx="14" fill="${header}"/>
    <text x="100" y="138" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="22" font-weight="800">SP</text>
    <text x="160" y="118" fill="#fff" font-family="Arial,sans-serif" font-size="16" font-weight="700">IPTV Smarters Pro PC</text>
    <text x="160" y="140" fill="#64748b" font-family="Arial,sans-serif" font-size="11">VLC Media Player (alternatif)</text>
    <rect x="64" y="160" width="120" height="36" rx="8" fill="${accent}"/>
    <text x="124" y="183" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="12" font-weight="700">Indir</text>
    <rect x="64" y="210" width="512" height="88" rx="10" fill="#1f2937"/>
    <text x="320" y="260" text-anchor="middle" fill="#94a3b8" font-family="Arial,sans-serif" font-size="11">Resmi web sitesinden .exe indirin</text>
  `)));

  write(dir, 'installer', baseSvg('#0a0a0a', `
  <rect x="120" y="48" width="400" height="264" rx="14" fill="#111827" stroke="${accent}" stroke-opacity="0.4"/>
  <text x="320" y="88" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="16" font-weight="700">Setup Wizard</text>
  <text x="320" y="118" text-anchor="middle" fill="#64748b" font-family="Arial,sans-serif" font-size="12">setup.exe calistirin</text>
  <rect x="160" y="150" width="320" height="12" rx="6" fill="#1f2937"/>
  <rect x="160" y="150" width="180" height="12" rx="6" fill="${accent}"/>
  <rect x="360" y="220" width="96" height="36" rx="8" fill="${accent}"/>
  <text x="408" y="243" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="12" font-weight="700">Next</text>
  `));

  write(dir, 'finish', baseSvg('#0a0a0a', `
  <rect x="120" y="48" width="400" height="264" rx="14" fill="#111827" stroke="${accent}" stroke-opacity="0.4"/>
  <text x="320" y="100" text-anchor="middle" fill="#22C55E" font-family="Arial,sans-serif" font-size="28">&#10003;</text>
  <text x="320" y="140" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="16" font-weight="700">Kurulum tamamlandi</text>
  <rect x="240" y="170" width="160" height="40" rx="10" fill="${accent}"/>
  <text x="320" y="196" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="13" font-weight="700">Finish / Ac</text>
  `));

  write(dir, 'xtream', baseSvg('#0a0a0a', `
  <rect x="40" y="32" width="560" height="52" rx="12" fill="${header}"/>
  <text x="56" y="64" fill="#fff" font-family="Arial,sans-serif" font-size="15" font-weight="800">Login with Xtream Codes API</text>
  <rect x="40" y="100" width="260" height="120" rx="12" fill="#111827" stroke="${accent}" stroke-width="2"/>
  <text x="170" y="155" text-anchor="middle" fill="${accent}" font-family="Arial,sans-serif" font-size="12" font-weight="700">Xtream Codes</text>
  <rect x="320" y="100" width="280" height="120" rx="12" fill="#111827" stroke="#334155"/>
  <text x="460" y="155" text-anchor="middle" fill="#64748b" font-family="Arial,sans-serif" font-size="12">M3U URL</text>
  `));

  write(dir, 'login', baseSvg('#0a0a0a', `
  <rect x="40" y="24" width="560" height="48" rx="10" fill="${header}"/>
  <text x="56" y="54" fill="${accent}" font-family="Arial,sans-serif" font-size="14" font-weight="800">Xtream Giris</text>
  <rect x="40" y="88" width="560" height="48" rx="10" fill="#111827" stroke="#334155"/>
  <text x="56" y="118" fill="#E2E8F0" font-family="Arial,sans-serif" font-size="14">Server URL · Username · Password</text>
  <rect x="40" y="148" width="560" height="48" rx="10" fill="#111827" stroke="#334155"/>
  <text x="56" y="178" fill="#64748b" font-family="Arial,sans-serif" font-size="13">WhatsApp ile gonderilen bilgileri yapistirin</text>
  `));

  write(dir, 'load', baseSvg('#0a0a0a', `
  <rect x="48" y="48" width="544" height="264" rx="14" fill="#111827" stroke="${accent}" stroke-opacity="0.35"/>
  <circle cx="320" cy="150" r="28" stroke="${accent}" stroke-width="4" fill="none" stroke-dasharray="40 16"/>
  <text x="320" y="210" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="700">Kanallar yukleniyor...</text>
  <text x="320" y="234" text-anchor="middle" fill="#64748b" font-family="Arial,sans-serif" font-size="11">1-2 dakika surebilir</text>
  `));

  write(dir, 'watch', baseSvg('#0a0a0a', `
  <rect x="40" y="40" width="400" height="220" rx="12" fill="#000" stroke="${accent}" stroke-opacity="0.5"/>
  <polygon points="220,130 220,170 260,150" fill="${accent}"/>
  <text x="480" y="80" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="700">Live TV</text>
  <text x="480" y="120" fill="#64748b" font-family="Arial,sans-serif" font-size="12">VOD</text>
  <text x="480" y="150" fill="#64748b" font-family="Arial,sans-serif" font-size="12">Movies</text>
  <text x="480" y="190" fill="${accent}" font-family="Arial,sans-serif" font-size="11">Sol menuden secin</text>
  `));
}

function genMacApp(dir, prefix, cfg) {
  const { accent, header, btn, badge, label, badgeText } = cfg;
  const storeName = cfg.storeName || 'Mac App Store';
  const storeProgress = cfg.storeProgress || `${storeName} · Yukleniyor`;
  const p = (name, body) => write(dir, `${prefix}-${name}`, body);

  p('store', baseSvg('#0a0a0a', cfg.appStore ? windowChrome(storeName, accent, `
    <rect x="64" y="88" width="72" height="72" rx="18" fill="${cfg.msStore ? '#0078D4' : '#007AFF'}"/>
    ${cfg.msStore
      ? `<rect x="80" y="104" width="18" height="18" fill="#fff"/><rect x="102" y="104" width="18" height="18" fill="#fff"/><rect x="80" y="126" width="18" height="18" fill="#fff"/><rect x="102" y="126" width="18" height="18" fill="#fff"/>`
      : `<path d="M92 106v36l28-18z" fill="#fff"/>`}
    <text x="320" y="130" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="700">${storeName}</text>
    <rect x="248" y="160" width="144" height="48" rx="10" fill="#1f2937" stroke="${accent}" stroke-opacity="0.4"/>
    <text x="320" y="190" text-anchor="middle" fill="${accent}" font-family="Arial,sans-serif" font-size="11">${cfg.storeHint || 'Store acin'}</text>
  `) : windowChrome(cfg.windowTitle || 'Safari', accent, `
    <text x="320" y="120" text-anchor="middle" fill="${accent}" font-family="Arial,sans-serif" font-size="16" font-weight="800">${cfg.siteLabel}</text>
    <rect x="248" y="140" width="144" height="40" rx="10" fill="${btn}"/>
    <text x="320" y="166" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="12" font-weight="700">${cfg.siteBtn}</text>
  `)));

  p('search', baseSvg('#0a0a0a', cfg.appStore ? windowChrome(`${storeName} · Ara`, accent, `
    <rect x="64" y="88" width="512" height="36" rx="10" fill="#0f172a" stroke="#334155"/>
    <text x="80" y="111" fill="#fff" font-family="Arial,sans-serif" font-size="13">${label}</text>
    <rect x="64" y="140" width="512" height="56" rx="10" fill="#111827" stroke="${accent}" stroke-opacity="0.35"/>
    <text x="320" y="174" text-anchor="middle" fill="#94a3b8" font-family="Arial,sans-serif" font-size="12">Arama sonucu</text>
  `) : windowChrome(cfg.downloadTitle || 'Download', accent, `
    <rect x="64" y="92" width="64" height="64" rx="14" fill="${header}"/>
    <text x="96" y="132" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="${(badgeText || badge).length > 3 ? 12 : 18}" font-weight="800">${badgeText || badge}</text>
    <text x="150" y="118" fill="#fff" font-family="Arial,sans-serif" font-size="15" font-weight="700">${label}</text>
    <rect x="150" y="128" width="88" height="28" rx="14" fill="${btn}"/>
    <text x="194" y="147" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="11" font-weight="700">${cfg.downloadBtn || 'Download'}</text>
  `)));

  p('find', baseSvg('#0a0a0a', cfg.appStore ? `
  <rect x="120" y="70" width="400" height="220" rx="14" fill="#111827" stroke="${accent}" stroke-opacity="0.35"/>
  <rect x="160" y="100" width="64" height="64" rx="16" fill="${header}" stroke="${accent}"/>
  <text x="192" y="142" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="${(badgeText || badge).length > 2 ? '14' : '20'}" font-weight="800">${badgeText || badge}</text>
  <text x="260" y="118" fill="#fff" font-family="Arial,sans-serif" font-size="16" font-weight="700">${label}</text>
  <text x="260" y="140" fill="#64748b" font-family="Arial,sans-serif" font-size="11">${storeName}</text>
  <rect x="260" y="152" width="88" height="32" rx="16" fill="${btn}"/>
  <text x="304" y="173" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="12" font-weight="700">Get / Al</text>
  ` : `
  <rect x="120" y="60" width="400" height="240" rx="14" fill="#111827" stroke="${accent}" stroke-opacity="0.35"/>
  <rect x="160" y="100" width="80" height="80" rx="18" fill="${header}" stroke="${accent}"/>
  <text x="200" y="152" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="22" font-weight="800">${badge}</text>
  <path d="M300 130 L420 130 L360 190 Z" fill="${accent}" fill-opacity="0.35"/>
  <text x="320" y="220" text-anchor="middle" fill="#94a3b8" font-family="Arial,sans-serif" font-size="12">${cfg.installHint || 'Applications klasorune surukleyin'}</text>
  `));

  p('install', baseSvg('#0a0a0a', cfg.appStore ? `
  <rect x="160" y="80" width="320" height="200" rx="14" fill="#111827" stroke="${accent}" stroke-opacity="0.35"/>
  <rect x="188" y="108" width="56" height="56" rx="14" fill="${header}"/>
  <text x="216" y="144" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="16" font-weight="800">${badgeText || badge}</text>
  <text x="320" y="132" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="700">${label}</text>
  <rect x="240" y="150" width="160" height="12" rx="6" fill="#1f2937"/>
  <rect x="240" y="150" width="100" height="12" rx="6" fill="${btn}"/>
  <text x="320" y="190" text-anchor="middle" fill="#64748b" font-family="Arial,sans-serif" font-size="11">${storeProgress}</text>
  ` : `
  <rect x="48" y="200" width="544" height="96" rx="18" fill="#111827" stroke="#334155"/>
  <rect x="120" y="220" width="56" height="56" rx="14" fill="${header}" stroke="${accent}"/>
  <text x="148" y="256" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="16" font-weight="800">${badge}</text>
  <text x="320" y="140" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="700">${cfg.openHint || 'Launchpad / Uygulamalar'}</text>
  <text x="320" y="168" text-anchor="middle" fill="#64748b" font-family="Arial,sans-serif" font-size="11">${cfg.gatekeeper || 'Gatekeeper: Yine de Ac'}</text>
  `));

  p('open', baseSvg('#0a0a0a', `
  <rect x="40" y="32" width="560" height="52" rx="12" fill="${header}"/>
  <text x="56" y="64" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="800">${cfg.menuTitle || 'File > Open URL'}</text>
  <rect x="40" y="100" width="560" height="56" rx="10" fill="#111827" stroke="${accent}" stroke-opacity="0.5"/>
  <text x="56" y="136" fill="${accent}" font-family="Arial,sans-serif" font-size="13" font-weight="700">${cfg.menuAction || 'Cmd+U · M3U URL'}</text>
  `));

  p('login', baseSvg('#0a0a0a', `
  <rect x="40" y="24" width="560" height="48" rx="10" fill="${header}"/>
  <text x="56" y="54" fill="${accent}" font-family="Arial,sans-serif" font-size="14" font-weight="800">${cfg.formTitle || 'Giris / URL'}</text>
  <rect x="40" y="88" width="560" height="48" rx="10" fill="#111827" stroke="#334155"/>
  <text x="56" y="118" fill="${cfg.server8811 ? '#A78BFA' : '#E2E8F0'}" font-family="Arial,sans-serif" font-size="14">${cfg.formFields || 'Server · Username · Password'}</text>
  <rect x="40" y="148" width="560" height="48" rx="10" fill="#111827" stroke="#334155"/>
  <text x="56" y="178" fill="#64748b" font-family="Arial,sans-serif" font-size="13">${cfg.formHint || 'WhatsApp bilgilerini girin'}</text>
  `));

  p('add', baseSvg('#0a0a0a', `
  <rect x="40" y="88" width="560" height="48" rx="10" fill="#111827" stroke="${accent}" stroke-opacity="0.45"/>
  <text x="56" y="110" fill="#64748b" font-family="Arial,sans-serif" font-size="11">${cfg.urlLabel || 'M3U URL'}</text>
  <text x="56" y="128" fill="#E2E8F0" font-family="Arial,sans-serif" font-size="13">http://sunucu/playlist.m3u</text>
  <rect x="40" y="148" width="200" height="44" rx="10" fill="${btn}"/>
  <text x="140" y="176" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="800">${cfg.saveBtn || 'Kaydet / Oynat'}</text>
  `));

  p('watch', baseSvg('#0a0a0a', `
  <rect x="40" y="40" width="400" height="220" rx="12" fill="#000" stroke="${accent}" stroke-opacity="0.5"/>
  <polygon points="220,130 220,170 260,150" fill="${accent}"/>
  <text x="480" y="90" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="700">${cfg.watchTitle || 'Live TV'}</text>
  <text x="480" y="130" fill="#64748b" font-family="Arial,sans-serif" font-size="12">${cfg.watchSub || 'Cmd+F tam ekran'}</text>
  `));

  p('final', baseSvg('#0a0a0a', `
  <rect x="48" y="48" width="544" height="264" rx="16" fill="#111827" stroke="${accent}" stroke-opacity="0.4"/>
  <rect x="72" y="72" width="48" height="48" rx="12" fill="${header}"/>
  <text x="96" y="102" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="800">${badge}</text>
  <text x="136" y="96" fill="#fff" font-family="Arial,sans-serif" font-size="16" font-weight="800">${cfg.finalTitle || 'Giris bilgileriniz'}</text>
  <text x="136" y="116" fill="#64748b" font-family="Arial,sans-serif" font-size="11">WhatsApp / e-posta ile gonderildi</text>
  <rect x="72" y="140" width="496" height="40" rx="8" fill="#0f172a" stroke="#334155"/>
  <text x="88" y="165" fill="#E2E8F0" font-family="Arial,sans-serif" font-size="13">${cfg.finalHint || 'M3U linki veya Xtream bilgileri'}</text>
  <rect x="72" y="196" width="220" height="44" rx="10" fill="${btn}"/>
  <text x="182" y="224" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="800">Giris Yap</text>
  `));
}

function genWindowsApps(dir) {
  genMacApp(dir, 'ibo', {
    appStore: true,
    msStore: true,
    storeName: 'Microsoft Store',
    storeHint: 'Microsoft Store acin',
    storeProgress: 'Microsoft Store · Yukleniyor',
    accent: '#34D399', header: '#064E3B', btn: '#059669', badge: 'IBO', badgeText: 'IBO',
    label: 'IBO Player Pro',
    menuTitle: 'Xtream veya M3U Ekleyin', menuAction: 'Xtream Codes / M3U girin',
    formTitle: 'IBO Player Pro · Giris', formFields: 'Sunucu · Username · Password',
    saveBtn: 'Kaydet', watchTitle: 'Live TV · VOD', finalHint: 'Türkiye paketi bilgileriniz',
  });
  genMacApp(dir, 'abc', {
    appStore: false,
    windowTitle: 'abciptvplayer.com',
    accent: '#FB7185', header: '#881337', btn: '#E11D48', badge: 'ABC', badgeText: 'ABC',
    label: 'ABC IPTV Player',
    menuTitle: 'M3U Playlist Ekleyin', menuAction: 'M3U URL yapistirin',
    formTitle: 'ABC · M3U Giris', formFields: 'M3U playlist URL',
    saveBtn: 'Yukle / Kaydet', watchTitle: 'Live TV · VOD', finalHint: 'Avrupa Standart M3U linki',
  });
  genMacApp(dir, 'vs', {
    appStore: false,
    windowTitle: 'BlueStacks · Play Store',
    accent: '#22D3EE', header: '#164E63', btn: '#0891B2', badge: 'VS', badgeText: 'VS',
    label: 'VS Player',
    menuTitle: 'Xtream veya Stalker Portal', menuAction: 'Portal bilgilerini girin',
    formTitle: 'VS Player · Portal', formFields: 'Xtream / Stalker login',
    saveBtn: 'Login / Add User', watchTitle: 'Live TV · VOD', finalHint: 'Avrupa HD portal bilgileri',
  });
}

function genMacApps(dir) {
  genMacApp(dir, 'next', {
    appStore: true,
    accent: '#94A3B8', header: '#1E293B', btn: '#475569', badge: 'N+', badgeText: 'N+',
    label: 'NEXT+',
    menuTitle: 'Playlist veya Xtream Ekleyin', menuAction: 'M3U / Xtream Codes girin',
    formTitle: 'NEXT+ · Giris', formFields: 'Sunucu · Username · Password',
    saveBtn: 'Kaydet', watchTitle: 'Live TV · VOD', finalHint: 'Giris bilgilerinizi eksiksiz girin',
  });
  genMacApp(dir, 'castora', {
    appStore: true,
    server8811: true,
    accent: '#A78BFA', header: '#2E1065', btn: '#7C3AED', badge: '▶', badgeText: 'C',
    label: 'CASTORA',
    menuTitle: 'CASTORA · Xtream Giris', menuAction: 'Xtream Codes secin',
    formTitle: 'CASTORA · Giris', formFields: 'SERVER / URL: 8811',
    saveBtn: 'Login / Add User', watchTitle: 'Live TV · VOD', finalHint: 'Xtream bilgileri + 8811',
  });
}

function tabletShell(inner, stroke = '#A78BFA', wide = true) {
  const w = wide ? 280 : 220;
  const x = wide ? 180 : 210;
  return `
  <rect x="${x}" y="36" width="${w}" height="288" rx="24" fill="#0f0f0f" stroke="${stroke}" stroke-width="2"/>
  <rect x="${x + 12}" y="56" width="${w - 24}" height="248" rx="10" fill="#111827"/>
  ${inner}`;
}

function genTabletApps(dir) {
  genMacApp(dir, 'ibo', {
    appStore: true,
    storeName: 'App Store / Play Store',
    storeHint: 'App Store veya Play Store acin',
    storeProgress: 'App Store / Play Store · Yukleniyor',
    accent: '#34D399', header: '#064E3B', btn: '#059669', badge: 'IBO', badgeText: 'IBO',
    label: 'IBO Player Pro',
    menuTitle: 'Xtream veya M3U Ekleyin', menuAction: 'Xtream Codes / M3U girin',
    formTitle: 'IBO Player Pro · Giris', formFields: 'Sunucu · Username · Password',
    saveBtn: 'Kaydet', watchTitle: 'Live TV · VOD', finalHint: 'Türkiye paketi bilgileriniz',
  });
  genMacApp(dir, 'abc', {
    appStore: true,
    storeName: 'App Store / Play Store',
    storeHint: 'App Store veya Play Store acin',
    storeProgress: 'App Store / Play Store · Yukleniyor',
    accent: '#FB7185', header: '#881337', btn: '#E11D48', badge: 'ABC', badgeText: 'ABC',
    label: 'ABC IPTV Player',
    menuTitle: 'M3U Playlist Ekleyin', menuAction: 'M3U URL yapistirin',
    formTitle: 'ABC · M3U Giris', formFields: 'M3U playlist URL',
    saveBtn: 'Yukle / Kaydet', watchTitle: 'Live TV · VOD', finalHint: 'Avrupa Standart M3U linki',
  });
  genMacApp(dir, 'vs', {
    appStore: true,
    storeName: 'Google Play',
    storeHint: 'Play Store acin',
    storeProgress: 'Google Play · Yukleniyor',
    accent: '#22D3EE', header: '#164E63', btn: '#0891B2', badge: 'VS', badgeText: 'VS',
    label: 'VS Player',
    menuTitle: 'Xtream veya Stalker Portal', menuAction: 'Portal bilgilerini girin',
    formTitle: 'VS Player · Portal', formFields: 'Xtream / Stalker login',
    saveBtn: 'Login / Add User', watchTitle: 'Live TV · VOD', finalHint: 'Avrupa HD portal bilgileri',
  });
}

genWindowsApps(path.join(root, 'public/guides/windows'));
genMacApps(path.join(root, 'public/guides/mac'));
genTabletApps(path.join(root, 'public/guides/tablet'));

console.log('Generated Windows, Mac and Tablet guide SVGs');
