import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, RotateCcw, Building2, Share2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// Helper component for section headers
const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
    <div className="p-2 bg-primary/10 rounded-lg">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  </div>
);

// Helper for form fields
const FormField = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-300">{label}</label>
    {children}
  </div>
);

const FooterTab = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const defaultFooterData = {
    company_name: '',
    phone: '',
    email: '',
    address: '',
    working_hours: '',
    social_facebook: '',
    social_twitter: '',
    social_instagram: '',
    social_linkedin: '',
    social_youtube: '',
    description: '',
    copyright_text: '',
    payment_methods_text: ''
  };

  const [formData, setFormData] = useState(defaultFooterData);

  // Fetch data on mount
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        // Use maybeSingle() to handle 0 rows gracefully without throwing PGRST116
        const { data, error } = await supabase
          .from('site_content')
          .select('*')
          .eq('key', 'footer_contact_info')
          .maybeSingle();

        if (error) throw error;

        if (data && data.value) {
          setFormData({ ...defaultFooterData, ...data.value });
        } else {
          // If no data exists yet, ensure we use defaults
          setFormData(defaultFooterData);
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Footer verileri yüklenirken bir sorun oluştu."
        });
      } finally {
        setFetching(false);
      }
    };

    fetchFooterData();
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({
          key: 'footer_contact_info',
          value: formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Footer ayarları başarıyla kaydedildi.",
        className: "bg-green-600 text-white border-none"
      });
    } catch (error) {
      console.error('Error saving footer data:', error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Kaydedilirken bir sorun oluştu."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Tüm değişiklikleri geri almak istediğinize emin misiniz?')) {
      setFetching(true);
      // Re-fetch logic
      supabase
        .from('site_content')
        .select('*')
        .eq('key', 'footer_contact_info')
        .maybeSingle()
        .then(({ data }) => {
           if (data?.value) setFormData({ ...defaultFooterData, ...data.value });
           else setFormData(defaultFooterData);
           setFetching(false);
        });
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Footer Yönetimi</h2>
          <p className="text-slate-400 mt-1">Site alt kısmı için iletişim ve bağlantı ayarları</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center px-4 py-2 text-sm font-medium text-slate-300 bg-[#0a0a0a] rounded-lg hover:bg-[#0a0a0a] transition-colors border border-slate-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Sıfırla
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#e50914] to-[#b20710] rounded-lg hover:from-[#e50914] hover:to-[#b20710] transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-8"
      >
        {/* Company Info Section */}
        <div className="bg-[#0a0a0a]/50 border border-slate-800 rounded-xl p-6">
          <SectionHeader 
            icon={Building2} 
            title="Şirket Bilgileri" 
            description="Firmanızın temel iletişim bilgileri" 
          />
          <div className="grid md:grid-cols-2 gap-6">
            <FormField label="Şirket Adı">
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Örn: QruzeTV Technology"
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-primary"
              />
            </FormField>
            <FormField label="Telefon">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Örn: +49XXXXXXXXXX"
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-primary"
              />
            </FormField>
            <FormField label="E-posta Adresi">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Örn: info@qruzetv.com"
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-primary"
              />
            </FormField>
            <FormField label="Adres">
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                placeholder="Örn: Teknoloji Mah. Yazılım Sok. No:1 İstanbul"
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-primary resize-none"
              />
            </FormField>
          </div>
        </div>

        {/* Working Hours & Additional */}
        <div className="bg-[#0a0a0a]/50 border border-slate-800 rounded-xl p-6">
          <SectionHeader 
            icon={Clock} 
            title="Çalışma Saatleri & Detaylar" 
            description="Müşterilerinize ne zaman hizmet verdiğinizi belirtin" 
          />
          <div className="grid md:grid-cols-2 gap-6">
            <FormField label="Çalışma Saatleri">
              <input
                type="text"
                name="working_hours"
                value={formData.working_hours}
                onChange={handleChange}
                placeholder="Örn: Hafta içi 09:00 - 18:00"
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-primary"
              />
            </FormField>
            <FormField label="Kısa Açıklama (Footer Altı)">
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Örn: Türkiye'nin lider dijital yayın platformu."
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-primary"
              />
            </FormField>
            <FormField label="Telif Hakkı Metni">
              <input
                type="text"
                name="copyright_text"
                value={formData.copyright_text}
                onChange={handleChange}
                placeholder="Örn: Tüm hakları saklıdır © 2024"
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-primary"
              />
            </FormField>
            <FormField label="Ödeme Yöntemleri Metni">
              <input
                type="text"
                name="payment_methods_text"
                value={formData.payment_methods_text}
                onChange={handleChange}
                placeholder="Örn: Visa, Mastercard, Havale"
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-primary"
              />
            </FormField>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-[#0a0a0a]/50 border border-slate-800 rounded-xl p-6">
          <SectionHeader 
            icon={Share2} 
            title="Sosyal Medya" 
            description="Platformlarınızın bağlantılarını yönetin" 
          />
          <div className="grid md:grid-cols-2 gap-6">
            <FormField label="Facebook URL">
              <input
                type="text"
                name="social_facebook"
                value={formData.social_facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-primary"
              />
            </FormField>
            <FormField label="Twitter / X URL">
              <input
                type="text"
                name="social_twitter"
                value={formData.social_twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-primary"
              />
            </FormField>
            <FormField label="Instagram URL">
              <input
                type="text"
                name="social_instagram"
                value={formData.social_instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-primary"
              />
            </FormField>
            <FormField label="LinkedIn URL">
              <input
                type="text"
                name="social_linkedin"
                value={formData.social_linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-primary"
              />
            </FormField>
            <FormField label="YouTube URL">
              <input
                type="text"
                name="social_youtube"
                value={formData.social_youtube}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-primary"
              />
            </FormField>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FooterTab;