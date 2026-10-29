
import React, { memo } from 'react';
import { PlayCircle, Film, Info } from 'lucide-react';
import { useWhenVisible } from '@/hooks/useWhenVisible';

const getYouTubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m) return m[1];
  }
  return null;
};

const isLocalVideo = (src) => {
  if (!src || typeof src !== 'string') return false;
  const s = src.trim();
  return s.endsWith('.mp4') || s.endsWith('.webm') || s.startsWith('/');
};

const VideoBlock = ({ source, isYouTube, title }) => {
  const [blockRef, visible] = useWhenVisible({ rootMargin: '120px' });

  return (
    <div
      ref={blockRef}
      className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-[#09090d] shadow-[0_18px_50px_rgba(0,0,0,0.48)] group"
    >
      {!visible ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#09090d]">
          <PlayCircle className="w-12 h-12 text-primary/70 animate-pulse" aria-hidden />
          <span className="sr-only">{title}</span>
        </div>
      ) : isYouTube ? (
        <iframe
          src={`https://www.youtube.com/embed/${source}?rel=0`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <video
          src={source}
          controls
          playsInline
          preload="metadata"
          poster="/og/home.jpg"
          className="w-full h-full object-cover"
        >
          Tarayıcınız video oynatmayı desteklemiyor.
        </video>
      )}
    </div>
  );
};

const VideoCard = ({ sources, title, description, icon: Icon, gradient }) => (
  <div className="luxury-card group rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_28px_80px_rgba(0,0,0,0.48),0_0_34px_rgba(229,9,20,0.14)]">
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.08] group-hover:opacity-[0.15] transition-opacity`} />
    <div className="relative p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-[0_0_28px_rgba(229,9,20,0.28)] ring-1 ring-white/20`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <p className="text-xl font-bold text-white">{title}</p>
      </div>
      {description && (
        <p className="text-slate-400 text-sm mb-4 leading-relaxed">{description}</p>
      )}
      <div className="space-y-4">
        {sources.map(({ source, isYouTube }, i) => (
          <VideoBlock key={i} source={source} isYouTube={isYouTube} title={`${title} ${i + 1}`} />
        ))}
      </div>
    </div>
  </div>
);

const buildSources = (youtubeUrl, mainUrl) => {
  const sources = [];
  const ytId = youtubeUrl ? getYouTubeId(youtubeUrl) : null;
  const mainYtId = mainUrl ? getYouTubeId(mainUrl) : null;
  const mainLocal = mainUrl && isLocalVideo(mainUrl) ? mainUrl : null;
  if (ytId) sources.push({ source: ytId, isYouTube: true });
  if (mainYtId && mainYtId !== ytId) sources.push({ source: mainYtId, isYouTube: true });
  if (mainLocal) sources.push({ source: mainLocal, isYouTube: false });
  return sources;
};

const HomePageVideoSection = ({ videos, lang = 'tr' }) => {
  const iptvSources = buildSources(videos?.iptv_nedir_youtube?.trim?.(), videos?.iptv_nedir?.trim?.());
  const icerikSources = buildSources(videos?.icerik_bilgisi_youtube?.trim?.(), videos?.icerik_bilgisi?.trim?.());
  const hasIptv = iptvSources.length > 0;
  const hasIcerik = icerikSources.length > 0;

  const tr = {
    title: 'Video Rehberleri',
    subtitle: 'IPTV hakkında bilmeniz gerekenler',
    iptvTitle: 'IPTV Nedir?',
    iptvDesc: 'IPTV teknolojisi ve nasıl çalıştığını anlatan kısa rehber.',
    icerikTitle: 'İçerik Bilgisi',
    icerikDesc: 'Kanal ve VOD içerikleri hakkında detaylı bilgi.'
  };

  const de = {
    title: 'Video-Anleitungen',
    subtitle: 'Alles rund um IPTV',
    iptvTitle: 'Was ist IPTV?',
    iptvDesc: 'Kurzer Überblick über IPTV-Technologie und Funktionsweise.',
    icerikTitle: 'Inhaltsübersicht',
    icerikDesc: 'Detaillierte Informationen zu Kanälen und VOD-Inhalten.'
  };

  const t = lang === 'de' ? de : tr;
  const hasAnyVideo = hasIptv || hasIcerik;

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <span className="luxury-kicker mb-4">{lang === 'de' ? 'Premium Guide' : 'Premium Rehber'}</span>
        <h2 className="section-title text-2xl md:text-3xl mb-3 flex items-center justify-center gap-3">
          <PlayCircle className="w-8 h-8 text-primary" />
          {t.title}
        </h2>
        <p className="text-slate-400 text-lg">{t.subtitle}</p>
      </div>

      {!hasAnyVideo ? (
        <div className="max-w-xl mx-auto p-8 rounded-2xl border border-dashed border-slate-600 bg-[#0a0a0a]/40 text-center">
          <p className="text-slate-400 mb-2">
            {lang === 'de' 
              ? 'Video-URLs können unter Admin → Einstellungen hinzugefügt werden.' 
              : 'Video URL\'leri Admin → Ayarlar sayfasından eklenebilir.'}
          </p>
          <p className="text-slate-500 text-sm">
            {lang === 'de' ? 'YouTube-Links oder lokale Pfade (z.B. /videos/datei.mp4)' : 'YouTube linkleri veya yerel dosya yolu (örn. /videos/dosya.mp4)'}
          </p>
        </div>
      ) : (
      <div className={`grid gap-8 ${hasIptv && hasIcerik ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
        {hasIptv && (
          <VideoCard
            sources={iptvSources}
            title={t.iptvTitle}
            description={t.iptvDesc}
            icon={Film}
            gradient="from-[#e50914] to-[#b20710]"
          />
        )}
        {hasIcerik && (
          <VideoCard
            sources={icerikSources}
            title={t.icerikTitle}
            description={t.icerikDesc}
            icon={Info}
            gradient="from-[#e50914] to-[#b20710]"
          />
        )}
      </div>
      )}
    </section>
  );
};

export default memo(HomePageVideoSection);
