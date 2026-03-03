import React from 'react';
import PremiumHero from '@/components/PremiumHero';

/**
 * Hero Component Wrapper
 * Updated to use the new PremiumHero design.
 * Maintains backward compatibility with existing imports.
 */
const Hero = (props) => {
  return <PremiumHero {...props} />;
};

export default Hero;