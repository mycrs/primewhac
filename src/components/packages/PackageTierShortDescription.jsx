import React, { memo } from 'react';
import { TIER_SHORT_DESCRIPTIONS_TR, TIER_SHORT_DESCRIPTIONS_DE } from '@/constants/packageTiers';

/** Seçili paket tipi için kısa (1-2 satır) açıklama */
const PackageTierShortDescription = ({ selectedTier, isDe = false, text: textProp }) => {
  const descriptions = isDe ? TIER_SHORT_DESCRIPTIONS_DE : TIER_SHORT_DESCRIPTIONS_TR;
  const text = textProp || descriptions[selectedTier] || '';

  if (!text) return null;

  return (
    <p className="hidden md:block text-center text-slate-400 text-xs md:text-sm max-w-xl mx-auto mb-4 leading-relaxed font-normal">
      {text}
    </p>
  );
};

export default memo(PackageTierShortDescription);
