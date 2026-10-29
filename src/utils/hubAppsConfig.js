/**
 * Hub kurulum yapılandırması — admin ↔ frontend dönüşümü.
 * Windows / Tablet / Android Telefon hub modeli.
 */

import { ANDROID_PHONE_APPS } from '@/data/androidPhoneApps';
import { WINDOWS_APPS } from '@/data/windowsApps';
import { TABLET_APPS } from '@/data/tabletApps';

export const HUB_APP_THEMES = [
  { value: 'red', label: 'Kırmızı', color: 'from-[#e50914] to-[#b20710]', colorLight: 'text-[#e50914]', bg: 'bg-[#e50914]/10' },
  { value: 'emerald', label: 'Zümrüt', color: 'from-emerald-400 to-teal-600', colorLight: 'text-emerald-300', bg: 'bg-emerald-500/10' },
  { value: 'rose', label: 'Gül', color: 'from-rose-400 to-red-600', colorLight: 'text-rose-300', bg: 'bg-rose-500/10' },
  { value: 'cyan', label: 'Camgöbeği', color: 'from-cyan-400 to-blue-600', colorLight: 'text-cyan-300', bg: 'bg-cyan-500/10' },
  { value: 'sky', label: 'Gök mavisi', color: 'from-sky-400 to-blue-600', colorLight: 'text-sky-300', bg: 'bg-sky-500/10' },
  { value: 'orange', label: 'Turuncu', color: 'from-orange-500 to-amber-600', colorLight: 'text-orange-400', bg: 'bg-orange-500/10' },
  { value: 'violet', label: 'Mor', color: 'from-violet-400 to-purple-600', colorLight: 'text-violet-300', bg: 'bg-violet-500/10' },
  { value: 'amber', label: 'Kehribar', color: 'from-amber-400 to-orange-600', colorLight: 'text-amber-300', bg: 'bg-amber-500/10' },
];

export const INSTALLATION_HUBS = {
  android_phone: {
    id: 'android_phone',
    dbKey: 'android_phone_config',
    deviceName: 'Android Telefon',
    hubSlug: 'android-phone',
    slugPrefix: 'android-phone',
    defaultApps: ANDROID_PHONE_APPS,
  },
  windows: {
    id: 'windows',
    dbKey: 'windows_pc_config',
    deviceName: 'Windows PC',
    hubSlug: 'windows',
    slugPrefix: 'windows',
    defaultApps: WINDOWS_APPS,
  },
  tablet: {
    id: 'tablet',
    dbKey: 'tablet_config',
    deviceName: 'Tablet',
    hubSlug: 'tablet',
    slugPrefix: 'tablet',
    defaultApps: TABLET_APPS,
  },
};

function themeStyles(theme) {
  return HUB_APP_THEMES.find((t) => t.value === theme) || HUB_APP_THEMES[0];
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'uygulama';
}

export function defaultAppToDb(app) {
  return {
    id: crypto.randomUUID(),
    slug: app.slug,
    appId: app.appId,
    name: app.name,
    nameDe: app.nameDe || app.name,
    taglineTr: app.tagline?.tr || '',
    taglineDe: app.tagline?.de || '',
    categoryTr: app.categoryLabel?.tr || '',
    categoryDe: app.categoryLabel?.de || '',
    logoInitials: app.logoInitials || 'APP',
    installSourceTr: app.installSource?.tr || '',
    installSourceDe: app.installSource?.de || '',
    officialUrl: app.officialUrl || '',
    platformsTr: app.platforms?.tr || '',
    platformsDe: app.platforms?.de || '',
    theme: app.theme || 'red',
    color: app.color || themeStyles(app.theme).color,
    colorLight: app.colorLight || themeStyles(app.theme).colorLight,
    bg: app.bg || themeStyles(app.theme).bg,
    app_links: Array.isArray(app.app_links) ? app.app_links : [],
    steps: Array.isArray(app.steps) ? app.steps : [],
    faq: (app.faq?.tr || []).map((item, i) => ({
      id: crypto.randomUUID(),
      q: item.q,
      a: item.a,
      qDe: app.faq?.de?.[i]?.q || item.q,
      aDe: app.faq?.de?.[i]?.a || item.a,
    })),
  };
}

export function createEmptyHubApp(slugPrefix) {
  const theme = themeStyles('red');
  return {
    id: crypto.randomUUID(),
    slug: `${slugPrefix}-${Date.now().toString(36)}`,
    appId: 'new-app',
    name: 'Yeni Uygulama',
    nameDe: 'Neue App',
    taglineTr: '',
    taglineDe: '',
    categoryTr: '',
    categoryDe: '',
    logoInitials: 'APP',
    installSourceTr: '',
    installSourceDe: '',
    officialUrl: '',
    platformsTr: '',
    platformsDe: '',
    theme: 'red',
    color: theme.color,
    colorLight: theme.colorLight,
    bg: theme.bg,
    app_links: [],
    steps: [],
    faq: [],
  };
}

function stepMatchesApp(stepTitle, app) {
  const title = (stepTitle || '').toLowerCase();
  const slug = (app.slug || '').toLowerCase();
  const appId = (app.appId || '').toLowerCase();
  const name = (app.name || '').toLowerCase();
  if (slug && title.includes(slug.replace(`${app.slug?.split('-')[0]}-`, ''))) return true;
  if (appId && title.includes(appId.replace('-', ' '))) return true;
  if (name && title.includes(name.split(' ').pop())) return true;
  if (/xc/i.test(title) && /xc/i.test(app.slug || app.name || '')) return true;
  if (/ibo/i.test(title) && /ibo/i.test(app.slug || app.name || app.appId || '')) return true;
  if (/abc/i.test(title) && /abc/i.test(app.slug || app.appId || '')) return true;
  if (/vs/i.test(title) && (/vs/i.test(app.slug || '') || /vs-player/.test(app.slug || ''))) return true;
  return false;
}

function mapLegacyStep(step) {
  return {
    id: step.id || crypto.randomUUID(),
    title: step.title || '',
    description: step.description || step.content || '',
    image: step.image || step.imageUrl || '',
  };
}

function migrateLegacyStepsToApps(existingData, defaultApps, slugPrefix) {
  const apps = defaultApps.map(defaultAppToDb);

  (existingData.steps || []).forEach((step) => {
    const match = apps.find((a) => {
      const def = defaultApps.find((d) => d.slug === a.slug);
      return stepMatchesApp(step.title, { ...a, ...def });
    });

    if (match) {
      match.steps.push(mapLegacyStep(step));
    } else {
      apps.push({
        ...createEmptyHubApp(slugPrefix),
        slug: `${slugPrefix}-${slugify(step.title)}`,
        name: step.title || 'Kurulum',
        nameDe: step.title || 'Installation',
        steps: [mapLegacyStep(step)],
      });
    }
  });

  return apps;
}

export function normalizeHubDeviceConfig(existingData, hubId) {
  const hub = INSTALLATION_HUBS[hubId];
  if (!hub) return { title: '', description: '', hero_image: '', hub_intro_tr: '', hub_intro_de: '', apps: [] };

  const base = {
    title: existingData?.title || `${hub.deviceName} Kurulumu`,
    description: existingData?.description || '',
    hero_image: existingData?.hero_image || '',
    hub_intro_tr: existingData?.hub_intro_tr || '',
    hub_intro_de: existingData?.hub_intro_de || '',
    apps: [],
  };

  if (Array.isArray(existingData?.apps) && existingData.apps.length > 0) {
    return {
      ...base,
      ...existingData,
      apps: existingData.apps.map((app) => ({
        ...createEmptyHubApp(hub.slugPrefix),
        ...app,
        id: app.id || crypto.randomUUID(),
        app_links: Array.isArray(app.app_links) ? app.app_links : [],
        steps: Array.isArray(app.steps) ? app.steps : [],
        faq: Array.isArray(app.faq) ? app.faq : [],
      })),
    };
  }

  if (Array.isArray(existingData?.steps) && existingData.steps.length > 0) {
    return {
      ...base,
      ...existingData,
      apps: migrateLegacyStepsToApps(existingData, hub.defaultApps, hub.slugPrefix),
    };
  }

  return {
    ...base,
    apps: hub.defaultApps.map(defaultAppToDb),
  };
}

export function dbAppToRuntime(dbApp, fallback = {}) {
  const theme = themeStyles(dbApp.theme || fallback.theme);
  return {
    slug: dbApp.slug || fallback.slug,
    appId: dbApp.appId || fallback.appId,
    name: dbApp.name || fallback.name,
    nameDe: dbApp.nameDe || fallback.nameDe || dbApp.name,
    pageName: fallback.pageName || {
      tr: dbApp.name,
      de: dbApp.nameDe || dbApp.name,
    },
    tagline: {
      tr: dbApp.taglineTr || fallback.tagline?.tr || '',
      de: dbApp.taglineDe || fallback.tagline?.de || '',
    },
    categoryLabel: {
      tr: dbApp.categoryTr || fallback.categoryLabel?.tr || '',
      de: dbApp.categoryDe || fallback.categoryLabel?.de || '',
    },
    logo: dbApp.logo || fallback.logo || null,
    logoInitials: dbApp.logoInitials || fallback.logoInitials || 'APP',
    officialUrl: dbApp.officialUrl || fallback.officialUrl || '',
    installSource: {
      tr: dbApp.installSourceTr || fallback.installSource?.tr || '',
      de: dbApp.installSourceDe || fallback.installSource?.de || '',
    },
    dbKey: fallback.dbKey,
    contentSlug: dbApp.slug || fallback.contentSlug,
    color: dbApp.color || fallback.color || theme.color,
    colorLight: dbApp.colorLight || fallback.colorLight || theme.colorLight,
    bg: dbApp.bg || fallback.bg || theme.bg,
    theme: dbApp.theme || fallback.theme || theme.value,
    platforms: {
      tr: dbApp.platformsTr || fallback.platforms?.tr || '',
      de: dbApp.platformsDe || fallback.platforms?.de || '',
    },
    app_links: dbApp.app_links || [],
    steps: dbApp.steps || [],
    faq: {
      tr: (dbApp.faq || []).map((f) => ({ q: f.q, a: f.a })),
      de: (dbApp.faq || []).map((f) => ({ q: f.qDe || f.q, a: f.aDe || f.a })),
    },
  };
}

export function mergeHubAppsFromDb(dbConfig, defaultApps) {
  if (!Array.isArray(dbConfig?.apps) || dbConfig.apps.length === 0) {
    return defaultApps;
  }

  return dbConfig.apps.map((dbApp) => {
    const fallback = defaultApps.find((d) => d.slug === dbApp.slug || d.appId === dbApp.appId) || {};
    return dbAppToRuntime(dbApp, fallback);
  });
}

export function resolveHubAppBySlug(slug, dbConfig, defaultApps) {
  const apps = mergeHubAppsFromDb(dbConfig, defaultApps);
  return apps.find((a) => a.slug === slug) || defaultApps.find((a) => a.slug === slug) || null;
}

export function buildDeviceEntryFromHubApp(app) {
  return {
    key: app.dbKey,
    name: app.pageName?.tr || app.name,
    nameDe: app.pageName?.de || app.nameDe,
    appId: app.appId,
    logo: app.logo,
    logoInitials: app.logoInitials,
    defaultAppName: app.name,
    color: app.color,
    colorLight: app.colorLight,
    bg: app.bg,
  };
}

export function mapDbStepsToGuide(steps, theme = 'neutral') {
  if (!Array.isArray(steps) || steps.length === 0) return [];
  return steps.map((step) => ({
    title: step.title || '',
    description: step.description || step.content || '',
    image: step.image?.trim?.() || step.image || '',
    visual: step.visual || 'app',
    theme: step.theme || theme,
  }));
}

export function validateHubAppsConfig(data) {
  const errors = {};

  if (!data?.title?.trim()) {
    errors.title = 'Hub başlığı zorunludur.';
  }

  if (!Array.isArray(data.apps) || data.apps.length === 0) {
    errors.apps = 'En az bir uygulama ekleyin.';
    return { isValid: false, errors };
  }

  const appErrors = {};
  data.apps.forEach((app, index) => {
    const current = {};
    if (!app.slug?.trim()) current.slug = 'Slug zorunlu (ör. android-phone-xc)';
    if (!app.name?.trim()) current.name = 'Uygulama adı zorunlu';
    if (!Array.isArray(app.steps) || app.steps.length === 0) {
      current.steps = 'En az bir kurulum adımı ekleyin';
    } else {
      app.steps.forEach((step, si) => {
        if (!step.title?.trim()) current[`step_${si}_title`] = `Adım ${si + 1}: başlık gerekli`;
        if (!step.description?.trim()) current[`step_${si}_desc`] = `Adım ${si + 1}: açıklama gerekli`;
      });
    }
    if (Object.keys(current).length) appErrors[index] = current;
  });

  if (Object.keys(appErrors).length) {
    errors.appErrors = appErrors;
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
