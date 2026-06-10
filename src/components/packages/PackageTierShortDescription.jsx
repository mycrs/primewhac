import React, { memo } from 'react';
import { TIER_SHORT_DESCRIPTIONS_TR, TIER_SHORT_DESCRIPTIONS_DE } from '@/constants/packageTiers';

/** Seçili paket tipi için kısa (1-2 satır) açıklama */
const PackageTierShortDescription = ({ selectedTier, isDe = false, text: textProp }) => {
  const descriptions = isDe ? TIER_SHORT_DESCRIPTIONS_DE : TIER_SHORT_DESCRIPTIONS_TR;
  const text = textProp || descriptions[selectedTier] || '';

  if (!text) return null;

  return (
    <p className="text-center text-gray-400 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-snug">
      {text}
    </p>
  );
};

export default memo(PackageTierShortDescription);
