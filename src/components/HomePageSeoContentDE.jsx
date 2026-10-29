import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Tv, Zap, Shield, Laptop, CheckCircle2, ArrowRight, Cpu } from 'lucide-react';
import { useTestModal } from '@/contexts/TestModalContext';

const HomePageSeoContentDE = ({ siteData }) => {
  const { openTestModal } = useTestModal();

  return (
    <div className="container mx-auto px-4 py-16 text-slate-300 leading-relaxed max-w-6xl">
      <article className="space-y-16">
        
        {/* Editorial Heading */}
        <header className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Cpu className="w-3.5 h-3.5 text-primary" />
            <span>Streaming-Leitfaden & Infrastruktur</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Türkische Sender in Deutschland und{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] via-[#f40612] to-amber-500">
              Moderne Übertragungsstandards
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
            Für Familien in Deutschland, Österreich und der Schweiz ist der verlässliche Empfang heimatlicher Sender ein wichtiges Stück Lebensqualität. QruzeTV verbindet diese Nähe mit europäischer Serverarchitektur und moderner Streaming-Technik.
          </p>
        </header>

        {/* Section 1: Streaming-Stabilität & Bitrate */}
        <section className="bg-gradient-to-b from-[#141418] via-[#0d0d10] to-[#08080a] p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Zap className="w-7 h-7 text-primary shrink-0" />
              <span>Warum puffern Streams und wie verhindern wir das?</span>
            </h3>
            
            <p className="text-slate-300 text-base md:text-lg mb-6 leading-relaxed font-light">
              Flüssige Live-Übertragungen hängen nicht nur von der Download-Geschwindigkeit Ihres DSL- oder Glasfaseranschlusses ab, sondern vor allem vom direkten Peering an zentralen europäischen Internet-Knotenpunkten wie dem DE-CIX in Frankfurt am Main.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-black/40 p-6 rounded-2xl border border-white/10">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Direktes Peering zu deutschen ISPs
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-light mb-4">
                  Optimierte Routen zu Telekom Deutschland, Vodafone, 1&amp;1 und O2 umgehen überlastete Zwischenknoten und minimieren Latenzzeiten während stark frequentierter Abendstunden.
                </p>
                <div className="text-xs text-emerald-400 font-mono">✓ Hohe Bandbreiten-Stabilität</div>
              </div>

              <div className="bg-black/40 p-6 rounded-2xl border border-white/10">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  H.265 / HEVC Kodierung
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-light mb-4">
                  Doppelte Effizienz im Vergleich zum älteren H.264-Standard. Auch über WLAN erhalten Sie bei schnellen Sportbewegungen scharfe Konturen ohne Artefaktbildung.
                </p>
                <div className="text-xs text-amber-300 font-mono">✓ Echte 60 FPS Bildrate</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
              <span className="text-sm text-slate-400">
                Testen Sie die Stabilität auf Ihren eigenen Geräten unverbindlich und kostenfrei.
              </span>
              <button
                type="button"
                onClick={openTestModal}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-white transition-colors"
              >
                <span>Kostenlosen Test anfordern</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Section 2: Geräte-Kompatibilität */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Laptop className="w-7 h-7 text-primary" />
              <span>Auf welchen Geräten lässt sich QruzeTV nutzen?</span>
            </h3>
            <p className="text-slate-400 text-base font-light">
              Dank Unterstützung von M3U Plus und Xtream Codes API sind Sie nicht an proprietäre Boxen gebunden.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-[#0e0e12] p-6 hover:border-primary/40 transition-all">
              <h4 className="text-lg font-bold text-white mb-2">Smart TV (Samsung & LG)</h4>
              <p className="text-sm text-slate-300 mb-4 font-light leading-relaxed">
                Nutzbar mit gängigen Apps wie IBO Player, Smart IPTV oder Nanomid ohne zusätzliche Receiver-Hardware direkt über die TV-Fernbedienung.
              </p>
              <Link to="/de/setup/smart-tv" className="text-xs font-semibold text-primary hover:underline">
                Smart TV Anleitung →
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0e0e12] p-6 hover:border-primary/40 transition-all">
              <h4 className="text-lg font-bold text-white mb-2">Fire TV & Android TV</h4>
              <p className="text-sm text-slate-300 mb-4 font-light leading-relaxed">
                TiviMate, IPTV Smarters Pro oder XCIPTV bieten übersichtliche Senderfavoriten, EPG-Programmvorschau und schnelle Umschaltzeiten.
              </p>
              <Link to="/de/setup" className="text-xs font-semibold text-primary hover:underline">
                Fire TV & Android Anleitung →
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0e0e12] p-6 hover:border-primary/40 transition-all">
              <h4 className="text-lg font-bold text-white mb-2">Apple TV & Mobilgeräte</h4>
              <p className="text-sm text-slate-300 mb-4 font-light leading-relaxed">
                GSE Smart IPTV oder IPTVX bieten im Apple-Ökosystem flüssige 4K-Wiedergabe und vollständige AirPlay-Kompatibilität.
              </p>
              <Link to="/de/setup/apple-tv" className="text-xs font-semibold text-primary hover:underline">
                Apple TV Anleitung →
              </Link>
            </div>
          </div>
        </section>

        {/* Section 3: Datenschutz & Transparenz */}
        <section className="bg-gradient-to-br from-[#121217] via-[#09090b] to-black p-8 md:p-12 rounded-3xl border border-white/10">
          <div className="max-w-4xl mx-auto space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="w-7 h-7 text-emerald-400" />
              <span>Transparenz, Datenschutz und keine Vertragsfalle</span>
            </h3>
            
            <p className="text-slate-300 leading-relaxed font-light text-base md:text-lg">
              Bei QruzeTV gibt es keine automatischen monatlichen Abbuchungen oder versteckten Klauseln. Sie zahlen ausschließlich die gewählte Laufzeit im Voraus.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">Keine Abo-Verlängerung</p>
                  <p className="text-xs text-slate-400 mt-1">Nach Ablauf der gebuchten Monate endet der Zugang automatisch. Keine Kündigungsschreiben erforderlich.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">Persönlicher Kundensupport</p>
                  <p className="text-xs text-slate-400 mt-1">Echte Mitarbeiter unterstützen Sie bei der Ersteinrichtung auf Deutsch und Türkisch direkt per WhatsApp.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">
                Haben Sie Fragen zur Kompatibilität Ihres Fernsehers? Schreiben Sie unserem Support-Team.
              </p>
              <Link
                to="/de/kontakt"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all border border-white/15"
              >
                <span>Kontakt aufnehmen</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </article>
    </div>
  );
};

export default memo(HomePageSeoContentDE);
