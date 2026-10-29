import React from 'react';
import InstallationGuideRenderer from '../InstallationGuideRenderer';
import { buildMacAppSteps } from './macAppSteps';

const MacGuide = ({ dbData }) => (
  <InstallationGuideRenderer
    data={dbData}
    fallbackData={{ steps: buildMacAppSteps(false, 'next-plus') }}
  />
);

export default MacGuide;
