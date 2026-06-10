import React, { useEffect, useState } from 'react';
import { useAdminData } from '@/hooks/useAdminData';
import { clearSiteDataCache } from '@/hooks/useSiteData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { normalizeGlobalAlert } from '@/utils/normalizeGlobalAlert';

const AdminSettingsPage = () => {
  const { fetchSettings, updateSettings } = useAdminData();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      const data = await fetchSettings();
      const formatted = data.reduce((acc, curr) => {
        let val = curr.value;
        if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
          try { val = JSON.parse(val); } catch (_) {}
        }
        acc[curr.key] = val;
        return acc;
      }, {});
        if (!formatted.videos) formatted.videos = { iptv_nedir: '', icerik_bilgisi: '', iptv_nedir_youtube: '', icerik_bilgisi_youtube: '' };
      setSettings(formatted);
      setLoading(false);
    };
    loadSettings();
  }, [fetchSettings]);

  const handleChange = (e, section, field) => {
    const val = e.target.value;
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: val,
      },
    }));
  };

  const handleSave = async (key) => {
    setSaving(true);
    const ok = await updateSettings(key, settings[key]);
    // contactData kaydedilince contact_info da güncelle (site tek kaynak kullansın)
    if (key === 'contactData' && ok) {
      const contactInfo = { ...(settings.contact_info || {}), whatsapp: settings.contactData?.whatsapp ?? '', email: settings.contactData?.email ?? '' };
      await updateSettings('contact_info', contactInfo);
      clearSiteDataCache(); // Site cache temizle - güncel veri çekilsin
    }
    if ((key === 'contactData' || key === 'blog_seo_settings' || key === 'globalAlert') && ok) {
      clearSiteDataCache();
    }
    setSaving(false);
  };

  const handleGlobalAlertToggle = (checked) => {
    setSettings((prev) => ({
      ...prev,
      globalAlert: { ...(prev.globalAlert || {}), enabled: checked },
    }));
  };

  const handleSaveGlobalAlert = async () => {
    setSaving(true);
    const payload = normalizeGlobalAlert({
      ...settings.globalAlert,
      message: settings.globalAlert?.text || settings.globalAlert?.message || '',
      text: settings.globalAlert?.text || settings.globalAlert?.message || '',
    });
    const ok = await updateSettings('globalAlert', payload);
    if (ok) clearSiteDataCache();
    setSaving(false);
  };

  if (loading) return <div className="text-white text-center py-10">Yükleniyor...</div>;

  const contactData = settings.contactData || {};
  const globalAlert = settings.globalAlert || {};
  const videos = settings.videos || { iptv_nedir: '', icerik_bilgisi: '' };
  const blogSeo = settings.blog_seo_settings || {};

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Sistem Ayarları</h2>

      <div className="bg-[#0a0a0a] p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">İletişim Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">WhatsApp Numarası</Label>
            <Input value={contactData.whatsapp || ''} onChange={(e) => handleChange(e, 'contactData', 'whatsapp')} className="bg-[#0a0a0a] text-white" />
          </div>
          <div>
            <Label className="text-slate-300">E-posta</Label>
            <Input value={contactData.email || ''} onChange={(e) => handleChange(e, 'contactData', 'email')} className="bg-[#0a0a0a] text-white" />
          </div>
          <div className="md:col-span-2">
            <Label className="text-slate-300">Telegram Linki</Label>
            <Input value={contactData.telegram || ''} onChange={(e) => handleChange(e, 'contactData', 'telegram')} className="bg-[#0a0a0a] text-white" />
          </div>
        </div>
        <Button onClick={() => handleSave('contactData')} disabled={saving} className="bg-primary hover:bg-primary text-white">
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Kaydet
        </Button>
      </div>

      <div className="bg-[#0a0a0a] p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Üst Bildirim Çubuğu (Global Alert)</h3>
        <p className="text-xs text-slate-500">Duyuru banner ve test popup&apos;ından ayrıdır. Sabit üst şerit için kullanılır.</p>
        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-[#0a0a0a]/50">
          <Label className="text-slate-300">Şeridi göster</Label>
          <Switch checked={!!globalAlert.enabled} onCheckedChange={handleGlobalAlertToggle} />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label className="text-slate-300">Bildirim Metni</Label>
            <Input value={globalAlert.text || globalAlert.message || ''} onChange={(e) => handleChange(e, 'globalAlert', 'text')} className="bg-[#0a0a0a] text-white" />
          </div>
          <div>
            <Label className="text-slate-300">Link URL (isteğe bağlı)</Label>
            <Input value={globalAlert.link || ''} onChange={(e) => handleChange(e, 'globalAlert', 'link')} className="bg-[#0a0a0a] text-white" placeholder="https://streamtr.eu/paketler" />
          </div>
        </div>
        <Button onClick={handleSaveGlobalAlert} disabled={saving} className="bg-primary hover:bg-primary text-white">
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Kaydet
        </Button>
      </div>

      <div className="bg-[#0a0a0a] p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Ana Sayfa Video Rehberleri</h3>
        <p className="text-sm text-slate-400">YouTube linkleri üstte, yerel videolar altta gösterilir. Her ikisi de SEO için VideoObject schema ile işaretlenir.</p>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label className="text-slate-300">IPTV Nedir? – YouTube (üstte gösterilir)</Label>
            <Input 
              value={videos.iptv_nedir_youtube || ''} 
              onChange={(e) => handleChange(e, 'videos', 'iptv_nedir_youtube')} 
              placeholder="https://www.youtube.com/watch?v=..." 
              className="bg-[#0a0a0a] text-white" 
            />
          </div>
          <div>
            <Label className="text-slate-300">IPTV Nedir? – Yerel video</Label>
            <Input 
              value={videos.iptv_nedir || ''} 
              onChange={(e) => handleChange(e, 'videos', 'iptv_nedir')} 
              placeholder="/videos/iptv.nedir.mp4" 
              className="bg-[#0a0a0a] text-white" 
            />
          </div>
          <div>
            <Label className="text-slate-300">İçerik Bilgisi – YouTube (üstte gösterilir)</Label>
            <Input 
              value={videos.icerik_bilgisi_youtube || ''} 
              onChange={(e) => handleChange(e, 'videos', 'icerik_bilgisi_youtube')} 
              placeholder="https://www.youtube.com/watch?v=..." 
              className="bg-[#0a0a0a] text-white" 
            />
          </div>
          <div>
            <Label className="text-slate-300">İçerik Bilgisi – Yerel video</Label>
            <Input 
              value={videos.icerik_bilgisi || ''} 
              onChange={(e) => handleChange(e, 'videos', 'icerik_bilgisi')} 
              placeholder="/videos/icerikbilgisi.mp4" 
              className="bg-[#0a0a0a] text-white" 
            />
          </div>
        </div>
        <Button onClick={() => handleSave('videos')} disabled={saving} className="bg-primary hover:bg-primary text-white">
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Kaydet
        </Button>
      </div>

      <div className="bg-[#0a0a0a] p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Blog & ChatBot İsimleri</h3>
        <p className="text-sm text-slate-400">Blog meta başlık sonrası ve destek botu başlığı. Değişiklikler yeni içeriklerde kullanılır.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">Blog Başlık Sonrası (Meta Title Suffix)</Label>
            <Input 
              value={blogSeo.title_suffix || ''} 
              onChange={(e) => handleChange(e, 'blog_seo_settings', 'title_suffix')} 
              placeholder="QruzeTV"
              className="bg-[#0a0a0a] text-white" 
            />
            <p className="text-xs text-slate-500 mt-1">Örn: QruzeTV, KaliteliIPTV. Blog yazıları: Başlık | Bu Değer</p>
          </div>
        </div>
        <Button onClick={() => handleSave('blog_seo_settings')} disabled={saving} className="bg-primary hover:bg-primary text-white">
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Kaydet
        </Button>
      </div>

    </div>
  );
};

export default AdminSettingsPage;
