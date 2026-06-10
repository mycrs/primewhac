import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, HelpCircle, Save, Loader2, AlertCircle, CheckCircle2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Input, Textarea } from '@/components/admin/AdminFormControls';
import AdminTabWrapper from '@/components/admin/AdminTabWrapper';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { defaultFaqData } from '@/data/defaultFaqData.js';

export { defaultFaqData };

export const FaqTab = () => {
    const { toast } = useToast();
    
    // State management
    const [formData, setFormData] = useState(defaultFaqData);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [expandedSections, setExpandedSections] = useState({ 0: true }); // First section open by default

    // Fetch data on mount
    useEffect(() => {
        fetchFaqData();
    }, []);

    const fetchFaqData = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('site_content')
                .select('value')
                .eq('key', 'faqData')
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    console.log("No FAQ data found, using new structured defaults.");
                    setFormData(defaultFaqData);
                    return;
                }
                throw error;
            }

            if (data?.value) {
                // Check if old flat structure or new sectioned structure
                if (data.value.sections) {
                    setFormData(data.value);
                } else {
                    // Fallback to default if old structure detected, to force upgrade to new sections
                    console.log("Old flat FAQ structure detected. Upgrading to new sectioned default.");
                    setFormData(defaultFaqData);
                }
            }
        } catch (error) {
            console.error("Error fetching FAQ:", error);
            toast({
                variant: "destructive",
                title: "Veri Yükleme Hatası",
                description: "Mevcut SSS verileri yüklenemedi. Varsayılanlar kullanılıyor."
            });
            setFormData(defaultFaqData);
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        setValidationError(null);
        
        if (!formData.title?.trim()) {
            setValidationError("Sayfa başlığı boş olamaz.");
            return false;
        }

        if (!formData.sections || formData.sections.length === 0) {
            setValidationError("En az bir kategori eklemelisiniz.");
            return false;
        }

        for (let s = 0; s < formData.sections.length; s++) {
            const section = formData.sections[s];
            if (!section.title?.trim()) {
                 setValidationError(`${s + 1}. bölüm başlığı boş bırakılamaz.`);
                 return false;
            }
            if (!section.items || section.items.length === 0) {
                 setValidationError(`"${section.title}" bölümünde en az bir soru olmalıdır.`);
                 return false;
            }
            for (let i = 0; i < section.items.length; i++) {
                const item = section.items[i];
                if (!item.question?.trim()) {
                    setValidationError(`"${section.title}" bölümündeki ${i + 1}. soru boş bırakılamaz.`);
                    return false;
                }
                if (!item.answer?.trim()) {
                    setValidationError(`"${section.title}" bölümündeki ${i + 1}. cevap boş bırakılamaz.`);
                    return false;
                }
            }
        }

        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) {
             toast({
                variant: "destructive",
                title: "Doğrulama Hatası",
                description: validationError || "Lütfen tüm alanları kontrol edin.",
            });
            return;
        }

        setIsSaving(true);
        try {
            const payload = { 
                key: 'faqData',
                value: formData,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('site_content')
                .upsert(payload, { onConflict: 'key' });

            if (error) throw error;

            toast({
                title: "Başarılı",
                description: (
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600"/> 
                        <span>SSS başarıyla kaydedildi.</span>
                    </div>
                ),
                className: "bg-green-50 border-green-200 text-green-900"
            });

        } catch (error) {
            console.error("FAQ Save Error:", error);
            toast({
                variant: "destructive",
                title: "Kaydetme Başarısız",
                description: error.message || "Veritabanına bağlanırken bir sorun oluştu.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleBasicChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (validationError) setValidationError(null);
    };

    const handleSectionChange = (sIndex, field, value) => {
        setFormData(prev => {
            const newSections = [...prev.sections];
            newSections[sIndex] = { ...newSections[sIndex], [field]: value };
            return { ...prev, sections: newSections };
        });
        if (validationError) setValidationError(null);
    };

    const handleItemChange = (sIndex, iIndex, field, value) => {
        setFormData(prev => {
            const newSections = [...prev.sections];
            const newItems = [...newSections[sIndex].items];
            newItems[iIndex] = { ...newItems[iIndex], [field]: value };
            newSections[sIndex].items = newItems;
            return { ...prev, sections: newSections };
        });
        if (validationError) setValidationError(null);
    };

    const addSection = () => {
        setFormData(prev => ({ 
            ...prev, 
            sections: [...prev.sections, { title: 'Yeni Kategori', items: [] }] 
        }));
        setExpandedSections(prev => ({ ...prev, [formData.sections.length]: true }));
        setValidationError(null);
    };

    const removeSection = (sIndex) => {
        setFormData(prev => ({ 
            ...prev, 
            sections: prev.sections.filter((_, i) => i !== sIndex) 
        }));
    };

    const addItem = (sIndex) => {
        setFormData(prev => {
            const newSections = [...prev.sections];
            newSections[sIndex].items.push({ question: '', answer: '' });
            return { ...prev, sections: newSections };
        });
        setValidationError(null);
    };
    
    const removeItem = (sIndex, iIndex) => {
        setFormData(prev => {
            const newSections = [...prev.sections];
            newSections[sIndex].items = newSections[sIndex].items.filter((_, i) => i !== iIndex);
            return { ...prev, sections: newSections };
        });
    };

    const toggleSection = (index) => {
        setExpandedSections(prev => ({ ...prev, [index]: !prev[index] }));
    };

    if (isLoading) {
        return (
            <AdminTabWrapper title="Sıkça Sorulan Sorular" icon={HelpCircle}>
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-slate-500">Veriler yükleniyor...</p>
                </div>
            </AdminTabWrapper>
        );
    }

    return (
        <AdminTabWrapper 
            title="Sıkça Sorulan Sorular (SSS)" 
            description="Kullanıcıların merak ettiklerini kategoriler halinde yanıtlayın." 
            icon={HelpCircle}
            actions={
                <div className="flex gap-2">
                    <Button onClick={() => fetchFaqData()} variant="ghost" size="icon" title="Yenile">
                        <RefreshCw className="w-4 h-4 text-slate-500" />
                    </Button>
                    <Button onClick={addSection} variant="outline" className="border-dashed border-slate-600 text-slate-400 hover:text-white hover:bg-[#0a0a0a]">
                        <Plus className="w-4 h-4 mr-2" /> Kategori Ekle
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving} 
                        className={`bg-green-600 hover:bg-green-700 transition-all ${isSaving ? 'opacity-80 cursor-not-allowed' : ''}`}
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            }
        >
            {validationError && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-3 text-red-200 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-sm font-medium">{validationError}</p>
                </div>
            )}

            <div className="admin-card mb-8 space-y-6">
                <Input 
                    label="Sayfa Ana Başlığı (H1)" 
                    value={formData.title} 
                    onChange={e => handleBasicChange('title', e.target.value)} 
                    className="border-slate-700 focus:border-primary text-lg font-bold"
                />
                <Textarea
                    label="SEO Açıklaması (Giriş Paragrafı)"
                    value={formData.description}
                    onChange={e => handleBasicChange('description', e.target.value)}
                    rows={4}
                    className="border-slate-700 focus:border-primary text-slate-300"
                    placeholder="Sık sorulan sorular sayfası için SEO uyumlu giriş metni..."
                />
            </div>

            <div className="space-y-6">
                {formData.sections.map((section, sIndex) => (
                    <div key={sIndex} className="bg-[#0a0a0a]/40 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                        {/* Section Header */}
                        <div 
                            className="bg-[#0a0a0a]/80 p-4 flex items-center justify-between cursor-pointer hover:bg-[#0a0a0a] transition-colors"
                            onClick={() => toggleSection(sIndex)}
                        >
                            <div className="flex-1 flex items-center gap-4 mr-4" onClick={e => e.stopPropagation()}>
                                <span className="bg-primary/20 text-primary font-bold px-3 py-1 rounded-md text-sm border border-primary/30">
                                    Bölüm {sIndex + 1}
                                </span>
                                <Input 
                                    value={section.title}
                                    onChange={e => handleSectionChange(sIndex, 'title', e.target.value)}
                                    className="h-9 border-slate-600 bg-[#0a0a0a]/50 max-w-md font-semibold"
                                    placeholder="Kategori Başlığı"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Button 
                                    onClick={(e) => { e.stopPropagation(); removeItem(sIndex); }} 
                                    variant="ghost" 
                                    className="text-slate-400 hover:text-red-400 hover:bg-red-900/20 h-8 px-2"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Kategoriyi Sil
                                </Button>
                                {expandedSections[sIndex] ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                            </div>
                        </div>

                        {/* Section Content (Items) */}
                        {expandedSections[sIndex] && (
                            <div className="p-6 space-y-6 bg-[#0a0a0a]/20">
                                {section.items.map((item, iIndex) => (
                                    <div key={iIndex} className="relative group pl-6 border-l-2 border-slate-800 hover:border-primary transition-colors">
                                        <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-[#0a0a0a] border-2 border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-colors">
                                            {iIndex + 1}
                                        </div>
                                        <div className="flex justify-between items-start mb-3">
                                            <label className="text-sm text-slate-400 font-semibold mb-1 block">Soru {iIndex + 1}</label>
                                            <Button 
                                                onClick={() => removeItem(sIndex, iIndex)} 
                                                variant="ghost" 
                                                className="text-slate-500 hover:text-red-400 hover:bg-red-900/10 h-6 w-6 p-0"
                                                title="Soruyu Sil"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                        <div className="space-y-4">
                                            <Input 
                                                placeholder="Örn: Kurulum ücretli mi?"
                                                value={item.question}
                                                onChange={e => handleItemChange(sIndex, iIndex, 'question', e.target.value)}
                                                className={`font-medium border-slate-700 bg-[#0a0a0a]/50 ${!item.question && validationError ? 'border-red-500/50' : ''}`}
                                            />
                                            <Textarea
                                                placeholder="Detaylı cevap metni..."
                                                value={item.answer}
                                                onChange={e => handleItemChange(sIndex, iIndex, 'answer', e.target.value)}
                                                rows={4}
                                                className={`text-slate-300 border-slate-700 bg-[#0a0a0a]/50 ${!item.answer && validationError ? 'border-red-500/50' : ''}`}
                                            />
                                        </div>
                                    </div>
                                ))}

                                <Button 
                                    onClick={() => addItem(sIndex)} 
                                    variant="outline" 
                                    className="w-full mt-4 border-dashed border-slate-700 text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/10"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Bu Kategoriye Yeni Soru Ekle
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </AdminTabWrapper>
    );
};

export default FaqTab;