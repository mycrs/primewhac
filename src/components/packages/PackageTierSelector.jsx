import React, { memo } from 'react';
import { ACTIVE_TIER_OPTIONS } from '@/constants/packageTiers';

/**
 * Paket tipi seçici — bölge sekmeleriyle aynı görsel dil (rounded-full pill).
 * tierOptions: [{ id, label }] — CMS'den; yoksa ACTIVE_TIER_OPTIONS
 */
const PackageTierSelector = ({ selectedTier, onTierChange, isDe = false, tierOptions }) => {
  const options = tierOptions?.length
    ? tierOptions
    : ACTIVE_TIER_OPTIONS.map((o) => ({ id: o.id, label: isDe ? o.labelDe : o.labelTr }));

  return (
    <div className="flex flex-col items-center mb-3">
      <div
        className="inline-flex flex-wrap justify-center gap-1 bg-[#121218]/90 border border-white/10 p-1 rounded-full shadow-inner max-w-full"
        role="tablist"
        aria-label={isDe ? 'Pakettyp auswählen' : 'Paket tipi seçin'}
      >
        {options.map((option) => {
          const isActive = selectedTier === option.id;
          const label = option.label;
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onTierChange(option.id)}
              className={`rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-[#e50914] to-[#b20710] text-white shadow-md shadow-[#e50914]/30 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default memo(PackageTierSelector);
