import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Tv, Smartphone, Monitor, AppWindow, Tablet, MonitorPlay, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const devices = [
  {
    id: 'smart-tv',
    name: 'Smart TV',
    subtitleTr: 'Samsung • LG • Philips • TCL',
    subtitleDe: 'Samsung • LG • Philips • TCL',
    tagTr: 'Popüler TV',
    tagDe: 'Beliebter TV',
    icon: MonitorPlay,
    badgeColor: 'text-[#ff4b55]',
  },
  {
    id: 'android-tv',
    name: 'Android TV',
    subtitleTr: 'Google TV • Fire TV • Mi Box',
    subtitleDe: 'Google TV • Fire TV • Mi Box',
    tagTr: 'TV Box & Stick',
    tagDe: 'TV Box & Stick',
    icon: Tv,
    badgeColor: 'text-emerald-400',
  },
  {
    id: 'ios',
    name: 'iOS (Apple)',
    subtitleTr: 'iPhone & iPad • NEXT+ / CASTORA',
    subtitleDe: 'iPhone & iPad • NEXT+ / CASTORA',
    tagTr: 'Apple Ekosistem',
    tagDe: 'Apple iOS',
    icon: Smartphone,
    badgeColor: 'text-blue-400',
  },
  {
    id: 'android-phone',
    name: 'Android Mobil',
    subtitleTr: 'Samsung • Xiaomi • Oppo (XCIPTV)',
    subtitleDe: 'Samsung • Xiaomi • Oppo (XCIPTV)',
    tagTr: 'Akıllı Telefon',
    tagDe: 'Smartphone',
    icon: Smartphone,
    badgeColor: 'text-amber-400',
  },
  {
    id: 'windows',
    name: 'Windows PC',
    subtitleTr: 'Windows 10 / 11 (IBO Player • VLC)',
    subtitleDe: 'Windows 10 / 11 (IBO Player • VLC)',
    tagTr: 'Bilgisayar',
    tagDe: 'PC & Laptop',
    icon: Monitor,
    badgeColor: 'text-cyan-400',
  },
  {
    id: 'mac',
    name: 'Mac',
    subtitleTr: 'macOS M1-M4 & Intel (CASTORA)',
    subtitleDe: 'macOS M1-M4 & Intel (CASTORA)',
    tagTr: 'Apple Silicon',
    tagDe: 'macOS App',
    icon: AppWindow,
    badgeColor: 'text-purple-400',
  },
  {
    id: 'tablet',
    name: 'Tablet',
    subtitleTr: 'iPadOS & Android Tablet Ekranı',
    subtitleDe: 'iPadOS & Android Tablet Display',
    tagTr: 'Geniş Ekran',
    tagDe: 'Tablet',
    icon: Tablet,
    badgeColor: 'text-rose-400',
  },
];

const DeviceSelectionSection = ({ selectedDevice, onSelect, asLinks = false }) => {
  const location = useLocation();
  const isDe = location.pathname.includes('/de');
  const basePath = isDe ? '/de/einrichtung' : '/kurulum';

  return (
    <section className="w-full py-8 md:py-12 px-2 sm:px-4">
      <div className="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 border border-primary/25 text-[#ff4d58] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          {isDe ? 'GERÄTEAUSWAHL' : 'CİHAZINIZI SEÇİN'}
        </span>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
          {isDe ? 'Wählen Sie Ihr Gerät für das Setup' : 'Kurulum Yapacağınız Cihazı Seçin'}
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {isDe
            ? 'Klicken Sie auf Ihr Gerät, um die Schritt-für-Schritt-Anleitung mit M3U-Link oder Xtream-Codes anzuzeigen.'
            : 'Adım adım resimli talimatlar ve önerilen IPTV uygulamaları için izlemek istediğiniz cihazı seçin.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 sm:gap-4">
        {devices.map((device) => {
          const Icon = device.icon;
          const isSelected = selectedDevice === device.id;
          const tag = isDe ? device.tagDe : device.tagTr;
          const subtitle = isDe ? device.subtitleDe : device.subtitleTr;

          const cardContent = (
            <div
              className={cn(
                'relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 h-full min-h-[175px] group text-left overflow-hidden',
                isSelected
                  ? 'bg-gradient-to-b from-[#1c1214]/95 to-[#0e090b]/98 border-[#e50914] shadow-[0_0_30px_rgba(229,9,20,0.3)] ring-1 ring-[#e50914]/50'
                  : 'bg-gradient-to-b from-[#131318]/90 via-[#0d0d12]/90 to-[#07070a]/95 border-white/10 hover:border-primary/50 hover:shadow-[0_0_25px_rgba(229,9,20,0.18)]'
              )}
            >
              {/* Subtle top edge glow on hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/70 transition-all duration-500" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/40 group-hover:bg-primary/10 transition-colors">
                    <Icon className={cn('w-5 h-5 transition-transform duration-300 group-hover:scale-110', device.badgeColor)} />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-400 group-hover:text-slate-200">
                    {tag}
                  </span>
                </div>

                <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-[#ff4b55] transition-colors mb-1">
                  {device.name}
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {subtitle}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400 group-hover:text-white transition-colors">
                  {isDe ? 'Anleitung' : 'Rehberi Gör'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#ff4b55] group-hover:translate-x-1 transition-all duration-300" />
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </div>
          );

          if (asLinks) {
            return (
              <Link key={device.id} to={`${basePath}/${device.id}`} className="block h-full">
                <motion.div
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full"
                >
                  {cardContent}
                </motion.div>
              </Link>
            );
          }

          return (
            <motion.button
              key={device.id}
              type="button"
              onClick={() => onSelect(device.id)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="h-full text-left"
            >
              {cardContent}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

export default DeviceSelectionSection;
