/** Tablet — hub fallback adımları (uygulama sayfaları tabletAppSteps kullanır) */

import { buildTabletAppSteps } from './tabletAppSteps';

export const TABLET_VISUALS = [
  'store', 'search', 'search', 'install', 'app', 'xtream', 'addUser', 'watch', 'login',
];

export function buildTabletSteps(isDe) {
  return buildTabletAppSteps(isDe, 'ibo-player');
}

export function resolveTabletGuideSteps(dbSteps, isDe, appId = 'ibo-player') {
  const fallback = buildTabletAppSteps(isDe, appId);
  if (!Array.isArray(dbSteps) || dbSteps.length === 0) return fallback;

  return dbSteps.map((step, index) => {
    const fb = fallback[index] || fallback[fallback.length - 1];
    return {
      title: step.title || fb.title,
      description: step.description || fb.description,
      image: step.image?.trim() || fb.image,
      visual: step.visual || fb.visual || 'app',
      theme: step.theme || fb.theme,
    };
  });
}
