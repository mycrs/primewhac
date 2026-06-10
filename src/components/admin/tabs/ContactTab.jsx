
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { clearSiteDataCache } from '@/hooks/useSiteData';
import { Loader2, Save, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';

const FormInput = ({ label, type = "text", value, onChange, placeholder, icon: Icon }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-primary" />}
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 bg-[#0a0a0a] border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-colors"
    />
  </div>
);

const ContactTab = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  
  const [contactData, setContactData] = useState({
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    map_url: '',
    support_email: ''
  });

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const { data, error, isFallback, message } = await executeSupabaseQuery(
          () => supabase.from('site_content').select('value').eq('key', 'contact_info').maybeSingle(),
          { retries: 3, context: 'fetch_contact_info', fallback: null, timeoutMs: 15000 }
        );

        if (error && isFallback) {
          toast({ variant: "destructive", title: "Ağ Hatası", description: message || "İletişim bilgileri yüklenemedi." });
        } else if (data?.value) {
          const val = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          setContactData(prev => ({ ...prev, ...val }));
        }
      } catch (error) {
        console.error('Error loading contact info:', error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchContactData();
  }, [toast]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error, message } = await executeSupabaseQuery(
        () => supabase.from('site_content').upsert(
          { key: 'contact_info', value: contactData, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        ),
        { retries: 3, context: 'save_contact_info', timeoutMs: 15000 }
      );

      if (error) {
         toast({ variant: "destructive", title: "Hata", description: message || "Kaydetme işlemi başarısız oldu." });
         return;
      }

      clearSiteDataCache(); // Site cache temizle - güncel veri çekilsin

      toast({
        title: "Başarılı",
        description: "İletişim bilgileri güncellendi.",
        className: "bg-green-600 text-white border-none"
      });
    } catch (error) {
      console.error('Error saving:', error);
      toast({ variant: "destructive", title: "Hata", description: "Beklenmeyen bir hata oluştu." });
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">İletişim Bilgileri</h2>
          <p className="text-slate-400 mt-1">İletişim sayfası ve genel iletişim kanalları</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center px-6 py-2 bg-primary hover:bg-primary text-white rounded-lg transition-colors font-medium disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Kaydet
        </button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6">
        <div className="bg-[#0a0a0a]/50 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Telefon & WhatsApp
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <FormInput
              label="Telefon Numarası"
              value={contactData.phone}
              onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+4916345869030"
            />
            <FormInput
              label="WhatsApp Numarası (Sadece Rakam)"
              value={contactData.whatsapp}
              onChange={(e) => setContactData(prev => ({ ...prev, whatsapp: e.target.value }))}
              placeholder="4916345869030"
            />
          </div>
        </div>

        <div className="bg-[#0a0a0a]/50 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            E-posta Adresleri
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <FormInput
              label="Genel İletişim E-posta"
              type="email"
              value={contactData.email}
              onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="info@sirketiniz.com"
            />
            <FormInput
              label="Destek E-posta"
              type="email"
              value={contactData.support_email}
              onChange={(e) => setContactData(prev => ({ ...prev, support_email: e.target.value }))}
              placeholder="support@sirketiniz.com"
            />
          </div>
        </div>

        <div className="bg-[#0a0a0a]/50 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Konum Bilgileri
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Açık Adres</label>
              <textarea
                rows={3}
                value={contactData.address}
                onChange={(e) => setContactData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Mahalle, Sokak, No, İlçe/İl"
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <FormInput
              label="Google Maps Embed URL"
              value={contactData.map_url}
              onChange={(e) => setContactData(prev => ({ ...prev, map_url: e.target.value }))}
              placeholder="https://www.google.com/maps/embed?..."
              icon={Globe}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactTab;
