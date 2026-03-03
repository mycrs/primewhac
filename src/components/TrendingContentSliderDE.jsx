import React, { memo } from 'react';
import TrendingContentSlider from './TrendingContentSlider';

const TrendingContentSliderDE = ({ title = "Beliebte Inhalte in 4K IPTV" }) => {
  return <TrendingContentSlider title={title} isDe />;
};

export default memo(TrendingContentSliderDE);