import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Input, Textarea, ImagePreviewInput } from '@/components/admin/AdminFormControls';
import { clearSiteDataCache } from '@/hooks/useSiteData';
import { Button } from '@/components/ui/button';
import { Save, Info, Zap, Home, Loader2, Plus, Trash2, ImageIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AdminTabWrapper from '@/components/admin/AdminTabWrapper';
import { adminPath } from '@/constants/adminRoutes';

export const HeroTab = ({ siteData, setSiteData }) => {
    const { toast } = useToast();
    const location = useLocation();
    const { setHeroData } = setSiteData;
    const defaultMainTab = useMemo(
        () => (location.pathname === adminPath('hero') ? 'premiumSlides' : 'content'),
        [location.pathname]
    );

    // Use local state for form handling to prevent excessive DB writes
    const [formData, setFormData] = useState(siteData.heroData || {});
    const [isSaving, setIsSaving] = useState(false);

    // Sync with siteData when it changes (initial load or external update)
    useEffect(() => {
        if (siteData.heroData) {
            const h = siteData.heroData;
            const urls = Array.isArray(h.premiumHeroBackdropUrls)
                ? [...h.premiumHeroBackdropUrls]
                : [];
            setFormData({
                ...h,
                premiumHeroBackdropUrls: urls.length ? urls : [''],
            });
        }
    }, [siteData.heroData]);
    
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const rawUrls = Array.isArray(formData.premiumHeroBackdropUrls)
                ? formData.premiumHeroBackdropUrls
                : [];
            const cleanedUrls = rawUrls.map((s) => String(s).trim()).filter(Boolean).slice(0, 15);
            const payload = { ...formData, premiumHeroBackdropUrls: cleanedUrls };
            await setHeroData(payload);
            clearSiteDataCache();

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
            <Tabs key={defaultMainTab} defaultValue={defaultMainTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-[#0a0a0a] p-1 rounded-xl mb-6 gap-1">
                    <TabsTrigger value="content" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white text-xs sm:text-sm">İçerik & Metin</TabsTrigger>
                    <TabsTrigger value="style" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white text-xs sm:text-sm">Stil & Renkler</TabsTrigger>
                    <TabsTrigger value="premiumSlides" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white text-xs sm:text-sm">Premium slayt</TabsTrigger>
                    <TabsTrigger value="info" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white text-xs sm:text-sm">Bilgi</TabsTrigger>
                </TabsList>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-6">
                    <div className="admin-card">
                        <Alert className="mb-6 bg-primary/20 border-primary/50 text-primary">
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
                                placeholder="Örn: QruzeTV"
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
                                <h5 className="font-semibold text-primary mb-4">Birinci Buton (Ana Aksiyon)</h5>
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
                        <div className="flex items-center justify-between p-4 bg-[#0a0a0a]/50 rounded-lg border border-slate-700">
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

                <TabsContent value="premiumSlides" className="space-y-6">
                    <div className="admin-card space-y-6">
                        <div className="flex items-start gap-3">
                            <ImageIcon className="w-5 h-5 text-primary shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Ana sayfa Premium Hero arka planı</h3>
                                <p className="text-sm text-gray-400">
                                    TMDB yerine kendi görsel adreslerinizi kullanın. Her satıra tam URL yapıştırın (https://…). En fazla 15 görsel; slayt sırası listedeki sıradır.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#0a0a0a]/50 rounded-lg border border-slate-700">
                            <div className="space-y-1 pr-4">
                                <Label className="text-base text-white">Özel görsel URL’leri kullan</Label>
                                <p className="text-xs text-gray-400">
                                    Açıkken sadece sizin yapıştırdığınız adresler kullanılır; URL yokken arka planda yalnızca renkli gradient görünür (TMDB çağrılmaz). Kapalıysa TMDB’den otomatik görseller yüklenir (ayrıca sabit yedek görsel listesi yoktur).
                                </p>
                            </div>
                            <Switch
                                checked={formData.premiumHeroUseCustomBackdrops === true}
                                onCheckedChange={(checked) => handleChange('premiumHeroUseCustomBackdrops', checked)}
                            />
                        </div>

                        <Input
                            label="Slayt üst yazısı (tüm görseller için)"
                            value={formData.premiumHeroCustomSlideCaption ?? ''}
                            onChange={(e) => handleChange('premiumHeroCustomSlideCaption', e.target.value)}
                            placeholder="Örn: Sinema Kalitesinde Yayın"
                        />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-white">Görsel URL listesi</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="border-primary/50 text-primary hover:bg-primary/40"
                                    onClick={() => {
                                        const list = Array.isArray(formData.premiumHeroBackdropUrls)
                                            ? [...formData.premiumHeroBackdropUrls]
                                            : [''];
                                        if (list.length >= 15) return;
                                        handleChange('premiumHeroBackdropUrls', [...list, '']);
                                    }}
                                    disabled={(formData.premiumHeroBackdropUrls || []).length >= 15}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Satır ekle
                                </Button>
                            </div>

                            {(Array.isArray(formData.premiumHeroBackdropUrls) ? formData.premiumHeroBackdropUrls : ['']).map((url, index) => (
                                <div key={index} className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:items-start p-3 rounded-lg border border-slate-700 bg-[#0a0a0a]/30">
                                    <div className="flex-1 min-w-0 space-y-2 w-full">
                                        <ImagePreviewInput
                                            label={`Görsel ${index + 1}`}
                                            value={url}
                                            onChange={(e) => {
                                                const list = [...(formData.premiumHeroBackdropUrls || [''])];
                                                list[index] = e.target.value;
                                                handleChange('premiumHeroBackdropUrls', list);
                                            }}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0 self-end sm:self-auto sm:mt-8 text-red-400 hover:text-red-300 hover:bg-red-950/40 min-h-[44px] min-w-[44px]"
                                        onClick={() => {
                                            const list = [...(formData.premiumHeroBackdropUrls || [''])];
                                            if (list.length <= 1) {
                                                handleChange('premiumHeroBackdropUrls', ['']);
                                                return;
                                            }
                                            list.splice(index, 1);
                                            handleChange('premiumHeroBackdropUrls', list.length ? list : ['']);
                                        }}
                                        aria-label="Satırı sil"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
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
                            <li><strong>Görseller:</strong> Eski banner slaytları için "Banner Yönetimi"; ana sayfa Premium Hero için "Premium slayt" sekmesinde URL girebilirsiniz.</li>
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