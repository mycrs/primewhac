
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { useChannelsRealtime } from '@/hooks/useChannelsRealtime';

const ChannelForm = ({ channel, onSuccess, onCancel }) => {
  const { addChannel, updateChannel } = useChannelsRealtime();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    logo_url: '',
    background_image_url: '',
    is_active: true
  });

  useEffect(() => {
    if (channel) {
      setFormData({
        name: channel.name || '',
        description: channel.description || '',
        category: channel.category || '',
        logo_url: channel.logo_url || '',
        background_image_url: channel.background_image_url || channel.image_url || '',
        is_active: channel.is_active ?? true
      });
    }
  }, [channel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      // also save to image_url for backwards compatibility if needed, but primary is background_image_url
      image_url: formData.background_image_url 
    };

    let result;
    if (channel?.id) {
      result = await updateChannel(channel.id, payload);
    } else {
      result = await addChannel(payload);
    }

    setIsSubmitting(false);
    
    if (result.success) {
      if (onSuccess) onSuccess();
    }
  };

  const renderImagePreview = (url, alt) => {
    if (!url) return (
      <div className="w-full h-24 bg-slate-800 rounded flex items-center justify-center border border-slate-700">
        <ImageIcon className="w-8 h-8 text-slate-500" />
      </div>
    );
    return (
      <div className="w-full h-24 bg-slate-800 rounded overflow-hidden border border-slate-700 relative">
        <img src={url} alt={alt} className="w-full h-full object-contain bg-slate-900/50" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
        <div className="absolute inset-0 items-center justify-center hidden bg-slate-800 text-xs text-red-400">
          Geçersiz URL
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4 max-h-[80vh] overflow-y-auto px-1">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-200">Kanal Adı *</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          className="bg-slate-950 border-slate-800 text-white"
          placeholder="Örn: TRT 1"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-slate-200">Kategori</Label>
        <Input 
          id="category" 
          name="category" 
          value={formData.category} 
          onChange={handleChange} 
          className="bg-slate-950 border-slate-800 text-white"
          placeholder="Örn: Ulusal, Spor, Belgesel"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="logo_url" className="text-slate-200">Logo URL</Label>
          <Input 
            id="logo_url" 
            name="logo_url" 
            value={formData.logo_url} 
            onChange={handleChange} 
            className="bg-slate-950 border-slate-800 text-white"
            placeholder="https://example.com/logo.png"
          />
          <p className="text-xs text-slate-500 mt-1">Öne çıkan kanallarda net görünmesi için 256×256 veya 512×512 PNG/SVG kullanın.</p>
          <div className="mt-2">
            <Label className="text-xs text-slate-400 mb-1 block">Önizleme (Logo)</Label>
            {renderImagePreview(formData.logo_url, "Logo Önizleme")}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="background_image_url" className="text-slate-200">Arka Plan Görseli URL</Label>
          <Input 
            id="background_image_url" 
            name="background_image_url" 
            value={formData.background_image_url} 
            onChange={handleChange} 
            className="bg-slate-950 border-slate-800 text-white"
            placeholder="https://example.com/bg.jpg"
          />
          <p className="text-xs text-slate-500 mt-1">Kartta net görünmesi için yüksek çözünürlük kullanın (örn. 600×400 veya 1200×800).</p>
          <div className="mt-2">
            <Label className="text-xs text-slate-400 mb-1 block">Önizleme (Arka Plan)</Label>
            {renderImagePreview(formData.background_image_url, "Arka Plan Önizleme")}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-slate-200">Açıklama</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          className="bg-slate-950 border-slate-800 text-white min-h-[80px]"
          placeholder="Kanal hakkında kısa bilgi..."
        />
      </div>

      <div className="flex items-center justify-between p-3 border border-slate-800 rounded-lg bg-slate-950">
        <div className="space-y-0.5">
          <Label htmlFor="is_active" className="text-slate-200">Durum</Label>
          <p className="text-sm text-slate-500">Kanal aktif olarak listelenecek mi?</p>
        </div>
        <Switch 
          id="is_active" 
          checked={formData.is_active} 
          onCheckedChange={handleSwitchChange} 
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t border-slate-800 sticky bottom-0 bg-slate-900 pb-2">
        <Button type="button" variant="outline" onClick={onCancel} className="bg-transparent border-slate-700 text-white hover:bg-slate-800">
          İptal
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 text-white">
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {channel ? 'Güncelle' : 'Ekle'}
        </Button>
      </div>
    </form>
  );
};

export default ChannelForm;
