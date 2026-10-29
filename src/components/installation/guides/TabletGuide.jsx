import React from 'react';
import InstallationGuideRenderer from '../InstallationGuideRenderer';
import { buildTabletSteps } from './tabletSteps';

const TabletGuide = ({ dbData }) => (
  <InstallationGuideRenderer
    data={dbData}
    fallbackData={{ steps: buildTabletSteps(false) }}
  />
);

export default TabletGuide;
