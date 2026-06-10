import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, AlertCircle, Layout, Image as ImageIcon, Type, FileText, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import AdminTabWrapper from '@/components/admin/AdminTabWrapper';
import { useSetupPage } from '@/hooks/useSetupPage';
import { cn } from '@/lib/utils';

const SetupPage = () => {
  const { toast } = useToast();
  const { fetchSetupPage, updateSetupPage, loading: hookLoading, error: hookError } = useSetupPage({
    enableRealtime: true,
  });
  
  const [isInitializing, setIsInitializing] = useState(true);
  
  const [formData, setFormData] = useState({
    id: null,
    sayfa_baslik: '',
    secme_baslik: '',
    kurulum_aciklamasi: '',
    admin_1_aciklama: '',
    admin_1_gorsel_url: ''
  });
  
  const [saveStatus, setSaveStatus] = useState('idle');

  const loadData = async () => {
    setIsInitializing(true);
    setSaveStatus('idle');
    try {
      const data = await fetchSetupPage();
      if (data) {
        setFormData({
          id: data.id,
          sayfa_baslik: data.sayfa_baslik || '',
          secme_baslik: data.secme_baslik || '',
          kurulum_aciklamasi: data.kurulum_aciklamasi || '',
          admin_1_aciklama: data.admin_1_aciklama || '',
          admin_1_gorsel_url: data.admin_1_gorsel_url || ''
        });
      }
    } catch (e) {
      console.error("SetupPage component load error:", e);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [fetchSetupPage]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.sayfa_baslik) {
      toast({ variant: "destructive", title: "Hata", description: "Başlık zorunludur." });
      return;
    }

    setSaveStatus('saving');
    const result = await updateSetupPage(formData);

    if (result.success) {
      setSaveStatus('success');
      if (result.data?.id && !formData.id) {
        setFormData(prev => ({ ...prev, id: result.data.id }));
      }
      toast({
        title: "Başarılı",
        description: "Ayarlar başarıyla kaydedildi.",
        className: "bg-green-600 text-white"
      });
      setTimeout(() => setSaveStatus('idle'), 2500);
    } else {
      setSaveStatus('error');
      toast({
        variant: "destructive",
        title: "Hata",
        description: result.error?.message || "Kaydedilemedi."
      });
    }
  };

  if (isInitializing) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AdminTabWrapper
      title="Kurulum Sayfası Yönetimi"
      description="Sistem kurulum ve rehber sayfalarını buradan yönetebilirsiniz."
      icon={Layout}
      actions={
        <div className="flex items-center gap-2">
           <Button variant="outline" size="icon" onClick={loadData}>
              <RefreshCw className="w-4 h-4" />
           </Button>
           <Button onClick={handleSave} disabled={saveStatus === 'saving'}>
              {saveStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Kaydet
           </Button>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Title Section */}
        <Card className="bg-[#0a0a0a]/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Type className="w-5 h-5 text-primary" />
              Sayfa Başlıkları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label className="text-slate-300">Ana Başlık (sayfa_baslik)</Label>
              <Input
                value={formData.sayfa_baslik}
                onChange={(e) => handleInputChange('sayfa_baslik', e.target.value)}
                className="bg-[#0a0a0a] border-slate-800 text-white"
                placeholder="Android TV Kurulumu"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-300">Alt Başlık (secme_baslik)</Label>
              <Input
                value={formData.secme_baslik}
                onChange={(e) => handleInputChange('secme_baslik', e.target.value)}
                className="bg-[#0a0a0a] border-slate-800 text-white"
                placeholder="8 adımda kolay kurulum."
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Section */}
        <Card className="bg-[#0a0a0a]/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Açıklamalar & Adımlar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label className="text-slate-300">Genel Açıklama (kurulum_aciklamasi)</Label>
              <Textarea
                value={formData.kurulum_aciklamasi}
                onChange={(e) => handleInputChange('kurulum_aciklamasi', e.target.value)}
                className="bg-[#0a0a0a] border-slate-800 text-white min-h-[100px]"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-300">Adım 1 İçeriği (admin_1_aciklama)</Label>
              <Textarea
                value={formData.admin_1_aciklama}
                onChange={(e) => handleInputChange('admin_1_aciklama', e.target.value)}
                className="bg-[#0a0a0a] border-slate-800 text-white min-h-[80px]"
                placeholder="İlk adımı buraya yazın..."
              />
              <p className="text-xs text-slate-500">Bu alan kurulum rehberinin ilk adımı veya öne çıkan açıklaması olarak kullanılır.</p>
            </div>
          </CardContent>
        </Card>

        {/* Image Section */}
        <Card className="bg-[#0a0a0a]/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-pink-400" />
              Görsel Ayarları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label className="text-slate-300">Hero Görsel URL (admin_1_gorsel_url)</Label>
              <Input
                value={formData.admin_1_gorsel_url}
                onChange={(e) => handleInputChange('admin_1_gorsel_url', e.target.value)}
                className="bg-[#0a0a0a] border-slate-800 text-white"
              />
            </div>
            {formData.admin_1_gorsel_url && (
              <div className="mt-4 p-2 bg-[#0a0a0a] rounded-lg border border-slate-800">
                <img 
                  src={formData.admin_1_gorsel_url} 
                  alt="Kurulum görsel önizlemesi" 
                  className="max-h-60 w-auto mx-auto rounded"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminTabWrapper>
  );
};

export default SetupPage;