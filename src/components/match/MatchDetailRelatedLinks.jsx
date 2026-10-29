import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, HelpCircle, Package, Tv, FileText, BarChart3, Link2, FileCode } from 'lucide-react';

/**
 * Maç detay sayfası – SEO ve UX için ilgili sayfalara yönlendirme.
 * Kurulum, SSS, Paketler, Kanallar, Blog, Karşılaştırma.
 */
const LINKS_TR = [
  {
    to: '/kurulum/',
    icon: Settings,
    title: 'IPTV Kurulum Rehberi',
    desc: 'Smart TV, Android, iOS için adım adım kurulum nasıl yapılır?',
  },
  {
    to: '/sss/',
    icon: HelpCircle,
    title: 'Sıkça Sorulan Sorular',
    desc: 'IPTV nedir? Hangi internet hızı gerekir? Donma sorunu nasıl çözülür?',
  },
  {
    to: '/paketler/',
    icon: Package,
    title: 'IPTV Paketleri ve Fiyatları',
    desc: '3 aylık, 6 aylık, 12 aylık paketler. Uygun fiyatlı abonelik seçenekleri.',
  },
  {
    to: '/channels/',
    icon: Tv,
    title: 'Kanal Listesi',
    desc: '4K ve HD spor kanalları. Hangi kanallar dahil?',
  },
  {
    to: '/blog/',
    icon: FileText,
    title: 'Blog & Rehberler',
    desc: 'IPTV ipuçları, kurulum rehberleri ve güncel haberler.',
  },
  {
    to: '/karsilastirma/',
    icon: BarChart3,
    title: 'IPTV Karşılaştırması',
    desc: 'Paket özellikleri, HD vs 4K, en iyi IPTV hangisi?',
  },
  {
    to: '/m3u-converter/',
    icon: FileCode,
    title: 'M3U Dönüştür',
    desc: 'M3U formatında IPTV listesi oluştur. Ücretsiz dönüştürme aracı.',
  },
];

const LINKS_DE = [
  { to: '/de/einrichtung/', icon: Settings, title: 'IPTV Einrichtungsanleitung', desc: 'Schritt-für-Schritt für Smart TV, Android, iOS.' },
  { to: '/de/sss/', icon: HelpCircle, title: 'Häufig gestellte Fragen', desc: 'Was ist IPTV? Welche Internetgeschwindigkeit? Störungen beheben.' },
  { to: '/de/paketler/', icon: Package, title: 'IPTV Pakete und Preise', desc: '3, 6, 12 Monate. Günstige Abo-Optionen.' },
  { to: '/de/kanale/', icon: Tv, title: 'Kanal Liste', desc: '4K und HD Sportkanäle. Welche Kanäle enthalten?' },
  { to: '/de/blog/', icon: FileText, title: 'Blog & Anleitungen', desc: 'IPTV Tipps, Einrichtungsanleitungen, aktuelle News.' },
  { to: '/de/m3u-olustur/', icon: BarChart3, title: 'M3U Liste erstellen', desc: 'M3U-Format IPTV-Liste erstellen. Kostenloses Tool.' },
];

export default function MatchDetailRelatedLinks({ locale = 'tr' }) {
  const links = locale === 'de' ? LINKS_DE : LINKS_TR;
  const heading = locale === 'de' ? 'Das könnte Sie auch interessieren' : 'İlginizi çekebilecekler';
  const cta = locale === 'de' ? 'Mehr erfahren' : 'Detaylı bilgi';

  return (
    <section className="p-6 sm:p-8 lg:p-12 pr-20 sm:pr-8 lg:pr-12 bg-[#0a0a0a]/30 border-t border-slate-800">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Link2 className="w-6 h-6 text-primary" />
        {heading}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="group flex gap-4 p-4 rounded-2xl bg-[#0a0a0a]/60 border border-slate-700/80 hover:border-primary/50 hover:bg-[#0a0a0a]/60 transition-all duration-300"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm mt-0.5 leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
                <span className="inline-block mt-2 text-primary text-sm font-medium group-hover:underline">
                  {cta} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
