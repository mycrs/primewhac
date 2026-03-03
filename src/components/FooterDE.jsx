import React, { memo } from 'react';
import { 
  Phone, Mail, Globe, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { defaultData } from '@/data/defaultSiteData';

const FooterDE = ({ contactData: propContactData, siteData }) => {
  const currentYear = new Date().getFullYear();
  const NEW_LOGO_URL = "https://horizons-cdn.hostinger.com/6f4a665f-b1cc-4753-8f96-f98db31dd5f3/ee7b00c4d7684d8a8e7320e9b78634fe.png";
  
  const displayData = {
    ...defaultData.contactData, 
    ...propContactData,
    ...(siteData?.footer_contact_info || {})
  };

  const { company_name = 'QRUZE TV Premium IPTV', phone, email } = displayData;

  return (
    <footer className="bg-[#0a0a16] border-t border-[#2a2a40] text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/de" className="inline-block">
              <img src={NEW_LOGO_URL} alt="QRUZE TV" className="h-14 w-auto object-contain" />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              QRUZE TV bietet erstklassige IPTV-Pakete mit Tausenden von Kanälen, Filmen und Serien für Ihr Zuhause.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" />
              Angebote
            </h3>
            <ul className="space-y-3">
              <li><Link to="/de/pakete" className="hover:text-purple-400 transition-colors">IPTV Pakete</Link></li>
              <li><Link to="/de/spielplan" className="hover:text-purple-400 transition-colors">Spielplan</Link></li>
              <li><Link to="/de/kanale" className="hover:text-purple-400 transition-colors">Kanalliste</Link></li>
              <li><Link to="/de/reseller" className="hover:text-purple-400 transition-colors">Reseller werden</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-500" />
              Hilfe
            </h3>
            <ul className="space-y-3">
              <li><Link to="/de/einrichtung" className="hover:text-purple-400 transition-colors">Installationsanleitung</Link></li>
              <li><Link to="/de/guide/iptv-kurulum-rehberi" className="hover:text-purple-400 transition-colors">Detaillierte Installationsanleitung</Link></li>
              <li><Link to="/de/sss" className="hover:text-purple-400 transition-colors">FAQ</Link></li>
              <li><Link to="/de/test" className="hover:text-purple-400 transition-colors">Kostenloser Test</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-500" />
              Rechtliches
            </h3>
            <ul className="space-y-3">
              <li><Link to="/de/uber-uns" className="hover:text-purple-400 transition-colors">Über uns</Link></li>
              <li><Link to="/de/privacy" className="hover:text-purple-400 transition-colors">Datenschutz</Link></li>
              <li><Link to="/de/terms" className="hover:text-purple-400 transition-colors">AGB</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5 text-purple-500" />
              Kontakt
            </h3>
            <ul className="space-y-4">
              {phone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-purple-500" />
                  <a href={`tel:${phone}`} className="hover:text-purple-400 transition-colors">{phone}</a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-purple-500" />
                  <a href={`mailto:${email}`} className="hover:text-purple-400 transition-colors">{email}</a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#2a2a40] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {currentYear} {company_name}. Alle Rechte vorbehalten.</p>
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