import React from 'react';

/**
 * Maç detay sayfası – sol ve sağ kenar futbol dekorasyonu.
 * Sadece xl (≥1280px) ekranlarda görünür.
 *
 * İçerik:
 *  - Dikey çim şeridi (gradient)
 *  - Çizgi desen (saha çizgileri)
 *  - Kale direği SVG
 *  - Fiziksel top animasyonu (düşer, zıplar, döner)
 *  - Yıldız parıltıları
 */
export default function MatchDetailSideDecor() {
  return (
    <>
      <style>{`
        /* ── Top: düşer ve gerçekçi zıplar ── */
        @keyframes ball-drop {
          0%   { top: -60px; transform: rotate(0deg)   scale(1);    opacity: 0; }
          5%   { opacity: 1; }
          30%  { top: 62%;  transform: rotate(360deg)  scale(1);    opacity: 1; }
          38%  { top: 64%;  transform: rotate(400deg)  scale(0.9, 1.1); }
          46%  { top: 40%;  transform: rotate(500deg)  scale(1.05, 0.95); }
          54%  { top: 63%;  transform: rotate(560deg)  scale(0.92, 1.08); }
          60%  { top: 52%;  transform: rotate(600deg)  scale(1); }
          66%  { top: 63%;  transform: rotate(630deg)  scale(0.95, 1.05); }
          72%  { top: 57%;  transform: rotate(650deg)  scale(1); }
          76%  { top: 63%;  transform: rotate(670deg)  scale(0.97, 1.03); }
          80%  { top: 60%;  transform: rotate(680deg)  scale(1); }
          84%  { top: 63%;  transform: rotate(690deg)  scale(1); }
          88%  { opacity: 1; }
          100% { top: 63%;  transform: rotate(720deg)  scale(1);    opacity: 0; }
        }
        @keyframes ball-drop-r {
          0%   { top: 110%; transform: rotate(0deg)   scale(1);    opacity: 0; }
          5%   { opacity: 1; }
          30%  { top: 30%;  transform: rotate(-360deg) scale(1);    opacity: 1; }
          38%  { top: 28%;  transform: rotate(-400deg) scale(0.9, 1.1); }
          46%  { top: 55%;  transform: rotate(-500deg) scale(1.05, 0.95); }
          54%  { top: 29%;  transform: rotate(-560deg) scale(0.92, 1.08); }
          60%  { top: 42%;  transform: rotate(-600deg) scale(1); }
          66%  { top: 29%;  transform: rotate(-630deg) scale(0.95, 1.05); }
          72%  { top: 36%;  transform: rotate(-650deg) scale(1); }
          76%  { top: 29%;  transform: rotate(-670deg) scale(0.97, 1.03); }
          80%  { top: 33%;  transform: rotate(-680deg) scale(1); }
          84%  { top: 29%;  transform: rotate(-690deg) scale(1); }
          88%  { opacity: 1; }
          100% { top: -60px; transform: rotate(-720deg) scale(1);   opacity: 0; }
        }

        /* ── Çim dalgalanması ── */
        @keyframes grass-sway {
          0%, 100% { transform: skewX(0deg); }
          50%       { transform: skewX(3deg); }
        }

        /* ── Yıldız parıldama ── */
        @keyframes star-twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50%       { opacity: 1; transform: scale(1.2); }
        }

        /* ── Kale titreşimi ── */
        @keyframes goal-pulse {
          0%, 100% { filter: drop-shadow(0 0 0px #e50914); }
          50%       { filter: drop-shadow(0 0 8px #e50914) drop-shadow(0 0 16px #e50914); }
        }

        /* ── Saha çizgisi sweep ── */
        @keyframes line-sweep {
          0%   { opacity: 0.1; transform: scaleY(0.8); }
          50%  { opacity: 0.35; transform: scaleY(1); }
          100% { opacity: 0.1; transform: scaleY(0.8); }
        }
      `}</style>

      {/* ═══════════════ SOL PANEL ═══════════════ */}
      <aside
        aria-hidden
        className="hidden xl:flex fixed left-0 top-0 bottom-0 w-[72px] flex-col pointer-events-none z-0 overflow-hidden select-none"
      >
        {/* Arka plan: çim gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #0a0a1a 0%, #0d1f0d 40%, #0a1a0a 70%, #080d08 100%)',
            opacity: 0.85,
          }}
        />

        {/* Dikey çizgiler: saha çizgi efekti */}
        {[12, 32, 52].map((x, i) => (
          <div
            key={`lline-${i}`}
            className="absolute top-0 bottom-0 w-px bg-green-400/20"
            style={{
              left: x,
              animation: `line-sweep ${4 + i}s ease-in-out infinite`,
              animationDelay: `${i * 1.3}s`,
            }}
          />
        ))}

        {/* Yatay çizgiler: saha doku */}
        {[20, 35, 50, 65, 80].map((pct, i) => (
          <div
            key={`hlline-${i}`}
            className="absolute left-0 right-0 h-px bg-green-400/10"
            style={{ top: `${pct}%` }}
          />
        ))}

        {/* Çim şeritleri (alt kısım) */}
        {[8, 20, 32, 44, 56, 68].map((x, i) => (
          <div
            key={`grass-${i}`}
            className="absolute bottom-0 w-2 bg-green-500/40 rounded-t-full origin-bottom"
            style={{
              left: x,
              height: 18 + (i % 3) * 6,
              animation: `grass-sway ${2.5 + (i % 3) * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}

        {/* Kale direği SVG – üst */}
        <svg
          viewBox="0 0 72 90"
          className="absolute top-20 left-0 w-full"
          style={{ animation: 'goal-pulse 3s ease-in-out infinite' }}
        >
          {/* Ağ dokusu */}
          {[0, 10, 20, 30, 40].map((y) => (
            <line key={`gnh-${y}`} x1="8" y1={35 + y} x2="64" y2={35 + y} stroke="#4ade80" strokeWidth="0.6" strokeOpacity="0.25" />
          ))}
          {[8, 18, 28, 38, 48, 58].map((x) => (
            <line key={`gnv-${x}`} x1={x} y1="35" x2={x} y2="75" stroke="#4ade80" strokeWidth="0.6" strokeOpacity="0.25" />
          ))}
          {/* Çerçeve */}
          <polyline
            points="8,30 8,75 64,75 64,30"
            fill="none"
            stroke="#e50914"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Üst bar */}
          <line x1="8" y1="30" x2="64" y2="30" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />
        </svg>

        {/* Yıldızlar */}
        {[
          { x: 15, top: '18%', dur: 2.1 },
          { x: 50, top: '42%', dur: 1.7 },
          { x: 28, top: '55%', dur: 2.8 },
          { x: 58, top: '30%', dur: 1.4 },
        ].map((s, i) => (
          <span
            key={`lstar-${i}`}
            className="absolute text-xs"
            style={{
              left: s.x,
              top: s.top,
              animation: `star-twinkle ${s.dur}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
              color: i % 2 === 0 ? '#fbbf24' : '#a78bfa',
            }}
          >
            ✦
          </span>
        ))}

        {/* Futbol topu – yukarıdan düşer, zıplar */}
        <span
          className="absolute text-3xl"
          style={{
            left: 18,
            animation: 'ball-drop 7s ease-in-out infinite',
            animationDelay: '1s',
            willChange: 'top, transform',
          }}
        >
          ⚽
        </span>
      </aside>

      {/* ═══════════════ SAĞ PANEL ═══════════════ */}
      <aside
        aria-hidden
        className="hidden xl:flex fixed right-0 top-0 bottom-0 w-[72px] flex-col pointer-events-none z-0 overflow-hidden select-none"
      >
        {/* Arka plan */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #0a0a1a 0%, #1f0d0d 40%, #1a0a0a 70%, #0d0808 100%)',
            opacity: 0.85,
          }}
        />

        {/* Dikey çizgiler */}
        {[12, 32, 52].map((x, i) => (
          <div
            key={`rline-${i}`}
            className="absolute top-0 bottom-0 w-px bg-red-400/20"
            style={{
              left: x,
              animation: `line-sweep ${4.5 + i}s ease-in-out infinite`,
              animationDelay: `${i * 1.1 + 0.5}s`,
            }}
          />
        ))}

        {/* Yatay çizgiler */}
        {[20, 35, 50, 65, 80].map((pct, i) => (
          <div
            key={`rhlline-${i}`}
            className="absolute left-0 right-0 h-px bg-red-400/10"
            style={{ top: `${pct}%` }}
          />
        ))}

        {/* Çim şeritleri */}
        {[8, 20, 32, 44, 56, 68].map((x, i) => (
          <div
            key={`rgrass-${i}`}
            className="absolute bottom-0 w-2 bg-green-400/35 rounded-t-full origin-bottom"
            style={{
              left: x,
              height: 16 + (i % 3) * 7,
              animation: `grass-sway ${2.8 + (i % 3) * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.25 + 0.4}s`,
            }}
          />
        ))}

        {/* Kale – aşağıdan */}
        <svg
          viewBox="0 0 72 90"
          className="absolute bottom-20 left-0 w-full"
          style={{
            transform: 'scaleY(-1)',
            animation: 'goal-pulse 3.5s ease-in-out infinite',
            animationDelay: '1s',
          }}
        >
          {[0, 10, 20, 30, 40].map((y) => (
            <line key={`rgnh-${y}`} x1="8" y1={35 + y} x2="64" y2={35 + y} stroke="#f87171" strokeWidth="0.6" strokeOpacity="0.25" />
          ))}
          {[8, 18, 28, 38, 48, 58].map((x) => (
            <line key={`rgnv-${x}`} x1={x} y1="35" x2={x} y2="75" stroke="#f87171" strokeWidth="0.6" strokeOpacity="0.25" />
          ))}
          <polyline
            points="8,30 8,75 64,75 64,30"
            fill="none"
            stroke="#f87171"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="8" y1="30" x2="64" y2="30" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" />
        </svg>

        {/* Yıldızlar */}
        {[
          { x: 10, top: '25%', dur: 2.3 },
          { x: 45, top: '48%', dur: 1.9 },
          { x: 60, top: '15%', dur: 2.5 },
          { x: 25, top: '62%', dur: 1.6 },
        ].map((s, i) => (
          <span
            key={`rstar-${i}`}
            className="absolute text-xs"
            style={{
              left: s.x,
              top: s.top,
              animation: `star-twinkle ${s.dur}s ease-in-out infinite`,
              animationDelay: `${i * 0.6 + 0.3}s`,
              color: i % 2 === 0 ? '#fb923c' : '#818cf8',
            }}
          >
            ✦
          </span>
        ))}

        {/* Top – aşağıdan yukarı, zıplar */}
        <span
          className="absolute text-3xl"
          style={{
            left: 18,
            animation: 'ball-drop-r 8s ease-in-out infinite',
            animationDelay: '2.5s',
            willChange: 'top, transform',
          }}
        >
          ⚽
        </span>
      </aside>
    </>
  );
}
