import React from 'react';
import { Input, Textarea } from '@/components/admin/AdminFormControls';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

export const AboutTab = ({ siteData, setSiteData }) => {
    const { aboutData } = siteData;
    const { setAboutData } = setSiteData;

    const handleChange = (field, value) => {
        setAboutData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFeatureChange = (index, key, value) => {
        setAboutData(prev => {
            const newFeatures = [...(prev.features || [])];
            newFeatures[index] = { ...newFeatures[index], [key]: value };
            return { ...prev, features: newFeatures };
        });
    }

    const addFeature = () => {
        setAboutData(prev => ({
            ...prev,
            features: [...(prev.features || []), { id: Date.now(), title: '', description: '', icon: 'CheckCircle' }]
        }));
    };

    const removeFeature = (index) => {
        setAboutData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Hakkımızda Sayfası</h3>
            <div className="glass-effect rounded-lg p-6 space-y-4">
                <Input 
                    label="Ana Başlık" 
                    value={aboutData?.title || ''} 
                    onChange={e => handleChange('title', e.target.value)} 
                />
                <Textarea 
                    label="Alt Başlık" 
                    value={aboutData?.subtitle || ''} 
                    onChange={e => handleChange('subtitle', e.target.value)} 
                    rows={2}
                />
            </div>

            <div className="glass-effect rounded-lg p-6 space-y-4">
                <h4 className="text-xl font-bold text-yellow-400">Bölüm 1: Misyon & Vizyon</h4>
                <Input 
                    label="Bölüm 1 Başlığı" 
                    value={aboutData?.section1Title || ''} 
                    onChange={e => handleChange('section1Title', e.target.value)} 
                />
                <Textarea 
                    label="Bölüm 1 Ana Metin" 
                    value={aboutData?.mainText || ''} 
                    onChange={e => handleChange('mainText', e.target.value)}
                    rows={5} 
                />
                 <Input 
                    label="Bölüm 1 Resim URL" 
                    value={aboutData?.imageUrl || ''} 
                    onChange={e => handleChange('imageUrl', e.target.value)}
                />
            </div>

            <div className="glass-effect rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="text-xl font-bold text-yellow-400">Öne Çıkan Özellikler</h4>
                    <Button onClick={addFeature} size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Özellik Ekle</Button>
                </div>
                 {(aboutData?.features || []).map((feature, index) => (
                    <div key={feature.id || index} className="space-y-2 p-4 border border-gray-700 rounded-md relative">
                        <Input label={`Özellik ${index + 1} Başlık`} value={feature.title} onChange={e => handleFeatureChange(index, 'title', e.target.value)} />
                        <Textarea label={`Özellik ${index + 1} Açıklama`} value={feature.description} onChange={e => handleFeatureChange(index, 'description', e.target.value)} rows={2} />
                        <Input label={`Özellik ${index + 1} İkon Adı (Lucide)`} value={feature.icon} onChange={e => handleFeatureChange(index, 'icon', e.target.value)} placeholder="Örn: Target, ShieldCheck, Users" />
                        <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => removeFeature(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                 ))}
            </div>

            <div className="glass-effect rounded-lg p-6 space-y-4">
                <h4 className="text-xl font-bold text-yellow-400">Bölüm 2: Teknoloji & Müşteri Memnuniyeti</h4>
                 <Input 
                    label="Bölüm 2 Başlığı" 
                    value={aboutData?.section2Title || ''} 
                    onChange={e => handleChange('section2Title', e.target.value)} 
                />
                <Textarea 
                    label="Bölüm 2 Metni" 
                    value={aboutData?.secondaryText || ''} 
                    onChange={e => handleChange('secondaryText', e.target.value)}
                    rows={5} 
                />
                 <Input 
                    label="Bölüm 2 Resim URL" 
                    value={aboutData?.secondaryImageUrl || ''} 
                    onChange={e => handleChange('secondaryImageUrl', e.target.value)}
                />
            </div>
        </div>
    );
};