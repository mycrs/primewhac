import React, { useEffect, useState } from 'react';
import { Settings, Tv, Smartphone, Monitor, Laptop, Tablet, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import AdminTabWrapper from '@/components/admin/AdminTabWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeviceInstallationForm from '../DeviceInstallationForm';
import HubAppsInstallationForm from '../HubAppsInstallationForm';
import { useSetupPage } from '@/hooks/useSetupPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

const GeneralSettings = ({ data, onSave }) => {
  const [formData, setFormData] = useState({
    sayfa_baslik: '',
    secme_baslik: '',
    kurulum_aciklamasi: '',
    admin_1_gorsel_url: '',
    cover_image_url: ''
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({
        sayfa_baslik: data.sayfa_baslik || '',
        secme_baslik: data.secme_baslik || '',
        kurulum_aciklamasi: data.kurulum_aciklamasi || '',
        admin_1_gorsel_url: data.admin_1_gorsel_url || '',
        cover_image_url: data.cover_image_url || ''
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.sayfa_baslik || formData.sayfa_baslik.length < 3) {
      newErrors.sayfa_baslik = "Sayfa başlığı en az 3 karakter olmalıdır.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      console.warn(`[SetupPageTab] Validation failed for general settings`, errors);
      return;
    }
    
    setSaving(true);
    try {
      console.log(`[SetupPageTab] Saving general settings`, formData);
      await onSave(formData);
    } catch (error) {
      console.error("[SetupPageTab] Error saving general settings:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="bg-[#0a0a0a] border-slate-800 max-w-2xl mt-6">
      <CardContent className="p-6 space-y-6">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Genel Sayfa Ayarları
        </h3>
        
        <div className="grid gap-2">
          <Label className="text-slate-300">Ana Sayfa Başlığı <span className="text-red-500">*</span></Label>
          <Input 
            name="sayfa_baslik"
            value={formData.sayfa_baslik} 
            onChange={handleChange}
            className={`bg-[#0a0a0a] text-white ${errors.sayfa_baslik ? 'border-red-500' : 'border-slate-800'}`}
            disabled={saving}
          />
          {errors.sayfa_baslik && <p className="text-red-500 text-xs">{errors.sayfa_baslik}</p>}
        </div>
        <div className="grid gap-2">
          <Label className="text-slate-300">Alt Başlık</Label>
          <Input 
            name="secme_baslik"
            value={formData.secme_baslik} 
            onChange={handleChange}
            className="bg-[#0a0a0a] border-slate-800 text-white"
            disabled={saving}
          />
        </div>
        <div className="grid gap-2">
          <Label className="text-slate-300">Genel Açıklama</Label>
          <Textarea 
            name="kurulum_aciklamasi"
            value={formData.kurulum_aciklamasi} 
            onChange={handleChange}
            className="bg-[#0a0a0a] border-slate-800 min-h-[100px] text-white"
            disabled={saving}
          />
        </div>
        
        <div className="grid gap-4 p-4 border border-slate-800 rounded-lg bg-[#0a0a0a]/50">
            <h4 className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Görsel Ayarları
            </h4>
            
            <div className="grid gap-2">
              <Label className="text-slate-300">Ana Arkaplan Görseli (Cover Image)</Label>
              <Input 
                name="cover_image_url"
                value={formData.cover_image_url} 
                onChange={handleChange}
                placeholder="https://example.com/cover-image.jpg"
                className="bg-[#0a0a0a] border-slate-800 font-mono text-sm text-white"
                disabled={saving}
              />
              {formData.cover_image_url && (
                <div className="relative h-32 rounded overflow-hidden border border-slate-800 mt-2">
                  <img 
                    src={formData.cover_image_url} 
                    alt="Kurulum sayfası kapak önizlemesi" 
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>

            <div className="grid gap-2 opacity-70">
              <Label className="text-slate-300 text-xs">Yedek Görsel (Legacy)</Label>
              <Input 
                name="admin_1_gorsel_url"
                value={formData.admin_1_gorsel_url} 
                onChange={handleChange}
                className="bg-[#0a0a0a] border-slate-800 font-mono text-xs h-8 text-white"
                disabled={saving}
              />
            </div>
        </div>
        
        <Button onClick={handleSave} disabled={saving} className="w-full bg-primary hover:bg-primary">
          {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Kaydediliyor...</> : "Genel Ayarları Kaydet"}
        </Button>
      </CardContent>
    </Card>
  );
};

const SetupPageTab = () => {
  const { setupData, loading, error, fetchSetupPage, updateGeneralSettings } = useSetupPage({
    enableRealtime: true,
  });
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    fetchSetupPage();
  }, [fetchSetupPage]);

  if (loading && !setupData) {
    return (
      <AdminTabWrapper title="Kurulum Sayfası Yönetimi" description="Tüm cihazlar için kurulum rehberlerini buradan yönetebilirsiniz.">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AdminTabWrapper>
    );
  }

  if (error && !setupData) {
     return (
       <AdminTabWrapper title="Kurulum Sayfası Yönetimi" description="Hata oluştu.">
         <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl">
            Veri yüklenemedi: {error}
         </div>
       </AdminTabWrapper>
     );
  }

  return (
    <AdminTabWrapper
      title="Kurulum Sayfası Yönetimi"
      description="Tüm cihazlar için kurulum rehberlerini buradan yönetebilirsiniz."
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-4">
          <TabsList className="bg-[#0a0a0a] border border-slate-800 p-1 h-auto flex w-max min-w-full lg:min-w-0 lg:w-full lg:flex-wrap justify-start gap-1">
            <TabsTrigger value="general" className="data-[state=active]:bg-primary text-slate-400 gap-2 px-4 py-2">
              <Settings className="w-4 h-4" /> Genel
            </TabsTrigger>
            <TabsTrigger value="android_tv" className="data-[state=active]:bg-[#141414] text-slate-400 gap-2 px-4 py-2">
              <Tv className="w-4 h-4" /> Android TV
            </TabsTrigger>
            <TabsTrigger value="ios" className="data-[state=active]:bg-[#e50914] text-slate-400 gap-2 px-4 py-2">
              <Smartphone className="w-4 h-4" /> iOS
            </TabsTrigger>
            <TabsTrigger value="android_phone" className="data-[state=active]:bg-green-600 text-slate-400 gap-2 px-4 py-2">
              <Smartphone className="w-4 h-4" /> Android
            </TabsTrigger>
            <TabsTrigger value="windows" className="data-[state=active]:bg-[#141414] text-slate-400 gap-2 px-4 py-2">
              <Monitor className="w-4 h-4" /> Windows
            </TabsTrigger>
            <TabsTrigger value="mac" className="data-[state=active]:bg-[#141414] text-slate-400 gap-2 px-4 py-2">
              <Laptop className="w-4 h-4" /> Mac
            </TabsTrigger>
            <TabsTrigger value="smart_tv" className="data-[state=active]:bg-pink-600 text-slate-400 gap-2 px-4 py-2">
              <Tv className="w-4 h-4" /> Smart TV
            </TabsTrigger>
            <TabsTrigger value="tablet" className="data-[state=active]:bg-orange-600 text-slate-400 gap-2 px-4 py-2">
              <Tablet className="w-4 h-4" /> Tablet
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general" className="mt-0">
          <GeneralSettings data={setupData} onSave={updateGeneralSettings} />
        </TabsContent>

        <TabsContent value="android_tv" className="mt-0">
          <DeviceInstallationForm 
            deviceKey="android_tv_config" 
            deviceName="Android TV" 
            existingData={setupData?.android_tv_config} 
          />
        </TabsContent>

        <TabsContent value="ios" className="mt-0">
          <DeviceInstallationForm 
            deviceKey="ios_config" 
            deviceName="iOS (iPhone/iPad)" 
            existingData={setupData?.ios_config} 
          />
        </TabsContent>

        <TabsContent value="android_phone" className="mt-0">
          <HubAppsInstallationForm
            hubId="android_phone"
            existingData={setupData?.android_phone_config}
          />
        </TabsContent>

        <TabsContent value="windows" className="mt-0">
          <HubAppsInstallationForm
            hubId="windows"
            existingData={setupData?.windows_pc_config}
          />
        </TabsContent>

        <TabsContent value="mac" className="mt-0">
          <DeviceInstallationForm 
            deviceKey="mac_config" 
            deviceName="Mac" 
            existingData={setupData?.mac_config} 
          />
        </TabsContent>

        <TabsContent value="smart_tv" className="mt-0">
          <DeviceInstallationForm 
            deviceKey="smart_tv_config" 
            deviceName="Smart TV" 
            existingData={setupData?.smart_tv_config} 
          />
        </TabsContent>

        <TabsContent value="tablet" className="mt-0">
          <HubAppsInstallationForm
            hubId="tablet"
            existingData={setupData?.tablet_config}
          />
        </TabsContent>
      </Tabs>
    </AdminTabWrapper>
  );
};

export default SetupPageTab;