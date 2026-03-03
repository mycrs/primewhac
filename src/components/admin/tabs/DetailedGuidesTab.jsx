import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { Input, Textarea, ImagePreviewInput } from '@/components/admin/AdminFormControls';
import { useToast } from '@/components/ui/use-toast';

const GuideEditor = ({ guide, onSave, onCancel }) => {
    const [formData, setFormData] = useState(guide);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="glass-effect rounded-lg p-6 space-y-4">
            <h4 className="text-xl font-bold text-white mb-4">{guide.isNew ? 'Yeni Rehber Ekle' : 'Rehberi Düzenle'}</h4>
            <Input label="Rehber Başlığı" value={formData.title || ''} onChange={e => handleChange('title', e.target.value)} />
            <ImagePreviewInput label="İkon URL" value={formData.iconUrl || ''} onChange={e => handleChange('iconUrl', e.target.value)} placeholder="https://ornek.com/ikon.png" />
            <Textarea label="Kısa Açıklama (Kart için)" value={formData.description || ''} onChange={e => handleChange('description', e.target.value)} rows={3} />
            <Textarea label="Detaylı Kurulum İçeriği (Adımlar için)" value={formData.content || ''} onChange={e => handleChange('content', e.target.value)} rows={12} />
            <div className="flex space-x-4">
                <Button onClick={() => onSave(formData)} className="bg-green-600 hover:bg-green-700">
                    <Save className="mr-2 h-4 w-4" /> Kaydet
                </Button>
                <Button onClick={onCancel} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" /> İptal
                </Button>
            </div>
        </div>
    );
};

export const DetailedGuidesTab = ({ siteData, setSiteData }) => {
    const { toast } = useToast();
    const { setDetailedGuidesData } = setSiteData;

    const [formData, setFormData] = useState(siteData.detailedGuidesData || { title: '', subtitle: '', guides: [] });
    const [isSaving, setIsSaving] = useState(false);
    const [editingGuide, setEditingGuide] = useState(null);

    useEffect(() => {
        if (siteData.detailedGuidesData) {
            setFormData(siteData.detailedGuidesData);
        }
    }, [siteData.detailedGuidesData]);

    const handleSaveSettings = async () => {
        setIsSaving(true);
        try {
            await setDetailedGuidesData(formData);
            toast({ title: "Başarılı", description: "Sayfa ayarları kaydedildi." });
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Hata", description: "Kaydedilemedi." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveGuide = (guideToSave) => {
        let updatedGuides;
        if (guideToSave.isNew) {
            const newGuide = { ...guideToSave, id: Date.now(), isNew: undefined };
            updatedGuides = [...(formData.guides || []), newGuide];
        } else {
            updatedGuides = (formData.guides || []).map(g => g.id === guideToSave.id ? guideToSave : g);
        }
        
        const newFormData = { ...formData, guides: updatedGuides };
        setFormData(newFormData);
        setEditingGuide(null);
        
        // Auto-save guides
        setDetailedGuidesData(newFormData).then(() => {
            toast({ title: "Başarılı", description: "Rehber listesi güncellendi." });
        });
    };

    const handleDeleteGuide = (guideId) => {
        if(!confirm("Silmek istediğinize emin misiniz?")) return;
        const updatedGuides = (formData.guides || []).filter(g => g.id !== guideId);
        const newFormData = { ...formData, guides: updatedGuides };
        setFormData(newFormData);
        setDetailedGuidesData(newFormData).then(() => {
            toast({ title: "Silindi", description: "Rehber silindi." });
        });
    };

    const handleAddNew = () => {
        setEditingGuide({ isNew: true, title: '', description: '', iconUrl: '', content: '' });
    };

    if (editingGuide) {
        return <GuideEditor guide={editingGuide} onSave={handleSaveGuide} onCancel={() => setEditingGuide(null)} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Detaylı Kurulum Rehberleri Sayfası Yönetimi</h3>
                <Button onClick={handleSaveSettings} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Ayarları Kaydet
                </Button>
            </div>
            
            <div className="glass-effect rounded-lg p-6 space-y-4">
                <Input 
                    label="Sayfa Ana Başlığı" 
                    value={formData.title || ''} 
                    onChange={e => handleFieldChange('title', e.target.value)}
                />
                <Input 
                    label="Sayfa Alt Başlığı" 
                    value={formData.subtitle || ''} 
                    onChange={e => handleFieldChange('subtitle', e.target.value)}
                />
            </div>

            <div className="flex justify-between items-center">
                <h4 className="text-xl font-bold text-white">Kurulum Rehberleri</h4>
                <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" /> Yeni Rehber Ekle
                </Button>
            </div>

            <div className="space-y-4">
                {(formData.guides || []).map(guide => (
                    <div key={guide.id} className="glass-effect rounded-lg p-4 flex justify-between items-center">
                        <div className="flex items-center space-x-4 overflow-hidden">
                            {guide.iconUrl && <img src={guide.iconUrl} alt="" className="w-10 h-10 object-contain flex-shrink-0" onError={(e) => { e.target.onerror = null; e.target.style.display='none'; }} />}
                            <div className="flex-grow overflow-hidden">
                                <p className="text-white font-bold truncate">{guide.title}</p>
                                <p className="text-sm text-gray-400 truncate">{guide.description}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2 flex-shrink-0 ml-4">
                            <Button onClick={() => setEditingGuide(guide)} variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => handleDeleteGuide(guide.id)} variant="destructive" size="sm">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                {(formData.guides || []).length === 0 && (
                    <p className="text-gray-400 text-center py-4">Henüz hiç rehber eklenmemiş.</p>
                )}
            </div>
        </div>
    );
};

export default DetailedGuidesTab;