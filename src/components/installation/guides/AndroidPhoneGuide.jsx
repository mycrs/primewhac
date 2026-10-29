import React from 'react';
import InstallationGuideRenderer from '../InstallationGuideRenderer';
import {
  buildQruzePlayerSteps,
  resolveQruzePlayerGuideSteps,
} from './androidQruzePlayerSteps';

export const androidPhoneFallbackStepsTr = buildQruzePlayerSteps(false, { device: 'phone' });
export const androidPhoneFallbackStepsDe = buildQruzePlayerSteps(true, { device: 'phone' });

export function resolveAndroidPhoneGuideSteps(dbSteps, isDe) {
  return resolveQruzePlayerGuideSteps(dbSteps, isDe, { device: 'phone' });
}

const AndroidPhoneGuide = ({ dbData }) => (
  <InstallationGuideRenderer
    data={dbData}
    fallbackData={{ steps: androidPhoneFallbackStepsTr }}
  />
);

export default AndroidPhoneGuide;
