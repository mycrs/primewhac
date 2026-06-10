
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Edit, Trash2, Save, X } from 'lucide-react';

const ChatBotDataManager = ({ item, onSuccess }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [formData, setFormData] = useState({
    keyword: item.keyword,
    response: item.response,
    active: item.active
  });

  const handleDelete = async () => {
    if (!window.confirm("Bu cevabı silmek istediğinize emin misiniz?")) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('chatbot_responses')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Silindi",
        description: "Otomatik cevap başarıyla silindi."
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Silme işlemi başarısız oldu."
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!formData.keyword.trim() || !formData.response.trim()) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Alanlar boş bırakılamaz."
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('chatbot_responses')
        .update({
          keyword: formData.keyword.trim(),
          response: formData.response.trim(),
          active: formData.active,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Güncellendi",
        description: "Kayıt başarıyla güncellendi."
      });
      setIsEditing(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Güncelleme başarısız oldu."
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4">
        <div className="bg-[#0a0a0a] border border-slate-700 rounded-xl p-6 w-full max-w-lg shadow-2xl space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold text-white">Kaydı Düzenle</h4>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
              <X className="w-5 h-5 text-slate-400" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Anahtar Kelimeler</Label>
              <Input 
                value={formData.keyword}
                onChange={e => setFormData(prev => ({...prev, keyword: e.target.value}))}
                className="bg-[#0a0a0a] text-white border-slate-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Cevap</Label>
              <Textarea 
                value={formData.response}
                onChange={e => setFormData(prev => ({...prev, response: e.target.value}))}
                rows={4}
                className="bg-[#0a0a0a] text-white border-slate-700"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id={`edit-active-${item.id}`}
                checked={formData.active} 
                onCheckedChange={checked => setFormData(prev => ({...prev, active: checked}))} 
                className="data-[state=checked]:bg-green-500"
              />
              <Label htmlFor={`edit-active-${item.id}`} className="text-slate-300 cursor-pointer">Aktif</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
              İptal
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-[#e50914] hover:bg-[#e50914] text-white">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Kaydet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsEditing(true)}
        className="bg-[#0a0a0a] border-slate-700 hover:bg-[#0a0a0a] hover:text-white h-8 px-2"
        title="Düzenle"
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={handleDelete}
        disabled={isDeleting}
        className="h-8 px-2"
        title="Sil"
      >
        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </Button>
    </div>
  );
};

export default ChatBotDataManager;
