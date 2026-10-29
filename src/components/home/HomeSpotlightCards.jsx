import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Trophy, ChevronRight, ShieldCheck, Activity } from 'lucide-react';

const HIGHLIGHT_LEAGUES = [
  { name: 'Trendyol Süper Lig', code: 'TR-1', flag: '🇹🇷', tag: 'Canlı Saatler' },
  { name: 'UEFA Şampiyonlar Ligi', code: 'UCL', flag: '🇪🇺', tag: 'Haftanın Maçları' },
  { name: 'Premier League', code: 'ENG', flag: '🇬🇧', tag: 'Prime Time' },
  { name: 'Turkish Airlines EuroLeague', code: 'BASKET', flag: '🏀', tag: 'Basketbol' }
];

const HomeSpotlightCards = () => (
  <section className="py-14 md:py-20" aria-labelledby="live-sports-heading">
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#121217] via-[#0b0b0e] to-[#070709] px-6 py-10 md:px-12 md:py-14 shadow-[0_24px_80px_rgba(0,0,0,0.85)]">
        {/* Subtle background ambient lighting */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-16 h-80 w-80 rounded-full bg-gradient-to-br from-primary/20 via-amber-500/10 to-transparent blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-500/10 via-primary/5 to-transparent blur-3xl"
        />

        <div className="relative grid md:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Info (7 cols) */}
          <div className="md:col-span-7 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-slate-200 mb-6 backdrop-blur-md">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>2026 CANLI FİKSTÜR REHBERİ</span>
            </div>

            <h2
              id="live-sports-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight"
            >
              Haftanın Karşılaşmaları{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
                Tek Ekranda
              </span>
            </h2>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto md:mx-0 font-light">
              Süper Lig, Avrupa kupaları ve EuroLeague basketbol fikstürü her gün güncellenir. Başlama saatlerini ve karşılaşma takvimini önceden öğrenip ekran başına hazırlıklı geçin.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 justify-center md:justify-start">
              <Link
                to="/mac-programi"
                title="Güncel maç programını ve başlama saatlerini inceleyin"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#f40612] hover:to-[#c30813] px-7 py-3.5 font-bold text-white transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 group"
              >
                <span>Güncel Maç Programı</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden />
              </Link>
              <Link
                to="/test"
                title="Ücretsiz yayın testini başlatın"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/15 px-6 py-3.5 font-semibold text-white hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-sm"
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Ücretsiz Test Et</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Artisan League Console Card (5 cols) */}
          <div className="md:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 md:p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Aktif Turnuva Takvimi</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Otomatik Senkron
                </span>
              </div>

              <div className="space-y-2.5">
                {HIGHLIGHT_LEAGUES.map((league, idx) => (
                  <Link
                    key={idx}
                    to="/mac-programi"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl" aria-hidden>{league.flag}</span>
                      <div>
                        <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                          {league.name}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {league.code} · {league.tag}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" /> 14 Günlük İleri Takvim
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Resmi Fikstür
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Editorial Strip */}
        <div className="relative mt-10 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 text-center md:text-left">
            <div>
              <p className="text-base font-bold text-white">Yurt Dışında Kesintisiz Televizyon Deneyimi</p>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed mt-0.5">
                Avrupa genelinde Türk kanallarını, açık yayınları ve spor fikstürünü yüksek bitrate ile takip edin.
              </p>
            </div>
            <div className="flex justify-center md:justify-end gap-3 text-xs text-slate-300">
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">Süper Lig</span>
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">EuroLeague</span>
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">Ulusal Kanallar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default memo(HomeSpotlightCards);
