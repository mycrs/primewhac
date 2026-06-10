import React from 'react';
import { faqSeoSupplementTR, faqSeoSupplementDE } from '@/data/faqSeoSupplementContent';

/**
 * SSS altı SEO metni — SSS hero ile uyumlu dikkat çekici mor / amber / pembe renk teması.
 */
export function FaqSeoSupplement({ lang = 'tr' }) {
  const data = lang === 'de' ? faqSeoSupplementDE : faqSeoSupplementTR;
  const sectionId = lang === 'de' ? 'iptv-zusatzinformationen' : 'iptv-ek-bilgiler';
  const titleId = `${sectionId}-baslik`;

  return (
    <section
      id={sectionId}
      aria-labelledby={titleId}
      className="relative overflow-hidden bg-[#0a0a0a] px-4 sm:px-6 pb-16 md:pb-28 pt-4 md:pt-8"
    >
      {/* Arka plan — SSS üst bölümle aynı dil */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_0%,rgba(229, 9, 20,0.22),transparent_58%)]" />
      <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-primary/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-64 w-64 rounded-full bg-[#e50914]/12 blur-[90px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[120%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#e50914]/10 to-transparent" />

      <div className="relative z-10 container mx-auto max-w-4xl">
        {/* Gradient çerçeve */}
        <div className="rounded-[1.75rem] bg-gradient-to-br from-[#e50914]/45 via-[#b20710]/25 to-amber-400/25 p-[1px] shadow-[0_0_80px_-20px_rgba(229,9,20,0.45)]">
          <div className="relative overflow-hidden rounded-[1.7rem] border border-white/[0.08] bg-[#141428]/92 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#e50914]/[0.07] via-transparent to-amber-500/[0.05]" />
            <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative px-5 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14">
              <div className="mb-8 md:mb-10">
                <span className="mb-4 inline-flex items-center rounded-full border border-primary/35 bg-primary/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary sm:text-xs">
                  {lang === 'de' ? 'Hintergrundinfos' : 'Ek bilgi'}
                </span>
                <h2
                  id={titleId}
                  className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl md:leading-tight"
                >
                  <span className="bg-gradient-to-r from-amber-200 via-[#e50914] to-[#b20710] bg-clip-text text-transparent">
                    {data.title}
                  </span>
                </h2>
                <div className="mt-5 h-px w-full max-w-md bg-gradient-to-r from-[#e50914]/60 via-[#e50914]/40 to-transparent" />
              </div>

              <p className="mb-10 max-w-none border-l-2 border-primary/45 pl-4 text-sm leading-relaxed text-slate-400 sm:text-[0.9375rem] md:mb-12 md:pl-5 md:leading-relaxed">
                {data.intro}
              </p>

              <div className="space-y-8 md:space-y-10">
                {data.blocks.map((block, i) => (
                  <div
                    key={i}
                    className="border-t border-white/[0.06] pt-8 first:border-t-0 first:pt-0 md:pt-10 md:first:pt-0"
                  >
                    <h3 className="mb-3 flex items-start gap-3 text-sm font-semibold tracking-tight text-slate-100 sm:text-base md:mb-4">
                      <span
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-[#b20710] shadow-[0_0_12px_rgba(229,9,20,0.7)]"
                        aria-hidden
                      />
                      <span className="leading-snug">{block.heading}</span>
                    </h3>
                    <div className="space-y-3.5 pl-0 sm:pl-5">
                      {block.paragraphs.map((paragraph, j) => (
                        <p
                          key={j}
                          className="text-sm leading-[1.75] text-slate-400 sm:text-[0.9375rem]"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FaqSeoSupplement;
