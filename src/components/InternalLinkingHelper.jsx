import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Link as LinkIcon } from 'lucide-react';

const InternalLinkingHelper = ({ currentPage, maxLinks = 5 }) => {
  const links = [
    { to: "/de/pakete", label: "IPTV-Preise ansehen", keywords: ["iptv preise", "pakete"] },
    { to: "/de/installation", label: "Zur Installationsanleitung", keywords: ["installation", "anleitung"] },
    { to: "/de/faq", label: "Häufig gestellte Fragen (FAQ)", keywords: ["faq", "fragen"] },
    { to: "/de/vergleich", label: "Pakete vergleichen", keywords: ["vergleich", "beste"] },
    { to: "/de/guide/iptv-installationsanleitung", label: "Detaillierter Blog-Leitfaden", keywords: ["leitfaden", "blog"] },
    { to: "/de/kanalle", label: "Kanalliste durchsuchen", keywords: ["kanäle", "liste"] },
    { to: "/de/test", label: "Kostenlos testen", keywords: ["test", "ausprobieren"] },
  ];

  // Filter out current page to avoid self-linking
  const relevantLinks = links
    .filter(link => !currentPage.includes(link.to) && link.to !== currentPage)
    .slice(0, maxLinks);

  return (
    <div className="my-12 p-6 bg-slate-900/50 border-l-4 border-purple-500 rounded-r-xl">
      <h3 className="flex items-center text-lg font-bold text-white mb-4">
        <LinkIcon className="w-5 h-5 mr-2 text-purple-400" />
        Weitere interessante Seiten
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relevantLinks.map((link, idx) => (
          <Link 
            key={idx} 
            to={link.to}
            className="group flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg hover:border-purple-500/50 transition-all hover:translate-x-1"
          >
            <span className="text-slate-300 font-medium group-hover:text-purple-400 transition-colors">
              {link.label}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-500 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InternalLinkingHelper;