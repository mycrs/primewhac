import React, { memo } from 'react';
import { MessageCircle, ShieldCheck, Zap, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { whatsappHref } from '@/utils/whatsappCustomer';
import { trackCtaClick, trackWhatsAppClick } from '@/utils/analyticsTracking';

const copy = {
  tr: {
    eyebrow: 'Satın almadan önce netleşin',
    title: 'Paket seçmeden önce 2 dakikada doğru kurulumu birlikte belirleyelim.',
    desc: 'Cihazınız, ülkeniz ve izleme alışkanlığınıza göre en uygun IPTV paketini öneriyoruz. Test, kurulum ve destek aynı ekipte.',
    whatsapp: 'WhatsApp ile hızlı danış',
    packages: 'Paketleri karşılaştır',
    items: ['Ücretsiz test yönlendirmesi', 'Anında aktivasyon', '7/24 kurulum desteği'],
    message: 'Merhaba, QruzeTV paketleri hakkında bilgi almak ve cihazıma uygun paketi seçmek istiyorum.',
    packagesPath: '/paketler',
  },
  de: {
    eyebrow: 'Vor dem Kauf Klarheit schaffen',
    title: 'Wir finden in 2 Minuten das passende Setup für Ihr Gerät.',
    desc: 'Je nach Gerät, Land und Sehgewohnheit empfehlen wir das passende IPTV-Paket. Test, Einrichtung und Support aus einer Hand.',
    whatsapp: 'Schnell per WhatsApp beraten lassen',
    packages: 'Pakete vergleichen',
    items: ['Kostenlose Testberatung', 'Sofortige Aktivierung', '24/7 Einrichtungs-Support'],
    message: 'Hallo, ich möchte Informationen zu QruzeTV-Paketen und das passende Paket für mein Gerät auswählen.',
    packagesPath: '/de/pakete',
  },
};

const icons = [ShieldCheck, Zap, Headphones];

const PremiumConversionStrip = ({ locale = 'tr', contactData }) => {
  const isDe = locale === 'de';
  const t = isDe ? copy.de : copy.tr;
  const whatsapp = contactData?.whatsapp || contactData?.phone || '';
  const href = whatsappHref(whatsapp, t.message);

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[radial-gradient(circle_at_12%_0%,rgba(229,9,20,0.18),transparent_32rem),linear-gradient(135deg,rgba(12,12,12,0.96),rgba(5,5,5,0.98))] py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" aria-hidden />
      <div className="container mx-auto px-4">
        <div className="luxury-glass grid gap-7 rounded-3xl p-6 md:grid-cols-[1.3fr_0.7fr] md:p-8">
          <div>
            <span className="luxury-kicker mb-4">{t.eyebrow}</span>
            <h2 className="max-w-3xl text-2xl font-black tracking-tight text-white md:text-3xl">
              {t.title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
              {t.desc}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {t.items.map((item, index) => {
                const Icon = icons[index] || ShieldCheck;
                return (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-slate-200">
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick(isDe ? 'home_conversion_strip_de' : 'home_conversion_strip')}
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#e50914] to-[#b20710] px-6 py-4 text-center text-base font-black text-white shadow-[0_18px_48px_rgba(229,9,20,0.32)] transition-all hover:scale-[1.015] hover:shadow-[0_22px_60px_rgba(229,9,20,0.45)]"
            >
              <MessageCircle className="h-5 w-5" />
              {t.whatsapp}
            </a>
            <Link
              to={t.packagesPath}
              onClick={() => trackCtaClick(isDe ? 'conversion_strip_packages_de' : 'conversion_strip_packages', 'home_conversion_strip')}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] px-6 py-3 text-center text-sm font-bold text-slate-100 transition-all hover:border-primary/45 hover:bg-white/[0.075]"
            >
              {t.packages}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(PremiumConversionStrip);
