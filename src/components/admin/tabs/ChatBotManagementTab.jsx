
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Save, Loader2, Bot, Plus, Edit, Trash2, X, AlertTriangle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/admin/AdminFormControls';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/customSupabaseClient';

const REDIRECT_OPTIONS = [
  { value: 'none', label: 'Yönlendirme Yok' },
  { value: '/paketler', label: 'Paketler (/paketler)' },
  { value: '/packages', label: 'Paketler (/packages)' },
  { value: '/mac-programi', label: 'Maç Programı (/mac-programi)' },
  { value: '/kurulum', label: 'Kurulum (/kurulum)' },
  { value: '/channels', label: 'Kanallar (/channels)' },
  { value: '/ne-izlesem', label: 'Ne İzlesem (/ne-izlesem)' },
  { value: '/m3u-converter', label: 'M3U Oluştur (/m3u-converter)' },
  { value: '/blog', label: 'Blog (/blog)' },
  { value: '/sss', label: 'SSS (/sss)' },
  { value: '/reseller', label: 'Bayilik (/reseller)' },
  { value: 'custom', label: 'Özel URL' },
];

import { CHATBOT_DEFAULT_KEYWORDS } from '@/data/chatbotKeywords';

const DEFAULT_KEYWORDS = CHATBOT_DEFAULT_KEYWORDS;

export const ChatBotManagementTab = ({ siteData, setSiteData }) => {
  const { toast } = useToast();
  
  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    enabled: false,
    title: '',
    welcomeMessage: '',
    inputPlaceholder: ''
  });
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);

  // Chatbot Data State
  const [botData, setBotData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // New Message State
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newRedirectUrl, setNewRedirectUrl] = useState('none');
  const [newCustomUrl, setNewCustomUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Edit / Delete State
  const [editingId, setEditingId] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState('');
  const [editingAnswer, setEditingAnswer] = useState('');
  const [editingRedirectUrl, setEditingRedirectUrl] = useState('none');
  const [editingCustomUrl, setEditingCustomUrl] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormErrors, setEditFormErrors] = useState({});

  const [deletingId, setDeletingId] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingDefaults, setIsLoadingDefaults] = useState(false);

  useEffect(() => {
    if (siteData?.chatBotData) {
      setGeneralSettings({
        enabled: siteData.chatBotData.enabled || false,
        title: siteData.chatBotData.title || '',
        welcomeMessage: siteData.chatBotData.welcomeMessage || '',
        inputPlaceholder: siteData.chatBotData.inputPlaceholder || ''
      });
    }
  }, [siteData]);

  const fetchChatBotData = async () => {
    setIsLoadingData(true);
    try {
      const { data, error } = await supabase
        .from('chatbot_responses')
        .select('id, keyword, response, redirect_url')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Fetch Data Error:", error);
        throw error;
      }
      
      // Also combine with any legacy qna data if it exists in siteData
      const legacyQna = siteData?.chatBotData?.qna || [];
      const combinedData = [...(data || []), ...legacyQna.map(item => ({ keyword: item.question, response: item.answer }))];
      
      // Remove duplicates based on keyword
      const uniqueData = Array.from(new Map(combinedData.map(item => [item.keyword, item])).values());
      
      setBotData(uniqueData);
    } catch (error) {
      console.error("Error fetching chatbot data:", error);
      toast({ variant: "destructive", title: "Veri Çekme Hatası", description: error.message || "Mesajlar yüklenemedi." });
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchChatBotData();
  }, [siteData]);

  const handleGeneralSettingChange = (field, value) => {
    setGeneralSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveGeneralSettings = async () => {
    setIsSavingGeneral(true);
    try {
      const updatedData = { 
        ...siteData.chatBotData, 
        ...generalSettings 
      };
      
      await setSiteData.setChatBotData(updatedData);
      toast({ title: "Başarılı", description: "Genel bot ayarları kaydedildi." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Hata", description: "Ayarlar kaydedilemedi." });
    } finally {
      setIsSavingGeneral(false);
    }
  };

  const getFinalUrl = (dropdownValue, customValue) => {
    if (dropdownValue === 'none') return null;
    if (dropdownValue === 'custom') return customValue.trim() || null;
    return dropdownValue;
  };

  const validateFormFields = (question, answer, urlType, customUrl) => {
    const errors = {};
    
    if (!question || question.trim().length < 3) {
      errors.question = "Soru alanı en az 3 karakter olmalıdır.";
    }
    
    if (!answer || answer.trim().length < 5) {
      errors.answer = "Cevap alanı en az 5 karakter olmalıdır.";
    }
    
    if (urlType === 'custom' && !customUrl?.trim()) {
       errors.customUrl = "Özel URL alanı boş bırakılamaz.";
    } else if (urlType === 'custom' && customUrl) {
      try {
        new URL(customUrl);
      } catch (err) {
        errors.customUrl = "Geçerli bir URL giriniz (örn: https://ornek.com)";
      }
    }
    
    return errors;
  };

  const handleAddMessage = async (isRetry = false) => {
    // 1. Validation
    const validationErrors = validateFormFields(newQuestion, newAnswer, newRedirectUrl, newCustomUrl);
    setFormErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      console.warn("Form validation failed:", validationErrors);
      return;
    }
    
    setIsAdding(true);
    
    // 2. Prepare Payload
    const finalUrl = getFinalUrl(newRedirectUrl, newCustomUrl);
    const payload = { 
      keyword: newQuestion.trim(), 
      response: newAnswer.trim(), 
      redirect_url: finalUrl,
      active: true 
    };

    console.log(`[API Request] Attempting to ${isRetry ? 'retry ' : ''}insert into chatbot_responses:`, payload);

    // 3. API Request
    try {
      const { data, error } = await supabase
        .from('chatbot_responses')
        .insert([payload])
        .select();
        
      if (error) {
        console.error("[Supabase Error] Insert failed:", error);
        throw error;
      }
      
      console.log("[API Success] Inserted data:", data);
      
      // 4. Success Handling
      toast({ title: "Başarılı", description: "Mesaj başarıyla eklendi." });
      setNewQuestion('');
      setNewAnswer('');
      setNewRedirectUrl('none');
      setNewCustomUrl('');
      setFormErrors({});
      fetchChatBotData(); // Refresh list immediately
      
    } catch (error) {
      // 5. Error Handling & Feedback
      console.error("[Add Message Error]:", error);
      
      let errorMessage = "Mesaj eklenirken beklenmeyen bir hata oluştu.";
      if (error.code === '23505') {
        errorMessage = "Bu soru (anahtar kelime) zaten mevcut. Lütfen benzersiz bir soru girin.";
      } else if (error.message) {
        errorMessage = `Veritabanı Hatası: ${error.message}`;
      }

      toast({ 
        variant: "destructive", 
        title: "Kayıt Başarısız", 
        description: (
          <div className="flex flex-col gap-2">
            <p>{errorMessage}</p>
            {!isRetry && (
              <Button size="sm" variant="outline" className="w-fit border-red-500/50 hover:bg-red-500/20" onClick={() => handleAddMessage(true)}>
                <RefreshCw className="w-3 h-3 mr-2" /> Yeniden Dene
              </Button>
            )}
          </div>
        ),
        duration: 6000
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleEdit = (item) => {
    if (!item.id) {
        toast({ variant: "destructive", title: "Hata", description: "Eski veriler düzenlenemez. Lütfen silip tekrar ekleyin." });
        return;
    }
    setEditingId(item.id);
    setEditingQuestion(item.keyword || item.question);
    setEditingAnswer(item.response || item.answer);
    setEditFormErrors({});

    const url = item.redirect_url;
    if (!url) {
      setEditingRedirectUrl('none');
      setEditingCustomUrl('');
    } else {
      const isStandardOption = REDIRECT_OPTIONS.some(opt => opt.value === url && opt.value !== 'custom' && opt.value !== 'none');
      if (isStandardOption) {
        setEditingRedirectUrl(url);
        setEditingCustomUrl('');
      } else {
        setEditingRedirectUrl('custom');
        setEditingCustomUrl(url);
      }
    }

    setShowEditModal(true);
  };

  const handleSave = async () => {
    const validationErrors = validateFormFields(editingQuestion, editingAnswer, editingRedirectUrl, editingCustomUrl);
    setEditFormErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0 || !editingId) {
      return;
    }
    
    setIsEditing(true);
    const finalUrl = getFinalUrl(editingRedirectUrl, editingCustomUrl);
    const payload = {
      keyword: editingQuestion.trim(),
      response: editingAnswer.trim(),
      redirect_url: finalUrl
    };

    console.log("[API Request] Attempting to update chatbot_responses:", { id: editingId, ...payload });

    try {
      const { data, error } = await supabase
        .from('chatbot_responses')
        .update(payload)
        .eq('id', editingId)
        .select();

      if (error) {
        console.error("[Supabase Error] Update failed:", error);
        throw error;
      }

      console.log("[API Success] Updated data:", data);
      toast({ title: "Başarılı", description: "Mesaj başarıyla güncellendi." });
      handleCancel();
      fetchChatBotData();
    } catch (error) {
      console.error("[Update Message Error]:", error);
      toast({ 
        variant: "destructive", 
        title: "Güncelleme Başarısız", 
        description: error.message ? `Hata: ${error.message}` : "Mesaj güncellenirken hata oluştu." 
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = (item) => {
    setDeletingId(item.id);
    setDeletingItem(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) {
      toast({ variant: "destructive", title: "Hata", description: "Silinecek öğe bulunamadı." });
      return;
    }

    setIsDeleting(true);
    console.log("[API Request] Attempting to delete from chatbot_responses:", deletingId);
    
    try {
      const { error } = await supabase
        .from('chatbot_responses')
        .delete()
        .eq('id', deletingId);

      if (error) {
        console.error("[Supabase Error] Delete failed:", error);
        throw error;
      }

      console.log("[API Success] Deleted successfully.");
      toast({ title: "Başarılı", description: "Başarılı - Mesaj silindi." });
      setShowDeleteModal(false);
      setDeletingId(null);
      setDeletingItem(null);
      fetchChatBotData();
      
    } catch (error) {
      console.error("[Delete Message Error]:", error);
      toast({ 
        variant: "destructive", 
        title: "Silme Başarısız", 
        description: error.message || "Mesaj silinirken beklenmeyen bir hata oluştu." 
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setEditingId(null);
    setEditingQuestion('');
    setEditingAnswer('');
    setEditingRedirectUrl('none');
    setEditingCustomUrl('');
    setEditFormErrors({});
    setDeletingId(null);
    setDeletingItem(null);
  };

  const handleLoadDefaults = async () => {
    setIsLoadingDefaults(true);
    let added = 0;
    try {
      for (const item of DEFAULT_KEYWORDS) {
        const { error } = await supabase
          .from('chatbot_responses')
          .insert([{ keyword: item.keyword, response: item.response, redirect_url: item.redirect_url, active: true }]);
        if (!error) added++;
      }
      toast({ title: 'Başarılı', description: `${added} varsayılan anahtar kelime eklendi.` });
      fetchChatBotData();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Hata', description: err?.message || 'Varsayılanlar yüklenemedi.' });
    } finally {
      setIsLoadingDefaults(false);
    }
  };

  const renderRedirectBadge = (url) => {
    if (!url) return <span className="text-slate-500 text-sm">Yok</span>;
    const standardOption = REDIRECT_OPTIONS.find(opt => opt.value === url);
    const displayLabel = standardOption ? standardOption.label : url;
    
    return (
      <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]" title={displayLabel}>
        {displayLabel}
      </Badge>
    );
  };

  // Safely check for errors by filtering out any empty/undefined ones
  const hasActiveErrors = Object.values(formErrors).some(err => Boolean(err));
  const isFormDisabled = isAdding || hasActiveErrors || !newQuestion.trim() || !newAnswer.trim() || (newRedirectUrl === 'custom' && !newCustomUrl.trim());

  const hasActiveEditErrors = Object.values(editFormErrors).some(err => Boolean(err));
  const isEditFormDisabled = isEditing || hasActiveEditErrors || !editingQuestion.trim() || !editingAnswer.trim() || (editingRedirectUrl === 'custom' && !editingCustomUrl.trim());


  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-500" />
            ChatBot Yönetimi
          </h3>
          <p className="text-slate-400 text-sm mt-1">Sitenizdeki canlı destek botunun ayarlarını yönetin.</p>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 z-10 relative">
          <h4 className="text-xl font-bold text-white">Genel Ayarlar</h4>
          <Button onClick={handleSaveGeneralSettings} disabled={isSavingGeneral} className="bg-cyan-600 hover:bg-cyan-700 text-white w-full sm:w-auto">
            {isSavingGeneral ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Ayarları Kaydet
          </Button>
        </div>

        <div className="flex items-center space-x-3 z-10 relative bg-slate-950 p-4 rounded-lg border border-slate-800 mb-6 inline-flex">
          <Switch 
            id="chatbot-enabled" 
            checked={generalSettings.enabled} 
            onCheckedChange={(checked) => handleGeneralSettingChange('enabled', checked)}
            className="data-[state=checked]:bg-green-500" 
          />
          <Label htmlFor="chatbot-enabled" className="text-white font-medium cursor-pointer">Destek Botunu Sitede Göster</Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 z-10 relative">
          <Input 
            label="Bot Başlığı" 
            value={generalSettings.title} 
            onChange={e => handleGeneralSettingChange('title', e.target.value)} 
          />
          <Input 
            label="Mesaj Yazma Alanı Metni" 
            value={generalSettings.inputPlaceholder} 
            onChange={e => handleGeneralSettingChange('inputPlaceholder', e.target.value)} 
          />
          <div className="md:col-span-2">
             <Input 
              label="Karşılama Mesajı (Bot açıldığında ilk görünen metin)" 
              value={generalSettings.welcomeMessage} 
              onChange={e => handleGeneralSettingChange('welcomeMessage', e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* New Message Form Section */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-6">
        <h4 className="text-xl font-bold text-white mb-4">Yeni Mesaj Ekle</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300 mb-2 block">Anahtar Kelimeler <span className="text-red-400">*</span></Label>
              <p className="text-xs text-slate-500 mb-1">Virgülle ayırarak benzer kelimeleri bağlayın – hepsi aynı cevabı tetikler</p>
              <Input 
                value={newQuestion}
                onChange={(e) => {
                  setNewQuestion(e.target.value);
                  if (formErrors.question) {
                    const { question, ...rest } = formErrors;
                    setFormErrors(rest);
                  }
                }}
                onBlur={() => {
                  if (newQuestion.trim().length > 0 && newQuestion.trim().length < 3) {
                    setFormErrors({...formErrors, question: "En az 3 karakter girin."});
                  }
                }}
                placeholder="Örn: paket, fiyat, ücret, abonelik"
                className={`bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 ${formErrors.question ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {formErrors.question && <p className="text-red-400 text-xs mt-1">{formErrors.question}</p>}
            </div>
            
            <div>
              <Label className="text-slate-300 mb-2 block">Yönlendirme (İsteğe Bağlı)</Label>
              <Select value={newRedirectUrl} onValueChange={(val) => {
                setNewRedirectUrl(val);
                if (val !== 'custom' && formErrors.customUrl) {
                  const { customUrl, ...rest } = formErrors;
                  setFormErrors(rest);
                }
              }}>
                <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                  <SelectValue placeholder="Yönlendirme seçin" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  {REDIRECT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-800">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newRedirectUrl === 'custom' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <Label className="text-slate-300 mb-2 block">Özel URL</Label>
                <Input 
                  value={newCustomUrl}
                  onChange={(e) => {
                    setNewCustomUrl(e.target.value);
                    if (formErrors.customUrl) {
                      const { customUrl, ...rest } = formErrors;
                      setFormErrors(rest);
                    }
                  }}
                  placeholder="https://ornek.com/sayfa"
                  className={`bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 ${formErrors.customUrl ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {formErrors.customUrl && <p className="text-red-400 text-xs mt-1">{formErrors.customUrl}</p>}
              </div>
            )}
          </div>
          
          <div className="space-y-4 flex flex-col h-full">
            <div className="flex-grow">
              <Label className="text-slate-300 mb-2 block">Cevap <span className="text-red-400">*</span></Label>
              <Textarea 
                value={newAnswer}
                onChange={(e) => {
                  setNewAnswer(e.target.value);
                  if (formErrors.answer) {
                    const { answer, ...rest } = formErrors;
                    setFormErrors(rest);
                  }
                }}
                onBlur={() => {
                  if (newAnswer.trim().length > 0 && newAnswer.trim().length < 5) {
                    setFormErrors({...formErrors, answer: "Cevap alanı en az 5 karakter olmalıdır."});
                  }
                }}
                placeholder="Cevabı girin (min 5 karakter)..."
                className={`bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 w-full rounded-md px-3 py-2 text-sm h-[130px] resize-none ${formErrors.answer ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {formErrors.answer && <p className="text-red-400 text-xs mt-1">{formErrors.answer}</p>}
            </div>
            <div className="flex justify-end mt-4">
              <Button 
                onClick={() => handleAddMessage(false)}
                disabled={isFormDisabled}
                className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Mesaj Ekle
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Data Table Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="text-xl font-bold text-white">ChatBot Verileri</h4>
            <p className="text-sm text-slate-400 mt-1">Botun kullandığı mevcut soru ve cevap havuzu. Virgülle ayrılmış kelimeler aynı cevabı tetikler.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadDefaults}
            disabled={isLoadingDefaults}
            className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 shrink-0"
          >
            {isLoadingDefaults ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Varsayılan Anahtar Kelimeleri Yükle
          </Button>
        </div>
        
        <div className="p-0">
          {isLoadingData ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            </div>
          ) : botData.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              Henüz veri bulunmamaktadır.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-950/50">
                  <TableRow className="border-slate-800 hover:bg-slate-950/50">
                    <TableHead className="w-[25%] text-slate-400 font-semibold">Anahtar Kelimeler (virgülle bağlı)</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Cevap</TableHead>
                    <TableHead className="w-[15%] text-slate-400 font-semibold">Yönlendirme</TableHead>
                    <TableHead className="w-[10%] text-slate-400 font-semibold text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {botData.map((item, index) => (
                    <TableRow key={item.id || index} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                      <TableCell className="font-medium text-white align-top">
                        {item.keyword || item.question}
                      </TableCell>
                      <TableCell className="text-slate-300 whitespace-pre-wrap">
                        {item.response || item.answer}
                      </TableCell>
                      <TableCell className="align-top">
                        {renderRedirectBadge(item.redirect_url)}
                      </TableCell>
                      <TableCell className="align-top text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item)}
                            className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden my-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Mesajı Düzenle</h3>
              <button onClick={handleCancel} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <Label className="text-slate-300 mb-2 block">Anahtar Kelimeler <span className="text-red-400">*</span></Label>
                <p className="text-xs text-slate-500 mb-1">Virgülle ayırarak benzer kelimeleri bağlayın</p>
                <Input 
                  value={editingQuestion}
                  onChange={(e) => {
                    setEditingQuestion(e.target.value);
                    if (editFormErrors.question) {
                      const { question, ...rest } = editFormErrors;
                      setEditFormErrors(rest);
                    }
                  }}
                  placeholder="Örn: paket, fiyat, ücret"
                  className={`bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 ${editFormErrors.question ? 'border-red-500' : ''}`}
                />
                {editFormErrors.question && <p className="text-red-400 text-xs mt-1">{editFormErrors.question}</p>}
              </div>
              <div>
                <Label className="text-slate-300 mb-2 block">Cevap <span className="text-red-400">*</span></Label>
                <Textarea 
                  value={editingAnswer}
                  onChange={(e) => {
                    setEditingAnswer(e.target.value);
                    if (editFormErrors.answer) {
                      const { answer, ...rest } = editFormErrors;
                      setEditFormErrors(rest);
                    }
                  }}
                  placeholder="Cevabı girin..."
                  rows={4}
                  className={`bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 w-full rounded-md px-3 py-2 text-sm ${editFormErrors.answer ? 'border-red-500' : ''}`}
                />
                {editFormErrors.answer && <p className="text-red-400 text-xs mt-1">{editFormErrors.answer}</p>}
              </div>
              
              <div>
                <Label className="text-slate-300 mb-2 block">Yönlendirme (İsteğe Bağlı)</Label>
                <Select value={editingRedirectUrl} onValueChange={(val) => {
                  setEditingRedirectUrl(val);
                  if (val !== 'custom' && editFormErrors.customUrl) {
                    const { customUrl, ...rest } = editFormErrors;
                    setEditFormErrors(rest);
                  }
                }}>
                  <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                    <SelectValue placeholder="Yönlendirme seçin" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800">
                    {REDIRECT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-800">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editingRedirectUrl === 'custom' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <Label className="text-slate-300 mb-2 block">Özel URL</Label>
                  <Input 
                    value={editingCustomUrl}
                    onChange={(e) => {
                      setEditingCustomUrl(e.target.value);
                      if (editFormErrors.customUrl) {
                        const { customUrl, ...rest } = editFormErrors;
                        setEditFormErrors(rest);
                      }
                    }}
                    placeholder="https://ornek.com/sayfa"
                    className={`bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 ${editFormErrors.customUrl ? 'border-red-500' : ''}`}
                  />
                  {editFormErrors.customUrl && <p className="text-red-400 text-xs mt-1">{editFormErrors.customUrl}</p>}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-950/50">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                İptal
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isEditFormDisabled}
                className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
              >
                {isEditing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Kaydet
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Mesajı Sil</h3>
              <button onClick={handleCancel} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-3 text-red-400 mb-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className="font-semibold text-sm">Bu işlem geri alınamaz!</p>
              </div>
              
              <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Soru:</span>
                  <p className="text-slate-300 text-sm mt-1">{deletingItem?.keyword || deletingItem?.question}</p>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Cevap:</span>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-3">{deletingItem?.response || deletingItem?.answer}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-950/50">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                İptal
              </Button>
              <Button 
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Sil
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBotManagementTab;
