import { Tv, Smartphone, Monitor, Laptop, Box } from 'lucide-react';

/**
 * IPTV test / sipariş akışı cihazları.
 * Admin: /admin/iptv-cihazlari — site_content.iptvFlowDevicesData (JSON dizi).
 * id değerleri WhatsApp / DB’ye `selectedDevice.name` yanında id ile eşlenir.
 */

const ICON_MAP = {
  tv: Tv,
  smartphone: Smartphone,
  monitor: Monitor,
  laptop: Laptop,
  box: Box,
};

export const IPTV_FLOW_DEVICE_ICON_OPTIONS = Object.keys(ICON_MAP);

/** site_content + varsayılan site verisi için JSON satırları */
export const DEFAULT_IPTV_FLOW_DEVICES_DATA = [
  {
    id: 'smart-tv',
    icon: 'tv',
    platforms: ['smarttv', 'android'],
    needsTvBrand: true,
    tr: { name: 'Smart TV', desc: 'Samsung, LG, Sony' },
    de: { name: 'Smart TV', desc: 'Samsung, LG, Sony' },
  },
  {
    id: 'android-tv',
    icon: 'tv',
    platforms: ['smarttv', 'android'],
    needsTvBrand: true,
    tr: { name: 'Android TV', desc: 'Nvidia Shield, Mi Box, Philips' },
    de: { name: 'Android TV', desc: 'Nvidia Shield, Mi Box, Philips' },
  },
  {
    id: 'android-box',
    icon: 'box',
    platforms: ['android'],
    needsTvBrand: false,
    tr: { name: 'Android Box', desc: 'Nvidia Shield, Mi Box, Formuler' },
    de: { name: 'Android Box', desc: 'Nvidia Shield, Mi Box, Formuler' },
  },
  {
    id: 'firestick',
    icon: 'box',
    platforms: ['android'],
    needsTvBrand: false,
    tr: { name: 'Firestick', desc: 'Amazon Fire TV Stick / Cube' },
    de: { name: 'Fire TV Stick', desc: 'Amazon Fire TV Stick / Cube' },
  },
  {
    id: 'smartphone',
    icon: 'smartphone',
    platforms: ['android', 'ios', 'tablet'],
    needsTvBrand: false,
    tr: { name: 'Telefon ve TV Box', desc: 'Android ve iOS cihazlar' },
    de: { name: 'Smartphone & TV-Box', desc: 'Android- und iOS-Geräte' },
  },
  {
    id: 'mag-box',
    icon: 'monitor',
    platforms: ['smarttv', 'android', 'pc'],
    needsTvBrand: false,
    tr: { name: 'Mag Box', desc: 'Mag Box, Enigma2, vb.' },
    de: { name: 'Mag Box', desc: 'Mag Box, Enigma2, usw.' },
  },
  {
    id: 'pc-mac',
    icon: 'laptop',
    platforms: ['pc', 'tablet'],
    needsTvBrand: false,
    tr: { name: 'PC / Mac', desc: 'Windows, macOS, Linux' },
    de: { name: 'PC / Mac', desc: 'Windows, macOS, Linux' },
  },
];

function rowValid(d) {
  return (
    d &&
    typeof d.id === 'string' &&
    d.id.trim().length > 0 &&
    d.tr &&
    typeof d.tr.name === 'string' &&
    d.de &&
    typeof d.de.name === 'string'
  );
}

/**
 * Admin / DB’den gelen diziyi doğrular. Boş veya geçersizse null (varsayılanlara dön).
 */
export function normalizeIptvFlowDevicesData(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const cleaned = raw
    .filter(rowValid)
    .map((d) => {
      const id = String(d.id)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_]/g, '');
      const icon = ICON_MAP[d.icon] ? d.icon : 'tv';
      const platforms =
        Array.isArray(d.platforms) && d.platforms.length
          ? [...new Set(d.platforms.map((p) => String(p).toLowerCase()))]
          : ['smarttv', 'android'];
      return {
        id: id || `device-${Math.random().toString(36).slice(2, 9)}`,
        icon,
        platforms,
        needsTvBrand: Boolean(d.needsTvBrand),
        tr: {
          name: String(d.tr.name || '').trim(),
          desc: String(d.tr.desc || '').trim(),
        },
        de: {
          name: String(d.de.name || '').trim(),
          desc: String(d.de.desc || '').trim(),
        },
      };
    })
    .filter((d) => d.id && d.tr.name && d.de.name);

  const seen = new Set();
  const unique = cleaned.filter((d) => {
    if (seen.has(d.id)) return false;
    seen.add(d.id);
    return true;
  });
  return unique.length ? unique : null;
}

function resolvedList(rawCustom) {
  const norm = normalizeIptvFlowDevicesData(rawCustom);
  return norm || DEFAULT_IPTV_FLOW_DEVICES_DATA;
}

/**
 * @param {'tr' | 'de'} lang
 * @param {unknown} rawCustom — siteData.iptvFlowDevicesData
 * @returns {{ id: string, name: string, desc: string, icon: React.ComponentType, needsTvBrand: boolean }[]}
 */
export function getIptvFlowDevices(lang, rawCustom) {
  const key = lang === 'de' ? 'de' : 'tr';
  return resolvedList(rawCustom).map((d) => ({
    id: d.id,
    name: d[key].name,
    desc: d[key].desc,
    icon: ICON_MAP[d.icon] || Tv,
    needsTvBrand: d.needsTvBrand,
  }));
}

export function getIptvDevicePlatformsMap(rawCustom) {
  const map = {};
  resolvedList(rawCustom).forEach((d) => {
    map[d.id] = d.platforms;
  });
  return map;
}

export function getIptvDeviceIdsNeedingTvBrand(rawCustom) {
  return resolvedList(rawCustom).filter((d) => d.needsTvBrand).map((d) => d.id);
}

/** Özet / ikon — rawCustom: siteData.iptvFlowDevicesData */
export function getIptvDeviceIcon(deviceId, rawCustom) {
  const row = resolvedList(rawCustom).find((x) => x.id === deviceId);
  return (row && ICON_MAP[row.icon]) || Tv;
}

/** Eski importlar: yalnızca varsayılan liste */
export const IPTV_DEVICE_PLATFORMS = Object.fromEntries(
  DEFAULT_IPTV_FLOW_DEVICES_DATA.map((d) => [d.id, d.platforms])
);

export const IPTV_DEVICE_IDS_NEEDING_TV_BRAND = DEFAULT_IPTV_FLOW_DEVICES_DATA.filter((d) => d.needsTvBrand).map(
  (d) => d.id
);
