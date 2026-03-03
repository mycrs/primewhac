import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { Input, Textarea, ImagePreviewInput } from '@/components/admin/AdminFormControls';
import { useToast } from '@/components/ui/use-toast';

export const InstallationTab = ({ siteData, setSiteData }) => {
    const { toast } = useToast();
    const { setInstallationPageData } = setSiteData;
    
    const [formData, setFormData] = useState(siteData.installationPageData || { title: '', tabs: [] });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (siteData.installationPageData) {
            setFormData(siteData.installationPageData);
        }
    }, [siteData.installationPageData]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await setInstallationPageData(formData);
            toast({ title: "Başarılı", description: "Kurulum sayfası güncellendi." });
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Hata", description: "Kaydedilemedi." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleTitleChange = (e) => {
        setFormData(prev => ({ ...prev, title: e.target.value }));
    };

    const handleTabChange = (tabIndex, field, value) => {
        const newTabs = [...(formData.tabs || [])];
        newTabs[tabIndex] = { ...newTabs[tabIndex], [field]: value };
        setFormData(prev => ({ ...prev, tabs: newTabs }));
    };

    const addTab = () => {
        const newTabs = [...(formData.tabs || []), { id: `tab_${Date.now()}`, title: 'Yeni Cihaz', steps: [], apps: [] }];
        setFormData(prev => ({ ...prev, tabs: newTabs }));
    };

    const removeTab = (tabIndex) => {
        const newTabs = (formData.tabs || []).filter((_, i) => i !== tabIndex);
        setFormData(prev => ({ ...prev, tabs: newTabs }));
    };
    
    const handleStepChange = (tabIndex, stepIndex, field, value) => {
        const newTabs = [...(formData.tabs || [])];
        newTabs[tabIndex].steps[stepIndex][field] = value;
        setFormData(prev => ({ ...prev, tabs: newTabs }));
    };

    const addStep = (tabIndex) => {
        const newTabs = [...(formData.tabs || [])];
        if (!newTabs[tabIndex].steps) newTabs[tabIndex].steps = [];
        newTabs[tabIndex].steps.push({ id: Date.now(), description: '', imageUrl: '' });
        setFormData(prev => ({ ...prev, tabs: newTabs }));
    };

    const removeStep = (tabIndex, stepIndex) => {
        const newTabs = [...(formData.tabs || [])];
        newTabs[tabIndex].steps.splice(stepIndex, 1);
        setFormData(prev => ({ ...prev, tabs: newTabs }));
    };

    const handleAppChange = (tabIndex, appIndex, field, value) => {
        const newTabs = [...(formData.tabs || [])];
        const app = { ...newTabs[tabIndex].apps[appIndex] };

        if (field.startsWith('details.')) {
            const detailField = field.split('.')[1];
            app.details = { ...(app.details || {}), [detailField]: value };
        } else {
            app[field] = value;
        }
        newTabs[tabIndex].apps[appIndex] = app;
        setFormData(prev => ({ ...prev, tabs: newTabs }));
    };

    const addApp = (tabIndex) => {
        const newTabs = [...(formData.tabs || [])];
        if (!newTabs[tabIndex].apps) newTabs[tabIndex].apps = [];
        newTabs[tabIndex].apps.push({ name: '', url: '#', slug: '', details: { title: '', description: '', content: '' } });
        setFormData(prev => ({ ...prev, tabs: newTabs }));
    };

    const removeApp = (tabIndex, appIndex) => {
        const newTabs = [...(formData.tabs || [])];
        newTabs[tabIndex].apps.splice(appIndex, 1);
        setFormData(prev => ({ ...prev, tabs: newTabs }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Kurulum Sayfası Yönetimi</h3>
                <Button onClick={handleSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Değişiklikleri Kaydet
                </Button>
            </div>
            
            <div className="glass-effect rounded-lg p-6">
                <Input 
                    label="Sayfa Başlığı" 
                    value={formData.title || ''} 
                    onChange={handleTitleChange} 
                />
            </div>
            
            <div className="flex justify-end">
                <Button onClick={addTab} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" /> Yeni Sekme (Cihaz) Ekle
                </Button>
            </div>

            <div className="space-y-4">
                {(formData.tabs || []).map((tab, tabIndex) => (
                    <div key={tab.id} className="glass-effect rounded-lg p-6 space-y-4 border border-slate-800">
                        <div className="flex justify-between items-center">
                            <Input 
                                label="Sekme Başlığı" 
                                value={tab.title} 
                                onChange={e => handleTabChange(tabIndex, 'title', e.target.value)} 
                            />
                            <Button onClick={() => removeTab(tabIndex)} variant="destructive" size="sm" className="ml-4 mt-6">
                                <Trash2 className="w-4 h-4 mr-2" /> Sekmeyi Sil
                            </Button>
                        </div>
                        
                        <div className="border-t border-gray-700 pt-4 mt-4">
                            <h4 className="text-lg font-bold text-yellow-400 mb-2">Kurulum Adımları</h4>
                             {(tab.steps || []).map((step, stepIndex) => (
                                <div key={step.id || stepIndex} className="p-3 border border-gray-600 rounded-lg mb-3 space-y-3 bg-slate-900/50">
                                    <Textarea 
                                        label={`Adım ${stepIndex + 1} Açıklama`}
                                        value={step.description}
                                        onChange={e => handleStepChange(tabIndex, stepIndex, 'description', e.target.value)}
                                        rows={3}
                                    />
                                    <ImagePreviewInput
                                        label={`Adım ${stepIndex + 1} Görsel URL`}
                                        value={step.imageUrl}
                                        onChange={e => handleStepChange(tabIndex, stepIndex, 'imageUrl', e.target.value)}
                                        placeholder="https://ornek.com/gorsel.jpg"
                                    />
                                    <Button onClick={() => removeStep(tabIndex, stepIndex)} variant="destructive" size="sm" className="mt-2">
                                        <Trash2 className="w-4 h-4 mr-2"/> Adımı Sil
                                    </Button>
                                </div>
                            ))}
                            <Button onClick={() => addStep(tabIndex)} size="sm" variant="outline" className="mt-2 border-dashed border-slate-600 text-slate-400">
                                <Plus className="w-4 h-4 mr-2" /> Adım Ekle
                            </Button>
                        </div>

                        <div className="border-t border-gray-700 pt-4 mt-4">
                            <h4 className="text-lg font-bold text-yellow-400 mb-2">Uygulama Linkleri ve Detayları</h4>
                             {(tab.apps || []).map((app, appIndex) => (
                                <div key={appIndex} className="p-3 border border-gray-600 rounded-lg mb-3 space-y-2 bg-slate-900/50">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        <Input label="Uygulama Adı" value={app.name || ''} onChange={e => handleAppChange(tabIndex, appIndex, 'name', e.target.value)} />
                                        <Input label="İndirme Linki (URL)" value={app.url || ''} onChange={e => handleAppChange(tabIndex, appIndex, 'url', e.target.value)} />
                                        <Input label="URL Slug (örn: uygulama-adi)" value={app.slug || ''} onChange={e => handleAppChange(tabIndex, appIndex, 'slug', e.target.value)} />
                                    </div>
                                    <Input label="Detay Sayfası Başlığı" value={app.details?.title || ''} onChange={e => handleAppChange(tabIndex, appIndex, 'details.title', e.target.value)} />
                                    <Textarea label="Detay Sayfası Kısa Açıklama (SEO için)" value={app.details?.description || ''} onChange={e => handleAppChange(tabIndex, appIndex, 'details.description', e.target.value)} rows={2} />
                                    <Textarea label="Detaylı Kurulum Anlatımı" value={app.details?.content || ''} onChange={e => handleAppChange(tabIndex, appIndex, 'details.content', e.target.value)} rows={6} />
                                    <Button onClick={() => removeApp(tabIndex, appIndex)} variant="destructive" size="sm" className="mt-2">
                                        <Trash2 className="w-4 h-4 mr-2"/> Uygulamayı Sil
                                    </Button>
                                </div>
                            ))}
                            <Button onClick={() => addApp(tabIndex)} size="sm" variant="outline" className="mt-2 border-dashed border-slate-600 text-slate-400">
                                <Plus className="w-4 h-4 mr-2" /> Uygulama Ekle
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InstallationTab;