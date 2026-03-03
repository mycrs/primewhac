import React, { memo } from 'react';
import { 
  MessageCircle, Phone, Mail, MapPin, 
  Instagram, ShieldCheck, Globe, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { defaultData } from '@/data/defaultSiteData';

const Footer = ({ contactData: propContactData, siteData }) => {
  const currentYear = new Date().getFullYear();
  const NEW_LOGO_URL = "https://horizons-cdn.hostinger.com/6f4a665f-b1cc-4753-8f96-f98db31dd5f3/ee7b00c4d7684d8a8e7320e9b78634fe.png";
  
  const displayData = {
    ...defaultData.contactData, 
    ...propContactData,
    ...(siteData?.footer_contact_info || {})
  };

  const {
    company_name = 'QRUZE TV Premium IPTV',
    phone,
    email,
    working_hours,
    description
  } = displayData;

  return (
    <footer className="bg-[#0a0a16] border-t border-[#2a2a40] text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img src={NEW_LOGO_URL} alt="QRUZE TV" className="h-14 w-auto object-contain" />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              {description || "Kaliteli IPTV paketleri sunan QRUZE TV, binlerce kanal, film ve dizi arşiviyle ev eğlencenizi bir üst seviyeye taşıyor."}
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" />
              Paketler
            </h3>
            <ul className="space-y-3">
              <li><Link to="/paketler" className="hover:text-purple-400 transition-colors">IPTV Paketleri</Link></li>
              <li><Link to="/channels" className="hover:text-purple-400 transition-colors">Kanal Listesi</Link></li>
              <li><Link to="/bayilik" className="hover:text-purple-400 transition-colors">Bayilik Başvurusu</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-500" />
              Destek
            </h3>
            <ul className="space-y-3">
              <li><Link to="/kurulum" className="hover:text-purple-400 transition-colors">Kurulum Rehberi</Link></li>
              <li><Link to="/guide/iptv-kurulum-rehberi" className="hover:text-purple-400 transition-colors">Detaylı Kurulum Rehberi</Link></li>
              <li><Link to="/sss" className="hover:text-purple-400 transition-colors">Sıkça Sorulan Sorular</Link></li>
              <li><Link to="/test" className="hover:text-purple-400 transition-colors">Ücretsiz Test</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-500" />
              Yasal
            </h3>
            <ul className="space-y-3">
              <li><Link to="/hakkimizda" className="hover:text-purple-400 transition-colors">Hakkımızda</Link></li>
              <li><Link to="/privacy" className="hover:text-purple-400 transition-colors">Gizlilik Politikası</Link></li>
              <li><Link to="/terms" className="hover:text-purple-400 transition-colors">Hizmet Şartları</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5 text-purple-500" />
              İletişim
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
          <p>&copy; {currentYear} {company_name}. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap gap-4 md:gap-6">
            <Link to="/hakkimizda" className="hover:text-white transition-colors">Hakkımızda</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Hizmet Şartları</Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">Site Haritası</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);