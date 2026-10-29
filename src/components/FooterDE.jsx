import React, { memo } from 'react';
import {
  MessageCircle, Mail, Globe2, ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { defaultData } from '@/data/defaultSiteData';
import { BRAND_LOGO_URL } from '@/constants/brandAssets';
import TrustBadges from '@/components/TrustBadges';
import FooterGeoMatrix from '@/components/footer/FooterGeoMatrix';
import { TOPIC_CLUSTERS, LEGAL_LINKS, LANG_SWITCH } from '@/data/footerGeoIntelligence';

const FooterDE = ({ contactData: propContactData, siteData }) => {
  const currentYear = new Date().getFullYear();

  const displayData = {
    ...defaultData.contactData,
    ...propContactData,
    ...(siteData?.footer_contact_info || {}),
  };

  const { email } = displayData;
  const clusters = TOPIC_CLUSTERS.de;
  const legalLinks = LEGAL_LINKS.de;
  const langSwitch = LANG_SWITCH.de;

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[radial-gradient(circle_at_18%_0%,rgba(229,9,20,0.14),transparent_34rem),linear-gradient(180deg,#080808_0%,#050505_100%)] text-gray-300 shadow-[0_-24px_80px_rgba(0,0,0,0.35)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" aria-hidden />

      <TrustBadges locale="de" variant="footer" />

      {/* GEO Intelligence: Broadcast-Knoten + Verfügbarkeitsmatrix + JSON-LD */}
      <FooterGeoMatrix locale="de" />

      <div className="container mx-auto px-4 pt-14 pb-8">
        <div className="mb-14 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Markenblock */}
          <div className="space-y-5 lg:col-span-2">
            <Link to="/de" className="inline-block">
              <img
                src={BRAND_LOGO_URL}
                alt="QruzeTV logo"
                className="h-14 w-auto object-contain"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-gray-400">
              Mit QruzeTV schauen Sie IPTV auf TV, Smartphone und Computer. Pakete, Kanalliste und Einrichtungshilfe an einem Ort.
            </p>
            <span className="luxury-kicker">Premium Streaming</span>

            {/* Kontakt */}
            <div className="pt-2">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Kontakt</p>
              <ul className="space-y-3">
              {/* Telefon- / WhatsApp-Links bewusst entfernt: tel:- und wa.me-Links
                  im statischen HTML wurden von Spam-Bots abgegriffen.
                  Supportanfragen laufen über das Paket-/Testformular. */}
              <li className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 shrink-0 text-primary" />
                <Link
                  to="/de/pakete/"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Pakete und Supportanfrage
                </Link>
              </li>
              {email && (
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-600">E-Mail</span>
                    <a href={`mailto:${email}`} className="text-sm text-gray-400 transition-colors hover:text-white">{email}</a>
                  </div>
                </li>
              )}
              </ul>
            </div>
          </div>

          {/* Topic-Cluster-Navigation — Hub-&-Spoke-Verlinkung */}
          {clusters.map((cluster) => (
            <nav key={cluster.id} aria-label={cluster.title}>
              <p className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
                {cluster.title}
              </p>
              <ul className="space-y-2.5">
                {cluster.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="inline-block text-sm text-gray-400 transition-all duration-200 hover:translate-x-0.5 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Untere Leiste: Copyright + Sprachwechsel + Rechtliches */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] pt-8 text-sm text-gray-500 md:flex-row">
          <p>&copy; {currentYear} QruzeTV. Alle Rechte vorbehalten.</p>

          <Link
            to={langSwitch.to}
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs text-gray-400 transition-colors hover:border-primary/40 hover:text-white"
            aria-label={`${langSwitch.hint}: ${langSwitch.label}`}
          >
            <Globe2 className="h-3.5 w-3.5 text-primary" />
            {langSwitch.label}
            <ArrowUpRight className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" />
          </Link>

          <nav aria-label="Rechtliche Links" className="flex flex-wrap gap-4 md:gap-6">
            {legalLinks.map((link) => (
              <Link key={link.to} to={link.to} className="transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default memo(FooterDE);
