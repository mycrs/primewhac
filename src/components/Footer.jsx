import React, { memo } from 'react';
import { 
  MessageCircle, Phone, Mail, MapPin, 
  ShieldCheck, Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { defaultData } from '@/data/defaultSiteData';
import { BRAND_LOGO_URL } from '@/constants/brandAssets';
import TrustBadges from '@/components/TrustBadges';
import { whatsappHref } from '@/utils/whatsappCustomer';
import { trackWhatsAppClick } from '@/utils/analyticsTracking';

const Footer = ({ contactData: propContactData, siteData }) => {
  const currentYear = new Date().getFullYear();
  
  const displayData = {
    ...defaultData.contactData, 
    ...propContactData,
    ...(siteData?.footer_contact_info || {})
  };

  const {
    company_name = 'QruzeTV',
    phone,
    whatsapp,
    email,
    working_hours,
    description
  } = displayData;
  const whatsappLink = whatsappHref(whatsapp || phone, 'Merhaba, QruzeTV paketleri hakkında bilgi almak istiyorum.');

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[radial-gradient(circle_at_18%_0%,rgba(229,9,20,0.16),transparent_34rem),linear-gradient(180deg,#080808_0%,#050505_100%)] text-gray-300 pb-8 shadow-[0_-24px_80px_rgba(0,0,0,0.35)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" aria-hidden />
      <TrustBadges locale="tr" variant="footer" />
      <div className="container mx-auto px-4 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img src={BRAND_LOGO_URL} alt="QruzeTV logo" className="h-14 w-auto object-contain" loading="lazy" decoding="async" />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              {description || "Kaliteli IPTV paketleri sunan QruzeTV, 10.000+ kanal, film ve dizi arşiviyle ev eğlencenizi bir üst seviyeye taşıyor."}
            </p>
            <span className="luxury-kicker">Premium yayın deneyimi</span>
          </div>

          <div>
            <p className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Paketler
            </p>
            <ul className="space-y-3">
              <li><Link to="/paketler" className="hover:text-primary/90 transition-colors">IPTV Paketleri</Link></li>
              <li><Link to="/channels" className="hover:text-primary/90 transition-colors">Kanal Listesi</Link></li>
              <li><Link to="/reseller" className="hover:text-primary/90 transition-colors">Bayilik Başvurusu</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Destek
            </p>
            <ul className="space-y-3">
              <li><Link to="/kurulum" className="hover:text-primary/90 transition-colors">Kurulum Rehberi</Link></li>
              <li><Link to="/guide/iptv-kurulum-rehberi" className="hover:text-primary/90 transition-colors">Detaylı Kurulum Rehberi</Link></li>
              <li><Link to="/m3u-converter" className="hover:text-primary/90 transition-colors">M3U Dönüştür</Link></li>
              <li><Link to="/blog" className="hover:text-primary/90 transition-colors">Blog</Link></li>
              <li><Link to="/sss" className="hover:text-primary/90 transition-colors">Sıkça Sorulan Sorular</Link></li>
              <li><Link to="/yorumlar" className="hover:text-primary/90 transition-colors">Müşteri Yorumları</Link></li>
              <li><Link to="/test" className="hover:text-primary/90 transition-colors">Ücretsiz Test</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Yasal
            </p>
            <ul className="space-y-3">
              <li><Link to="/hakkimizda" className="hover:text-primary/90 transition-colors">Hakkımızda</Link></li>
              <li><Link to="/privacy" className="hover:text-primary/90 transition-colors">Gizlilik Politikası</Link></li>
              <li><Link to="/terms" className="hover:text-primary/90 transition-colors">Hizmet Şartları</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              İletişim
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
                  <MessageCircle className="w-4 h-4 text-primary" />
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick('footer_tr')}
                    className="hover:text-primary/90 transition-colors"
                  >
                    WhatsApp ile hızlı destek
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
          <p>&copy; {currentYear} QruzeTV. Tüm hakları saklıdır.</p>
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