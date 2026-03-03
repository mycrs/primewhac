import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { seoMetadata } from '@/data/seoMetadata';
import { motion } from 'framer-motion';
import { 
  Map, Home, Box, BookOpen, Tv, Settings, HelpCircle, 
  UserPlus, Phone, Lock, FileText, Smartphone, Download, 
  Code, ExternalLink, Loader2, Check, ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateSitemapXml, downloadSitemap } from '@/utils/sitemapGenerator';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const SitemapSection = ({ title, links, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-purple-500/30 transition-all duration-300 h-full"
  >
    <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">{title}</h3>
    <ul className="space-y-3">
      {links.map((link, idx) => (
        <li key={idx}>
          <Link 
            to={link.path}
            className="group flex items-center text-slate-400 hover:text-white transition-colors"
          >
            <div className="p-1.5 rounded-md bg-slate-800 group-hover:bg-purple-500/20 mr-3 transition-colors">
              <link.icon className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
            </div>
            <span>{link.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  </motion.div>
);

const SitemapPage = ({ siteData }) => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { contactData, siteTexts } = siteData;
  
  // Safe access to metadata with fallback
  const metadata = seoMetadata?.sitemap || {
    title: "Site Haritası",
    description: "Tüm sayfalar",
    keywords: [],
    ogType: "website",
    ogImage: "",
    twitterCard: "summary"
  };

  const [xmlPreview, setXmlPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Unauthorized View
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
        <Header contactData={contactData} siteTexts={siteTexts} />
        <main className="flex-grow flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-[#1F2937] border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Yetkisiz Erişim</h1>
            <p className="text-gray-400 mb-8">
              Bu sayfayı görüntülemek için yönetici yetkisine sahip olmanız gerekmektedir.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-white text-black hover:bg-gray-200 font-bold"
            >
              Anasayfaya Dön
            </Button>
          </motion.div>
        </main>
        <Footer contactData={contactData} siteTexts={siteTexts} siteData={siteData} />
      </div>
    );
  }

  const sections = [
    {
      title: "Ana Sayfalar",
      links: [
        { label: "Ana Sayfa", path: "/", icon: Home },
        { label: "Hakkımızda", path: "/hakkimizda", icon: BookOpen },
        { label: "İletişim", path: "/#contact", icon: Phone },
      ]
    },
    {
      title: "Ürünler & Hizmetler",
      links: [
        { label: "Paketler", path: "/paketler", icon: Box },
        { label: "Kanal Listesi", path: "/channels", icon: Tv },
        { label: "Bayilik", path: "/reseller", icon: UserPlus },
      ]
    },
    {
      title: "Destek & Kurulum",
      links: [
        { label: "Kurulum Rehberi", path: "/installation", icon: Settings },
        { label: "Sıkça Sorulan Sorular", path: "/faq", icon: HelpCircle },
        { label: "M3U Dönüştürücü", path: "/m3u-converter", icon: Code },
      ]
    },
    {
      title: "İçerik & Medya",
      links: [
        { label: "Blog", path: "/blog", icon: BookOpen },
        { label: "Uygulamalar", path: "/installation", icon: Smartphone },
      ]
    },
    {
      title: "Yasal & Kurumsal",
      links: [
        { label: "Gizlilik Politikası", path: "/privacy", icon: Lock },
        { label: "Hizmet Şartları", path: "/terms", icon: FileText },
        { label: "Site Haritası", path: "/sitemap", icon: Map },
      ]
    }
  ];

  const handlePreview = async () => {
    setLoading(true);
    try {
      const xml = await generateSitemapXml();
      setXmlPreview(xml);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    const success = await downloadSitemap();
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
    setLoading(false);
  };

  return (
    <>
      <SEOHead 
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        ogType={metadata.ogType}
        ogImage={metadata.ogImage}
        twitterCard={metadata.twitterCard}
      />

      <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
        <Header contactData={contactData} siteTexts={siteTexts} />
        
        <main className="flex-grow pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Hero Section */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center p-2 bg-purple-500/10 rounded-full mb-4 border border-purple-500/20">
                <span className="text-purple-400 text-xs font-bold uppercase tracking-wider px-2">Admin Only</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                Site <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Haritası</span>
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                Web sitemizdeki tüm sayfaların hiyerarşik listesi ve arama motorları için optimize edilmiş XML yapısı.
              </p>
            </motion.div>

            {/* Visual Sitemap Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {sections.map((section, idx) => (
                <SitemapSection 
                  key={idx} 
                  title={section.title} 
                  links={section.links} 
                  delay={idx * 0.1} 
                />
              ))}
            </div>

            {/* XML Generator & Tools Section */}
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12"
            >
               <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8 border-b border-slate-800 pb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      <Code className="w-6 h-6 text-purple-500" />
                      XML Sitemap & Robots.txt
                    </h2>
                    <p className="text-slate-400">
                      Arama motorları için canlı sitemap oluşturun, önizleyin veya indirin.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                     <Button 
                       variant="outline" 
                       className="border-slate-700 text-slate-300 hover:text-white"
                       onClick={() => window.open('/robots.txt', '_blank')}
                     >
                       <ExternalLink className="w-4 h-4 mr-2" />
                       robots.txt Görüntüle
                     </Button>
                     <Button 
                        onClick={handlePreview}
                        variant="secondary"
                        disabled={loading}
                        className="bg-slate-800 text-white hover:bg-slate-700"
                     >
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Code className="w-4 h-4 mr-2" />}
                        XML Önizle
                     </Button>
                     <Button 
                        onClick={handleDownload}
                        className="bg-purple-600 hover:bg-purple-700 text-white min-w-[140px]"
                        disabled={loading}
                     >
                        {loading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : downloadSuccess ? (
                          <Check className="w-4 h-4 mr-2" />
                        ) : (
                          <Download className="w-4 h-4 mr-2" />
                        )}
                        {downloadSuccess ? 'İndirildi!' : 'Sitemap İndir'}
                     </Button>
                  </div>
               </div>

               {/* XML Preview Area */}
               {xmlPreview && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   className="mb-8"
                 >
                   <div className="rounded-lg overflow-hidden border border-slate-800 bg-[#1e1e1e]">
                      <div className="bg-[#252526] px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                        <span className="text-xs text-slate-400 font-mono">sitemap.xml (Önizleme)</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-xs text-slate-400 hover:text-white" 
                          onClick={() => setXmlPreview('')}
                        >
                          Kapat
                        </Button>
                      </div>
                      <div className="max-h-[400px] overflow-auto custom-scrollbar text-xs md:text-sm">
                        <SyntaxHighlighter language="xml" style={vscDarkPlus} customStyle={{ margin: 0, padding: '1.5rem' }}>
                          {xmlPreview}
                        </SyntaxHighlighter>
                      </div>
                   </div>
                 </motion.div>
               )}

               {/* Submission Instructions */}
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/2/22/Google_Search_Console_logo_%282016-2022%29.png" alt="Google" className="w-5 h-5 opacity-80" />
                       Google Search Console
                    </h3>
                    <ol className="list-decimal list-inside text-slate-400 space-y-2 text-sm">
                       <li>Google Search Console hesabınıza giriş yapın.</li>
                       <li>Sol menüden <strong>Sitemaps</strong> (Site Haritaları) sekmesine tıklayın.</li>
                       <li>"Yeni bir site haritası ekleyin" alanına <code>sitemap.xml</code> yazın.</li>
                       <li><strong>Gönder</strong> butonuna tıklayın.</li>
                    </ol>
                  </div>

                  <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Bing_logo_%282016%29.svg" alt="Bing" className="w-5 h-5 opacity-80 grayscale" />
                       Bing Webmaster Tools
                    </h3>
                    <ol className="list-decimal list-inside text-slate-400 space-y-2 text-sm">
                       <li>Bing Webmaster Tools hesabınıza giriş yapın.</li>
                       <li>Sol menüden <strong>Sitemaps</strong> sekmesini seçin.</li>
                       <li>Sağ üstteki <strong>Submit Sitemap</strong> butonuna tıklayın.</li>
                       <li>Sitemap URL'nizi tam olarak yapıştırın (örn: <code>https://site.com/sitemap.xml</code>).</li>
                       <li><strong>Submit</strong> butonuna tıklayın.</li>
                    </ol>
                  </div>
               </div>
            </motion.div>
          </div>
        </main>

        <Footer contactData={contactData} siteTexts={siteTexts} siteData={siteData} />
      </div>
    </>
  );
};

export default SitemapPage;