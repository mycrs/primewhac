import React, { useState, useEffect } from 'react';
import { Input, Textarea, ImagePreviewInput } from '@/components/admin/AdminFormControls';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const BlogSeoTab = ({ siteData, setSiteData }) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(siteData.blog_seo_settings || {});

  useEffect(() => {
    if (siteData.blog_seo_settings) {
        setSettings(siteData.blog_seo_settings);
    }
  }, [siteData.blog_seo_settings]);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { success } = await setSiteData.updateSiteContent('blog_seo_settings', settings);
      if (success) {
        toast({ title: "Başarılı", description: "Blog SEO ayarları güncellendi." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Hata", description: "Kaydedilemedi." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Blog SEO Ayarları</h2>
            <p className="text-gray-400">Tüm blog yazıları için varsayılan SEO yapılandırması.</p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Değişiklikleri Kaydet
          </Button>
      </div>

      <div className="grid gap-6">
        {/* Meta Tags Section */}
        <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Genel Meta Etiketleri</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
                <Input 
                    label="Blog Başlık Sonrası (Meta Title Suffix)" 
                    placeholder="QruzeTV"
                    helperText="Blog yazılarının meta başlığına eklenir: Başlık | Bu Değer"
                    value={settings.title_suffix || ''} 
                    onChange={(e) => handleChange('title_suffix', e.target.value)} 
                />
                <Input 
                    label="Meta Başlık Şablonu" 
                    placeholder="%title% | Blog - %site_name%"
                    helperText="%title% blog başlığı, %site_name% site adı ile değişir."
                    value={settings.meta_title_template || ''} 
                    onChange={(e) => handleChange('meta_title_template', e.target.value)} 
                />
                <Input 
                    label="Canonical URL Base" 
                    placeholder="https://site.com/blog"
                    value={settings.canonical_base_url || ''} 
                    onChange={(e) => handleChange('canonical_base_url', e.target.value)} 
                />
            </div>

            <Textarea 
                label="Varsayılan Meta Açıklama" 
                placeholder="Blogumuzdaki en son haberler ve güncellemeler..."
                helperText="Yazı özelinde açıklama girilmezse bu kullanılır."
                value={settings.default_meta_description || ''} 
                onChange={(e) => handleChange('default_meta_description', e.target.value)} 
            />

            <Input 
                label="Varsayılan Anahtar Kelimeler" 
                placeholder="iptv, blog, teknoloji, haberler"
                helperText="Virgülle ayırarak giriniz."
                value={settings.default_keywords || ''} 
                onChange={(e) => handleChange('default_keywords', e.target.value)} 
            />
        </div>

        {/* Open Graph / Social Media Section */}
        <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Sosyal Medya (Open Graph)</h3>
            
            <ImagePreviewInput
                label="Varsayılan Paylaşım Görseli (OG Image)"
                value={settings.default_og_image || ''}
                onChange={(e) => handleChange('default_og_image', e.target.value)}
            />

            <div className="grid md:grid-cols-2 gap-4">
                <Input 
                    label="Varsayılan OG Başlık" 
                    placeholder="Blog - En Güncel İçerikler"
                    value={settings.default_og_title || ''} 
                    onChange={(e) => handleChange('default_og_title', e.target.value)} 
                />
                <Input 
                    label="Twitter Kart Tipi" 
                    placeholder="summary_large_image"
                    value={settings.twitter_card_type || 'summary_large_image'} 
                    onChange={(e) => handleChange('twitter_card_type', e.target.value)} 
                />
            </div>
             <Textarea 
                label="Varsayılan OG Açıklama" 
                placeholder="Sosyal medyada paylaşılırken görünecek açıklama..."
                value={settings.default_og_description || ''} 
                onChange={(e) => handleChange('default_og_description', e.target.value)} 
            />
        </div>

        {/* Technical SEO Section */}
        <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Teknik SEO & Schema</h3>
            
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg">
                <div>
                    <Label htmlFor="enable-schema" className="text-white font-medium">Otomatik Schema.org (JSON-LD)</Label>
                    <p className="text-sm text-gray-400">Blog yazıları için otomatik yapısal veri oluştur.</p>
                </div>
                <Switch 
                    id="enable-schema"
                    checked={settings.enable_structured_data !== false}
                    onCheckedChange={(checked) => handleChange('enable_structured_data', checked)}
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSeoTab;