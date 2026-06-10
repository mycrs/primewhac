import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Info, MonitorPlay, Settings, HelpCircle, Zap, ShieldCheck, Wrench } from 'lucide-react';
import PackagesRegionInfo from '@/components/packages/PackagesRegionInfo';
import PackageTierSeoSection from '@/components/packages/PackageTierSeoSection';
import { resolvePackagesPageContent } from '@/utils/packagePageContent';

const PackagesPageSeoSections = ({ siteData, contactData, lang = 'tr' }) => {
  const isDe = lang === 'de';
  const content = resolvePackagesPageContent(siteData);
  const seo = content.seo || {};
  const whatsapp = contactData?.whatsapp?.replace(/[^0-9]/g, '') || '';
  const comparePath = isDe ? '/de/vergleich' : '/karsilastirma';
  const compareLabel = isDe ? 'Pakete vergleichen' : 'Paketleri Karşılaştır';
  const testPath = isDe ? '/de/test' : '/test';
  const faqPath = isDe ? '/de/sss' : '/sss';

  return (
    <>
      {seo.whatIsIptv?.paragraphs?.length > 0 && (
        <section className="py-12 bg-[#0a0a0a]/20">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
              <Info className="w-8 h-8 text-primary" />
              {seo.whatIsIptv.title || 'IPTV Paketleri Nedir?'}
            </h2>
            <div className="text-slate-300 space-y-4 leading-relaxed text-lg">
              {seo.whatIsIptv.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      <PackagesRegionInfo lang={lang} content={content} />

      <PackageTierSeoSection lang={lang} content={content} />

      {seo.featuresDetail && (
        <section className="py-16 bg-[#0a0a0a]/30 border-y border-white/5">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold mb-10 text-white text-center">
              {seo.featuresDetail.title || 'Paket Özellikleri Detaylı'}
            </h2>
            <div className="space-y-8 text-slate-300 text-lg leading-relaxed">
              {seo.featuresDetail.intro && <p>{seo.featuresDetail.intro}</p>}
              {(seo.featuresDetail.sections || []).map((sec) => (
                <div key={sec.title} className="bg-[#0a0a0a]/40 p-8 rounded-2xl border border-white/10">
                  <h3 className="text-2xl font-bold mb-4 text-white text-primary">{sec.title}</h3>
                  <p>{sec.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {seo.whyUs && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{seo.whyUs.title}</h2>
              <p className="mt-6 text-lg text-slate-400 max-w-3xl mx-auto">{seo.whyUs.description}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {(seo.whyUs.items || []).map((item, i) => {
                const Icon = [Zap, ShieldCheck, HelpCircle][i] || Zap;
                return (
                  <div key={item.title} className="bg-[#0a0a0a]/40 p-8 rounded-2xl border border-white/5">
                    <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-[#0a0a0a]/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            {seo.howToChoose?.paragraphs?.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <MonitorPlay className="w-8 h-8 text-primary" />
                  {seo.howToChoose.title || 'IPTV Paketleri Nasıl Seçilir?'}
                </h2>
                <div className="text-slate-300 text-lg leading-relaxed space-y-4">
                  {seo.howToChoose.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            )}

            {seo.usageTips && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Settings className="w-8 h-8 text-primary" />
                  {seo.usageTips.title || 'Kullanım İpuçları'}
                </h2>
                <div className="text-slate-300 text-lg leading-relaxed space-y-4">
                  {seo.usageTips.intro && <p>{seo.usageTips.intro}</p>}
                  {(seo.usageTips.items || []).length > 0 && (
                    <ul className="list-disc pl-6 space-y-2">
                      {seo.usageTips.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {seo.usageTips.outro && <p>{seo.usageTips.outro}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {seo.faq && (
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-gradient-to-br from-[#e50914]/20 to-[#b20710]/20 p-10 rounded-3xl border border-primary/30 text-center shadow-2xl relative overflow-hidden">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center justify-center gap-3">
                <HelpCircle className="w-8 h-8 text-primary" />
                {seo.faq.title || 'Sıkça Sorulan Sorular'}
              </h2>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                {seo.faq.description}
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
                <Link to={testPath} className="px-8 py-4 bg-primary/20 text-white font-bold rounded-xl hover:bg-primary/30 border border-primary/30 transition-all">
                  {isDe ? 'Kostenlos testen' : 'Test Hesabı Talep Et'}
                </Link>
                <Link to={comparePath} className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 border border-white/20 transition-all">
                  {compareLabel}
                </Link>
                <Link to={faqPath} className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 border border-white/20 transition-all flex items-center justify-center gap-2">
                  <Info className="w-5 h-5" />
                  {isDe ? 'Alle Fragen ansehen' : 'Tüm Soruları İncele'}
                </Link>
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary transition-all flex items-center justify-center gap-2"
                  >
                    <Wrench className="w-5 h-5" />
                    WhatsApp'tan Destek Al
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default memo(PackagesPageSeoSections);
