import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Info } from 'lucide-react';

const COPY = {
  tr: {
    title: 'Türkiye ve Avrupa Paketleri Arasındaki Fark',
    body:
      'Paket seçimi yapılırken kullanım bölgesi önemlidir. Türkiye ve Avrupa kullanıcıları için sunulan paket seçenekleri içerik, yayın erişimi ve kullanım koşulları açısından farklılık gösterebilir. Satın alma öncesinde paket açıklamaları, cihaz uyumluluğu ve kullanım bölgesi kontrol edilmelidir.',
    warning:
      'Bazı paketler yalnızca belirli bölgelerde kullanıma uygun olabilir. Emin değilseniz satın alma öncesinde test hesabı veya destek üzerinden bilgi alabilirsiniz.',
    links: [
      { to: '/test', label: 'Test hesabı' },
      { to: '/kurulum', label: 'Kurulum rehberi' },
      { to: '/sss', label: 'Sıkça sorulan sorular' },
    ],
  },
  de: {
    title: 'Unterschied zwischen Türkei- und Europa-Paketen',
    body:
      'Bei der Paketauswahl ist die Nutzungsregion wichtig. Die verfügbaren Inhalte, der Zugriff und die Nutzungsbedingungen können je nach Türkei- oder Europa-Paket unterschiedlich sein. Vor dem Kauf sollten Paketbeschreibung, Gerätekompatibilität und Nutzungsregion geprüft werden.',
    warning:
      'Einige Pakete können nur für bestimmte Regionen geeignet sein. Wenn Sie unsicher sind, können Sie vor dem Kauf einen Testzugang oder Support anfragen.',
    links: [
      { to: '/de/test', label: 'Testzugang' },
      { to: '/de/einrichtung', label: 'Einrichtungsanleitung' },
      { to: '/de/sss', label: 'Häufige Fragen' },
    ],
  },
};

const PackagesRegionInfo = ({ lang = 'tr', content }) => {
  const regionContent = content?.regions;
  const seoRegion = content?.seo?.regionDifference;
  const c = lang === 'de'
    ? COPY.de
    : regionContent
    ? {
        title: seoRegion?.title || 'Türkiye ve Avrupa Paketleri Arasındaki Fark',
        body: seoRegion?.body || regionContent.tr?.detailDescription || COPY.tr.body,
        warning: regionContent.tr?.warning || seoRegion?.warning || COPY.tr.warning,
        links: COPY.tr.links,
      }
    : COPY.tr;

  return (
    <section
      className="py-10 border-y border-white/5 bg-[#0a0a0a]/30"
      aria-labelledby={`packages-region-info-${lang}`}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a]/50 p-6 md:p-8">
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="w-6 h-6 text-primary shrink-0 mt-0.5" aria-hidden />
            <h2 id={`packages-region-info-${lang}`} className="text-xl md:text-2xl font-bold text-white">
              {c.title}
            </h2>
          </div>

          <p className="text-slate-300 leading-relaxed mb-4">{c.body}</p>

          <div className="flex items-start gap-2 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 mb-6">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden />
            <p className="text-sm text-amber-100/90 leading-relaxed">{c.warning}</p>
          </div>

          <nav className="flex flex-wrap gap-3" aria-label={lang === 'de' ? 'Weiterführende Links' : 'İlgili sayfalar'}>
            {c.links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm font-medium text-primary hover:underline underline-offset-2"
              >
                {label} →
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
};

export default PackagesRegionInfo;
