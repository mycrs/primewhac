/**
 * Kurulum cihaz/uygulama slug listesi — build script + prerender + sitemap ortak kaynağı.
 */
import { LEGACY_WINDOWS_REDIRECTS } from './windowsApps.js';

export const LEGACY_KURULUM_REDIRECTS = {
  ...LEGACY_WINDOWS_REDIRECTS,
};

export const BASE_KURULUM_DEVICES = [
  'android-tv',
  'ios',
  'android-phone',
  'android-phone-xc',
  'android-phone-ibo',
  'windows',
  'windows-ibo-player',
  'windows-abc',
  'windows-vs-player',
  'mac',
  'mac-next-plus',
  'mac-castora',
  'smart-tv',
  'smart-tv-0-player',
  'smart-tv-smarters-pro',
  'samsung-tv-iptv',
  'lg-tv-iptv',
  'philips-tv-iptv',
  'vestel-tv-iptv',
  'hisense-tv-iptv',
  'tcl-tv-iptv',
  'ios-next-plus',
  'ios-castora',
  'ios-9xtream',
  'tablet',
  'tablet-ibo-player',
  'tablet-abc',
  'tablet-vs-player',
];

/** Hub DB sütunu → hub slug */
export const HUB_CONFIG_KEYS = {
  android_phone_config: 'android-phone',
  windows_pc_config: 'windows',
  tablet_config: 'tablet',
};
