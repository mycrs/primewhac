import React from 'react';
import InstallationGuideRenderer from '../InstallationGuideRenderer';
import { buildIosAppSteps, resolveIosAppGuideSteps } from './iosAppSteps';

export const iosNextPlusFallbackStepsTr = buildIosAppSteps(false, 'next-plus');
export const iosNextPlusFallbackStepsDe = buildIosAppSteps(true, 'next-plus');

export function resolveIosGuideSteps(dbSteps, isDe, appId = 'next-plus') {
  return resolveIosAppGuideSteps(dbSteps, isDe, appId);
}

const iOSGuide = ({ dbData }) => (
  <InstallationGuideRenderer
    data={dbData}
    fallbackData={{ steps: iosNextPlusFallbackStepsTr }}
  />
);

export default iOSGuide;
