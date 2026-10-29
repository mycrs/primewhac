import React from 'react';
import InstallationGuideRenderer from '../InstallationGuideRenderer';
import { buildWindowsAppSteps } from './windowsAppSteps';

const WindowsPCGuide = ({ dbData }) => (
  <InstallationGuideRenderer
    data={dbData}
    fallbackData={{ steps: buildWindowsAppSteps(false, 'ibo-player') }}
  />
);

export default WindowsPCGuide;
