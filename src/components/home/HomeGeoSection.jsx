import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, HelpCircle, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HOME_GEO_FAQ_ITEMS, HOME_GEO_SERVICES } from '@/data/homeGeoContent';

const QUICK_LINKS = [
  { to: '/paketler', label: 'IPTV Paketleri' },
  { to: '/kurulum', label: 'Kurulum Rehberi' },
  { to: '/test', label: 'Ücretsiz Test' },
  { to: '/sss', label: 'Sık Sorulan Sorular' },
  { to: '/m3u-converter', label: 'M3U Dönüştürücü Aracı' },
  { to: '/reseller', label: 'Bayilik Programı' },
];

const HomeGeoSection = () => (
  <section className="py-16 border-t border-white/5" aria-labelledby="qruzetv-geo-heading">
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="luxury-glass rounded-3xl border border-white/10 p-8 md:p-10">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-8 h-8 text-primary shrink-0" aria-hidden />
          <h2 id="qruzetv-geo-heading" className="text-2xl md:text-3xl font-bold text-white">
            QruzeTV Nedir?
          </h2>
        </div>

        <p className="text-slate-300 leading-relaxed mb-8">
          QruzeTV, Türkçe ve Almanca yayın deneyimi için IPTV paketleri, cihaz kurulum rehberleri,
          kanal listesi, test hesabı ve kullanıcı desteği sunan bir yayın platformudur. Kullanıcılar
          Smart TV, Android TV, iOS, Windows, Mac ve tablet gibi cihazlarda kurulum rehberlerini
          takip ederek yayın deneyimini kolayca başlatabilir.
        </p>

        <p className="text-lg font-semibold text-white mb-3">Hangi hizmetleri sunuyoruz?</p>
        <ul className="grid sm:grid-cols-2 gap-2 mb-8 text-slate-300 text-sm md:text-base">
          {HOME_GEO_SERVICES.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-primary mt-1.5 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-lg font-semibold text-white mb-2">Hangi cihazlarda kullanılır?</p>
        <p className="text-slate-300 leading-relaxed mb-8">
          QruzeTV; Smart TV, Samsung TV, LG TV, Android TV, Android telefon, iPhone, iPad, Windows,
          Mac ve tablet cihazlar için kurulum rehberleri sunar. Cihaz uyumluluğu ve uygulama seçimi,
          kullanılacak pakete ve cihaza göre değişebilir.
        </p>

        <p className="text-lg font-semibold text-white mb-2">Türkiye ve Avrupa paket farkı</p>
        <p className="text-slate-300 leading-relaxed mb-6">
          QruzeTV&apos;de Türkiye ve Avrupa kullanıcıları için farklı paket seçenekleri bulunabilir.
          Paket seçimi yapılırken kullanım bölgesi, cihaz türü ve izlemek istenen yayın kategorileri
          dikkate alınmalıdır. Satın alma öncesinde{' '}
          <Link to="/paketler" title="IPTV paket açıklamalarını inceleyin" className="text-primary hover:underline">
            paket açıklamaları
          </Link>{' '}
          kontrol edilmelidir.
        </p>

        <nav
          className="flex flex-wrap gap-2 mb-10 pb-8 border-b border-white/10"
          aria-label="QruzeTV hızlı bağlantılar"
        >
          {QUICK_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              title={label}
              className="px-3 py-1.5 text-sm rounded-full bg-white/5 border border-white/10 text-slate-200 hover:border-primary/40 hover:text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-primary" aria-hidden />
          <p className="text-lg font-semibold text-white">Sık sorulan kısa sorular</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {HOME_GEO_FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={item.question} value={`geo-faq-${i}`} className="border-white/10">
              <AccordionTrigger className="text-left text-slate-200 hover:text-primary hover:no-underline py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 leading-relaxed pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);

export default HomeGeoSection;
