import React, { useState, lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { seoMetadata } from '@/data/seoMetadata';
import { HTML_SITEMAP_DE, HTML_SITEMAP_TR } from '@/data/htmlSitemapLinks';
import { motion } from 'framer-motion';
import {
  Map, Code, ExternalLink, Loader2, Check, ShieldAlert, Heading, Globe, Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateSitemapXml, downloadSitemap } from '@/utils/sitemapGenerator';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const LazyXmlHighlighter = lazy(() =>
  Promise.all([
    import('react-syntax-highlighter'),
    import('react-syntax-highlighter/dist/esm/styles/prism'),
  ]).then(([mod, themeMod]) => {
    const SyntaxHighlighter = mod.Prism;
    const vscDarkPlus = themeMod.vscDarkPlus;
    const XmlHighlighter = ({ children }) => (
      <SyntaxHighlighter
        language="xml"
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: '1.5rem' }}
      >
        {children}
      </SyntaxHighlighter>
    );
    return { default: XmlHighlighter };
  })
);

const HtmlSitemapColumn = ({ title, links, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-800 hover:border-primary/30 transition-all duration-300 h-full"
  >
    <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2 flex items-center gap-2">
      <Globe className="w-5 h-5 text-primary shrink-0" aria-hidden />
      {title}
    </h2>
    <ul className="space-y-2.5">
      {links.map((link) => (
        <li key={link.path}>
          <Link
            to={link.path}
            className="group flex items-center text-slate-400 hover:text-white transition-colors text-sm md:text-base"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 group-hover:bg-primary mr-3 shrink-0" aria-hidden />
            {link.label}
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

  const metadata = seoMetadata?.sitemap || {
    title: 'Site Haritası',
    description: 'Tüm sayfalar',
    keywords: [],
    ogType: 'website',
    ogImage: '',
    twitterCard: 'summary',
  };

  const [xmlPreview, setXmlPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

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

      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans">
        <Header contactData={contactData} siteTexts={siteTexts} />

        <main className="flex-grow pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4 border border-primary/20">
                <Map className="w-4 h-4 text-primary mr-2" aria-hidden />
                <span className="text-primary text-xs font-bold uppercase tracking-wider px-1">HTML Site Haritası</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                Site <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710]">Haritası</span>
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                QruzeTV sitesindeki tüm önemli sayfaların Türkçe ve Almanca canonical bağlantı listesi.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
              <HtmlSitemapColumn title="Türkçe Sayfalar" links={HTML_SITEMAP_TR} delay={0} />
              <HtmlSitemapColumn title="Deutsch / Almanca Sayfalar" links={HTML_SITEMAP_DE} delay={0.1} />
            </div>

            {session ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-20 bg-[#0a0a0a]/60 border border-slate-800 rounded-2xl p-6 md:p-8"
                >
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Heading className="w-5 h-5 text-primary" />
                    H1 / H2 / H3 Başlık Kuralları
                  </h2>
                  <ul className="space-y-3 text-slate-300 text-sm md:text-base">
                    <li className="flex items-start gap-2">
                      <span className="text-[#e50914] font-bold shrink-0">•</span>
                      <span><strong className="text-white">Gizli H1 yasak:</strong> H1 asla sr-only, hidden veya display:none ile gizlenmemelidir.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#e50914] font-bold shrink-0">•</span>
                      <span><strong className="text-white">Hiyerarşi:</strong> H1 → H2 → H3 sırası korunmalı.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#e50914] font-bold shrink-0">•</span>
                      <span><strong className="text-white">Tek H1:</strong> Her sayfada yalnızca bir H1 başlığı kullanılmalı.</span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-[#0a0a0a] border border-slate-800 rounded-2xl p-8 md:p-12"
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8 border-b border-slate-800 pb-8">
                    <div>
                      <div className="inline-flex items-center gap-2 mb-2 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/25">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">Admin</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Code className="w-6 h-6 text-primary" />
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
                        className="bg-[#0a0a0a] text-white hover:bg-[#0a0a0a]"
                      >
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Code className="w-4 h-4 mr-2" />}
                        XML Önizle
                      </Button>
                      <Button
                        onClick={handleDownload}
                        className="bg-primary hover:bg-primary text-white min-w-[140px]"
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
                          <Suspense
                            fallback={
                              <div className="flex items-center gap-2 p-6 text-slate-400 text-xs">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Syntax highlighter yükleniyor…
                              </div>
                            }
                          >
                            <LazyXmlHighlighter>{xmlPreview}</LazyXmlHighlighter>
                          </Suspense>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-800">
                      <h3 className="text-lg font-bold text-white mb-4">Google Search Console</h3>
                      <ol className="list-decimal list-inside text-slate-400 space-y-2 text-sm">
                        <li>Google Search Console hesabınıza giriş yapın.</li>
                        <li>Sol menüden <strong>Sitemaps</strong> sekmesine tıklayın.</li>
                        <li>&quot;Yeni bir site haritası ekleyin&quot; alanına <code>sitemap.xml</code> yazın.</li>
                        <li><strong>Gönder</strong> butonuna tıklayın.</li>
                      </ol>
                    </div>
                    <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-800">
                      <h3 className="text-lg font-bold text-white mb-4">Bing Webmaster Tools</h3>
                      <ol className="list-decimal list-inside text-slate-400 space-y-2 text-sm">
                        <li>Bing Webmaster Tools hesabınıza giriş yapın.</li>
                        <li>Sol menüden <strong>Sitemaps</strong> sekmesini seçin.</li>
                        <li><strong>Submit Sitemap</strong> butonuna tıklayın.</li>
                        <li>Sitemap URL&apos;nizi yapıştırın ve gönderin.</li>
                      </ol>
                    </div>
                  </div>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center rounded-2xl border border-slate-800 bg-[#0a0a0a]/40 p-8"
              >
                <p className="text-slate-400 text-sm">
                  XML sitemap araçları yalnızca yönetici oturumu açıkken görünür.
                </p>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="mt-4 border-slate-700 text-slate-300 hover:text-white"
                >
                  Anasayfaya dön
                </Button>
              </motion.div>
            )}
          </div>
        </main>

        <Footer contactData={contactData} siteTexts={siteTexts} siteData={siteData} />
      </div>
    </>
  );
};

export default SitemapPage;
