import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Server, Copy, Check, ExternalLink, Globe, 
  AlertCircle, FileCode, RefreshCw, XCircle, Search, HelpCircle,
  FileText, Info, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const CopyableField = ({ label, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0a0a0a] border border-slate-800 rounded-lg p-4 mb-4">
      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">{label}</label>
      <div className="flex items-center justify-between gap-4">
        <code className="text-primary font-mono text-sm break-all">{value}</code>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleCopy}
          className="hover:bg-primary/10 hover:text-primary text-slate-400 shrink-0"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  if (status === 'success') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
        <Check className="w-3 h-3 mr-1" />
        Başarılı
      </span>
    );
  } else if (status === 'error') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
        <XCircle className="w-3 h-3 mr-1" />
        Hata
      </span>
    );
  } else if (status === 'loading') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
        Kontrol
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0a0a0a] text-slate-400">
        <HelpCircle className="w-3 h-3 mr-1" />
        Bekliyor
      </span>
    );
  }
};

const BingVerificationPage = ({ siteData }) => {
  const { contactData, siteTexts } = siteData;
  const { session } = useAuth();

  const [verificationStatus, setVerificationStatus] = useState({
    xml: 'idle',
    meta: 'idle',
    cname: 'idle'
  });

  const checkStatus = async () => {
    // 1. Check XML File
    setVerificationStatus(prev => ({ ...prev, xml: 'loading', meta: 'loading', cname: 'loading' }));
    
    let xmlStatus = 'error';
    try {
      const response = await fetch('/BingSiteAuth.xml');
      if (response.ok) {
        const text = await response.text();
        if (text.includes('CA8DF3D0A50E3D150C561F86C75418F8')) {
          xmlStatus = 'success';
        }
      }
    } catch (e) {
      console.error("XML check failed", e);
    }

    // 2. Check Meta Tag
    let metaStatus = 'error';
    const metaTag = document.querySelector('meta[name="msvalidate.01"]');
    if (metaTag && metaTag.getAttribute('content') === 'CA8DF3D0A50E3D150C561F86C75418F8') {
      metaStatus = 'success';
    }

    // 3. DNS Check (Simulated for frontend)
    let cnameStatus = 'idle';

    setTimeout(() => {
      setVerificationStatus({
        xml: xmlStatus,
        meta: metaStatus,
        cname: cnameStatus 
      });
    }, 800);
  };

  useEffect(() => {
    checkStatus();
  }, []);
  
  return (
    <>
      <SEOHead 
        title="Bing Doğrulama Merkezi | QruzeTV" 
        description="Bing Webmaster Tools doğrulama talimatları, XML dosyası, Meta Etiketi ve Hostinger DNS CNAME ayarları."
        keywords={["bing doğrulama", "hostinger dns", "webmaster tools", "seo", "bingsiteauth", "cname"]}
        ogType="article"
        noindex
      />

      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans">
        <Header contactData={contactData} siteTexts={siteTexts} />
        
        <main className="flex-grow pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6 ring-1 ring-primary/20">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Bing_logo_%282016%29.svg" alt="Bing logosu" className="w-8 h-8 opacity-90" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-6">
                Bing Webmaster <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710]">Doğrulama</span>
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                Sitenizi Bing arama motorunda indekslemek için gerekli 3 farklı doğrulama yöntemi ve adım adım rehber.
              </p>
            </motion.div>

            {/* Verification Status Checker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0a0a0a] border border-slate-800 rounded-2xl p-6 md:p-8 mb-12 shadow-xl shadow-primary/10"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-primary" />
                    Canlı Sistem Kontrolü
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">Sitenizin anlık durumunu kontrol eder.</p>
                </div>
                <Button onClick={checkStatus} variant="outline" className="border-slate-700 text-slate-300 hover:text-white">
                  <RefreshCw className={`w-4 h-4 mr-2 ${verificationStatus.meta === 'loading' ? 'animate-spin' : ''}`} />
                  Tekrar Tara
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Check 1: XML */}
                <div className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors ${verificationStatus.xml === 'success' ? 'bg-green-500/5 border-green-500/20' : 'bg-[#0a0a0a]/50 border-slate-800'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-slate-200 font-semibold">
                      <FileCode className="w-4 h-4 text-orange-400" />
                      XML Dosyası
                    </div>
                    <StatusBadge status={verificationStatus.xml} />
                  </div>
                  <p className="text-xs text-slate-500">
                    {verificationStatus.xml === 'success' 
                      ? 'BingSiteAuth.xml dosyası başarılı bir şekilde oluşturuldu ve erişilebilir.' 
                      : 'Dosya bulunamadı veya içeriği hatalı.'}
                  </p>
                  {verificationStatus.xml === 'success' && (
                    <a href="/BingSiteAuth.xml" target="_blank" className="text-xs text-primary hover:text-primary hover:underline flex items-center mt-auto">
                      Dosyayı Aç <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>

                {/* Check 2: Meta */}
                <div className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors ${verificationStatus.meta === 'success' ? 'bg-green-500/5 border-green-500/20' : 'bg-[#0a0a0a]/50 border-slate-800'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-slate-200 font-semibold">
                      <Globe className="w-4 h-4 text-green-400" />
                      Meta Etiketi
                    </div>
                    <StatusBadge status={verificationStatus.meta} />
                  </div>
                  <p className="text-xs text-slate-500">
                    {verificationStatus.meta === 'success'
                      ? 'HTML <head> kısmında meta etiketi mevcut.'
                      : 'Meta etiketi bulunamadı. Lütfen SEOHead bileşenini kontrol edin.'}
                  </p>
                </div>

                {/* Check 3: CNAME */}
                <div className="bg-[#0a0a0a]/50 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-slate-200 font-semibold">
                      <Server className="w-4 h-4 text-blue-400" />
                      CNAME Kaydı
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#141414]/10 text-blue-400 border border-blue-500/20">
                      <Info className="w-3 h-3 mr-1" />
                      Panelden Bak
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    DNS kayıtları sunucu tabanlıdır. Tarayıcı üzerinden kontrol edilemez. Lütfen Hostinger panelini kullanın.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Methods Grid */}
            <div className="space-y-8">
              
              {/* SECTION 1: XML FILE */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#0a0a0a]/50 border border-slate-800 rounded-2xl p-8"
              >
                <div className="flex flex-col md:flex-row gap-6 md:items-start">
                  <div className="p-3 bg-orange-500/10 rounded-xl shrink-0">
                    <FileText className="w-8 h-8 text-orange-400" />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-white mb-2">Yöntem 1: XML Dosyası</h2>
                    <p className="text-slate-400 mb-6">En kolay ve hızlı yöntemdir. Dosya sunucunuza yüklenmiştir.</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Nasıl Doğrulanır?</h3>
                        <ol className="list-decimal list-inside text-sm text-slate-400 space-y-2">
                          <li>Bing Webmaster Tools panelinde sitenizi seçin.</li>
                          <li>Doğrulama yöntemlerinden <strong>XML File</strong> seçeneğine tıklayın.</li>
                          <li>Sistem dosyanın varlığını kontrol edecek ve anında onaylayacaktır.</li>
                        </ol>
                        <Button 
                          className="mt-2" variant="secondary" size="sm"
                          onClick={() => window.open('/BingSiteAuth.xml', '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Dosyayı Test Et
                        </Button>
                      </div>
                      <div className="bg-[#0a0a0a] p-4 rounded-lg border border-slate-800 font-mono text-xs">
                         <div className="text-slate-500 mb-2">// File Content: public/BingSiteAuth.xml</div>
                         <div className="text-blue-300">&lt;?xml version="1.0"?&gt;</div>
                         <div className="text-yellow-300">&lt;users&gt;</div>
                         <div className="text-white pl-4">&lt;user&gt;CA8DF3D0A50E3D150C561F86C75418F8&lt;/user&gt;</div>
                         <div className="text-yellow-300">&lt;/users&gt;</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* SECTION 2: META TAG */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#0a0a0a]/50 border border-slate-800 rounded-2xl p-8"
              >
                 <div className="flex flex-col md:flex-row gap-6 md:items-start">
                  <div className="p-3 bg-green-500/10 rounded-xl shrink-0">
                    <Globe className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-white mb-2">Yöntem 2: Meta Etiketi</h2>
                    <p className="text-slate-400 mb-6">Site başlık (head) kısmına eklenen doğrulama kodudur.</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Nasıl Kontrol Edilir?</h3>
                        <ul className="list-disc list-inside text-sm text-slate-400 space-y-2">
                          <li>Sitenizde herhangi bir sayfaya sağ tıklayın ve "Kaynağı Görüntüle" deyin.</li>
                          <li>Ctrl+F yaparak <code>msvalidate.01</code> aratın.</li>
                          <li>Kodun <code>&lt;head&gt;</code> etiketleri arasında olduğundan emin olun.</li>
                        </ul>
                        <div className="flex items-center gap-2 text-xs text-green-400 bg-green-400/10 p-2 rounded">
                          <Check className="w-3 h-3" />
                          Otomatik olarak tüm sayfalara eklendi.
                        </div>
                      </div>
                      <div>
                        <CopyableField 
                          label="Meta Etiketi" 
                          value='<meta name="msvalidate.01" content="CA8DF3D0A50E3D150C561F86C75418F8" />' 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* SECTION 3: HOSTINGER CNAME RECORD */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#0a0a0a]/50 border border-blue-900/30 rounded-2xl p-8 relative overflow-hidden"
              >
                {/* Background decorative element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#141414]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                 <div className="flex flex-col md:flex-row gap-6 md:items-start relative z-10">
                  <div className="p-3 bg-[#141414]/10 rounded-xl shrink-0">
                    <Settings className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-white mb-2">Yöntem 3: Hostinger DNS (CNAME) Ayarları</h2>
                    <p className="text-slate-400 mb-6">DNS üzerinden doğrulama yapmak için Hostinger panelinizi kullanın.</p>
                    
                    <div className="space-y-6">
                      
                      {/* Step 1 */}
                      <div className="bg-[#0a0a0a] p-6 rounded-xl border border-slate-800">
                        <h3 className="text-white font-semibold mb-4 flex items-center">
                          <span className="w-6 h-6 rounded-full bg-[#141414] text-white text-xs flex items-center justify-center mr-3">1</span>
                          Hostinger Panelini Açın
                        </h3>
                        <p className="text-sm text-slate-400 ml-9">
                          Hostinger hesabınıza giriş yapın. <strong>Domains (Alan Adları)</strong> bölümüne gidin ve <strong>DNS / Name Servers</strong> yönetimini açın.
                        </p>
                      </div>

                      {/* Step 2 */}
                      <div className="bg-[#0a0a0a] p-6 rounded-xl border border-slate-800">
                        <h3 className="text-white font-semibold mb-4 flex items-center">
                          <span className="w-6 h-6 rounded-full bg-[#141414] text-white text-xs flex items-center justify-center mr-3">2</span>
                          Yeni Kayıt Ekleyin
                        </h3>
                        <div className="ml-9 grid md:grid-cols-2 gap-4">
                          <CopyableField label="Type (Tip)" value="CNAME" />
                          <CopyableField label="TTL" value="3600" />
                          <CopyableField label="Name (Ad/Host)" value="fb05d6e6a4195322532f30d7b0a9860a" />
                          <CopyableField label="Points to (Hedef)" value="verify.bing.com" />
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="bg-[#0a0a0a] p-6 rounded-xl border border-slate-800">
                        <h3 className="text-white font-semibold mb-4 flex items-center">
                          <span className="w-6 h-6 rounded-full bg-[#141414] text-white text-xs flex items-center justify-center mr-3">3</span>
                          Kaydet ve Bekle
                        </h3>
                        <div className="ml-9">
                          <p className="text-sm text-slate-400 mb-3">
                            "Add Record" butonuna tıklayın. DNS değişikliklerinin dünya geneline yayılması <strong>1 saat ile 48 saat</strong> arasında sürebilir.
                          </p>
                          <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                            <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                            <div className="text-xs text-yellow-200">
                              <strong>İpucu:</strong> Eğer doğrulama hemen gerçekleşmezse endişelenmeyin. Çoğu zaman 15-20 dakika içinde aktif olur ancak bazen daha uzun sürebilir.
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer contactData={contactData} siteTexts={siteTexts} siteData={siteData} />
      </div>
    </>
  );
};

export default BingVerificationPage;