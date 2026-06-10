import React, { memo } from 'react';
import { 
  Phone, Mail, Globe, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { defaultData } from '@/data/defaultSiteData';
import { BRAND_LOGO_URL } from '@/constants/brandAssets';
import TrustBadges from '@/components/TrustBadges';
import { whatsappHref } from '@/utils/whatsappCustomer';
import { trackWhatsAppClick } from '@/utils/analyticsTracking';

const FooterDE = ({ contactData: propContactData, siteData }) => {
  const currentYear = new Date().getFullYear();
  
  const displayData = {
    ...defaultData.contactData, 
    ...propContactData,
    ...(siteData?.footer_contact_info || {})
  };

  const { company_name = 'QruzeTV', phone, whatsapp, email } = displayData;
  const whatsappLink = whatsappHref(whatsapp || phone, 'Hallo, ich möchte Informationen zu QruzeTV-Paketen erhalten.');

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[radial-gradient(circle_at_18%_0%,rgba(229,9,20,0.16),transparent_34rem),linear-gradient(180deg,#080808_0%,#050505_100%)] text-gray-300 pb-8 shadow-[0_-24px_80px_rgba(0,0,0,0.35)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" aria-hidden />
      <TrustBadges locale="de" variant="footer" />
      <div className="container mx-auto px-4 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/de" className="inline-block">
              <img src={BRAND_LOGO_URL} alt="QruzeTV logo" className="h-14 w-auto object-contain" loading="lazy" decoding="async" />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              QruzeTV bietet erstklassige IPTV-Pakete mit 10.000+ Kanälen, Filmen und Serien für Ihr Zuhause.
            </p>
            <span className="luxury-kicker">Premium Streaming</span>
          </div>

          <div>
            <p className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Angebote
            </p>
            <ul className="space-y-3">
              <li><Link to="/de/pakete" className="hover:text-primary/90 transition-colors">IPTV Pakete</Link></li>
              <li><Link to="/de/spielplan" className="hover:text-primary/90 transition-colors">Spielplan</Link></li>
              <li><Link to="/de/kanale" className="hover:text-primary/90 transition-colors">Kanalliste</Link></li>
              <li><Link to="/de/reseller" className="hover:text-primary/90 transition-colors">Reseller werden</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Hilfe
            </p>
            <ul className="space-y-3">
              <li><Link to="/de/einrichtung" className="hover:text-primary/90 transition-colors">Installationsanleitung</Link></li>
              <li><Link to="/de/guide/iptv-kurulum-rehberi" className="hover:text-primary/90 transition-colors">Detaillierte Installationsanleitung</Link></li>
              <li><Link to="/de/m3u-olustur" className="hover:text-primary/90 transition-colors">M3U erstellen</Link></li>
              <li><Link to="/de/blog" className="hover:text-primary/90 transition-colors">Blog</Link></li>
              <li><Link to="/de/sss" className="hover:text-primary/90 transition-colors">FAQ</Link></li>
              <li><Link to="/de/bewertungen" className="hover:text-primary/90 transition-colors">Kundenbewertungen</Link></li>
              <li><Link to="/de/test" className="hover:text-primary/90 transition-colors">Kostenloser Test</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Rechtliches
            </h3>
            <ul className="space-y-3">
              <li><Link to="/de/uber-uns" className="hover:text-primary/90 transition-colors">Über uns</Link></li>
              <li><Link to="/de/privacy" className="hover:text-primary/90 transition-colors">Datenschutz</Link></li>
              <li><Link to="/de/terms" className="hover:text-primary/90 transition-colors">AGB</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Kontakt
            </p>
            <ul className="space-y-4">
              {phone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary" />
                  <a href={`tel:${phone}`} className="hover:text-primary/90 transition-colors">{phone}</a>
                </li>
              )}
              {(whatsapp || phone) && (
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary" />
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick('footer_de')}
                    className="hover:text-primary/90 transition-colors"
                  >
                    Schneller WhatsApp-Support
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary" />
                  <a href={`mailto:${email}`} className="hover:text-primary/90 transition-colors">{email}</a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {currentYear} QruzeTV. Alle Rechte vorbehalten.</p>
          <div className="flex flex-wrap gap-4 md:gap-6">
            <Link to="/de/uber-uns" className="hover:text-white transition-colors">Über uns</Link>
            <Link to="/de/privacy" className="hover:text-white transition-colors">Datenschutz</Link>
            <Link to="/de/terms" className="hover:text-white transition-colors">AGB</Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(FooterDE);