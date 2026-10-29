import React, { useState, memo } from 'react';
import { Send, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useSiteData } from '@/hooks/useSiteData';
import { defaultData } from '@/data/defaultSiteData';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';
import { isSupabaseConfigured } from '@/utils/envValidator';
import { showPublicMaintenanceToastOnce } from '@/utils/supabaseMaintenanceToast';
import {
  isWhatsAppEnabled,
  isTelegramEnabled,
  openSupportWhatsApp,
  openSupportTelegram,
} from '@/utils/supportChannel';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [retryMode, setRetryMode] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const { siteData } = useSiteData();

  const contactInfo = siteData?.contact_info || siteData?.contactData || defaultData.contactData || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRetryMode(false);

    if (!isSupabaseConfigured()) {
      setTimeout(() => {
        toast({
          title: "Önizleme",
          description: "Mesaj gönderimi şu an örnek modda simüle edildi.",
          className: "bg-orange-700 border-none text-white"
        });
        setFormData({ name: '', email: '', message: '' });
        setLoading(false);
      }, 1000);
      return;
    }

    try {
        console.log("Saving contact message to Supabase...");
        const { error } = await executeSupabaseQuery(
            () => supabase.from('contact_messages').insert([{ 
                name: formData.name, 
                email: formData.email, 
                message: formData.message 
            }]),
            { retries: 3, context: 'submit_contact_form' }
        );

        if (error) throw error;
        
        toast({
            title: "Mesajınız Başarıyla Gönderildi",
            description: "En kısa sürede size dönüş yapacağız.",
            className: "bg-green-700 border-none text-white"
        });
        setFormData({ name: '', email: '', message: '' });
    } catch (error) {
        console.error('Contact error:', error);
        setRetryMode(true);
        showPublicMaintenanceToastOnce(toast);
    } finally {
        setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0a0a0a] border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black text-white mb-6">Bize Ulaşın</h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Sorularınız mı var? 7/24 destek ekibimiz size yardımcı olmak için hazır.
              Formu doldurun, en kısa sürede size dönüş yapalım.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-12 h-12 rounded-full bg-[#0a0a0a] flex items-center justify-center border border-slate-800 shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Anında Yanıt & 7/24 Kesintisiz Hizmet</h4>
                  <p className="text-sm text-slate-400">Canlı destek hatlarımız üzerinden ortalama 1-5 dakikada geri dönüş alırsınız.</p>
                </div>
              </div>

              {/* Dinamik Hızlı Destek Kanalları: WhatsApp & Telegram */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {isWhatsAppEnabled({ siteData, contactData: contactInfo }) && (
                  <button
                    type="button"
                    onClick={() => openSupportWhatsApp({ siteData, contactData: contactInfo })}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-900/40 text-left transition-all group shadow-lg shadow-emerald-950/20"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z" />
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.36 5L2 22l5.16-1.33A9.957 9.957 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.05c-1.63 0-3.14-.49-4.41-1.33l-.32-.21-3.06.79.82-2.98-.23-.34A8.04 8.04 0 014 12c0-4.41 3.59-8.05 8-8.05s8 3.64 8 8.05c0 4.42-3.59 8.05-8 8.05z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">WhatsApp Destek</div>
                      <div className="text-xs text-emerald-400 font-medium">Hemen Mesaj Gönder →</div>
                    </div>
                  </button>
                )}

                {isTelegramEnabled({ siteData, contactData: contactInfo }) && (
                  <button
                    type="button"
                    onClick={() => openSupportTelegram({ siteData, contactData: contactInfo })}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-sky-950/30 border border-sky-500/30 hover:border-sky-500 hover:bg-sky-900/40 text-left transition-all group shadow-lg shadow-sky-950/20"
                  >
                    <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform shrink-0">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Telegram Destek</div>
                      <div className="text-xs text-sky-400 font-medium">Sohbet Başlat →</div>
                    </div>
                  </button>
                )}
              </div>

              {/* Satın Al ve Test Et Hızlı Butonları */}
              <div className="flex flex-wrap gap-3 pt-3">
                <Link
                  to="/paketler/"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#f40612] hover:to-[#c60813] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#e50914]/20 transition-all hover:scale-105"
                >
                  Paketleri İncele ve Satın Al
                </Link>
                <Link
                  to="/test/"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-[#141414] hover:bg-[#222222] border border-amber-500/40 hover:border-amber-400 text-amber-400 hover:text-amber-300 font-bold text-sm rounded-xl transition-all hover:scale-105"
                >
                  ⚡ Ücretsiz Test Et
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] p-8 rounded-xl border border-slate-800">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input 
                        placeholder="Adınız" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="bg-[#0a0a0a] border-slate-800 h-12 text-white focus:border-primary"
                    />
                    <Input 
                        placeholder="E-posta" 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className="bg-[#0a0a0a] border-slate-800 h-12 text-white focus:border-primary"
                    />
                </div>
                <Textarea 
                    placeholder="Mesajınız..." 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    className="bg-[#0a0a0a] border-slate-800 min-h-[120px] text-white focus:border-primary"
                />
                <Button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full h-12 text-white font-bold rounded-lg ${retryMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-primary hover:bg-primary'}`}
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                      <>
                        {retryMode ? "Tekrar Dene" : "Mesaj Gönder"}
                        {retryMode ? <RefreshCw className="w-4 h-4 ml-2" /> : <Send className="w-4 h-4 ml-2" />}
                      </>
                    )}
                </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Contact);