
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Globe, MapPin, Clock, Euro, Check, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from 'framer-motion';

const AdminPackageForm = ({ pkg, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    region: 'EU',
    features: '',
    popular: false,
    enabled: true,
    whatsapp_message: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (pkg) {
      setFormData({
        name: pkg.name || '',
        price: pkg.price || '',
        duration: pkg.duration || '',
        region: pkg.region || 'EU',
        features: pkg.features ? pkg.features.join('\n') : '',
        popular: pkg.popular || false,
        enabled: pkg.enabled !== false,
        whatsapp_message: pkg.whatsapp_message || '',
      });
    }
  }, [pkg]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Paket adı zorunludur.';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) newErrors.price = 'Geçerli bir fiyat giriniz.';
    if (!formData.duration) newErrors.duration = 'Süre seçimi zorunludur.';
    if (!formData.region) newErrors.region = 'Bölge seçimi zorunludur.';
    if (!formData.features.trim()) newErrors.features = 'En az bir özellik girilmelidir.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    // Re-validate on change if fields have been touched
    if (Object.keys(touched).length > 0) {
      validate();
    }
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSwitch = (name) => (checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true, price: true, duration: true, region: true, features: true
    });
    
    if (!validate()) {
      toast({
        variant: "destructive",
        title: "Eksik Bilgi",
        description: "Lütfen tüm zorunlu alanları doldurun.",
      });
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        duration: formData.duration,
        region: formData.region,
        features: formData.features.split('\n').map((f) => f.trim()).filter(Boolean),
        popular: formData.popular,
        enabled: formData.enabled,
        whatsapp_message: formData.whatsapp_message,
      };

      if (pkg?.id) {
        const { error } = await supabase.from('packages').update(payload).eq('id', pkg.id);
        if (error) throw error;
        toast({ 
          title: 'Başarılı', 
          description: 'Paket başarıyla güncellendi.',
          className: "bg-green-600 border-none text-white"
        });
      } else {
        const { error } = await supabase.from('packages').insert([payload]);
        if (error) throw error;
        toast({ 
          title: 'Başarılı', 
          description: 'Yeni paket başarıyla eklendi.',
          className: "bg-green-600 border-none text-white"
        });
      }
      onSuccess();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Hata', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name && formData.price && formData.duration && formData.region && formData.features;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden"
    >
      <div className="bg-slate-800/50 p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          {pkg ? 'Paketi Düzenle' : 'Yeni Paket Ekle'}
        </h2>
        <p className="text-sm text-slate-400 mt-1">Paket detaylarını aşağıdan yapılandırabilirsiniz.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        {/* TASK 1: Region Selection Top Buttons */}
        <div className="space-y-3">
          <Label className="text-slate-300 font-semibold text-sm uppercase tracking-wider">Öncelikli Bölge Seçimi <span className="text-red-400">*</span></Label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleSelectChange('region', 'TR')}
              className={`relative overflow-hidden flex flex-col items-center justify-center py-4 px-4 rounded-xl border-2 transition-all duration-300 group ${
                formData.region === 'TR' 
                  ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                  : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className={`p-2 rounded-full mb-2 ${formData.region === 'TR' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700 text-slate-400'}`}>
                <MapPin className="w-6 h-6" />
              </div>
              <span className={`font-bold text-lg ${formData.region === 'TR' ? 'text-white' : 'text-slate-300'}`}>Türkiye</span>
              <span className={`text-xs ${formData.region === 'TR' ? 'text-purple-300' : 'text-slate-500'}`}>TR Fiyatlandırması</span>
              
              {formData.region === 'TR' && (
                <div className="absolute top-2 right-2">
                  <div className="bg-purple-500 rounded-full p-1">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSelectChange('region', 'EU')}
              className={`relative overflow-hidden flex flex-col items-center justify-center py-4 px-4 rounded-xl border-2 transition-all duration-300 group ${
                formData.region === 'EU' 
                  ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                  : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className={`p-2 rounded-full mb-2 ${formData.region === 'EU' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
                <Globe className="w-6 h-6" />
              </div>
              <span className={`font-bold text-lg ${formData.region === 'EU' ? 'text-white' : 'text-slate-300'}`}>Avrupa</span>
              <span className={`text-xs ${formData.region === 'EU' ? 'text-blue-300' : 'text-slate-500'}`}>EU Fiyatlandırması</span>

              {formData.region === 'EU' && (
                <div className="absolute top-2 right-2">
                  <div className="bg-blue-500 rounded-full p-1">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </button>
          </div>
          {errors.region && touched.region && (
            <p className="text-red-400 text-sm flex items-center mt-2"><AlertCircle className="w-4 h-4 mr-1"/> {errors.region}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/30 p-5 rounded-xl border border-slate-700/50">
          {/* TASK 4: Reorganized Layout */}
          
          {/* Package Name */}
          <div className="space-y-2">
            <Label className="text-slate-300">Paket Adı <span className="text-red-400">*</span></Label>
            <Input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Örn: Süper Paket"
              className={`bg-slate-950/50 text-white ${errors.name && touched.name ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-700'}`} 
            />
            {errors.name && touched.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label className="text-slate-300 flex items-center justify-between">
              <span>Fiyat <span className="text-red-400">*</span></span>
              <span className="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                Para Birimi: {formData.region === 'EU' ? 'Euro (€)' : 'TL (₺)'}
              </span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                {formData.region === 'EU' ? '€' : '₺'}
              </span>
              <Input 
                type="number" 
                step="0.01" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                placeholder="0.00"
                className={`pl-8 bg-slate-950/50 text-white ${errors.price && touched.price ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-700'}`} 
              />
            </div>
            {errors.price && touched.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* TASK 2: Duration Dropdown */}
          <div className="space-y-2">
            <Label className="text-slate-300">Süre <span className="text-red-400">*</span></Label>
            <Select value={formData.duration} onValueChange={(val) => handleSelectChange('duration', val)}>
              <SelectTrigger className={`bg-slate-950/50 text-white w-full ${errors.duration && touched.duration ? 'border-red-500' : 'border-slate-700'}`}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <SelectValue placeholder="Süre Seçiniz" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="1 Ay">1 Ay</SelectItem>
                <SelectItem value="3 Ay">3 Ay</SelectItem>
                <SelectItem value="6 Ay">6 Ay</SelectItem>
                <SelectItem value="12 Ay">12 Ay</SelectItem>
              </SelectContent>
            </Select>
            {errors.duration && touched.duration && <p className="text-red-400 text-xs mt-1">{errors.duration}</p>}
          </div>

          {/* TASK 3: Region Dropdown (Synced) */}
          <div className="space-y-2">
            <Label className="text-slate-300">Bölge <span className="text-red-400">*</span></Label>
            <Select value={formData.region} onValueChange={(val) => handleSelectChange('region', val)}>
              <SelectTrigger className={`bg-slate-950/50 text-white w-full ${errors.region && touched.region ? 'border-red-500' : 'border-slate-700'}`}>
                 <div className="flex items-center gap-2">
                  {formData.region === 'EU' ? <Globe className="w-4 h-4 text-slate-400" /> : <MapPin className="w-4 h-4 text-slate-400" />}
                  <SelectValue placeholder="Bölge Seçiniz" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="TR">Türkiye (TR)</SelectItem>
                <SelectItem value="EU">Avrupa (EU)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">Üstteki butonlarla senkronizedir.</p>
          </div>
        </div>

        {/* Features Textarea */}
        <div className="space-y-2 bg-slate-800/30 p-5 rounded-xl border border-slate-700/50">
          <Label className="text-slate-300 flex justify-between">
            <span>Özellikler <span className="text-red-400">*</span></span>
            <span className="text-xs text-slate-500 font-normal">Her satıra bir özellik yazın</span>
          </Label>
          <Textarea 
            name="features" 
            value={formData.features} 
            onChange={handleChange} 
            placeholder="Tüm Kanallar Açık&#10;7/24 Destek&#10;4K Yayın Kalitesi"
            className={`min-h-[120px] bg-slate-950/50 text-white resize-y ${errors.features && touched.features ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-700'}`} 
          />
          {errors.features && touched.features && <p className="text-red-400 text-xs mt-1">{errors.features}</p>}
        </div>

        {/* WhatsApp Message - Changed to Textarea for better usability as per Task 4 */}
        <div className="space-y-2 bg-slate-800/30 p-5 rounded-xl border border-slate-700/50">
          <Label className="text-slate-300">WhatsApp Sipariş Mesajı (İsteğe Bağlı)</Label>
          <Textarea 
            name="whatsapp_message" 
            value={formData.whatsapp_message} 
            onChange={handleChange} 
            placeholder="Örn: Merhaba, 12 Aylık Avrupa paketini satın almak istiyorum."
            className="bg-slate-950/50 text-white border-slate-700 min-h-[80px]" 
          />
          <p className="text-xs text-slate-500">Müşteri "Satın Al" butonuna tıkladığında WhatsApp'ta otomatik belirecek mesajdır.</p>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/30 p-5 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
            <div className="space-y-0.5">
              <Label htmlFor="popular" className="text-white cursor-pointer">Popüler Paket</Label>
              <p className="text-xs text-slate-500">Sitede öne çıkan olarak işaretle</p>
            </div>
            <Switch 
              id="popular" 
              checked={formData.popular} 
              onCheckedChange={handleSwitch('popular')} 
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
             <div className="space-y-0.5">
              <Label htmlFor="enabled" className="text-white cursor-pointer">Paket Aktif</Label>
              <p className="text-xs text-slate-500">Kullanıcılar paketi görebilir</p>
            </div>
            <Switch 
              id="enabled" 
              checked={formData.enabled} 
              onCheckedChange={handleSwitch('enabled')} 
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-700">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onCancel} 
            className="text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            İptal Et
          </Button>
          <Button 
            type="submit" 
            disabled={loading || !isFormValid} 
            className={`min-w-[140px] shadow-lg transition-all duration-300 ${
              isFormValid 
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25 hover:shadow-purple-500/40' 
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Check className="w-5 h-5 mr-2" />
            )}
            {pkg ? 'Değişiklikleri Kaydet' : 'Paketi Oluştur'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AdminPackageForm;
