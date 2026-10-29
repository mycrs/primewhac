import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Zap, Tv, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const BADGE_DATA = {
  tr: [
    {
      id: 'support',
      icon: ShieldCheck,
      kicker: 'GARANTİLİ YAYIN',
      title: '7/24 Kesintisiz Destek',
      desc: 'Birebir WhatsApp ve uzman teknik yardım güvencesi.',
      isLive: true,
    },
    {
      id: 'ssl',
      icon: Lock,
      kicker: 'GÜVENLİ ÖDEME',
      title: '256-Bit SSL Şifreleme',
      desc: 'Banka düzeyinde uçtan uca korumalı altyapı.',
    },
    {
      id: 'instant',
      icon: Zap,
      kicker: 'OTOMATİK TESLİMAT',
      title: 'Anında Aktivasyon',
      desc: 'Sipariş anında kullanıcı bilgileriniz hazır.',
    },
    {
      id: 'uhd',
      icon: Tv,
      kicker: 'SİNEMATİK KALİTE',
      title: '4K Ultra HD & 60 FPS',
      desc: 'Cam gibi net ve akıcı yayın deneyimi.',
    },
    {
      id: 'channels',
      icon: Sparkles,
      kicker: 'ZENGİN ARŞİV',
      title: '10.000+ Kanal & VOD',
      desc: 'Geniş film, dizi ve belgesel kütüphanesi.',
    },
  ],
  de: [
    {
      id: 'support',
      icon: ShieldCheck,
      kicker: 'GARANTIERTER SERVICE',
      title: '24/7 Premium Support',
      desc: 'Persönliche WhatsApp- und Technikhilfe.',
      isLive: true,
    },
    {
      id: 'ssl',
      icon: Lock,
      kicker: 'SICHERE ZAHLUNG',
      title: '256-Bit SSL-Schutz',
      desc: 'Bankübliche End-to-End-Verschlüsselung.',
    },
    {
      id: 'instant',
      icon: Zap,
      kicker: 'SOFORT-LIEFERUNG',
      title: 'Sofort-Aktivierung',
      desc: 'Zugangsdaten direkt nach der Bestellung bereit.',
    },
    {
      id: 'uhd',
      icon: Tv,
      kicker: 'KINO-QUALITÄT',
      title: '4K Ultra HD & 60 FPS',
      desc: 'Kristallklares Bild und flüssige Bildrate.',
    },
    {
      id: 'channels',
      icon: Sparkles,
      kicker: 'RIESIGES ARCHIV',
      title: '10.000+ Kanäle & VOD',
      desc: 'Filme, Serien und internationale Sender.',
    },
  ],
};

function TrustBadges({ locale = 'tr', variant = 'page', className = '' }) {
  const isDe = locale === 'de';
  const badges = isDe ? BADGE_DATA.de : BADGE_DATA.tr;

  const bandClasses = cn(
    'relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#0e0e14] via-[#09090d] to-[#060608] py-10 md:py-14',
    variant === 'footer' && 'border-b-0 py-8 md:py-12',
    className
  );

  return (
    <motion.section
      className={bandClasses}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px', amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      aria-label={isDe ? 'Vertrauens- und Qualitätsmerkmale' : 'Güven ve kalite rozetleri'}
    >
      {/* Top subtle ruby border highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e50914]/40 to-transparent" aria-hidden />

      {/* Ambient center cinema glow */}
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-36 w-3/4 max-w-4xl rounded-full bg-gradient-to-b from-[#e50914]/10 via-[#b20710]/5 to-transparent blur-3xl" aria-hidden />

      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 md:gap-4 lg:gap-5">
          {badges.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] via-white/[0.015] to-transparent p-5 backdrop-blur-md transition-all duration-300 hover:border-[#e50914]/45 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(229,9,20,0.14)]"
              >
                {/* Top highlight line on card */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 group-hover:via-[#e50914]/60 to-transparent transition-all duration-300" />

                <div>
                  {/* Top Bar: Icon Container + Optional Live Indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#e50914]/20 to-[#b20710]/10 border border-[#e50914]/30 text-[#ff4b55] shadow-md shadow-[#e50914]/10 transition-transform duration-300 group-hover:scale-105 group-hover:border-[#e50914]/60 group-hover:text-white">
                      <Icon className="h-5 w-5" strokeWidth={2.2} aria-hidden />
                    </div>

                    {item.isLive && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400 tracking-wider uppercase">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Aktif
                      </span>
                    )}
                  </div>

                  {/* Kicker Tag */}
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ff4b55] mb-1.5 block">
                    {item.kicker}
                  </span>

                  {/* Main Title */}
                  <h3 className="text-sm md:text-base font-extrabold text-white tracking-tight leading-snug mb-1 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[11px] leading-relaxed text-slate-400 font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

export default memo(TrustBadges);
