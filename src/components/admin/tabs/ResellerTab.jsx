import React, { useState, useEffect } from 'react';
import { Input, Textarea } from '@/components/admin/AdminFormControls';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const ResellerTab = ({ siteData, setSiteData }) => {
    const { toast } = useToast();
    const { setResellerData } = setSiteData;

    const [formData, setFormData] = useState(siteData.resellerData || {});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (siteData.resellerData) {
            setFormData(siteData.resellerData);
        }
    }, [siteData.resellerData]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await setResellerData(formData);
            toast({ title: "Başarılı", description: "Bayilik sayfası güncellendi." });
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Hata", description: "Kaydedilemedi." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (section, key, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] || {}),
                [key]: value
            }
        }));
    };
    
    const handleFeatureChange = (index, key, value) => {
        setFormData(prev => {
            const newFeatures = [...(prev.features || [])];
            newFeatures[index] = { ...newFeatures[index], [key]: value };
            return { ...prev, features: newFeatures };
        });
    }

    const addFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...(prev.features || []), { id: Date.now(), title: '', description: '', icon: 'CheckCircle' }]
        }));
    };

    const removeFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: (prev.features || []).filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Bayilik Sayfası Yönetimi</h3>
                <Button onClick={handleSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Kaydet
                </Button>
            </div>
            
            <div className="glass-effect rounded-lg p-6 space-y-4">
                <h4 className="text-xl font-bold text-yellow-400">Ana Başlıklar</h4>
                <Input label="Sayfa Başlığı" value={formData.title || ''} onChange={e => setFormData(p => ({...p, title: e.target.value}))} />
                <Textarea label="Sayfa Alt Başlığı" value={formData.subtitle || ''} onChange={e => setFormData(p => ({...p, subtitle: e.target.value}))} rows={2} />
            </div>

            <div className="glass-effect rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="text-xl font-bold text-yellow-400">Özellikler</h4>
                    <Button onClick={addFeature} size="sm" variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Özellik Ekle</Button>
                </div>
                 {(formData.features || []).map((feature, index) => (
                    <div key={feature.id || index} className="space-y-2 p-4 border border-gray-700 rounded-md relative bg-slate-900/50">
                        <Input label={`Özellik ${index + 1} Başlık`} value={feature.title} onChange={e => handleFeatureChange(index, 'title', e.target.value)} />
                        <Textarea label={`Özellik ${index + 1} Açıklama`} value={feature.description} onChange={e => handleFeatureChange(index, 'description', e.target.value)} rows={2} />
                        <Input label={`Özellik ${index + 1} İkon Adı`} value={feature.icon} onChange={e => handleFeatureChange(index, 'icon', e.target.value)} placeholder="Örn: LayoutDashboard, Wallet, Shield" />
                        <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => removeFeature(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                 ))}
            </div>

            <div className="glass-effect rounded-lg p-6 space-y-4">
                <h4 className="text-xl font-bold text-yellow-400">Eyleme Çağrı (CTA)</h4>
                 <Input label="Başlık" value={formData.cta?.title || ''} onChange={e => handleChange('cta', 'title', e.target.value)} />
                 <Textarea label="Açıklama" value={formData.cta?.description || ''} onChange={e => handleChange('cta', 'description', e.target.value)} rows={2} />
                 <Input label="Buton Metni" value={formData.cta?.buttonText || ''} onChange={e => handleChange('cta', 'buttonText', e.target.value)} />
                 <Textarea label="Bayilik WhatsApp Mesajı" value={formData.cta?.whatsappMessage || ''} onChange={e => handleChange('cta', 'whatsappMessage', e.target.value)} rows={2} />
            </div>
        </div>
    );
};

export default ResellerTab;