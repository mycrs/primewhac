
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Plus } from 'lucide-react';

const ChatBotAddForm = ({ onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    keyword: '',
    response: '',
    active: true
  });

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
        .insert([{
            keyword: formData.keyword.trim(),
            response: formData.response.trim(),
            active: formData.active
        }]);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Yeni otomatik cevap eklendi."
      });
      
      setFormData({ keyword: '', response: '', active: true });
      if (onSuccess) onSuccess();
      
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Cevap eklenirken bir hata oluştu."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-slate-800 rounded-lg p-6 space-y-4">
      <h4 className="text-lg font-semibold text-white">Yeni Soru & Cevap Ekle</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-300">Anahtar Kelimeler (Soru - Virgülle ayırın)</Label>
          <Input 
            value={formData.keyword}
            onChange={e => setFormData(prev => ({...prev, keyword: e.target.value}))}
            placeholder="paket, fiyat, iptv"
            className="bg-[#0a0a0a] text-white border-slate-700"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-slate-300">Otomatik Cevap</Label>
          <Textarea 
            value={formData.response}
            onChange={e => setFormData(prev => ({...prev, response: e.target.value}))}
            rows={3}
            placeholder="Fiyatlarımız aylık 50 TL'den başlamaktadır..."
            className="bg-[#0a0a0a] text-white border-slate-700"
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Switch 
            id="add-active" 
            checked={formData.active} 
            onCheckedChange={checked => setFormData(prev => ({...prev, active: checked}))} 
            className="data-[state=checked]:bg-green-500"
          />
          <Label htmlFor="add-active" className="text-slate-300 cursor-pointer">Aktif olarak kullan</Label>
        </div>

        <Button type="submit" disabled={loading} className="bg-[#e50914] hover:bg-[#e50914] text-white mt-4">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
          Kaydet
        </Button>
      </form>
    </div>
  );
};

export default ChatBotAddForm;
