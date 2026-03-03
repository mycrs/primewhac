
import React, { useEffect, useState } from 'react';
import { useAdminData } from '@/hooks/useAdminData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
        acc[curr.key] = curr.value;
        return acc;
      }, {});
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
        ...prev[section],
        [field]: val,
      },
    }));
  };

  const handleSave = async (key) => {
    setSaving(true);
    await updateSettings(key, settings[key]);
    setSaving(false);
  };

  if (loading) return <div className="text-white text-center py-10">Yükleniyor...</div>;

  const contactData = settings.contactData || {};
  const globalAlert = settings.globalAlert || {};

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Sistem Ayarları</h2>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">İletişim Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">WhatsApp Numarası</Label>
            <Input value={contactData.whatsapp || ''} onChange={(e) => handleChange(e, 'contactData', 'whatsapp')} className="bg-slate-950 text-white" />
          </div>
          <div>
            <Label className="text-slate-300">E-posta</Label>
            <Input value={contactData.email || ''} onChange={(e) => handleChange(e, 'contactData', 'email')} className="bg-slate-950 text-white" />
          </div>
          <div className="md:col-span-2">
            <Label className="text-slate-300">Telegram Linki</Label>
            <Input value={contactData.telegram || ''} onChange={(e) => handleChange(e, 'contactData', 'telegram')} className="bg-slate-950 text-white" />
          </div>
        </div>
        <Button onClick={() => handleSave('contactData')} disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white">
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Kaydet
        </Button>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Üst Bildirim Çubuğu (Global Alert)</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label className="text-slate-300">Bildirim Metni</Label>
            <Input value={globalAlert.text || ''} onChange={(e) => handleChange(e, 'globalAlert', 'text')} className="bg-slate-950 text-white" />
          </div>
          <div>
            <Label className="text-slate-300">Link URL</Label>
            <Input value={globalAlert.link || ''} onChange={(e) => handleChange(e, 'globalAlert', 'link')} className="bg-slate-950 text-white" />
          </div>
        </div>
        <Button onClick={() => handleSave('globalAlert')} disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white">
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Kaydet
        </Button>
      </div>

    </div>
  );
};

export default AdminSettingsPage;
