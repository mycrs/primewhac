import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit, Save, X, Loader2 } from 'lucide-react';
import { Input, Textarea } from '@/components/admin/AdminFormControls';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export const ChatBotTab = ({ siteData, setSiteData }) => {
    const { toast } = useToast();
    const { setChatBotData } = setSiteData;

    const [formData, setFormData] = useState(siteData.chatBotData || { enabled: false, title: '', welcomeMessage: '', inputPlaceholder: '', qna: [] });
    const [isSaving, setIsSaving] = useState(false);
    const [editingQna, setEditingQna] = useState(null);
    const [newQna, setNewQna] = useState({ question: '', answer: '' });

    useEffect(() => {
        if (siteData.chatBotData) {
            setFormData(siteData.chatBotData);
        }
    }, [siteData.chatBotData]);

    const handleSaveSettings = async () => {
        setIsSaving(true);
        try {
            await setChatBotData(formData);
            toast({ title: "Başarılı", description: "Bot ayarları kaydedildi." });
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

    const handleSaveQna = (qnaToSave) => {
        let updatedQnaList;
        if (qnaToSave.isNew) {
            if (!qnaToSave.question.trim() || !qnaToSave.answer.trim()) {
                alert("Soru ve cevap alanları boş bırakılamaz.");
                return;
            }
            const finalNewQna = { question: qnaToSave.question, answer: qnaToSave.answer, id: Date.now() };
            updatedQnaList = [...(formData.qna || []), finalNewQna];
            setNewQna({ question: '', answer: '' });
        } else {
            const finalEditQna = { question: qnaToSave.question, answer: qnaToSave.answer, id: qnaToSave.id };
            updatedQnaList = (formData.qna || []).map(q => q.id === finalEditQna.id ? finalEditQna : q);
            setEditingQna(null);
        }
        
        // Update local state
        const newFormData = { ...formData, qna: updatedQnaList };
        setFormData(newFormData);
        
        // Auto-save to DB for QnA changes to prevent data loss
        setChatBotData(newFormData).then(() => {
             toast({ title: "Başarılı", description: "Soru-Cevap listesi güncellendi." });
        });
    };

    const handleDelete = (qnaId) => {
        const updatedQnaList = (formData.qna || []).filter(q => q.id !== qnaId);
        const newFormData = { ...formData, qna: updatedQnaList };
        setFormData(newFormData);
        setChatBotData(newFormData).then(() => {
             toast({ title: "Silindi", description: "Soru-Cevap silindi." });
        });
    };

    const handleEditChange = (field, value) => {
        setEditingQna(prev => ({ ...prev, [field]: value }));
    };
    
    const handleNewChange = (field, value) => {
        setNewQna(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Destek Botu Yönetimi</h3>
                <Button onClick={handleSaveSettings} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Ayarları Kaydet
                </Button>
            </div>
            
            <div className="glass-effect rounded-lg p-6 space-y-4">
                <div className="flex items-center space-x-2">
                    <Switch id="chatbot-enabled" checked={formData.enabled} onCheckedChange={(checked) => handleFieldChange('enabled', checked)} />
                    <Label htmlFor="chatbot-enabled" className="text-white">Destek Botunu Aktif Et</Label>
                </div>
                <Input label="Bot Başlığı" value={formData.title || ''} onChange={e => handleFieldChange('title', e.target.value)} />
                <Input label="Karşılama Mesajı" value={formData.welcomeMessage || ''} onChange={e => handleFieldChange('welcomeMessage', e.target.value)} />
                <Input label="Mesaj Yazma Alanı Metni" value={formData.inputPlaceholder || ''} onChange={e => handleFieldChange('inputPlaceholder', e.target.value)} />
            </div>

            <div className="glass-effect rounded-lg p-6 space-y-4">
                <h4 className="text-xl font-bold text-white">Yeni Otomatik Cevap Ekle</h4>
                <Input 
                    label="Kullanıcının Sorabileceği Kelimeler (virgülle ayırın)" 
                    value={newQna.question} 
                    onChange={e => handleNewChange('question', e.target.value)} 
                    placeholder="paket, fiyat, üyelik" 
                />
                <Textarea 
                    label="Botun Vereceği Cevap" 
                    value={newQna.answer} 
                    onChange={e => handleNewChange('answer', e.target.value)} 
                    rows={3} 
                    placeholder="Tüm paketlerimizi paketler sayfasından görebilirsiniz."
                />
                <Button onClick={() => handleSaveQna({ ...newQna, isNew: true })} className="bg-[#141414] hover:bg-[#0a0a0a]">
                    <Plus className="w-4 h-4 mr-2" /> Listeye Ekle
                </Button>
            </div>

            <div className="space-y-4">
                <h4 className="text-xl font-bold text-white">Mevcut Otomatik Cevaplar</h4>
                {(formData.qna || []).map(q => (
                    <div key={q.id} className="glass-effect rounded-lg p-4">
                        {editingQna?.id === q.id ? (
                            <div className="space-y-4">
                                <Input 
                                    label="Kullanıcının Sorabileceği Kelimeler" 
                                    value={editingQna.question} 
                                    onChange={e => handleEditChange('question', e.target.value)} 
                                />
                                <Textarea 
                                    label="Botun Vereceği Cevap" 
                                    value={editingQna.answer} 
                                    onChange={e => handleEditChange('answer', e.target.value)} 
                                    rows={3} 
                                />
                                <div className="flex space-x-2">
                                    <Button onClick={() => handleSaveQna(editingQna)} size="sm" className="bg-green-600 hover:bg-green-700">
                                        <Save className="w-4 h-4 mr-2" /> Güncelle
                                    </Button>
                                    <Button onClick={() => setEditingQna(null)} size="sm" variant="outline">
                                        <X className="w-4 h-4 mr-2" /> İptal
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-yellow-400 font-semibold">Soru/Kelimeler:</p>
                                    <p className="text-white break-all">{q.question}</p>
                                    <p className="text-yellow-400 font-semibold mt-2">Cevap:</p>
                                    <p className="text-gray-300">{q.answer}</p>
                                </div>
                                <div className="flex space-x-2 flex-shrink-0 ml-4">
                                    <Button onClick={() => setEditingQna(q)} variant="outline" size="icon">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button onClick={() => handleDelete(q.id)} variant="destructive" size="icon">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {(formData.qna || []).length === 0 && (
                    <p className="text-gray-400 text-center py-4">Henüz hiç otomatik cevap eklenmemiş.</p>
                )}
            </div>
        </div>
    );
};

export default ChatBotTab;