import React, { memo } from 'react';
import ChannelSlider from './ChannelSlider';

// Reusing original component since it has no text, just scrolling images
const ChannelSliderDE = ({ channels }) => {
  return <ChannelSlider channels={channels} />;
};

export default memo(ChannelSliderDE);