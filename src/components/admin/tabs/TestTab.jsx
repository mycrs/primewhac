import React, { useState } from 'react';
import { Save, Zap, Info, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

const TestTab = ({ siteData, setSiteData }) => {
  const { toast } = useToast();
  
  // Initialize with existing data or defaults
  const [formData, setFormData] = useState(siteData.test_settings || {
    enabled: true,
    whatsapp: '',
    message_template: "Merhaba, {appName} uygulamasını {deviceType} cihazında test etmek istiyorum."
  });
  
  const handleSettingsChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      await setSiteData.setTest_settings(formData);
      toast({
        title: "Başarılı",
        description: "Test ayarları güncellendi.",
        className: "bg-green-600 border-green-700 text-white"
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ayarlar kaydedilirken bir sorun oluştu.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Zap className="h-8 w-8 text-yellow-500" />
            Test Yayını Yönetimi
          </h2>
          <p className="text-gray-400">Test başvurusu genel ayarlarını yönetin.</p>
        </div>
        <Button onClick={handleSaveSettings} className="bg-green-600 hover:bg-green-700">
          <Save className="mr-2 h-4 w-4" />
          Ayarları Kaydet
        </Button>
      </div>

      {/* Info Alert about Apps Location */}
      <Alert className="bg-[#0a0a0a]/20 border-blue-800 text-blue-200">
        <Info className="h-4 w-4" />
        <AlertTitle>Önemli Bilgi</AlertTitle>
        <AlertDescription className="mt-2 text-sm">
            Test başvurularında listelenen uygulamalar artık <strong>"Akıllı Form Uygulamaları"</strong> sekmesinden yönetilmektedir. 
            Burada yaptığınız uygulama değişiklikleri hem "Satın Al" hem de "Test Al" formlarında ortak olarak kullanılır.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {/* General Settings Card */}
        <Card className="bg-[#0a0a0a] border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Genel Ayarlar</CardTitle>
            <CardDescription className="text-slate-400">
              İletişim ve görünürlük ayarları
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a]/50 rounded-lg border border-slate-700">
              <div className="space-y-1">
                <Label className="text-base text-white">Test Modülü Aktif</Label>
                <p className="text-sm text-slate-400">Kapalıyken sitedeki tüm "Test Al" butonları gizlenir.</p>
              </div>
              <Switch
                checked={formData.enabled}
                onCheckedChange={(checked) => handleSettingsChange('enabled', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-white">WhatsApp Numarası</Label>
              <div className="relative">
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => handleSettingsChange('whatsapp', e.target.value)}
                  placeholder="4916345869030"
                  className="bg-[#0a0a0a] border-slate-700 text-white"
                />
              </div>
              <p className="text-xs text-slate-500">
                  Bu numara sadece test başvurularını almak için kullanılır. Boş bırakılırsa genel iletişim numarası kullanılır.
                  Lütfen numarayı ülke koduyla birlikte başında + olmadan yazın (örn: 49163...)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Message Template Card */}
        <Card className="bg-[#0a0a0a] border-slate-700">
          <CardHeader>
             <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Mesaj Şablonu
             </CardTitle>
             <CardDescription className="text-slate-400">
                Müşterilerin WhatsApp üzerinden göndereceği otomatik mesajı özelleştirin.
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="template" className="text-white">Şablon İçeriği</Label>
                <Textarea 
                   id="template"
                   value={formData.message_template}
                   onChange={(e) => handleSettingsChange('message_template', e.target.value)}
                   className="bg-[#0a0a0a] border-slate-700 text-white min-h-[100px]"
                   placeholder="Merhaba, test almak istiyorum..."
                />
             </div>

             <div className="bg-[#0a0a0a]/50 p-4 rounded-md border border-slate-700">
                <p className="text-sm font-semibold text-slate-300 mb-2">Kullanılabilir Değişkenler:</p>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                   <li><code className="bg-[#0a0a0a] px-1 py-0.5 rounded text-primary">{`{appName}`}</code> - Seçilen uygulama adı (örn: IBO Player)</li>
                   <li><code className="bg-[#0a0a0a] px-1 py-0.5 rounded text-primary">{`{deviceType}`}</code> - Cihaz türü (örn: Android TV)</li>
                </ul>
                <p className="text-xs text-slate-500 mt-3">
                   Örnek Çıktı: "Merhaba, <strong>IBO Player</strong> uygulamasını <strong>Android TV</strong> cihazında test etmek istiyorum."
                </p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestTab;