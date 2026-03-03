import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Save, X } from 'lucide-react';

const ChatBotResponseEditor = ({ responseData, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    keyword: '',
    response: '',
    active: true
  });

  useEffect(() => {
    if (responseData) {
      setFormData({
        keyword: responseData.keyword,
        response: responseData.response,
        active: responseData.active
      });
    }
  }, [responseData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.keyword.trim() || !formData.response.trim()) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Anahtar kelimeler ve cevap alanları zorunludur."
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('chatbot_responses')
        .update({
          keyword: formData.keyword,
          response: formData.response,
          active: formData.active
        })
        .eq('id', responseData.id);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Otomatik cevap güncellendi."
      });
      
      if (onSuccess) onSuccess();
      
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Cevap güncellenirken bir hata oluştu."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-effect rounded-lg p-6 space-y-4 border border-blue-500/30">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-bold text-white">Otomatik Cevabı Düzenle</h4>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-5 h-5 text-slate-400" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-300">Kullanıcının Sorabileceği Kelimeler (Virgülle ayırın)</Label>
          <Input 
            value={formData.keyword}
            onChange={e => setFormData(prev => ({...prev, keyword: e.target.value}))}
            className="bg-slate-950/50 text-white border-slate-700"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-slate-300">Botun Vereceği Cevap</Label>
          <Textarea 
            value={formData.response}
            onChange={e => setFormData(prev => ({...prev, response: e.target.value}))}
            rows={3}
            className="bg-slate-950/50 text-white border-slate-700"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch 
            id="edit-active" 
            checked={formData.active} 
            onCheckedChange={checked => setFormData(prev => ({...prev, active: checked}))} 
            className="data-[state=checked]:bg-green-500"
          />
          <Label htmlFor="edit-active" className="text-slate-300 cursor-pointer">Aktif</Label>
        </div>

        <div className="flex space-x-3 mt-4">
          <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Kaydet
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            İptal
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatBotResponseEditor;