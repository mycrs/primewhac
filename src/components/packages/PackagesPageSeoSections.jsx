import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Info, MonitorPlay, Settings, HelpCircle, Zap, ShieldCheck, Wrench } from 'lucide-react';
import PackagesRegionInfo from '@/components/packages/PackagesRegionInfo';
import PackageTierSeoSection from '@/components/packages/PackageTierSeoSection';
import { resolvePackagesPageContent } from '@/utils/packagePageContent';

const SEO_CONTENT_DE = {
  whatIsIptv: {
    title: 'Was ist ein IPTV-Paket?',
    paragraphs: [
      'Ein IPTV-Paket überträgt Fernsehprogramme und abrufbare Inhalte über die Internetverbindung. Statt Satellitenschüssel oder Kabelanschluss verwenden Sie eine kompatible App auf Smart TV, Fire TV, Smartphone, Tablet oder Computer.',
      'Für die Auswahl sind nicht nur Senderzahl und Preis wichtig. Entscheidend sind Gerätekompatibilität, Nutzungsregion, Bildqualität, Laufzeit und eine stabile Verbindung. Prüfen Sie das Angebot deshalb vor der Buchung auf Ihrem eigenen Gerät.',
      'In Deutschland sollte ein passendes Paket transparente Konditionen, verständliche Einrichtungshilfen und erreichbaren Support bieten. Für HD empfiehlt sich eine stabile Leitung ab etwa 16 Mbit/s; für 4K sollte am Abspielgerät deutlich mehr Bandbreite ankommen.'
    ]
  },
  featuresDetail: {
    title: 'Laufzeiten und Paketmerkmale im Überblick',
    intro: 'Wählen Sie die Laufzeit nach Ihrem tatsächlichen Bedarf. Ein kostenloser Test hilft, App, Netzwerk und Bildqualität vor einer längeren Buchung zu prüfen.',
    sections: [
      { title: '3-Monats-Pakete', content: 'Geeignet zum Einstieg oder für zeitlich begrenzte Nutzung. Sie bleiben flexibel und können die Qualität über mehrere Wochen im Alltag beurteilen.' },
      { title: '6-Monats-Pakete', content: 'Eine ausgewogene Option für Nutzer, die bereits wissen, dass Gerät und Internetverbindung zuverlässig funktionieren.' },
      { title: '12-Monats-Pakete', content: 'Für regelmäßige Nutzung gedacht. Vergleichen Sie vorab Leistungsumfang, Support und effektiven Monatspreis.' }
    ]
  },
  whyUs: {
    title: 'Worauf es bei einem IPTV-Paket ankommt',
    description: 'Ein gutes Nutzungserlebnis entsteht aus stabiler Technik, einfacher Einrichtung und nachvollziehbarem Support.',
    items: [
      { title: 'Stabile Wiedergabe', content: 'Optimierte Streams und die richtige App-Auswahl reduzieren Ladezeiten und Unterbrechungen.' },
      { title: 'Sichere Abwicklung', content: 'Klare Paketangaben, geschützte Datenübertragung und transparente Bestellschritte schaffen Vertrauen.' },
      { title: 'Hilfe bei der Einrichtung', content: 'Deutschsprachige Geräte-Anleitungen führen durch App-Installation, Anmeldung und Fehlerdiagnose.' }
    ]
  },
  howToChoose: {
    title: 'Welches IPTV-Paket passt zu mir?',
    paragraphs: [
      'Beginnen Sie mit dem Gerät: Samsung und LG nutzen andere App-Stores als Android TV oder Fire TV. Prüfen Sie anschließend, ob Sie hauptsächlich Live-TV, türkische Sender, Sport oder abrufbare Inhalte sehen möchten.',
      'Berücksichtigen Sie die Zahl gleichzeitig genutzter Geräte und testen Sie möglichst per LAN oder stabilem 5-GHz-WLAN. Eine lange Laufzeit lohnt sich erst, wenn die Wiedergabe in Ihrem Heimnetz zuverlässig ist.'
    ]
  },
  usageTips: {
    title: 'Tipps für störungsfreies Streaming',
    intro: 'Mit wenigen Kontrollen verbessern Sie Stabilität und Bildqualität:',
    items: [
      'Smart TV oder Streaming-Box nach Möglichkeit per LAN verbinden.',
      'Router, Betriebssystem und Player-App regelmäßig aktualisieren.',
      'Parallele Downloads und Cloud-Backups während des Streamings begrenzen.',
      'Bei Störungen einen zweiten Player oder ein zweites Gerät zum Vergleich testen.'
    ],
    outro: 'Unsere Geräte-Anleitungen zeigen die passenden Schritte für Smart TV, Fire TV, Android, iOS, Windows und Mac.'
  },
  faq: {
    title: 'Fragen zu Paketen und Einrichtung',
    description: 'Antworten zu Testzugang, Geräten, Laufzeiten, Streaming-Qualität und Einrichtung finden Sie in unserem deutschsprachigen Hilfebereich.'
  }
};

const PackagesPageSeoSections = ({ siteData, lang = 'tr' }) => {
  const isDe = lang === 'de';
  const content = resolvePackagesPageContent(siteData);
  const seo = isDe ? SEO_CONTENT_DE : (content.seo || {});
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
                {/* wa.me CTA'sı kaldırıldı — numara statik HTML'de açıkta kalıyordu.
                    Aynı tasarımla kurulum rehberine yönlendiriyoruz. */}
                <Link
                  to={isDe ? '/de/einrichtung/' : '/kurulum/'}
                  className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary transition-all flex items-center justify-center gap-2"
                >
                  <Wrench className="w-5 h-5" />
                  {isDe ? 'Einrichtungshilfe' : 'Kurulum Desteği'}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default memo(PackagesPageSeoSections);
