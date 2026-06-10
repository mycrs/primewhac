import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Info, 
  Package, 
  LifeBuoy, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle
} from 'lucide-react';
import { defaultData } from '@/data/defaultSiteData';
import { resolveBrandLogoSrc } from '@/constants/brandAssets';

const FooterLink = ({ to, children, ariaLabel }) => (
  <Link 
    to={to} 
    className="block text-gray-400 hover:text-primary hover:underline transition-all duration-300 text-sm py-1.5"
    aria-label={ariaLabel || children}
    onClick={() => window.scrollTo(0, 0)}
  >
    {children}
  </Link>
);

const SocialLink = ({ href, icon: Icon, label }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="p-2.5 rounded-xl bg-[#0a0a0a]/50 hover:bg-primary text-gray-400 hover:text-white transition-all duration-300 shadow-sm border border-slate-700/50"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
};

const FooterLinksSection = ({ contactData: propContactData, siteData }) => {
  const currentYear = new Date().getFullYear();
  
  const displayData = {
    ...defaultData.contactData, 
    ...propContactData,
    ...(siteData?.footer_contact_info || {})
  };

  const {
    phone,
    email,
    address,
    working_hours,
    description,
    social_facebook,
    social_twitter,
    social_instagram,
    social_whatsapp,
    whatsapp,
    logoUrl
  } = displayData;
  const waNumber = (social_whatsapp || whatsapp || '').replace(/\D/g, '');

  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-slate-800/60 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#141414]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 bg-[#0a0a0a]/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-8 shadow-2xl">
          
          {/* 1. Hakkımızda */}
          <div className="space-y-5">
            <p className="text-xl font-bold text-white flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Info className="w-5 h-5 text-primary" />
              </div>
              Hakkımızda
            </p>
            <p className="text-sm leading-relaxed text-slate-400">
              {description || "Kaliteli IPTV paketleri sunan QruzeTV, 10.000+ kanal, film ve dizi arsiviyle ev eglencenizi bir ust seviyeye tasiyor. Donmayan yayin teknolojisi ve 7/24 destek ile hizmetinizdeyiz."}
            </p>
            <div className="flex gap-3 pt-2">
              <SocialLink href={waNumber ? `https://wa.me/${waNumber}` : null} icon={MessageCircle} label="WhatsApp" />
              <SocialLink href={social_instagram} icon={Instagram} label="Instagram" />
              <SocialLink href={social_twitter} icon={Twitter} label="Twitter" />
              <SocialLink href={social_facebook} icon={Facebook} label="Facebook" />
            </div>
          </div>

          {/* 2. IPTV Paketleri */}
          <div className="space-y-5">
            <p className="text-xl font-bold text-white flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2 bg-[#141414]/10 rounded-lg">
                <Package className="w-5 h-5 text-blue-400" />
              </div>
              IPTV Paketleri
            </p>
            <div className="space-y-1.5">
              <FooterLink to="/paketler">Avantajlı IPTV Paketleri</FooterLink>
              <FooterLink to="/channels">4K ve HD Kanal Listesi</FooterLink>
              <FooterLink to="/reseller">IPTV Bayilik Fırsatları</FooterLink>
              <FooterLink to="/test">Ücretsiz IPTV Test Yayını</FooterLink>
              <FooterLink to="/m3u-converter">M3U Listesi Dönüştürücü</FooterLink>
            </div>
          </div>

          {/* 3. Yardım Merkezi */}
          <div className="space-y-5">
            <p className="text-xl font-bold text-white flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2 bg-[#e50914]/10 rounded-lg">
                <LifeBuoy className="w-5 h-5 text-[#e50914]" />
              </div>
              Yardım Merkezi
            </p>
            <div className="space-y-1.5">
              <FooterLink to="/kurulum">IPTV Kurulum Rehberi</FooterLink>
              <FooterLink to="/sss">Sıkça Sorulan Sorular (SSS)</FooterLink>
              <FooterLink to="/guide/iptv-kurulum-rehberi">Detaylı İzleme Rehberi</FooterLink>
              <FooterLink to="/blog">IPTV Blog ve Haberler</FooterLink>
            </div>
          </div>

          {/* 4. İletişim */}
          <div className="space-y-5">
            <p className="text-xl font-bold text-white flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2 bg-pink-500/10 rounded-lg">
                <PhoneCall className="w-5 h-5 text-pink-400" />
              </div>
              İletişim
            </p>
            <ul className="space-y-4">
               {phone && (
                 <li>
                   <a href={`tel:${phone}`} className="flex items-center gap-3 text-sm text-slate-400 hover:text-primary transition-colors group">
                     <div className="p-1.5 rounded-md bg-[#0a0a0a] group-hover:bg-primary/20 transition-colors">
                       <PhoneCall className="w-4 h-4 text-primary" />
                     </div>
                     <span className="break-all">{phone}</span>
                   </a>
                 </li>
               )}
               {email && (
                 <li>
                   <a href={`mailto:${email}`} className="flex items-center gap-3 text-sm text-slate-400 hover:text-primary transition-colors group">
                     <div className="p-1.5 rounded-md bg-[#0a0a0a] group-hover:bg-primary/20 transition-colors">
                       <Mail className="w-4 h-4 text-primary" />
                     </div>
                     <span className="break-all">{email}</span>
                   </a>
                 </li>
               )}
               {address && (
                 <li className="flex items-start gap-3 text-sm text-slate-400 group">
                   <div className="p-1.5 rounded-md bg-[#0a0a0a] shrink-0 mt-0.5">
                     <MapPin className="w-4 h-4 text-primary" />
                   </div>
                   <span>{address}</span>
                 </li>
               )}
               {working_hours && (
                 <li className="flex items-start gap-3 text-sm text-slate-400 group">
                   <div className="p-1.5 rounded-md bg-[#0a0a0a] shrink-0 mt-0.5">
                     <Clock className="w-4 h-4 text-primary" />
                   </div>
                   <span>{working_hours}</span>
                 </li>
               )}
             </ul>
          </div>

        </div>

        {/* Bottom Bar: Legal & Copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
             <img src={resolveBrandLogoSrc(logoUrl)} alt="QruzeTV logosu" className="h-8 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
            <p className="text-sm text-slate-500">&copy; {currentYear} QruzeTV. Tüm hakları saklıdır.</p>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-6" aria-label="Yasal Linkler">
            <Link to="/gizlilik" className="text-sm text-slate-500 hover:text-white transition-colors">Gizlilik Politikası</Link>
            <Link to="/sartlar" className="text-sm text-slate-500 hover:text-white transition-colors">Hizmet Şartları</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default FooterLinksSection;