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

const Footer = ({ contactData: propContactData, siteData }) => {
  const currentYear = new Date().getFullYear();

  const displayData = {
    ...defaultData.contactData,
    ...propContactData,
    ...(siteData?.footer_contact_info || {}),
  };

  const { email, description } = displayData;
  const clusters = TOPIC_CLUSTERS.tr;
  const legalLinks = LEGAL_LINKS.tr;
  const langSwitch = LANG_SWITCH.tr;

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[radial-gradient(circle_at_18%_0%,rgba(229,9,20,0.14),transparent_34rem),linear-gradient(180deg,#080808_0%,#050505_100%)] text-gray-300 shadow-[0_-24px_80px_rgba(0,0,0,0.35)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" aria-hidden />

      <TrustBadges locale="tr" variant="footer" />

      {/* GEO Intelligence: canlı yayın düğümleri + kapsama matrisi + JSON-LD */}
      <FooterGeoMatrix locale="tr" />

      <div className="container mx-auto px-4 pt-14 pb-8">
        <div className="mb-14 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Marka bloğu */}
          <div className="space-y-5 lg:col-span-2">
            <Link to="/" className="inline-block" aria-label="Ana Sayfa" title="Ana sayfa">
              <img
                src={BRAND_LOGO_URL}
                alt="QruzeTV logo"
                width={96}
                height={96}
                className="h-14 w-auto object-contain"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-gray-400">
              {description ||
                'QruzeTV ile TV, telefon ve bilgisayardan IPTV izleyin. Paketler, kanal listesi ve kurulum desteği tek yerde.'}
            </p>
            <span className="luxury-kicker">Premium yayın deneyimi</span>

            {/* İletişim */}
            <div className="pt-2">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Bize ulaşın</p>
              <ul className="space-y-3">
              {/* Telefon / WhatsApp linkleri bilerek kaldırıldı: statik HTML'de
                  duran tel: ve wa.me bağlantılarını spam botları hasat ediyordu.
                  Destek talebi paket/test formu üzerinden alınıyor. */}
              <li className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 shrink-0 text-primary" />
                <Link
                  to="/paketler/"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Paketler ve destek talebi
                </Link>
              </li>
              {email && (
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-600">E-posta</span>
                    <a href={`mailto:${email}`} className="text-sm text-gray-400 transition-colors hover:text-white">{email}</a>
                  </div>
                </li>
              )}
              </ul>
            </div>
          </div>

          {/* Topic cluster navigasyonu — hub & spoke iç link mimarisi */}
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
                      title={link.label}
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

        {/* Alt bar: telif + dil geçişi + yasal */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] pt-8 text-sm text-gray-500 md:flex-row">
          <div className="text-center md:text-left">
            <p>&copy; {currentYear} QruzeTV. Tüm hakları saklıdır.</p>
            <p className="text-[11px] text-gray-600 mt-1 max-w-xl font-light">
              QruzeTV; bağımsız bir yayın teknolojisi ve medya oynatıcı protokol platformudur. Kendi sunucularında telifli içerik barındırmaz, açık standartlarda arayüz ve akış desteği sağlar.
            </p>
          </div>

          <Link
            to={langSwitch.to}
            title={langSwitch.hint}
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs text-gray-400 transition-colors hover:border-primary/40 hover:text-white"
            aria-label={`${langSwitch.hint}: ${langSwitch.label}`}
          >
            <Globe2 className="h-3.5 w-3.5 text-primary" />
            {langSwitch.label}
            <ArrowUpRight className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" />
          </Link>

          <nav aria-label="Yasal bağlantılar" className="flex flex-wrap gap-4 md:gap-6">
            {legalLinks.map((link) => (
              <Link key={link.to} to={link.to} title={link.label} className="transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
