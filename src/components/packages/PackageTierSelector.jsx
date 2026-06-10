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
    <div className="flex flex-col items-center mb-4">
      <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        {isDe ? 'Pakettyp' : 'Paket Tipi'}
      </p>
      <div
        className="inline-flex bg-[#0a0a0a] border border-[#2a2a40] p-1 h-auto rounded-full"
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
              className={`rounded-full px-6 py-2.5 text-sm md:text-base transition-all ${
                isActive
                  ? 'bg-[#e50914] text-white'
                  : 'text-gray-400 hover:text-white'
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
