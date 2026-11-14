import React, { useState } from 'react';
import {
  MonitorPlay,
  Tv,
  Globe,
  Radio,
  Sliders,
  Check,
  Shield,
  Layers,
  Sparkles,
  Play,
  Wifi,
  Key,
  Film,
  Calendar,
  Grid,
  RefreshCw,
  ExternalLink,
  Smartphone,
  Flame,
  Volume2,
  Subtitles,
  Apple,
} from 'lucide-react';

export default function AppUiMockup({ guide }) {
  const [activeTab, setActiveTab] = useState(guide.loginType === 'web-portal' ? 'tv' : 'login');

  if (!guide) return null;

  const isWebPortal = guide.loginType === 'web-portal';

  return (
    <figure className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d0e14] p-3 shadow-2xl transition-all sm:p-5">
      {/* Tab Switcher Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
          <MonitorPlay className="h-4 w-4" style={{ color: guide.accent }} />
          <span>CANLI KURULUM SİMÜLASYONU</span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.04] p-1 text-xs">
          {isWebPortal ? (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('tv')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition ${
                  activeTab === 'tv'
                    ? 'bg-white/15 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Tv className="h-3.5 w-3.5" style={{ color: guide.accent }} />
                <span>1. TV Ekranı (MAC & Key)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('web')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition ${
                  activeTab === 'web'
                    ? 'bg-white/15 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="h-3.5 w-3.5" style={{ color: guide.accent }} />
                <span>2. Web Paneli (Yükleme)</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition ${
                  activeTab === 'login'
                    ? 'bg-white/15 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Key className="h-3.5 w-3.5" style={{ color: guide.accent }} />
                <span>1. Giriş Formu (Xtream)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('app')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition ${
                  activeTab === 'app'
                    ? 'bg-white/15 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="h-3.5 w-3.5" style={{ color: guide.accent }} />
                <span>2. Ana Arayüz (Dashboard)</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Screen Body based on slug & activeTab */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#07080c]">
        {guide.slug === 'iptv-smarters-pro' && (
          <SmartersPreview activeTab={activeTab} accent={guide.accent} />
        )}
        {guide.slug === 'tivimate' && (
          <TiviMatePreview activeTab={activeTab} accent={guide.accent} />
        )}
        {guide.slug === 'xciptv' && (
          <XciptvPreview activeTab={activeTab} accent={guide.accent} />
        )}
        {guide.slug === 'ibo-player' && (
          <IboPreview activeTab={activeTab} accent={guide.accent} portalUrl={guide.portalUrl} />
        )}
        {guide.slug === 'smart-iptv' && (
          <SmartIptvPreview activeTab={activeTab} accent={guide.accent} portalUrl={guide.portalUrl} />
        )}
        {guide.slug === 'smartone-iptv' && (
          <SmartOnePreview activeTab={activeTab} accent={guide.accent} portalUrl={guide.portalUrl} />
        )}
        {guide.slug === '0-player' && (
          <ZeroPlayerPreview activeTab={activeTab} accent={guide.accent} portalUrl={guide.portalUrl} />
        )}
        {guide.slug === 'hotplayer' && (
          <HotPlayerPreview activeTab={activeTab} accent={guide.accent} portalUrl={guide.portalUrl} />
        )}
        {guide.slug === 'televizo' && (
          <TelevizoPreview activeTab={activeTab} accent={guide.accent} />
        )}
        {guide.slug === 'iptvx' && (
          <IptvxPreview activeTab={activeTab} accent={guide.accent} />
        )}
      </div>

      {/* Caption footer */}
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span>
          {isWebPortal
            ? activeTab === 'tv'
              ? 'TV ekranında çıkan MAC & Key ile web panelinden eşleştirilir.'
              : `Resmî ${guide.portalName || 'web paneli'} üzerinden liste kaydedilir.`
            : activeTab === 'login'
            ? 'Doğrudan cihaz ekranından Xtream Codes sunucu bilgileri girilir.'
            : `${guide.name} ana kumanda menüsü ve yayın görünümü.`}
        </span>
        <span className="font-semibold text-slate-400">
          {guide.method}
        </span>
      </figcaption>
    </figure>
  );
}

// ----------------------------------------------------------------------
// 1. IPTV Smarters Pro Simulation (Iconic Purple & 3-Cards Dashboard)
// ----------------------------------------------------------------------
function SmartersPreview({ activeTab, accent }) {
  if (activeTab === 'login') {
    return (
      <div className="relative bg-gradient-to-br from-[#1a1033] via-[#0f0921] to-[#070412] p-5 text-white sm:p-7">
        <div className="mx-auto max-w-md rounded-2xl border border-purple-500/25 bg-[#140c29]/90 p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 font-black text-xs text-white">
                SP
              </div>
              <span className="font-bold tracking-tight text-purple-200">Login with Xtream Codes API</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Xtream</span>
          </div>

          <div className="mt-4 space-y-2.5 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-purple-300">Any Name (Liste Adı)</label>
              <div className="mt-1 rounded-lg border border-purple-500/30 bg-[#090417] px-3 py-2 font-mono text-purple-100">
                QruzeTV Premium
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-purple-300">Username (Kullanıcı Adı)</label>
              <div className="mt-1 rounded-lg border border-purple-500/30 bg-[#090417] px-3 py-2 font-mono text-purple-100">
                qruze_kullanici
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-purple-300">Password (Şifre)</label>
              <div className="mt-1 rounded-lg border border-purple-500/30 bg-[#090417] px-3 py-2 font-mono tracking-widest text-purple-100">
                ••••••••••••
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-purple-300">Server URL:Port (Sunucu Adresi)</label>
              <div className="mt-1 rounded-lg border border-purple-500/30 bg-[#090417] px-3 py-2 font-mono text-emerald-300">
                http://sunucu-adresi.xyz:8080
              </div>
              <span className="mt-1 block text-[10px] text-purple-400">Sonunda eğik çizgi (/) bırakmayın</span>
            </div>
          </div>

          <button
            type="button"
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-2.5 text-center text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-purple-600/30 hover:brightness-110"
          >
            ADD USER (Kullanıcı Ekle)
          </button>
        </div>
      </div>
    );
  }

  // Dashboard view (Iconic 3 big cards)
  return (
    <div className="relative bg-gradient-to-br from-[#120a26] via-[#090517] to-[#04020a] p-4 text-white sm:p-6">
      <div className="flex items-center justify-between border-b border-purple-500/20 pb-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-600 font-black text-[10px] text-white">
            SP
          </div>
          <span className="font-bold text-purple-100">IPTV SMARTERS PRO</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span>Profil: <strong className="text-purple-300">QruzeTV</strong></span>
          <span className="hidden sm:inline">20:30</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="group rounded-2xl border border-pink-500/30 bg-gradient-to-br from-pink-600/30 to-purple-800/40 p-4 transition hover:border-pink-400">
          <div className="flex items-center justify-between">
            <Radio className="h-6 w-6 text-pink-400" />
            <span className="rounded bg-pink-500/20 px-1.5 py-0.5 text-[9px] font-bold text-pink-300">CANLI</span>
          </div>
          <h4 className="mt-4 text-lg font-black tracking-tight text-white">LIVE TV</h4>
          <p className="mt-1 text-[11px] text-pink-200/80">Canlı Kanallar & EPG Akışı</p>
        </div>

        <div className="group rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-600/30 to-indigo-900/40 p-4 transition hover:border-purple-400">
          <div className="flex items-center justify-between">
            <Film className="h-6 w-6 text-purple-300" />
            <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-bold text-purple-300">4K VOD</span>
          </div>
          <h4 className="mt-4 text-lg font-black tracking-tight text-white">MOVIES</h4>
          <p className="mt-1 text-[11px] text-purple-200/80">Sinema Kulübü & Afişler</p>
        </div>

        <div className="group rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-600/30 to-blue-900/40 p-4 transition hover:border-cyan-400">
          <div className="flex items-center justify-between">
            <Layers className="h-6 w-6 text-cyan-300" />
            <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-bold text-cyan-300">DİZİLER</span>
          </div>
          <h4 className="mt-4 text-lg font-black tracking-tight text-white">SERIES</h4>
          <p className="mt-1 text-[11px] text-cyan-200/80">Sezonlar & Bölümler</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-purple-500/15 pt-3 text-[11px] text-purple-300/80">
        <div className="flex items-center gap-3">
          <span>✓ INSTALL EPG</span>
          <span>✓ MULTI-SCREEN (4 Ekran)</span>
          <span>✓ RECORDINGS</span>
        </div>
        <span className="font-mono text-purple-400">Stream: HLS / MPEGTS</span>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. TiviMate Simulation (Iconic Satellite Set-Top Box EPG Grid)
// ----------------------------------------------------------------------
function TiviMatePreview({ activeTab, accent }) {
  return (
    <div className="bg-[#0b0e14] p-4 text-white sm:p-5">
      {/* Top mini-bar with current time and group */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-blue-600/20 px-2 py-1 font-mono text-xs font-black text-blue-400">TiviMate</span>
          <span className="text-xs font-bold text-slate-300">Tüm Kanallar · Spor</span>
        </div>
        {/* Simulated mini live video player */}
        <div className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-black/60 px-3 py-1 text-xs">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="font-mono text-[11px] text-slate-300">CANLI YAYIN: 20:45</span>
        </div>
      </div>

      {/* Main Broadcast TV Guide Grid */}
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]">
        {/* Left Category Drawer */}
        <div className="hidden space-y-1 rounded-xl border border-white/5 bg-white/[0.02] p-2 text-xs sm:block">
          <div className="rounded-lg px-2 py-1 text-slate-500">Tüm Kanallar</div>
          <div className="rounded-lg bg-blue-600/30 px-2 py-1 font-bold text-blue-300">★ Spor (Canlı)</div>
          <div className="rounded-lg px-2 py-1 text-slate-400">Ulusal Kanallar</div>
          <div className="rounded-lg px-2 py-1 text-slate-400">Sinema & Dizi</div>
          <div className="rounded-lg px-2 py-1 text-slate-400">Belgesel</div>
          <div className="rounded-lg px-2 py-1 text-slate-400">Favoriler</div>
        </div>

        {/* EPG Timeline Rows */}
        <div className="space-y-2 text-xs">
          <div className="rounded-xl border border-blue-500/40 bg-blue-950/30 p-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-500/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-blue-300">01</span>
                <span className="font-bold text-white">SPOR 1 HD</span>
              </div>
              <span className="text-[10px] text-blue-400">19:00 - 21:00</span>
            </div>
            <div className="mt-1.5 text-[11px] text-slate-300">Futbol Ligi: Haftanın Maçı (Canlı Yayın)</div>
            {/* Timeline Progress Bar */}
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-3/4 rounded-full bg-blue-500" />
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-400">02</span>
                <span className="font-bold text-slate-200">SPOR 2 HD</span>
              </div>
              <span className="text-[10px] text-slate-500">20:30 - 22:30</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">Uluslararası Karşılaşma (Canlı)</div>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-400">03</span>
                <span className="font-bold text-slate-200">SPOR MAX HD</span>
              </div>
              <span className="text-[10px] text-slate-500">20:45 - 22:45</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">Avrupa Basketbol Turnuvası</div>
          </div>
        </div>
      </div>

      {/* Remote control guide */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3 text-[10px] text-slate-400">
        <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-slate-300">[OK] Tam Ekran</span>
        <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-slate-300">[Sol Tuş] Gruplar</span>
        <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-slate-300">[Sağ Tuş] EPG Akışı</span>
        <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-slate-300">[Uzun Bas OK] Menü / Favori</span>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. XCIPTV / OTR Player (OTTRUN Futuristic Cyan Neon Media Dashboard)
// ----------------------------------------------------------------------
function XciptvPreview({ activeTab, accent }) {
  return (
    <div className="bg-[#05111e] p-4 text-white sm:p-6">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-cyan-500/20 px-2 py-1 font-mono text-xs font-black text-cyan-400">XCIPTV</span>
          <span className="text-xs font-bold text-cyan-200">OTTRUN Media Center</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400/80">
          <span className="rounded bg-cyan-500/10 px-2 py-0.5 border border-cyan-500/20">ExoPlayer 2.18</span>
          <span className="text-emerald-400">● Aktif: 365 Gün</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-900/40 to-cyan-950/60 p-4 shadow-lg shadow-cyan-500/10 transition hover:border-cyan-300">
          <Tv className="h-6 w-6 text-cyan-400" />
          <h4 className="mt-3 text-base font-black text-white">LIVE TV</h4>
          <p className="text-[10px] text-cyan-300/70">Tüm Canlı Yayınlar</p>
        </div>

        <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-900/40 to-cyan-950/60 p-4 shadow-lg shadow-cyan-500/10 transition hover:border-cyan-300">
          <Film className="h-6 w-6 text-cyan-400" />
          <h4 className="mt-3 text-base font-black text-white">VOD / MOVIES</h4>
          <p className="text-[10px] text-cyan-300/70">4K & 1080p Sinema</p>
        </div>

        <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-900/40 to-cyan-950/60 p-4 shadow-lg shadow-cyan-500/10 transition hover:border-cyan-300">
          <Layers className="h-6 w-6 text-cyan-400" />
          <h4 className="mt-3 text-base font-black text-white">SERIES</h4>
          <p className="text-[10px] text-cyan-300/70">Diziler & Sezonlar</p>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-3">
          <Calendar className="h-5 w-5 text-cyan-400/80" />
          <div className="mt-2 text-xs font-bold text-slate-200">EPG TV REHBERİ</div>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-3">
          <Grid className="h-5 w-5 text-cyan-400/80" />
          <div className="mt-2 text-xs font-bold text-slate-200">MULTI-SCREEN (4)</div>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-3">
          <Radio className="h-5 w-5 text-cyan-400/80" />
          <div className="mt-2 text-xs font-bold text-slate-200">USB KAYIT (REC)</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-cyan-500/15 pt-3 text-[11px] text-cyan-400/70">
        <span>Dual Player: ExoPlayer & VLC Desteği</span>
        <span>Multi-DNS Koruma: Aktif</span>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. IBO Player Simulation (Device ID + Device Key & Web Portal)
// ----------------------------------------------------------------------
function IboPreview({ activeTab, accent, portalUrl }) {
  if (activeTab === 'tv') {
    return (
      <div className="bg-gradient-to-br from-[#042422] via-[#021716] to-[#010c0b] p-5 text-white sm:p-7">
        <div className="mx-auto max-w-md rounded-2xl border border-teal-500/30 bg-[#06302e]/80 p-5 text-center shadow-2xl backdrop-blur-md">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-300">
            <Tv className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-lg font-black text-white">IBO Player Pro</h3>
          <p className="mt-1 text-xs text-teal-200/80">Televizyonunuzun Cihaz Bilgileri</p>

          <div className="mt-5 space-y-2.5 text-left">
            <div className="rounded-xl border border-teal-500/30 bg-[#021d1b] p-3">
              <span className="text-[10px] uppercase font-bold text-teal-400">Device ID (MAC)</span>
              <div className="mt-1 font-mono text-sm font-black tracking-wider text-white">
                00:1A:79:B4:8C:21
              </div>
            </div>
            <div className="rounded-xl border border-teal-500/30 bg-[#021d1b] p-3">
              <span className="text-[10px] uppercase font-bold text-teal-400">Device Key (PIN)</span>
              <div className="mt-1 font-mono text-sm font-black tracking-widest text-emerald-400">
                849201
              </div>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-teal-300/70">
            Telefonunuzdan <strong>iboplayer.com/device/login</strong> adresini açıp bu iki kodu girin.
          </p>

          <div className="mt-4 rounded-xl border border-teal-500/20 bg-teal-500/10 py-2 text-xs font-bold text-teal-200">
            [ Reload ] TV Kumandasıyla Listeyi Yenileyin
          </div>
        </div>
      </div>
    );
  }

  // Web view
  return (
    <div className="bg-[#0b1016] p-4 text-white sm:p-6">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs text-slate-400">
        <Globe className="h-4 w-4 text-teal-400" />
        <span className="font-mono text-slate-300">https://iboplayer.com/device/login</span>
      </div>

      <div className="mt-4 rounded-xl border border-teal-500/30 bg-[#072422]/90 p-5">
        <div className="flex items-center justify-between border-b border-teal-500/20 pb-3">
          <span className="font-bold text-white">IBO Player Web Paneli</span>
          <span className="rounded bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold text-teal-300">+ Add XC Playlist</span>
        </div>

        <div className="mt-4 grid gap-2.5 text-xs sm:grid-cols-2">
          <div>
            <label className="text-slate-400 text-[11px]">Playlist Name</label>
            <div className="mt-1 rounded border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-white">QruzeTV</div>
          </div>
          <div>
            <label className="text-slate-400 text-[11px]">Host / Sunucu URL</label>
            <div className="mt-1 rounded border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-teal-300">http://sunucu:8080</div>
          </div>
          <div>
            <label className="text-slate-400 text-[11px]">Username (Kullanıcı Adı)</label>
            <div className="mt-1 rounded border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-white">qruze_user</div>
          </div>
          <div>
            <label className="text-slate-400 text-[11px]">Password (Şifre)</label>
            <div className="mt-1 rounded border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-white">••••••••</div>
          </div>
        </div>

        <button type="button" className="mt-4 w-full rounded-lg bg-teal-500 py-2 text-center text-xs font-black uppercase text-slate-950 hover:bg-teal-400">
          Save (Listeyi TV ile Eşleştir)
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 5. Smart IPTV (SIPTV) Simulation (Classic Double-Column / siptv.app)
// ----------------------------------------------------------------------
function SmartIptvPreview({ activeTab, accent, portalUrl }) {
  if (activeTab === 'tv') {
    return (
      <div className="bg-[#061426] p-5 text-white sm:p-7">
        <div className="mx-auto max-w-md rounded-2xl border border-sky-500/30 bg-[#092240] p-5 text-center shadow-2xl">
          <div className="text-xs font-black tracking-widest text-sky-400">SMART IPTV (SIPTV)</div>
          <h3 className="mt-2 text-xl font-black text-white">TV MAC Adresi</h3>
          <div className="my-4 rounded-xl border border-sky-400/40 bg-black/60 py-3 font-mono text-base font-black tracking-widest text-sky-200">
            A4:38:CC:12:EF:90
          </div>
          <p className="text-xs text-slate-300">
            7 days test period started. Please visit <strong>siptv.app/mylist</strong> to upload playlist.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-sky-500/10 p-2 text-xs text-sky-300">
            Kumandadan <strong className="rounded bg-sky-400/20 px-1.5 py-0.5 text-white">[0]</strong> tuşuna basarak listeyi yenileyin.
          </div>
        </div>
      </div>
    );
  }

  // Web view
  return (
    <div className="bg-[#0c131c] p-4 text-white sm:p-6">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs text-slate-400">
        <Globe className="h-4 w-4 text-sky-400" />
        <span className="font-mono text-slate-300">https://siptv.app/mylist/</span>
      </div>

      <div className="mt-4 rounded-xl border border-sky-500/30 bg-[#081b30] p-5">
        <h4 className="font-bold text-white text-sm">Upload playlist to Smart IPTV</h4>
        <div className="mt-3 space-y-2.5 text-xs">
          <div>
            <label className="text-slate-400 text-[11px]">MAC (TV Ekranındaki Adres):</label>
            <div className="mt-1 rounded border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-white">a4:38:cc:12:ef:90</div>
          </div>
          <div>
            <label className="text-slate-400 text-[11px]">URL (QruzeTV M3U Plus Linki):</label>
            <div className="mt-1 rounded border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-sky-300 truncate">
              https://qruzetv.../get.php?username=qruze&password=pass&type=m3u_plus
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /> Save online</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /> Detect EPG</span>
            <span className="text-slate-400">Country: Turkey</span>
          </div>
        </div>

        <button type="button" className="mt-4 w-full rounded-lg bg-sky-500 py-2 text-center text-xs font-black uppercase text-slate-950 hover:bg-sky-400">
          SEND (Listeyi Gönder)
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 6. SmartOne IPTV Simulation (Orange Warm Modern TV + Generator)
// ----------------------------------------------------------------------
function SmartOnePreview({ activeTab, accent, portalUrl }) {
  if (activeTab === 'tv') {
    return (
      <div className="bg-[#171007] p-5 text-white sm:p-7">
        <div className="mx-auto max-w-md rounded-2xl border border-amber-500/30 bg-[#21170a] p-5 text-center shadow-2xl">
          <div className="text-xs font-black uppercase tracking-widest text-amber-400">SmartOne IPTV</div>
          <h3 className="mt-2 text-xl font-black text-white">TV MAC Adresi</h3>
          <div className="my-4 rounded-xl border border-amber-400/40 bg-black/60 py-3 font-mono text-base font-black tracking-widest text-amber-300">
            3C:52:82:11:44:99
          </div>
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300">14 Gün Ücretsiz Deneme Aktif</span>
          <p className="mt-4 text-xs text-slate-300">
            smartone-iptv.com/plugin/smart_one/main_generate üzerinden listenizi ekleyin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#120d07] p-4 text-white sm:p-6">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs text-slate-400">
        <Globe className="h-4 w-4 text-amber-400" />
        <span className="font-mono text-slate-300">smartone-iptv.com/plugin/smart_one/main_generate</span>
      </div>

      <div className="mt-4 rounded-xl border border-amber-500/30 bg-[#1c1308] p-5">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <span className="font-bold text-white text-xs">SmartOne Playlist Generator</span>
          <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">Xtream Code</span>
        </div>

        <div className="mt-3 space-y-2 text-xs">
          <div>
            <label className="text-slate-400 text-[11px]">MAC Address</label>
            <div className="mt-1 rounded border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-white">3C:52:82:11:44:99</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 text-[11px]">Xtream Username</label>
              <div className="mt-1 rounded border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-white">qruze_user</div>
            </div>
            <div>
              <label className="text-slate-400 text-[11px]">Xtream Password</label>
              <div className="mt-1 rounded border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-white">••••••••</div>
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-[11px]">Server URL (Host:Port)</label>
            <div className="mt-1 rounded border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-amber-300">http://sunucu:8080</div>
          </div>
        </div>

        <button type="button" className="mt-4 w-full rounded-lg bg-amber-500 py-2 text-center text-xs font-black uppercase text-slate-950 hover:bg-amber-400">
          Generate SmartOne IPTV
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 7. 0 Player (Zero Player) Simulation
// ----------------------------------------------------------------------
function ZeroPlayerPreview({ activeTab, accent, portalUrl }) {
  if (activeTab === 'tv') {
    return (
      <div className="bg-[#14120a] p-5 text-white sm:p-7">
        <div className="mx-auto max-w-md rounded-2xl border border-yellow-500/30 bg-[#211d10] p-5 text-center shadow-2xl">
          <div className="text-xs font-black uppercase tracking-widest text-yellow-400">0 PLAYER · SAMSUNG / LG</div>
          <div className="my-4 space-y-2">
            <div className="rounded-xl border border-yellow-500/30 bg-black/50 p-2.5">
              <span className="text-[10px] text-yellow-400">MAC ADDRESS</span>
              <div className="font-mono text-sm font-bold text-white">B8:27:EB:45:67:89</div>
            </div>
            <div className="rounded-xl border border-yellow-500/30 bg-black/50 p-2.5">
              <span className="text-[10px] text-yellow-400">DEVICE KEY (PIN)</span>
              <div className="font-mono text-sm font-bold text-yellow-300">4729</div>
            </div>
          </div>
          <p className="text-xs text-slate-400">0player.com adresinden bu bilgilerle giriş yapın.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121008] p-4 text-white sm:p-6">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs text-slate-400">
        <Globe className="h-4 w-4 text-yellow-400" />
        <span className="font-mono text-slate-300">https://0player.com</span>
      </div>
      <div className="mt-4 rounded-xl border border-yellow-500/30 bg-[#1e1a0b] p-5">
        <h4 className="font-bold text-white text-xs">0Player Device Portal · Add Playlist</h4>
        <div className="mt-3 space-y-2 text-xs">
          <div>
            <label className="text-slate-400 text-[11px]">Playlist Name</label>
            <div className="mt-1 rounded border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-white">QruzeTV</div>
          </div>
          <div>
            <label className="text-slate-400 text-[11px]">Xtream Server URL</label>
            <div className="mt-1 rounded border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-yellow-300">http://sunucu:8080</div>
          </div>
        </div>
        <button type="button" className="mt-4 w-full rounded-lg bg-yellow-500 py-2 text-center text-xs font-black uppercase text-slate-950 hover:bg-yellow-400">
          Save Playlist
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 8. HotPlayer Simulation
// ----------------------------------------------------------------------
function HotPlayerPreview({ activeTab, accent, portalUrl }) {
  if (activeTab === 'tv') {
    return (
      <div className="bg-[#1a0b06] p-5 text-white sm:p-7">
        <div className="mx-auto max-w-md rounded-2xl border border-orange-500/30 bg-[#2b120a] p-5 text-center shadow-2xl">
          <div className="text-xs font-black uppercase tracking-widest text-orange-400">HotPlayer Smart TV</div>
          <div className="my-4 rounded-xl border border-orange-400/40 bg-black/60 py-3 font-mono text-base font-black tracking-widest text-orange-300">
            A8:2B:B9:7D:14:02
          </div>
          <p className="text-xs text-slate-300">hotplayer.app/upload adresine gidip bu adresi girin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#140804] p-4 text-white sm:p-6">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs text-slate-400">
        <Globe className="h-4 w-4 text-orange-400" />
        <span className="font-mono text-slate-300">https://hotplayer.app/upload</span>
      </div>
      <div className="mt-4 rounded-xl border border-orange-500/30 bg-[#240e07] p-5">
        <h4 className="font-bold text-white text-xs">HotPlayer Upload · Xtream Codes API</h4>
        <div className="mt-3 space-y-2 text-xs">
          <div>
            <label className="text-slate-400 text-[11px]">MAC Address</label>
            <div className="mt-1 rounded border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-white">a8:2b:b9:7d:14:02</div>
          </div>
          <div>
            <label className="text-slate-400 text-[11px]">Server URL (Host:Port)</label>
            <div className="mt-1 rounded border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-orange-300">http://sunucu:8080</div>
          </div>
        </div>
        <button type="button" className="mt-4 w-full rounded-lg bg-orange-500 py-2 text-center text-xs font-black uppercase text-slate-950 hover:bg-orange-400">
          Upload Playlist
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 9. Televizo Simulation (Android Material 3 In-App Setup)
// ----------------------------------------------------------------------
function TelevizoPreview({ activeTab, accent }) {
  return (
    <div className="bg-[#08101e] p-5 text-white sm:p-7">
      <div className="mx-auto max-w-md rounded-2xl border border-blue-500/30 bg-[#0d1a33] p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-blue-500/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-bold text-blue-300">Televizo</span>
            <span className="text-xs font-bold text-white">Yeni Çalma Listesi</span>
          </div>
          <span className="rounded bg-blue-500/30 px-2 py-0.5 text-[10px] font-bold text-blue-200">Xtream Codes</span>
        </div>

        <div className="mt-4 space-y-2.5 text-xs">
          <div>
            <label className="text-slate-400 text-[11px]">Liste Adı</label>
            <div className="mt-1 rounded border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-white">QruzeTV</div>
          </div>
          <div>
            <label className="text-slate-400 text-[11px]">Sunucu Adresi</label>
            <div className="mt-1 rounded border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-blue-300">http://sunucu:8080</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 text-[11px]">Kullanıcı Adı</label>
              <div className="mt-1 rounded border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-white">qruze_user</div>
            </div>
            <div>
              <label className="text-slate-400 text-[11px]">Şifre</label>
              <div className="mt-1 rounded border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-white">••••••••</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400">
            <Check className="h-3.5 w-3.5" />
            <span>Otomatik Güncelleme: Her 12 Saatte Bir</span>
          </div>
        </div>

        <button type="button" className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-center text-xs font-black uppercase text-white shadow hover:bg-blue-500">
          ✓ Çalma Listesini Kaydet
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 10. IPTVX Simulation (Apple TV Frosted Glass & iCloud Sync)
// ----------------------------------------------------------------------
function IptvxPreview({ activeTab, accent }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1c0817] via-[#10040e] to-[#080207] p-5 text-white sm:p-7">
      <div className="mx-auto max-w-lg rounded-2xl border border-pink-500/25 bg-black/60 p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-pink-500/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 text-xs font-black">X</span>
            <span className="font-bold text-pink-200">IPTVX · Apple TV & iOS</span>
          </div>
          <span className="rounded-full bg-pink-500/20 px-2.5 py-0.5 text-[10px] font-bold text-pink-300">
            ☁ iCloud Senkronizasyonu: Aktif
          </span>
        </div>

        {/* Hero banner simulation */}
        <div className="mt-4 rounded-xl border border-white/10 bg-gradient-to-r from-rose-950/60 to-purple-950/60 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-rose-500/30 px-2 py-0.5 text-[9px] font-black tracking-wider text-rose-300">4K DOLBY VISION</span>
            <span className="rounded bg-purple-500/30 px-2 py-0.5 text-[9px] font-black tracking-wider text-purple-300">HDR10</span>
            <span className="rounded bg-white/10 px-2 py-0.5 text-[9px] font-bold text-slate-300">IMDb 8.6</span>
          </div>
          <h4 className="mt-2 text-lg font-black text-white">Yıldızlararası Yolculuk 4K</h4>
          <p className="mt-1 text-xs text-rose-200/80">Kaldığın Yerden Devam Et (Kalan: 48 dk)</p>
        </div>

        <div className="mt-4 rounded-xl border border-pink-500/20 bg-white/[0.03] p-3 text-xs">
          <div className="font-semibold text-pink-300">Xtream API ile Bağlandı</div>
          <div className="mt-1 text-slate-400 text-[11px]">
            iPhone’da kurduğunuz an, Apple TV 4K’da tek harf yazmadan otomatik hazır!
          </div>
        </div>
      </div>
    </div>
  );
}
