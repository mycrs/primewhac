
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Info, Settings, ShoppingCart, Trophy } from 'lucide-react';

const InternalLinkingOptimization = ({ currentPage = 'home' }) => {
  const location = useLocation();
  const isGerman = location.pathname.startsWith('/de') || currentPage.includes('DE');

  const links = {
    home: isGerman ? [
      {
        to: '/de/pakete',
        text: 'IPTV-Pakete und Preise',
        icon: ShoppingCart,
        desc: 'Erkunden Sie die günstigsten Paketoptionen.',
        ariaLabel: 'Gehen Sie zur Seite IPTV-Pakete und Preise'
      },
      {
        to: '/de/einrichtung',
        text: 'IPTV-Installationsanleitung',
        icon: Settings,
        desc: 'Detaillierte Installationsanweisungen für Ihr Gerät.',
        ariaLabel: 'Gehen Sie zur Seite IPTV-Installationsanleitung'
      }
    ] : [
      {
        to: '/paketler',
        text: 'IPTV paketleri ve fiyatları',
        icon: ShoppingCart,
        desc: 'En uygun fiyatlı paket seçeneklerini inceleyin.',
        ariaLabel: 'IPTV paketleri ve fiyatları sayfasına git'
      },
      {
        to: '/mac-programi',
        text: 'Maç programı',
        icon: Trophy,
        desc: 'Bugünkü ve gelecek maçlar, hangi kanalda izlenir.',
        ariaLabel: 'Maç programı sayfasına git'
      },
      {
        to: '/kurulum',
        text: 'IPTV kurulum rehberi',
        icon: Settings,
        desc: 'Cihazınıza özel detaylı kurulum talimatları.',
        ariaLabel: 'IPTV kurulum rehberi sayfasına git'
      }
    ],
    packages: isGerman ? [
      {
        to: '/de/einrichtung',
        text: 'Installationsanleitung',
        icon: Settings,
        desc: 'Installieren Sie Ihr Paket sofort auf Ihrem Gerät.',
        ariaLabel: 'Gehen Sie zur Seite IPTV-Installationsanleitung'
      },
      {
        to: '/de/sss',
        text: 'Häufig gestellte Fragen',
        icon: Info,
        desc: 'Antworten auf Ihre Fragen.',
        ariaLabel: 'Gehen Sie zur FAQ-Seite'
      }
    ] : [
      {
        to: '/installation',
        text: 'Paketinizi kurmak için',
        icon: Settings,
        desc: 'Satın aldığınız paketi cihazınıza hemen kurun.',
        ariaLabel: 'IPTV kurulum rehberi sayfasına git'
      },
      {
        to: '/faq',
        text: 'Sıkça Sorulan Sorular',
        icon: Info,
        desc: 'Aklınıza takılan soruların cevapları.',
        ariaLabel: 'SSS sayfasına git'
      }
    ],
    installation: isGerman ? [
      {
        to: '/de/pakete',
        text: 'Paket auswählen',
        icon: ShoppingCart,
        desc: 'Wenn Sie noch kein Paket haben, kaufen Sie jetzt eines.',
        ariaLabel: 'Gehen Sie zur Seite IPTV-Pakete und Preise'
      },
      {
        to: '/de/was-soll-ich-schauen',
        text: 'Was soll ich sehen?',
        icon: ArrowRight,
        desc: 'Beliebte Inhalte, die Sie nach der Installation ansehen können.',
        ariaLabel: 'Gehen Sie zur Seite Was soll ich sehen'
      }
    ] : [
      {
        to: '/packages',
        text: 'Paket seçmek için',
        icon: ShoppingCart,
        desc: 'Henüz bir paketiniz yoksa hemen satın alın.',
        ariaLabel: 'Paketler sayfasına git'
      },
      {
        to: '/what-to-watch',
        text: 'Ne İzlesem?',
        icon: ArrowRight,
        desc: 'Kurulum sonrası izleyebileceğiniz popüler içerikler.',
        ariaLabel: 'Ne İzlesem sayfasına git'
      }
    ]
  };

  // Determine key based on current path or prop
  let activeKey = 'home';
  if (currentPage.toLowerCase().includes('packages') || currentPage.toLowerCase().includes('paketler')) activeKey = 'packages';
  if (currentPage.toLowerCase().includes('installation') || currentPage.toLowerCase().includes('kurulum')) activeKey = 'installation';

  const activeLinks = links[activeKey] || links.home;

  return (
    <div className="w-full py-8 my-8 border-t border-slate-800/50">
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
        {activeLinks.map((link, idx) => {
          const accentColors = ['text-purple-300/90', 'text-emerald-300/90', 'text-amber-200/90'];
          const accent = accentColors[idx % accentColors.length];
          return (
          <Link 
            key={idx} 
            to={link.to}
            className="group flex items-center gap-4 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 p-4 rounded-xl transition-all duration-300 w-full md:w-auto md:min-w-[300px]"
            aria-label={link.ariaLabel}
          >
            <div className="w-10 h-10 rounded-full bg-purple-900/20 group-hover:bg-purple-600/20 flex items-center justify-center transition-colors">
              <link.icon className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
            </div>
            <div>
              <span className="text-white font-medium text-sm md:text-base group-hover:text-purple-300 transition-colors flex items-center gap-2 block">
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
