import React, { useState, memo } from 'react';
import { Send, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useSiteData } from '@/hooks/useSiteData';
import { defaultData } from '@/data/defaultSiteData';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';
import { isSupabaseConfigured } from '@/utils/envValidator';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [retryMode, setRetryMode] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const { siteData } = useSiteData();

  const contactInfo = siteData?.contact_info || siteData?.contactData || defaultData.contactData || {};
  const whatsappNumber = contactInfo?.whatsapp || "905551234567";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRetryMode(false);

    if (!isSupabaseConfigured()) {
      setTimeout(() => {
        toast({
          title: "Demo Modu",
          description: "Mesaj gönderimi simüle edildi (Supabase yapılandırılmamış).",
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
        toast({
            variant: "destructive",
            title: "Hata",
            description: "Mesaj gönderilemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin."
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-950 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black text-white mb-6">Bize Ulaşın</h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Sorularınız mı var? 7/24 destek ekibimiz size yardımcı olmak için hazır.
              Formu doldurun veya WhatsApp üzerinden iletişime geçin.
            </p>
            
            <div className="space-y-6">
                <div className="flex items-center gap-4 text-slate-300">
                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                        <CheckCircle2 className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">Anında Yanıt</h4>
                        <p className="text-sm text-slate-400">Mesai saatleri içinde ortalama 15dk</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4 text-slate-300">
                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                        <CheckCircle2 className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">Teknik Destek</h4>
                        <p className="text-sm text-slate-400">Kurulum ve aktivasyon yardımı</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-8">
                <a 
                  href={`https://wa.me/${whatsappNumber}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                >
                  WhatsApp Destek Hattı
                </a>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input 
                        placeholder="Adınız" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="bg-slate-950 border-slate-800 h-12 text-white focus:border-purple-500"
                    />
                    <Input 
                        placeholder="E-posta" 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className="bg-slate-950 border-slate-800 h-12 text-white focus:border-purple-500"
                    />
                </div>
                <Textarea 
                    placeholder="Mesajınız..." 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    className="bg-slate-950 border-slate-800 min-h-[120px] text-white focus:border-purple-500"
                />
                <Button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full h-12 text-white font-bold rounded-lg ${retryMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-purple-600 hover:bg-purple-700'}`}
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