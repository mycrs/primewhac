import React, { memo } from 'react';
import { Layers } from 'lucide-react';
import { getTierDetailDescriptions } from '@/utils/packagePageContent';

/**
 * Standart / Premium uzun açıklamaları — paket kartlarının altında (SEO/GEO).
 */
const PackageTierSeoSection = ({ lang = 'tr', content }) => {
  const isDe = lang === 'de';
  const items = getTierDetailDescriptions(content || {}, isDe);

  return (
    <section
      className="py-12 border-y border-white/5 bg-[#0a0a0a]/20"
      aria-labelledby="packages-tier-seo-heading"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <h2
          id="packages-tier-seo-heading"
          className="text-3xl font-bold mb-8 text-white flex items-center gap-3"
        >
          <Layers className="w-8 h-8 text-primary shrink-0" aria-hidden />
          {isDe ? 'Unterschied zwischen Standard- und Premium-Paketen' : 'Standart ve Premium Paket Farkı'}
        </h2>

        <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
          {items.map(({ id, title, description }) => (
            <div key={id}>
              <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(PackageTierSeoSection);
