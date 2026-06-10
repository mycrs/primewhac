import React, { useState } from 'react';
import { Textarea } from '@/components/admin/AdminFormControls';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const LegalPagesTab = ({ siteData, setSiteData }) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // Local state for immediate typing feedback
  const [formData, setFormData] = useState({
    privacy_policy_content: siteData.privacy_policy_content || '',
    terms_of_service_content: siteData.terms_of_service_content || '',
    cookie_policy_content: siteData.cookie_policy_content || '',
    refund_policy_content: siteData.refund_policy_content || '',
    disclaimer_content: siteData.disclaimer_content || ''
  });

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key) => {
    setSaving(true);
    try {
      const { success } = await setSiteData.updateSiteContent(key, formData[key]);
      if (success) {
        toast({ title: "Başarılı", description: "İçerik kaydedildi." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Hata", description: "Kaydedilemedi." });
    } finally {
      setSaving(false);
    }
  };

  const pages = [
    { 
        id: 'privacy', 
        key: 'privacy_policy_content', 
        label: 'Gizlilik Politikası', 
        desc: 'Kullanıcı verilerinin nasıl toplandığını ve kullanıldığını açıklayın.',
        placeholder: '<h1>Gizlilik Politikası</h1><p>Şirketimiz veri gizliliğine önem verir...</p>'
    },
    { 
        id: 'terms', 
        key: 'terms_of_service_content', 
        label: 'Kullanım Şartları', 
        desc: 'Hizmet kullanım koşullarını ve kurallarını belirtin.',
        placeholder: '<h1>Kullanım Şartları</h1><p>Bu hizmeti kullanarak...</p>'
    },
    { 
        id: 'cookies', 
        key: 'cookie_policy_content', 
        label: 'Çerez Politikası', 
        desc: 'Web sitesinde kullanılan çerezler ve amaçları hakkında bilgi verin.',
        placeholder: '<h1>Çerez Politikası</h1><p>Deneyiminizi geliştirmek için çerezler kullanıyoruz...</p>'
    },
    { 
        id: 'refund', 
        key: 'refund_policy_content', 
        label: 'İade Politikası', 
        desc: 'Ürün veya hizmet iadeleri ile ilgili şartları açıklayın.',
        placeholder: '<h1>İade Politikası</h1><p>14 gün içinde iade hakkınız...</p>'
    },
    { 
        id: 'disclaimer', 
        key: 'disclaimer_content', 
        label: 'Yasal Uyarı (Disclaimer)', 
        desc: 'Sorumluluk reddi ve diğer yasal uyarıları ekleyin.',
        placeholder: '<h1>Yasal Uyarı</h1><p>Bu sitedeki bilgiler sadece genel bilgilendirme amaçlıdır...</p>'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-white">Yasal Sayfalar Yönetimi</h2>
      </div>

      <Tabs defaultValue="privacy" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-[#0a0a0a]">
            {pages.map(page => (
                <TabsTrigger key={page.id} value={page.id}>{page.label}</TabsTrigger>
            ))}
        </TabsList>
        
        {pages.map(page => (
            <TabsContent key={page.id} value={page.id} className="space-y-4 mt-4">
                <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">{page.label}</h3>
                            <p className="text-sm text-gray-400">{page.desc}</p>
                        </div>
                        <Button 
                            onClick={() => handleSave(page.key)} 
                            disabled={saving}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Kaydet
                        </Button>
                    </div>
                    
                    <div className="space-y-2">
                        <p className="text-xs text-yellow-500 bg-yellow-500/10 p-2 rounded inline-block">
                            İpucu: HTML etiketleri kullanabilirsiniz (&lt;h1&gt;, &lt;p&gt;, &lt;strong&gt; vb.)
                        </p>
                        <Textarea 
                            rows={20}
                            placeholder={page.placeholder}
                            value={formData[page.key]} 
                            onChange={(e) => handleChange(page.key, e.target.value)}
                            className="font-mono text-sm bg-[#0a0a0a] border-slate-800 focus:border-primary"
                        />
                    </div>
                </div>
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default LegalPagesTab;