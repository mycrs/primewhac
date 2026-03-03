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

const FooterLink = ({ to, children, ariaLabel }) => (
  <Link 
    to={to} 
    className="block text-gray-400 hover:text-purple-400 hover:underline transition-all duration-300 text-sm py-1.5"
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
      className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-purple-600 text-gray-400 hover:text-white transition-all duration-300 shadow-sm border border-slate-700/50"
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
    company_name = 'Qruze IPTV',
    phone,
    email,
    address,
    working_hours,
    description,
    social_facebook,
    social_twitter,
    social_instagram,
    social_whatsapp,
    logoUrl
  } = displayData;

  return (
    <footer className="w-full bg-[#0F172A] border-t border-slate-800/60 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-8 shadow-2xl">
          
          {/* 1. Hakkımızda */}
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-white flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Info className="w-5 h-5 text-purple-400" />
              </div>
              Hakkımızda
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              {description || "Kaliteli IPTV paketleri sunan Qruze IPTV, binlerce kanal, film ve dizi arşiviyle ev eğlencenizi bir üst seviyeye taşıyor. Donmayan yayın teknolojisi ve 7/24 destek ile hizmetinizdeyiz."}
            </p>
            <div className="flex gap-3 pt-2">
              <SocialLink href={social_whatsapp ? `https://wa.me/${social_whatsapp}` : null} icon={MessageCircle} label="WhatsApp" />
              <SocialLink href={social_instagram} icon={Instagram} label="Instagram" />
              <SocialLink href={social_twitter} icon={Twitter} label="Twitter" />
              <SocialLink href={social_facebook} icon={Facebook} label="Facebook" />
            </div>
          </div>

          {/* 2. IPTV Paketleri */}
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-white flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Package className="w-5 h-5 text-blue-400" />
              </div>
              IPTV Paketleri
            </h3>
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
            <h3 className="text-xl font-bold text-white flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <LifeBuoy className="w-5 h-5 text-emerald-400" />
              </div>
              Yardım Merkezi
            </h3>
            <div className="space-y-1.5">
              <FooterLink to="/installation">IPTV Kurulum Rehberi</FooterLink>
              <FooterLink to="/faq">Sıkça Sorulan Sorular (SSS)</FooterLink>
              <FooterLink to="/guide/iptv-kurulum-rehberi">Detaylı İzleme Rehberi</FooterLink>
              <FooterLink to="/blog">IPTV Blog ve Haberler</FooterLink>
            </div>
          </div>

          {/* 4. İletişim */}
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-white flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2 bg-pink-500/10 rounded-lg">
                <PhoneCall className="w-5 h-5 text-pink-400" />
              </div>
              İletişim
            </h3>
            <ul className="space-y-4">
               {phone && (
                 <li>
                   <a href={`tel:${phone}`} className="flex items-center gap-3 text-sm text-slate-400 hover:text-purple-400 transition-colors group">
                     <div className="p-1.5 rounded-md bg-slate-800 group-hover:bg-purple-500/20 transition-colors">
                       <PhoneCall className="w-4 h-4 text-purple-400" />
                     </div>
                     <span className="break-all">{phone}</span>
                   </a>
                 </li>
               )}
               {email && (
                 <li>
                   <a href={`mailto:${email}`} className="flex items-center gap-3 text-sm text-slate-400 hover:text-purple-400 transition-colors group">
                     <div className="p-1.5 rounded-md bg-slate-800 group-hover:bg-purple-500/20 transition-colors">
                       <Mail className="w-4 h-4 text-purple-400" />
                     </div>
                     <span className="break-all">{email}</span>
                   </a>
                 </li>
               )}
               {address && (
                 <li className="flex items-start gap-3 text-sm text-slate-400 group">
                   <div className="p-1.5 rounded-md bg-slate-800 shrink-0 mt-0.5">
                     <MapPin className="w-4 h-4 text-purple-400" />
                   </div>
                   <span>{address}</span>
                 </li>
               )}
               {working_hours && (
                 <li className="flex items-start gap-3 text-sm text-slate-400 group">
                   <div className="p-1.5 rounded-md bg-slate-800 shrink-0 mt-0.5">
                     <Clock className="w-4 h-4 text-purple-400" />
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
             {logoUrl ? (
                <img src={logoUrl} alt={company_name} className="h-8 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
             ) : (
                <span className="text-xl font-black bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent opacity-80">Q</span>
             )}
            <p className="text-sm text-slate-500">&copy; {currentYear} {company_name}. Tüm hakları saklıdır.</p>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-6" aria-label="Yasal Linkler">
            <Link to="/privacy" className="text-sm text-slate-500 hover:text-white transition-colors">Gizlilik Politikası</Link>
            <Link to="/terms" className="text-sm text-slate-500 hover:text-white transition-colors">Hizmet Şartları</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default FooterLinksSection;