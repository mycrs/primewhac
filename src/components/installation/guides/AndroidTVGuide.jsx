import React from 'react';
import InstallationGuideRenderer from '../InstallationGuideRenderer';
import {
  buildQruzePlayerSteps,
  resolveQruzePlayerGuideSteps,
} from './androidQruzePlayerSteps';

export const androidTvFallbackStepsTr = buildQruzePlayerSteps(false, { device: 'tv' });
export const androidTvFallbackStepsDe = buildQruzePlayerSteps(true, { device: 'tv' });

export function resolveAndroidTvGuideSteps(dbSteps, isDe) {
  return resolveQruzePlayerGuideSteps(dbSteps, isDe, { device: 'tv' });
}

const AndroidTVGuide = ({ dbData }) => (
  <InstallationGuideRenderer
    data={dbData}
    fallbackData={{ steps: androidTvFallbackStepsTr }}
  />
);

export default AndroidTVGuide;
