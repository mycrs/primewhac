// Player choices for the device the customer already uses. Store availability
// varies by country, device model and version; these are not download links.
const TV = ['smart-tv'];
const ANDROID_TV = ['android-tv', 'android-box', 'firestick'];
const PHONE = ['smartphone', 'tablet'];
const APPLE = ['smartphone', 'tablet', 'apple-tv'];

export const FLOW_PLAYER_APPS = [
  { id: 'flow-ibo', name: 'IBO Player', platforms: ['smarttv', 'android', 'pc'], devices: [...TV, ...ANDROID_TV, 'pc-mac'] },
  { id: 'flow-smart-iptv', name: 'Smart IPTV', platforms: ['smarttv'], devices: TV },
  { id: 'flow-ss-iptv', name: 'SS IPTV', description: 'LG Smart TV; diğer modellerde erişim değişebilir.', platforms: ['smarttv'], devices: TV },
  { id: 'flow-flix', name: 'Flix Player', platforms: ['smarttv', 'android', 'ios'], devices: [...TV, ...PHONE] },
  { id: 'flow-smartone', name: 'SmartOne IPTV', platforms: ['smarttv', 'android'], devices: [...TV, ...ANDROID_TV] },
  { id: 'flow-smarters-tv', name: 'Smarters Player', platforms: ['smarttv'], devices: TV },
  { id: 'flow-tivimate', name: 'TiviMate', platforms: ['android'], devices: ANDROID_TV },
  { id: 'flow-televizo', name: 'Televizo', platforms: ['android'], devices: [...ANDROID_TV, ...PHONE] },
  { id: 'flow-ott-navigator', name: 'OTT Navigator IPTV', platforms: ['android'], devices: ANDROID_TV },
  { id: 'flow-iptv-extreme', name: 'IPTV Extreme', platforms: ['android'], devices: [...ANDROID_TV, ...PHONE] },
  { id: 'flow-octopus', name: 'Octopus IPTV Player', platforms: ['android'], devices: [...ANDROID_TV, ...PHONE] },
  { id: 'flow-smarters-lite', name: 'Smarters Player Lite', platforms: ['ios'], devices: APPLE },
  { id: 'flow-iptvx', name: 'IPTVX', platforms: ['ios'], devices: APPLE },
  { id: 'flow-uhf', name: 'UHF', platforms: ['ios'], devices: APPLE },
  { id: 'flow-gse', name: 'GSE SMART IPTV PRO', platforms: ['ios'], devices: PHONE },
  { id: 'flow-iplaytv', name: 'iPlayTV', platforms: ['ios'], devices: ['apple-tv'] },
  { id: 'flow-vlc', name: 'VLC', platforms: ['android', 'ios', 'pc'], devices: [...ANDROID_TV, ...PHONE, 'pc-mac', 'apple-tv'] },
  { id: 'flow-kodi', name: 'Kodi', platforms: ['android', 'pc'], devices: [...ANDROID_TV, 'pc-mac'] },
  { id: 'flow-all-iptv', name: 'ALL IPTV Player', platforms: ['windows'], devices: ['pc-mac'] },
];

const DEVICE_PLATFORMS = {
  'smart-tv': ['smarttv'],
  'android-tv': ['android'],
  'android-box': ['android'],
  firestick: ['android'],
  smartphone: ['android', 'ios'],
  tablet: ['android', 'ios', 'tablet'],
  'apple-tv': ['ios'],
  'pc-mac': ['pc'],
  'mag-box': [],
};

export function getFlowApps(rawApps, deviceId, platformsMap = {}) {
  if (!deviceId) return [];
  const custom = Array.isArray(rawApps) ? rawApps : Array.isArray(rawApps?.apps) ? rawApps.apps : [];
  const allowed = DEVICE_PLATFORMS[deviceId] ?? platformsMap[deviceId] ?? [];
  const curated = FLOW_PLAYER_APPS.filter((app) => app.devices.includes(deviceId));
  const curatedNames = new Map(FLOW_PLAYER_APPS.map((app) => [app.name.toLocaleLowerCase('tr'), app]));
  const applicableCustom = custom.filter((app) => {
    if (!app?.name || !Array.isArray(app.platforms)) return false;
    const known = curatedNames.get(app.name.toLocaleLowerCase('tr'));
    return known ? known.devices.includes(deviceId) : app.platforms.some((platform) => allowed.includes(platform));
  });
  const result = new Map();
  [...applicableCustom, ...curated].forEach((app) => {
    const key = app.name.trim().toLocaleLowerCase('tr');
    if (!result.has(key)) result.set(key, app);
  });
  return [...result.values()].sort((a, b) => Number(Boolean(b.recommended)) - Number(Boolean(a.recommended)));
}
