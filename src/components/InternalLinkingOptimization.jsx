
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Info, Settings, ShoppingCart, Trophy } from 'lucide-react';

const InternalLinkingOptimization = ({ currentPage = 'home' }) => {
  const location = useLocation();
  const isGerman = location.pathname.startsWith('/de') || currentPage.includes('DE');

  const links = {
    home: isGerman ? [
      {
        to: '/de/pakete/',
        text: 'IPTV-Pakete und Preise',
        icon: ShoppingCart,
        desc: 'Erkunden Sie die günstigsten Paketoptionen.',
        ariaLabel: 'Gehen Sie zur Seite IPTV-Pakete und Preise'
      },
      {
        to: '/de/einrichtung/',
        text: 'IPTV-Installationsanleitung',
        icon: Settings,
        desc: 'Detaillierte Installationsanweisungen für Ihr Gerät.',
        ariaLabel: 'Gehen Sie zur Seite IPTV-Installationsanleitung'
      },
      {
        to: '/de/tuerkische-sender-in-deutschland/',
        text: 'Türkische Sender in Deutschland',
        icon: Trophy,
        desc: 'Empfangswege, Geräte und Einrichtung im Überblick.',
        ariaLabel: 'Ratgeber für türkische Sender in Deutschland öffnen'
      },
      {
        to: '/de/test/',
        text: 'Kostenlos testen',
        icon: Info,
        desc: 'Streaming-Qualität vor der Buchung auf dem eigenen Gerät prüfen.',
        ariaLabel: 'Kostenlosen IPTV-Test öffnen'
      }
    ] : [
      {
        to: '/paketler/',
        text: 'IPTV paketleri ve fiyatları',
        icon: ShoppingCart,
        desc: 'En uygun fiyatlı paket seçeneklerini inceleyin.',
        ariaLabel: 'IPTV paketleri ve fiyatları sayfasına git'
      },
      {
        to: '/kurulum/',
        text: 'IPTV kurulum rehberi',
        icon: Settings,
        desc: 'Cihazınıza özel detaylı kurulum talimatları.',
        ariaLabel: 'IPTV kurulum rehberi sayfasına git'
      },
      {
        to: '/test/',
        text: 'Ücretsiz test hesabı',
        icon: Info,
        desc: 'Satın almadan önce yayın kalitesini deneyin.',
        ariaLabel: 'Test hesabı sayfasına git'
      },
      {
        to: '/sss/',
        text: 'Sıkça sorulan sorular',
        icon: Info,
        desc: 'Paket, kurulum ve destek hakkında yanıtlar.',
        ariaLabel: 'SSS sayfasına git'
      },
      {
        to: '/m3u-converter/',
        text: 'M3U dönüştürücü',
        icon: ArrowRight,
        desc: 'M3U linkinden Xtream bilgilerini çıkarın.',
        ariaLabel: 'M3U dönüştürücü sayfasına git'
      },
      {
        to: '/reseller/',
        text: 'Bayilik / reseller',
        icon: ShoppingCart,
        desc: 'Bayilik başvurusu ve iş ortaklığı.',
        ariaLabel: 'Bayilik sayfasına git'
      }
    ],
    packages: isGerman ? [
      {
        to: '/de/einrichtung/',
        text: 'Installationsanleitung',
        icon: Settings,
        desc: 'Installieren Sie Ihr Paket sofort auf Ihrem Gerät.',
        ariaLabel: 'Gehen Sie zur Seite IPTV-Installationsanleitung'
      },
      {
        to: '/de/sss/',
        text: 'Häufig gestellte Fragen',
        icon: Info,
        desc: 'Antworten auf Ihre Fragen.',
        ariaLabel: 'Gehen Sie zur FAQ-Seite'
      },
      {
        to: '/de/test/',
        text: 'Kostenloser Testzugang',
        icon: Info,
        desc: 'Qualität vor dem Kauf testen.',
        ariaLabel: 'Zur Testseite'
      }
    ] : [
      {
        to: '/kurulum/',
        text: 'Kurulum rehberi',
        icon: Settings,
        desc: 'Paketinizi cihazınıza kurmak için adım adım rehber.',
        ariaLabel: 'IPTV kurulum rehberi sayfasına git'
      },
      {
        to: '/sss/',
        text: 'Sıkça sorulan sorular',
        icon: Info,
        desc: 'Paket ve ödeme hakkında sık sorulan sorular.',
        ariaLabel: 'SSS sayfasına git'
      },
      {
        to: '/test/',
        text: 'Ücretsiz test hesabı',
        icon: Info,
        desc: 'Satın almadan önce yayın kalitesini deneyin.',
        ariaLabel: 'Test hesabı sayfasına git'
      }
    ],
    installation: isGerman ? [
      {
        to: '/de/pakete/',
        text: 'Paket auswählen',
        icon: ShoppingCart,
        desc: 'Wenn Sie noch kein Paket haben, kaufen Sie jetzt eines.',
        ariaLabel: 'Gehen Sie zur Seite IPTV-Pakete und Preise'
      },
      {
        to: '/de/test/',
        text: 'Kostenloser Testzugang',
        icon: Info,
        desc: 'Qualität vor dem Kauf testen.',
        ariaLabel: 'Zur Testseite'
      },
      {
        to: '/de/sss/',
        text: 'Häufig gestellte Fragen',
        icon: Info,
        desc: 'Antworten zu Einrichtung und Paketen.',
        ariaLabel: 'Gehen Sie zur FAQ-Seite'
      }
    ] : [
      {
        to: '/paketler/',
        text: 'Paket seçmek için',
        icon: ShoppingCart,
        desc: 'Henüz bir paketiniz yoksa hemen inceleyin.',
        ariaLabel: 'Paketler sayfasına git'
      },
      {
        to: '/test/',
        text: 'Ücretsiz test hesabı',
        icon: Info,
        desc: 'Kurulum öncesi yayın kalitesini deneyin.',
        ariaLabel: 'Test hesabı sayfasına git'
      },
      {
        to: '/sss/',
        text: 'Sıkça sorulan sorular',
        icon: Info,
        desc: 'Kurulum ve paketler hakkında yanıtlar.',
        ariaLabel: 'SSS sayfasına git'
      }
    ],
    m3u: isGerman
      ? [
          {
            to: '/de/einrichtung/',
            text: 'IPTV-Einrichtungsanleitung',
            icon: Settings,
            desc: 'Schritt-für-Schritt für Ihr Gerät.',
            ariaLabel: 'Zur Einrichtungsanleitung',
          },
          {
            to: '/de/sss/',
            text: 'Häufig gestellte Fragen',
            icon: Info,
            desc: 'Antworten zu M3U, Einrichtung und Paketen.',
            ariaLabel: 'Zur FAQ-Seite',
          },
        ]
      : [
          {
            to: '/kurulum/',
            text: 'IPTV kurulum rehberi',
            icon: Settings,
            desc: 'Cihazınıza özel detaylı kurulum talimatları.',
            ariaLabel: 'IPTV kurulum rehberi sayfasına git',
          },
          {
            to: '/sss/',
            text: 'Sıkça sorulan sorular',
            icon: Info,
            desc: 'M3U, kurulum ve paketler hakkında yanıtlar.',
            ariaLabel: 'SSS sayfasına git',
          },
        ],
    faq: isGerman
      ? [
          {
            to: '/de/pakete/',
            text: 'IPTV-Pakete und Preise',
            icon: ShoppingCart,
            desc: 'Passende Pakete und aktuelle Preise.',
            ariaLabel: 'Zu IPTV-Paketen und Preisen',
          },
          {
            to: '/de/einrichtung/',
            text: 'Installationsanleitung',
            icon: Settings,
            desc: 'Schritt-für-Schritt für Ihr Gerät.',
            ariaLabel: 'Zur Einrichtungsanleitung',
          },
          {
            to: '/de/test/',
            text: 'Kostenloser Testzugang',
            icon: Info,
            desc: 'Qualität vor dem Kauf testen.',
            ariaLabel: 'Zur Testseite',
          },
        ]
      : [
          {
            to: '/paketler/',
            text: 'IPTV paketleri ve fiyatları',
            icon: ShoppingCart,
            desc: 'En uygun fiyatlı paket seçeneklerini inceleyin.',
            ariaLabel: 'IPTV paketleri ve fiyatları sayfasına git',
          },
          {
            to: '/kurulum/',
            text: 'IPTV kurulum rehberi',
            icon: Settings,
            desc: 'Cihazınıza özel detaylı kurulum talimatları.',
            ariaLabel: 'IPTV kurulum rehberi sayfasına git',
          },
          {
            to: '/test/',
            text: 'Ücretsiz test hesabı',
            icon: Info,
            desc: 'Satın almadan önce yayın kalitesini deneyin.',
            ariaLabel: 'Test hesabı sayfasına git',
          },
        ],
    blog: isGerman
      ? [
          {
            to: '/de/pakete/',
            text: 'IPTV-Pakete und Preise',
            icon: ShoppingCart,
            desc: 'Passende Pakete und aktuelle Preise.',
            ariaLabel: 'Zu IPTV-Paketen und Preisen',
          },
          {
            to: '/de/einrichtung/',
            text: 'Installationsanleitung',
            icon: Settings,
            desc: 'Schritt-für-Schritt für Ihr Gerät.',
            ariaLabel: 'Zur Einrichtungsanleitung',
          },
          {
            to: '/de/sss/',
            text: 'Häufig gestellte Fragen',
            icon: Info,
            desc: 'Antworten zu Paketen und Einrichtung.',
            ariaLabel: 'Zur FAQ-Seite',
          },
          {
            to: '/de/test/',
            text: 'Kostenloser Testzugang',
            icon: Info,
            desc: 'Qualität vor dem Kauf testen.',
            ariaLabel: 'Zur Testseite',
          },
        ]
      : [
          {
            to: '/paketler/',
            text: 'IPTV paketleri ve fiyatları',
            icon: ShoppingCart,
            desc: 'En uygun fiyatlı paket seçeneklerini inceleyin.',
            ariaLabel: 'IPTV paketleri ve fiyatları sayfasına git',
          },
          {
            to: '/kurulum/',
            text: 'IPTV kurulum rehberi',
            icon: Settings,
            desc: 'Cihazınıza özel detaylı kurulum talimatları.',
            ariaLabel: 'IPTV kurulum rehberi sayfasına git',
          },
          {
            to: '/sss/',
            text: 'Sıkça sorulan sorular',
            icon: Info,
            desc: 'Paket ve kurulum hakkında yanıtlar.',
            ariaLabel: 'SSS sayfasına git',
          },
          {
            to: '/test/',
            text: 'Ücretsiz test hesabı',
            icon: Info,
            desc: 'Satın almadan önce yayın kalitesini deneyin.',
            ariaLabel: 'Test hesabı sayfasına git',
          },
        ],
  };

  // Determine key based on current path or prop
  const p = (currentPage || 'home').toLowerCase();
  let activeKey = 'home';
  if (p.includes('m3u')) activeKey = 'm3u';
  else if (p.includes('faq') || p === 'sss') activeKey = 'faq';
  else if (p.includes('blog')) activeKey = 'blog';
  else if (p.includes('packages') || p.includes('paketler') || p.includes('pakete')) activeKey = 'packages';
  else if (p.includes('installation') || p.includes('kurulum') || p.includes('einrichtung')) activeKey = 'installation';

  const activeLinks = links[activeKey] || links.home;

  return (
    <div className="w-full py-8 my-8 border-t border-slate-800/50">
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
        {activeLinks.map((link, idx) => {
          const accentColors = ['text-primary/90', 'text-[#e50914]/90', 'text-amber-200/90'];
          const accent = accentColors[idx % accentColors.length];
          return (
          <Link 
            key={idx} 
            to={link.to}
            title={link.text}
            className="group flex items-center gap-4 bg-[#0a0a0a]/40 hover:bg-[#0a0a0a]/80 border border-slate-800 hover:border-primary/50 p-4 rounded-xl transition-all duration-300 w-full md:w-auto md:min-w-[300px]"
            aria-label={link.ariaLabel}
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
              <link.icon className="w-5 h-5 text-primary group-hover:text-primary" />
            </div>
            <div>
              <span className="text-white font-medium text-sm md:text-base group-hover:text-primary transition-colors flex items-center gap-2 block">
                {link.text}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0" />
              </span>
              <p className={`text-xs mt-0.5 ${accent}`}>{link.desc}</p>
            </div>
          </Link>
          );
        })}
      </div>
    </div>
  );
};

export default InternalLinkingOptimization;
