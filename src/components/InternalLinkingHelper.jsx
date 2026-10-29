import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Link as LinkIcon } from 'lucide-react';

const InternalLinkingHelper = ({ currentPage, maxLinks = 5, lang }) => {
  // Dil tespiti: açık lang prop'u öncelikli; yoksa currentPage '/de' ile başlıyorsa Almanca, değilse Türkçe.
  const isDe = lang ? lang === 'de' : (currentPage || '').startsWith('/de');
  const heading = isDe ? 'Weitere interessante Seiten' : 'İlgili Sayfalar';
  const links = [
    { to: "/de/pakete/", label: "IPTV-Preise ansehen", keywords: ["iptv preise", "pakete"] },
    { to: "/de/einrichtung/", label: "Zur Installationsanleitung", keywords: ["installation", "anleitung"] },
    { to: "/de/sss/", label: "Häufig gestellte Fragen (FAQ)", keywords: ["faq", "fragen"] },
    { to: "/de/vergleich/", label: "Pakete vergleichen", keywords: ["vergleich", "beste"] },
    { to: "/de/guide/iptv-kurulum-rehberi/", label: "Detaillierter Blog-Leitfaden", keywords: ["leitfaden", "blog"] },
    { to: "/de/kanale/", label: "Kanalliste durchsuchen", keywords: ["kanäle", "liste"] },
    { to: "/de/test/", label: "Kostenlos testen", keywords: ["test", "ausprobieren"] },
  ];

  // Filter out current page to avoid self-linking (slash'siz/slash'lı karşılaştırma)
  const normPath = (p) => (p || '').replace(/\/+$/, '');
  const current = normPath(currentPage);
  const relevantLinks = links
    .filter(link => !current.includes(normPath(link.to)) && normPath(link.to) !== current)
    .slice(0, maxLinks);

  return (
    <div className="my-12 p-6 bg-[#0a0a0a]/50 border-l-4 border-primary rounded-r-xl">
      <h3 className="flex items-center text-lg font-bold text-white mb-4">
        <LinkIcon className="w-5 h-5 mr-2 text-primary" />
        {heading}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relevantLinks.map((link, idx) => (
          <Link 
            key={idx} 
            to={link.to}
            className="group flex items-center justify-between p-3 bg-[#0a0a0a] border border-slate-800 rounded-lg hover:border-primary/50 transition-all hover:translate-x-1"
          >
            <span className="text-slate-300 font-medium group-hover:text-primary transition-colors">
              {link.label}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InternalLinkingHelper;