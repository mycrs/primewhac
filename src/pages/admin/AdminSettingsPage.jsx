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
import {
  normalizeContactSettings,
  parseSiteContentValue,
  serializeContactSettings,
} from '@/utils/contactSettings';

const AdminSettingsPage = () => {
  const { fetchSettings, updateSettings, updateSettingsMany } = useAdminData();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const data = await fetchSettings();
        const formatted = (data || []).reduce((acc, curr) => {
          if (!curr || !curr.key) return acc;
          acc[curr.key] = parseSiteContentValue(curr.value);
          return acc;
        }, {});

        // contact_info is canonical; contactData is retained as a legacy fallback.
        formatted.contactData = normalizeContactSettings({
          contactInfo: formatted.contact_info,
          contactData: formatted.contactData,
        });
        if (!formatted.videos) formatted.videos = { iptv_nedir: '', icerik_bilgisi: '', iptv_nedir_youtube: '', icerik_bilgisi_youtube: '' };
        setSettings(formatted);
      } catch (err) {
        console.error('loadSettings error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    try {
      if (key === 'contactData') {
        // The visible form is backed by contactData.  The previous code gave
        // contact_info precedence here, which meant an older canonical row
        // silently overwrote a newly entered WhatsApp number before saving.
        // Keep contact_info as a compatibility fallback, but let the edited
        // form state win for every contact field.
        const contactPayload = serializeContactSettings(normalizeContactSettings({
          contactInfo: settings.contactData,
          contactData: settings.contact_info,
        }));

        // Write the canonical row and the legacy mirror in one request so a
        // partial save cannot make the two records disagree.
        const ok = await updateSettingsMany([
          { key: 'contact_info', value: contactPayload },
          { key: 'contactData', value: contactPayload },
        ]);
        if (ok) {
          setSettings((prev) => ({
            ...prev,
            contact_info: contactPayload,
            contactData: contactPayload,
          }));
          clearSiteDataCache();
        }
      } else {
        const ok = await updateSettings(key, settings[key]);
        if ((key === 'blog_seo_settings' || key === 'globalAlert') && ok) {
          clearSiteDataCache();
        }
      }
    } catch (err) {
        console.error('[AdminSettingsPage] handleSave error:', err);
        toast({ variant: 'destructive', title: 'Hata', description: 'Kaydetme sırasında bir hata oluştu: ' + (err?.message || err) });
    } finally {
      setSaving(false);
    }
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
        <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">İletişim ve Destek Kanalları</h3>
        <p className="text-xs text-slate-400">
          Bu ekrandaki destek ayarları tek iletişim kaynağından yönetilir. Eski sürümler için gereken kayıt otomatik olarak eşitlenir.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#121212] border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-slate-200 font-bold">WhatsApp kanalı aktif</Label>
              <Switch
                checked={contactData.whatsapp_enabled === true}
                onCheckedChange={(val) => setSettings(prev => ({
                  ...prev,
                  contactData: { ...prev.contactData, whatsapp_enabled: val }
                }))}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-400">WhatsApp Numarası</Label>
              <Input
                value={contactData.whatsapp || ''}
                onChange={(e) => handleChange(e, 'contactData', 'whatsapp')}
                className="bg-[#0a0a0a] text-white text-sm"
                placeholder="+49XXXXXXXXXX"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-400">Varsayılan Mesaj</Label>
              <Input
                value={contactData.whatsapp_message || ''}
                onChange={(e) => handleChange(e, 'contactData', 'whatsapp_message')}
                className="bg-[#0a0a0a] text-white text-sm"
                placeholder="Merhaba, bilgi almak istiyorum."
              />
            </div>
          </div>

          <div className="p-4 bg-[#121212] border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-slate-200 font-bold">Telegram kanalı aktif</Label>
              <Switch
                checked={contactData.telegram_enabled === true}
                onCheckedChange={(val) => setSettings(prev => ({
                  ...prev,
                  contactData: { ...prev.contactData, telegram_enabled: val }
                }))}
                className="data-[state=checked]:bg-sky-500"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-400">Telegram Linki veya Kullanıcı Adı</Label>
              <Input
                value={contactData.telegram || ''}
                onChange={(e) => handleChange(e, 'contactData', 'telegram')}
                className="bg-[#0a0a0a] text-white text-sm"
                placeholder="qruzetv_support"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-400">E-posta Adresi</Label>
              <Input
                value={contactData.email || ''}
                onChange={(e) => handleChange(e, 'contactData', 'email')}
                className="bg-[#0a0a0a] text-white text-sm"
                placeholder="info@qruzetv.com"
              />
            </div>
          </div>
        </div>

        {/* Sipariş Yönlendirme Kanalı Seçici */}
        <div className="p-4 bg-[#121212] border border-slate-800 rounded-xl space-y-2">
          <Label className="text-slate-200 font-bold block">Sipariş & Test Yönlendirme Kanalı</Label>
          <p className="text-xs text-slate-400">
            Kullanıcı siteden paket satın al veya test al formunu doldurduğunda sipariş detaylarının iletileceği kanal:
          </p>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setSettings(prev => ({
                ...prev,
                contactData: { ...prev.contactData, order_channel: 'whatsapp' }
              }))}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                contactData.order_channel !== 'telegram'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 ring-2 ring-emerald-400/50'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🟢 WhatsApp ({contactData.order_channel !== 'telegram' ? 'Seçili' : 'Seç'})
            </button>
            <button
              type="button"
              onClick={() => setSettings(prev => ({
                ...prev,
                contactData: { ...prev.contactData, order_channel: 'telegram' }
              }))}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                contactData.order_channel === 'telegram'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-950/40 ring-2 ring-sky-400/50'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🔵 Telegram ({contactData.order_channel === 'telegram' ? 'Seçili' : 'Seç'})
            </button>
          </div>
        </div>

        {/* Her Sayfada Gezen Destek Butonları */}
        <div className="p-4 bg-[#121212] border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-slate-200 font-bold block">Her Sayfada Gezen Destek Butonları (Sağ Alt)</Label>
              <p className="text-xs text-slate-400">
                Tüm sayfalarda sağ altta sabit duran hızlı destek butonlarının görünürlük ayarları
              </p>
            </div>
              <Switch
                checked={contactData.floating_actions?.enabled === true}
              onCheckedChange={(val) => setSettings(prev => ({
                ...prev,
                contactData: {
                  ...prev.contactData,
                  floating_actions: {
                    ...(prev.contactData?.floating_actions || {}),
                    enabled: val,
                  }
                }
              }))}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-slate-800 rounded-lg">
              <div>
                <span className="text-sm font-medium text-slate-200 block">Sağ altta WhatsApp göster</span>
                <span className="text-xs text-slate-500">Sağ alttaki WhatsApp ikonunu göster/gizle</span>
              </div>
              <Switch
                checked={contactData.floating_actions?.show_whatsapp === true && contactData.whatsapp_enabled === true}
                disabled={contactData.whatsapp_enabled !== true}
                onCheckedChange={(val) => setSettings(prev => ({
                  ...prev,
                  contactData: {
                    ...prev.contactData,
                    floating_actions: {
                      ...(prev.contactData?.floating_actions || {}),
                      show_whatsapp: val,
                    }
                  }
                }))}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-slate-800 rounded-lg">
              <div>
                <span className="text-sm font-medium text-slate-200 block">Sağ altta Telegram göster</span>
                <span className="text-xs text-slate-500">Sağ alttaki Telegram ikonunu göster/gizle</span>
              </div>
              <Switch
                checked={contactData.floating_actions?.show_telegram === true && contactData.telegram_enabled === true}
                disabled={contactData.telegram_enabled !== true}
                onCheckedChange={(val) => setSettings(prev => ({
                  ...prev,
                  contactData: {
                    ...prev.contactData,
                    floating_actions: {
                      ...(prev.contactData?.floating_actions || {}),
                      show_telegram: val,
                    }
                  }
                }))}
                className="data-[state=checked]:bg-sky-500"
              />
            </div>
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
            <Input value={globalAlert.link || ''} onChange={(e) => handleChange(e, 'globalAlert', 'link')} className="bg-[#0a0a0a] text-white" placeholder="https://cineverse.pro/paketler" />
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
            <p className="text-xs text-slate-500 mt-1">Örn: QruzeTV. Blog yazıları: Başlık | Bu Değer</p>
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
