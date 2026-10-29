import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Tv, Zap, Shield, Users, CheckCircle2, Star, Cpu, HelpCircle, ArrowRight, Laptop, Smartphone } from 'lucide-react';
import { useTestModal } from '@/contexts/TestModalContext';

const HomePageSeoContent = ({ siteData }) => {
  const { openTestModal } = useTestModal();

  return (
    <div className="container mx-auto px-4 py-16 text-slate-300 leading-relaxed max-w-6xl">
      <article className="space-y-16">
        
        {/* Editorial Heading */}
        <header className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Cpu className="w-3.5 h-3.5 text-primary" />
            <span>Dijital Yayın Rehberi & Mühendislik</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Yurt Dışında Türk Kanalları ve{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] via-[#f40612] to-amber-500">
              Yüksek Çözünürlüklü Yayın Standartları
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
            Almanya, Avusturya, Hollanda ve Avrupa genelinde yaşayan Türk topluluğu için televizyon sadece bir eğlence aracı değil; anadili, kültürü ve memleket gündemini evde canlı tutmanın en samimi yoludur. QruzeTV, bu ihtiyacı modern yayın altyapısıyla buluşturur.
          </p>
        </header>

        {/* Section 1: Yayın Teknolojisi ve Bitrate Gerçekleri */}
        <section className="bg-gradient-to-b from-[#141418] via-[#0d0d10] to-[#08080a] p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Zap className="w-7 h-7 text-primary shrink-0" />
              <span>Yayın Donması Neden Olur ve Nasıl Önlenir?</span>
            </h3>
            
            <p className="text-slate-300 text-base md:text-lg mb-6 leading-relaxed font-light">
              Dijital yayınlarda akıcılık; yalnızca evinizdeki internet hızına değil, yayını ileten sunucunun Avrupa ana omurgasına (DE-CIX Frankfurt, AMS-IX Amsterdam) olan doğrudan bağlantısına bağlıdır. Geleneksel ucuz sunucular, akşam saatlerinde veya derbi maçlarında bant genişliği yetersizliğinden kilitlenir.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-black/40 p-6 rounded-2xl border border-white/10">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Doğrudan Avrupa CDN Peering
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-light mb-4">
                  Sunucularımız, Avrupa&apos;nın önde gelen telekom sağlayıcılarıyla (Telekom Deutschland, Vodafone, KPN) doğrudan eşleşerek aradaki aracı düğümleri atlar ve gecikmeyi en alt seviyeye çeker.
                </p>
                <div className="text-xs text-emerald-400 font-mono">✓ Sıfır Paket Kaybı Hedefi</div>
              </div>

              <div className="bg-black/40 p-6 rounded-2xl border border-white/10">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  H.265 / HEVC Akıllı Sıkıştırma
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-light mb-4">
                  Eski H.264 teknolojisine kıyasla yarı yarıya daha az bant genişliği tüketerek iki kat daha net piksel yoğunluğu sağlar. Wi-Fi bağlantınız zayıflasa bile akış kesintiye uğramaz.
                </p>
                <div className="text-xs text-amber-300 font-mono">✓ 60 FPS Hareket Netliği</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
              <span className="text-sm text-slate-400">
                Kendi cihazınızda performansı test etmek için 2 saatlik ücretsiz test hattımızı deneyin.
              </span>
              <button
                type="button"
                onClick={openTestModal}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-white transition-colors"
              >
                <span>Hemen Ücretsiz Test İste</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Section 2: Donanım ve Cihaz Uyumluluğu Rehberi */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Laptop className="w-7 h-7 text-primary" />
              <span>Hangi Cihazlarda Nasıl İzlenir?</span>
            </h3>
            <p className="text-slate-400 text-base font-light">
              QruzeTV açık standartları (M3U Plus & Xtream Codes API) destekler; sizi kapalı veya hantal bir uygulamaya mahkûm etmez.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-[#0e0e12] p-6 hover:border-primary/40 transition-all">
              <h4 className="text-lg font-bold text-white mb-2">Smart TV (Samsung & LG)</h4>
              <p className="text-sm text-slate-300 mb-4 font-light leading-relaxed">
                Tizen ve webOS işletim sistemlerinde IBO Player, Smart IPTV veya Nanomid uygulamaları ile ek kutuya gerek kalmadan kumandanızla izleyin.
              </p>
              <Link to="/kurulum/smart-tv" className="text-xs font-semibold text-primary hover:underline">
                Smart TV Kurulum Rehberi →
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0e0e12] p-6 hover:border-primary/40 transition-all">
              <h4 className="text-lg font-bold text-white mb-2">Android TV & Firestick</h4>
              <p className="text-sm text-slate-300 mb-4 font-light leading-relaxed">
                TiviMate, IPTV Smarters Pro veya XCIPTV oynatıcıları ile gelişmiş kanal listeleme, canlı EPG ve favori kategorilendirme kolaylığı.
              </p>
              <Link to="/kurulum" className="text-xs font-semibold text-primary hover:underline">
                Firestick & Android Rehberi →
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0e0e12] p-6 hover:border-primary/40 transition-all">
              <h4 className="text-lg font-bold text-white mb-2">Apple TV & iOS</h4>
              <p className="text-sm text-slate-300 mb-4 font-light leading-relaxed">
                GSE Smart IPTV veya IPTVX uygulamalarıyla Apple ekosisteminde akıcı 4K ve AirPlay uyumlu üst düzey deneyim.
              </p>
              <Link to="/kurulum/ios" className="text-xs font-semibold text-primary hover:underline">
                Apple TV Kurulum Rehberi →
              </Link>
            </div>
          </div>
        </section>

        {/* Section 3: Şeffaf Hizmet Anlayışı & Taahhütsüz Model */}
        <section className="bg-gradient-to-br from-[#121217] via-[#09090b] to-black p-8 md:p-12 rounded-3xl border border-white/10">
          <div className="max-w-4xl mx-auto space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="w-7 h-7 text-emerald-400" />
              <span>Güvenlik, Şeffaflık ve Taahhütsüz Kullanım</span>
            </h3>
            
            <p className="text-slate-300 leading-relaxed font-light text-base md:text-lg">
              Sektördeki en büyük çekincelerden biri; otomatik yenilenen gizli abonelikler ve muhatap bulunamayan teknik sorunlardır. QruzeTV modelinde:
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">Sözleşmesiz & Açık Fiyat</p>
                  <p className="text-xs text-slate-400 mt-1">Kartınızdan asla bilginiz dışında otomatik para çekilmez; süreniz bittiğinde yenilemek tamamen sizin tercihinizdir.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">Canlı İnsan Destek Ekibi</p>
                  <p className="text-xs text-slate-400 mt-1">Botlar yerine, televizyonunuzun ve modeminizin modeline göre doğrudan çözüm üreten Türkçe destek uzmanları.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">
                Sorularınız mı var? Destek ekibimize dilediğiniz an WhatsApp üzerinden ulaşabilirsiniz.
              </p>
              <Link
                to="/iletisim"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all border border-white/15"
              >
                <span>İletişim Bilgileri</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </article>
    </div>
  );
};

export default memo(HomePageSeoContent);
