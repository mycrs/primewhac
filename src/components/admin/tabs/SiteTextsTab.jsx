import React, { useState, useEffect } from 'react';
import { Input, Textarea } from '@/components/admin/AdminFormControls';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';

export const SiteTextsTab = ({ siteData, setSiteData }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState(siteData.siteTexts || {});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (siteData.siteTexts) {
            setFormData(siteData.siteTexts);
        }
    }, [siteData.siteTexts]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { success } = await setSiteData.updateSiteContent('siteTexts', formData);
            if (success) {
                toast({ title: "Başarılı", description: "Metinler güncellendi." });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Hata", description: "Kaydedilemedi." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (section, key, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Site Metinleri</h2>
                    <p className="text-gray-400">Sayfa başlıkları ve açıklamalarını düzenleyin.</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Tümünü Kaydet
                </Button>
            </div>
            
            <Tabs defaultValue="home" className="w-full">
                <TabsList className="bg-slate-800">
                    <TabsTrigger value="home">Ana Sayfa</TabsTrigger>
                    <TabsTrigger value="about">Hakkımızda</TabsTrigger>
                    <TabsTrigger value="contact">İletişim</TabsTrigger>
                    <TabsTrigger value="blog">Blog</TabsTrigger>
                </TabsList>

                <TabsContent value="home" className="space-y-4 mt-4 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-lg font-bold text-white mb-4">Ana Sayfa Bölümleri</h3>
                    <Input 
                        label="Ana Sayfa Başlık (Hero)" 
                        value={formData.homepage?.title || ''} 
                        onChange={e => handleChange('homepage', 'title', e.target.value)} 
                    />
                    <Textarea 
                        label="Ana Sayfa Açıklama" 
                        value={formData.homepage?.description || ''} 
                        onChange={e => handleChange('homepage', 'description', e.target.value)} 
                    />
                    <Input 
                        label="İstatistikler Başlığı" 
                        value={formData.homeSections?.stats?.title || ''} 
                        onChange={e => handleChange('homeSections', 'stats', { ...formData.homeSections?.stats, title: e.target.value })} 
                    />
                </TabsContent>

                <TabsContent value="about" className="space-y-4 mt-4 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-lg font-bold text-white mb-4">Hakkımızda Sayfası</h3>
                    <Input 
                        label="Hakkımızda Başlık" 
                        value={formData.about?.title || ''} 
                        onChange={e => handleChange('about', 'title', e.target.value)} 
                    />
                    <Textarea 
                        label="Hakkımızda Açıklama" 
                        rows={6}
                        value={formData.about?.description || ''} 
                        onChange={e => handleChange('about', 'description', e.target.value)} 
                    />
                </TabsContent>

                <TabsContent value="contact" className="space-y-4 mt-4 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-lg font-bold text-white mb-4">İletişim Sayfası</h3>
                    <Input 
                        label="İletişim Başlık" 
                        value={formData.contact?.title || ''} 
                        onChange={e => handleChange('contact', 'title', e.target.value)} 
                    />
                    <Textarea 
                        label="İletişim Açıklama" 
                        rows={4}
                        value={formData.contact?.description || ''} 
                        onChange={e => handleChange('contact', 'description', e.target.value)} 
                    />
                </TabsContent>

                <TabsContent value="blog" className="space-y-4 mt-4 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-lg font-bold text-white mb-4">Blog Sayfası</h3>
                    <Input 
                        label="Blog Ana Başlık" 
                        value={formData.blog?.title || ''} 
                        onChange={e => handleChange('blog', 'title', e.target.value)} 
                    />
                    <Textarea 
                        label="Blog Sayfası Açıklaması" 
                        rows={4}
                        value={formData.blog?.description || ''} 
                        onChange={e => handleChange('blog', 'description', e.target.value)} 
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SiteTextsTab;