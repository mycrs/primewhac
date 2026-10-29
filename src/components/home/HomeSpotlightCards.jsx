import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Goal, Film, Tv } from 'lucide-react';

const CONFETTI = [
  { left: '12%', color: 'bg-amber-300', delay: '0s' },
  { left: '28%', color: 'bg-primary', delay: '0.8s' },
  { left: '46%', color: 'bg-emerald-300', delay: '1.6s' },
  { left: '64%', color: 'bg-amber-400', delay: '0.4s' },
  { left: '82%', color: 'bg-sky-300', delay: '1.2s' },
];

const FOLLOW = [
  { to: '/channels', icon: Goal, label: 'Spor' },
  { to: '/channels', icon: Film, label: 'Film & Dizi' },
  { to: '/channels', icon: Tv, label: 'Canlı TV' },
];

const HomeSpotlightCards = () => (
  <section className="py-14 md:py-20" aria-labelledby="live-sports-heading">
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="relative overflow-hidden rounded-3xl luxury-glass border border-white/10 px-6 py-10 md:px-12 md:py-14">
        {/* arka plan parlaması */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-gradient-to-br from-amber-400/25 via-primary/15 to-transparent blur-3xl wc-glow"
        />
        {/* ışık süzülmesi */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent wc-sheen" />
        </div>
        {/* konfeti */}
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            aria-hidden
            className={`pointer-events-none absolute top-0 h-2 w-2 rounded-[2px] ${c.color} wc-confetti`}
            style={{ left: c.left, animationDelay: c.delay }}
          />
        ))}

        <div className="relative grid md:grid-cols-2 gap-10 items-center">
          {/* SOL: metin */}
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-bold tracking-wide text-white mb-5">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              CANLI
            </span>

            <h2
              id="live-sports-heading"
              className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4"
            >
              Günlük Fikstür Rehberi{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                Her Gün Güncel
              </span>
            </h2>

            <p className="text-slate-300 leading-relaxed mb-7 max-w-md mx-auto md:mx-0">
              Günün karşılaşmalarını ve başlama saatlerini tek ekranda inceleyin.
              Fikstür bilgileri düzenli olarak güncellenir.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                to="/mac-programi"
                title="Güncel maç programını ve başlama saatlerini inceleyin"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3 font-bold text-black hover:from-amber-300 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20"
              >
                Güncel maç programı
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                to="/test"
                title="Ücretsiz IPTV testini başlatın"
                className="inline-flex items-center justify-center rounded-xl bg-white/5 border border-white/15 px-6 py-3 font-semibold text-white hover:border-white/40 transition-all"
              >
                Ücretsiz dene
              </Link>
            </div>
          </div>

          {/* SAĞ: dönen futbol topu */}
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div
                aria-hidden
                className="absolute inset-0 rounded-full bg-amber-400/20 blur-2xl wc-glow"
              />
              {/* zemin gölgesi */}
              <div
                aria-hidden
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-3 w-28 md:w-36 rounded-[50%] bg-black/50 blur-md"
              />
              <div className="wc-float">
                <svg
                  viewBox="0 0 100 100"
                  role="img"
                  aria-label="Futbol topu"
                  className="wc-spin h-32 w-32 md:h-44 md:w-44 drop-shadow-[0_12px_30px_rgba(0,0,0,0.55)]"
                >
                  <circle cx="50" cy="50" r="46" fill="#fafafa" stroke="#111827" strokeWidth="1.5" />
                  <polygon points="50,33 66,45 60,64 40,64 34,45" fill="#111827" />
                  <g stroke="#111827" strokeWidth="3" strokeLinecap="round">
                    <line x1="50" y1="33" x2="50" y2="9" />
                    <line x1="66" y1="45" x2="86" y2="34" />
                    <line x1="60" y1="64" x2="74" y2="83" />
                    <line x1="40" y1="64" x2="26" y2="83" />
                    <line x1="34" y1="45" x2="14" y2="34" />
                  </g>
                  <g fill="#111827">
                    <circle cx="50" cy="8" r="4.5" />
                    <circle cx="87" cy="33" r="4.5" />
                    <circle cx="75" cy="84" r="4.5" />
                    <circle cx="25" cy="84" r="4.5" />
                    <circle cx="13" cy="33" r="4.5" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* alt şerit: yurt dışından spor + film & dizi */}
        <div className="relative mt-10 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="text-center md:text-left">
              <p className="text-lg font-bold text-white mb-1">Yalnızca futbol değil</p>
              <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                Gurbette spor karşılaşmalarını, vizyondaki filmleri ve yeni dizileri tek abonelikle takip et.
              </p>
            </div>
            <nav className="flex justify-center gap-2.5" aria-label="İçerik kategorileri">
              {FOLLOW.map(({ to, icon: Icon, label }) => (
                <Link
                  key={label}
                  to={to}
                  title={`${label} IPTV içeriklerini inceleyin`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-sm text-slate-200 hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HomeSpotlightCards;
