import React, { memo, useMemo } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import {
  COVERAGE_MATRIX,
  COVERAGE_COPY,
  NETWORK_STATS,
} from '@/data/footerGeoIntelligence';
import { buildFooterJsonLd } from '@/utils/footerSchema';

/**
 * Kısa hizmet özeti + isteğe bağlı bölge listesi + footer JSON-LD.
 * Bölge/şehir listesi detay içinde tutulur; böylece hem kullanıcı deneyimi sade kalır
 * hem de footerSchema areaServed ile aynı içerik HTML içinde korunur.
 */
const FooterGeoMatrix = ({ locale = 'tr' }) => {
  const matrix = COVERAGE_MATRIX[locale] || COVERAGE_MATRIX.tr;
  const copy = COVERAGE_COPY[locale] || COVERAGE_COPY.tr;
  const stats = NETWORK_STATS[locale] || NETWORK_STATS.tr;
  const highlightedStats = [stats[0], stats[2], stats[3]].filter(Boolean);
  const regionSummary = matrix.map(({ region }) => region).join(' · ');

  const jsonLd = useMemo(() => JSON.stringify(buildFooterJsonLd(locale)), [locale]);

  return (
    <section
      aria-label={copy.title}
      className="border-b border-white/[0.06] bg-white/[0.015]"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <div className="container mx-auto px-4 py-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
              <p className="text-sm font-bold text-white">
                {locale === 'de' ? 'Wo können Sie QruzeTV nutzen?' : 'QruzeTV nerede kullanılabilir?'}
              </p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-gray-400">{copy.subtitle}</p>
            <p className="mt-2 text-[11px] leading-relaxed text-gray-600">{regionSummary}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:min-w-[24rem]">
          {highlightedStats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/[0.06] bg-black/30 px-3 py-2.5 text-center"
            >
              <div className="text-base font-bold text-white">{s.value}</div>
              <div className="mt-0.5 text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
          </div>
        </div>

        <details className="group mt-5 border-t border-white/[0.06] pt-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-semibold text-gray-400 transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
            <span>{locale === 'de' ? 'Verfügbare Regionen anzeigen' : 'Hizmet verilen bölgeleri göster'}</span>
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {matrix.map(({ region, cities }) => (
              <div key={region}>
                <div className="mb-1.5 text-xs font-semibold text-gray-400">{region}</div>
                <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] leading-relaxed text-gray-600">
                  {cities.map((city, i) => (
                    <span key={city}>
                      {city}
                      {i < cities.length - 1 && <span className="text-gray-700"> ·</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
};

export default memo(FooterGeoMatrix);
