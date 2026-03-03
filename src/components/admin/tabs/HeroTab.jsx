import React, { useState, useEffect } from 'react';
import { Input, Textarea, ImagePreviewInput } from '@/components/admin/AdminFormControls';
import { Button } from '@/components/ui/button';
import { Save, Info, Zap, Smartphone, Monitor, Home, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AdminTabWrapper from '@/components/admin/AdminTabWrapper';

export const HeroTab = ({ siteData, setSiteData }) => {
    const { toast } = useToast();
    const { setHeroData } = setSiteData;
    
    // Use local state for form handling to prevent excessive DB writes
    const [formData, setFormData] = useState(siteData.heroData || {});
    const [isSaving, setIsSaving] = useState(false);

    // Sync with siteData when it changes (initial load or external update)
    useEffect(() => {
        if (siteData.heroData) {
            setFormData(siteData.heroData);
        }
    }, [siteData.heroData]);
    
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Save to Supabase via the hook wrapper
            await setHeroData(formData);
            
            toast({ 
                title: "Başarılı", 
                description: "Hero ayarları ve metinler başarıyla kaydedildi.",
                className: "bg-green-600 text-white"
            });
        } catch (error) {
            console.error("Save error:", error);
            toast({ 
                variant: "destructive",
                title: "Hata", 
                description: "Ayarlar kaydedilirken bir sorun oluştu." 
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AdminTabWrapper
            title="Ana Karşılama (Hero) Ayarları"
            description="Sitenizin açılış ekranındaki metinleri ve butonları özelleştirin."
            icon={Home}
            actions={
                <Button onClick={handleSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700 text-white">
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </Button>
            }
        >
            <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800 p-1 rounded-xl mb-6">
                    <TabsTrigger value="content" className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white">İçerik & Metin</TabsTrigger>
                    <TabsTrigger value="style" className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white">Stil & Renkler</TabsTrigger>
                    <TabsTrigger value="info" className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white">Bilgi</TabsTrigger>
                </TabsList>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-6">
                    <div className="admin-card">
                        <Alert className="mb-6 bg-purple-900/20 border-purple-500/50 text-purple-200">
                            <Info className="h-4 w-4" />
                            <AlertTitle>Önemli Bilgi</AlertTitle>
                            <AlertDescription>
                                Bu metinler, "Banner Yönetimi" sekmesinde yüklediğiniz görsellerde başlık/açıklama girilmemişse varsayılan olarak kullanılır.
                            </AlertDescription>
                        </Alert>

                        <div className="admin-grid-2">
                            <Input 
                                label="Üst Başlık (Önek)" 
                                value={formData.titlePrefix || ""} 
                                onChange={e => handleChange('titlePrefix', e.target.value)}
                                placeholder="Örn: QruzeHD"
                            />
                            <Input 
                                label="Vurgulu Başlık (Gradient)" 
                                value={formData.titleHighlight || ""} 
                                onChange={e => handleChange('titleHighlight', e.target.value)}
                                placeholder="Örn: Sınırsız Eğlence"
                            />
                        </div>
                        
                        <Textarea 
                            label="Açıklama Metni" 
                            value={formData.description || ""} 
                            onChange={e => handleChange('description', e.target.value)}
                            rows={3}
                        />

                        <div className="admin-divider" />

                        <div className="admin-grid-2">
                            <div>
                                <h5 className="font-semibold text-purple-400 mb-4">Birinci Buton (Ana Aksiyon)</h5>
                                <Input 
                                    label="Buton Metni" 
                                    value={formData.primaryButtonText || ""} 
                                    onChange={e => handleChange('primaryButtonText', e.target.value)}
                                />
                                <Input 
                                    label="Buton Linki/Aksiyonu" 
                                    value={formData.primaryButtonLink || ""} 
                                    onChange={e => handleChange('primaryButtonLink', e.target.value)}
                                    placeholder="paketler"
                                />
                            </div>
                            <div>
                                <h5 className="font-semibold text-pink-400 mb-4">İkinci Buton</h5>
                                <Input 
                                    label="Buton Metni" 
                                    value={formData.secondaryButtonText || ""} 
                                    onChange={e => handleChange('secondaryButtonText', e.target.value)}
                                />
                                <Input 
                                    label="Buton Linki" 
                                    value={formData.secondaryButtonLink || ""} 
                                    onChange={e => handleChange('secondaryButtonLink', e.target.value)}
                                    placeholder="contact"
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Style Tab */}
                <TabsContent value="style" className="space-y-6">
                    <div className="admin-card space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                            <div className="space-y-1">
                                <Label className="text-base text-white flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-yellow-400" />
                                    Animasyonları Etkinleştir
                                </Label>
                                <p className="text-xs text-gray-400">
                                    Masaüstü cihazlarda giriş animasyonlarını gösterir.
                                </p>
                            </div>
                            <Switch 
                                checked={formData.animationEnabled !== false}
                                onCheckedChange={checked => handleChange('animationEnabled', checked)}
                            />
                        </div>

                        <div className="admin-grid-2">
                            <div>
                                <Label className="mb-2 block text-white">Overlay Başlangıç Rengi</Label>
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="w-10 h-10 rounded border border-gray-600 shadow-sm shrink-0"
                                        style={{ backgroundColor: formData.overlayColorStart || "rgba(0,0,0,0.9)" }}
                                    />
                                    <Input 
                                        value={formData.overlayColorStart || ""}
                                        onChange={e => handleChange('overlayColorStart', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="mb-2 block text-white">Overlay Bitiş Rengi</Label>
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="w-10 h-10 rounded border border-gray-600 shadow-sm shrink-0"
                                        style={{ backgroundColor: formData.overlayColorEnd || "rgba(88, 28, 135, 0.4)" }}
                                    />
                                    <Input 
                                        value={formData.overlayColorEnd || ""}
                                        onChange={e => handleChange('overlayColorEnd', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="info">
                     <div className="admin-card">
                        <h3 className="text-lg font-bold text-white mb-2">Nasıl Çalışır?</h3>
                        <p className="text-gray-300 mb-4">
                            "Hero" alanı, sitenizin en üstünde yer alan büyük karşılama ekranıdır. 
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-400">
                            <li><strong>Görseller:</strong> Görsel yönetimi için lütfen "Banner Yönetimi" sekmesini kullanın.</li>
                            <li><strong>Metinler:</strong> Bu sekmeden girdiğiniz başlık ve açıklamalar, görsel slaytlarında özel bir metin yoksa kullanılır.</li>
                            <li><strong>Butonlar:</strong> "Hemen Başla" ve "Detaylı Bilgi" butonlarının metinlerini ve yönlendirme linklerini buradan değiştirebilirsiniz.</li>
                        </ul>
                     </div>
                </TabsContent>
            </Tabs>
        </AdminTabWrapper>
    );
};

export default HeroTab;