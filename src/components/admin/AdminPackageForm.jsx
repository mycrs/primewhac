
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
import { isoToDatetimeLocalInput } from '@/utils/packageCampaignDatetime';
import { buildPackagePayload, savePackageToSupabase } from '@/utils/buildPackagePayload';
import {
  PACKAGE_TIER_OPTIONS,
  PACKAGE_CURRENCY_OPTIONS,
  PACKAGE_DURATION_PRESETS,
} from '@/constants/packageAdminFields';

function featuresToText(features) {
  if (!features) return '';
  if (Array.isArray(features)) return features.map((f) => (typeof f === 'string' ? f : String(f))).join('\n');
  if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features);
      return Array.isArray(parsed) ? parsed.map((f) => String(f)).join('\n') : features;
    } catch { return features; }
  }
  return '';
}

const AdminPackageForm = ({ pkg, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    original_price: '',
    campaign_label: '',
    duration: '',
    region: 'EU',
    features: '',
    tier: 'standard',
    sort_order: 0,
    currency: '₺',
    popular: false,
    featured: false,
    badge_text: '',
    badge_enabled: false,
    button_text: '',
    card_description: '',
    enabled: true,
    whatsapp_message: '',
    countdown_active: false,
    campaign_end_datetime: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (pkg) {
      setFormData({
        name: String(pkg.name ?? ''),
        price: pkg.price !== undefined && pkg.price !== null ? String(pkg.price) : '',
        original_price: pkg.original_price != null ? String(pkg.original_price) : '',
        campaign_label: String(pkg.campaign_label ?? ''),
        duration: String(pkg.duration ?? ''),
        region: pkg.region === 'TR' || pkg.region === 'EU' ? pkg.region : 'EU',
        features: featuresToText(pkg.features),
        tier: pkg.tier || 'standard',
        sort_order: pkg.sort_order ?? 0,
        currency: pkg.currency || (pkg.region === 'EU' ? '€' : '₺'),
        popular: Boolean(pkg.popular),
        featured: Boolean(pkg.featured),
        badge_text: String(pkg.badge_text ?? ''),
        badge_enabled: Boolean(pkg.badge_enabled),
        button_text: String(pkg.button_text ?? ''),
        card_description: String(pkg.card_description ?? ''),
        enabled: pkg.enabled !== false,
        whatsapp_message: String(pkg.whatsapp_message ?? ''),
        countdown_active: Boolean(pkg.countdown_active),
        campaign_end_datetime: isoToDatetimeLocalInput(pkg.campaign_end_date) || '',
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
    if (formData.countdown_active) {
      const raw = String(formData.campaign_end_datetime || '').trim();
      if (!raw) newErrors.campaign_end_datetime = 'Geri sayım açıkken kampanya bitiş tarihi zorunludur.';
      else if (Number.isNaN(new Date(raw).getTime())) {
        newErrors.campaign_end_datetime = 'Geçerli bir tarih ve saat seçin.';
      }
    }

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
      name: true,
      price: true,
      duration: true,
      region: true,
      features: true,
      ...(formData.countdown_active ? { campaign_end_datetime: true } : {})
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
        const payload = buildPackagePayload({
        ...formData,
        features: formData.features.split('\n').map((f) => f.trim()).filter(Boolean),
      });

      const { error, stripped } = await savePackageToSupabase(supabase, {
        id: pkg?.id,
        payload,
      });

      if (error) throw error;

      if (stripped?.length > 0) {
        toast({
          title: 'Uyarı',
          description: `Paket kaydedildi. Eksik sütunlar: ${stripped.join(', ')}. docs/supabase-packages-tier-migration.sql çalıştırın.`,
          className: 'bg-amber-600 border-none text-white',
          duration: 8000,
        });
        onSuccess();
        return;
      }

      toast({ 
        title: 'Başarılı', 
        description: pkg?.id ? 'Paket başarıyla güncellendi.' : 'Yeni paket başarıyla eklendi.',
        className: "bg-green-600 border-none text-white"
      });
      onSuccess();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Hata', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.name &&
    formData.price &&
    formData.duration &&
    formData.region &&
    formData.features &&
    (!formData.countdown_active || String(formData.campaign_end_datetime || '').trim());

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0a0a0a] rounded-xl border border-slate-800 shadow-2xl overflow-hidden"
    >
      <div className="bg-[#0a0a0a]/50 p-6 border-b border-slate-700">
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
                  ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(229,9,20,0.2)]' 
                  : 'border-slate-700 bg-[#0a0a0a]/50 hover:bg-[#0a0a0a] hover:border-slate-600'
              }`}
            >
              <div className={`p-2 rounded-full mb-2 ${formData.region === 'TR' ? 'bg-primary/20 text-primary' : 'bg-[#0a0a0a] text-slate-400'}`}>
                <MapPin className="w-6 h-6" />
              </div>
              <span className={`font-bold text-lg ${formData.region === 'TR' ? 'text-white' : 'text-slate-300'}`}>Türkiye</span>
              <span className={`text-xs ${formData.region === 'TR' ? 'text-primary' : 'text-slate-500'}`}>TR Fiyatlandırması</span>
              
              {formData.region === 'TR' && (
                <div className="absolute top-2 right-2">
                  <div className="bg-primary rounded-full p-1">
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
                  ? 'border-blue-500 bg-[#141414]/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                  : 'border-slate-700 bg-[#0a0a0a]/50 hover:bg-[#0a0a0a] hover:border-slate-600'
              }`}
            >
              <div className={`p-2 rounded-full mb-2 ${formData.region === 'EU' ? 'bg-[#141414]/20 text-blue-400' : 'bg-[#0a0a0a] text-slate-400'}`}>
                <Globe className="w-6 h-6" />
              </div>
              <span className={`font-bold text-lg ${formData.region === 'EU' ? 'text-white' : 'text-slate-300'}`}>Avrupa</span>
              <span className={`text-xs ${formData.region === 'EU' ? 'text-blue-300' : 'text-slate-500'}`}>EU Fiyatlandırması</span>

              {formData.region === 'EU' && (
                <div className="absolute top-2 right-2">
                  <div className="bg-[#141414] rounded-full p-1">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0a0a0a]/30 p-5 rounded-xl border border-slate-700/50">
          {/* TASK 4: Reorganized Layout */}
          
          {/* Package Name */}
          <div className="space-y-2">
            <Label className="text-slate-300">Paket Adı <span className="text-red-400">*</span></Label>
            <Input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Örn: Süper Paket"
              className={`bg-[#0a0a0a]/50 text-white ${errors.name && touched.name ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-700'}`} 
            />
            {errors.name && touched.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label className="text-slate-300 flex items-center justify-between">
              <span>Fiyat <span className="text-red-400">*</span></span>
              <span className="text-xs font-mono bg-[#0a0a0a] px-2 py-0.5 rounded text-slate-400">
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
                className={`pl-8 bg-[#0a0a0a]/50 text-white ${errors.price && touched.price ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-700'}`} 
              />
            </div>
            {errors.price && touched.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* Original Price (for discount display) */}
          <div className="space-y-2">
            <Label className="text-slate-300">Orijinal Fiyat (İndirim İçin)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                {formData.region === 'EU' ? '€' : '₺'}
              </span>
              <Input 
                type="number" 
                step="0.01" 
                name="original_price" 
                value={formData.original_price} 
                onChange={handleChange} 
                placeholder="Boş = indirim yok"
                className="pl-8 bg-[#0a0a0a]/50 text-white border-slate-700" 
              />
            </div>
            <p className="text-xs text-slate-500">Doluysa sitede eski fiyat üstü çizili gösterilir.</p>
          </div>

          {/* Campaign Label */}
          <div className="space-y-2 md:col-span-2">
            <Label className="text-slate-300">Kampanya Etiketi</Label>
            <Input 
              name="campaign_label" 
              value={formData.campaign_label} 
              onChange={handleChange} 
              placeholder="Örn: +3 ay hediye, Sınırlı süre kampanya"
              className="bg-[#0a0a0a]/50 text-white border-slate-700" 
            />
            <p className="text-xs text-slate-500">Kartta fiyatın altında küçük etiket olarak gösterilir. Boş bırakabilirsiniz.</p>
          </div>

          <div className="space-y-4 md:col-span-2 rounded-lg border border-slate-700/60 bg-[#0a0a0a]/40 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Label htmlFor="countdown-active-admin" className="text-slate-300">Geri sayım aktif</Label>
                <p className="text-xs text-slate-500">Kartta kampanya bitişine kadar canlı geri sayım.</p>
              </div>
              <Switch
                id="countdown-active-admin"
                checked={!!formData.countdown_active}
                onCheckedChange={(checked) => {
                  setFormData((prev) => ({
                    ...prev,
                    countdown_active: checked,
                    ...(checked ? {} : { campaign_end_datetime: '' })
                  }));
                  setTouched((prev) => ({ ...prev, campaign_end_datetime: true }));
                }}
                className="shrink-0 data-[state=checked]:bg-orange-500"
              />
            </div>
            {formData.countdown_active && (
              <div className="space-y-2">
                <Label className="text-slate-300">Kampanya bitiş tarihi <span className="text-red-400">*</span></Label>
                <Input
                  type="datetime-local"
                  name="campaign_end_datetime"
                  value={formData.campaign_end_datetime ?? ''}
                  onChange={handleChange}
                  className={`bg-[#0a0a0a]/50 text-white ${errors.campaign_end_datetime && touched.campaign_end_datetime ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-700'}`}
                />
                {errors.campaign_end_datetime && touched.campaign_end_datetime && (
                  <p className="text-red-400 text-xs mt-1">{errors.campaign_end_datetime}</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Paket Tipi (Tier)</Label>
            <Select value={formData.tier || 'standard'} onValueChange={(val) => handleSelectChange('tier', val)}>
              <SelectTrigger className="bg-[#0a0a0a]/50 text-white w-full border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-slate-700 text-white">
                {PACKAGE_TIER_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Süre <span className="text-red-400">*</span></Label>
            <Select value={formData.duration} onValueChange={(val) => handleSelectChange('duration', val)}>
              <SelectTrigger className={`bg-[#0a0a0a]/50 text-white w-full ${errors.duration && touched.duration ? 'border-red-500' : 'border-slate-700'}`}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <SelectValue placeholder="Süre Seçiniz" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-slate-700 text-white">
                {PACKAGE_DURATION_PRESETS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              name="duration"
              value={formData.duration || ''}
              onChange={handleChange}
              placeholder="veya manuel süre: 18 Ay"
              className="bg-[#0a0a0a]/50 text-white border-slate-700 mt-2"
            />
            {errors.duration && touched.duration && <p className="text-red-400 text-xs mt-1">{errors.duration}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Para Birimi</Label>
            <Select value={formData.currency || '₺'} onValueChange={(val) => handleSelectChange('currency', val)}>
              <SelectTrigger className="bg-[#0a0a0a]/50 text-white w-full border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-slate-700 text-white">
                {PACKAGE_CURRENCY_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Sıralama No</Label>
            <Input name="sort_order" type="number" value={formData.sort_order ?? 0} onChange={handleChange} className="bg-[#0a0a0a]/50 text-white border-slate-700" />
          </div>

          {/* TASK 3: Region Dropdown (Synced) */}
          <div className="space-y-2">
            <Label className="text-slate-300">Bölge <span className="text-red-400">*</span></Label>
            <Select value={formData.region} onValueChange={(val) => handleSelectChange('region', val)}>
              <SelectTrigger className={`bg-[#0a0a0a]/50 text-white w-full ${errors.region && touched.region ? 'border-red-500' : 'border-slate-700'}`}>
                 <div className="flex items-center gap-2">
                  {formData.region === 'EU' ? <Globe className="w-4 h-4 text-slate-400" /> : <MapPin className="w-4 h-4 text-slate-400" />}
                  <SelectValue placeholder="Bölge Seçiniz" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-slate-700 text-white">
                <SelectItem value="TR">Türkiye (TR)</SelectItem>
                <SelectItem value="EU">Avrupa (EU)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">Üstteki butonlarla senkronizedir.</p>
          </div>
        </div>

        {/* Features Textarea */}
        <div className="space-y-2 bg-[#0a0a0a]/30 p-5 rounded-xl border border-slate-700/50">
          <Label className="text-slate-300 flex justify-between">
            <span>Özellikler <span className="text-red-400">*</span></span>
            <span className="text-xs text-slate-500 font-normal">Her satıra bir özellik yazın</span>
          </Label>
          <Textarea 
            name="features" 
            value={formData.features} 
            onChange={handleChange} 
            placeholder="Tüm Kanallar Açık&#10;7/24 Destek&#10;4K Yayın Kalitesi"
            className={`min-h-[120px] bg-[#0a0a0a]/50 text-white resize-y ${errors.features && touched.features ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-700'}`} 
          />
          {errors.features && touched.features && <p className="text-red-400 text-xs mt-1">{errors.features}</p>}
        </div>

        <div className="space-y-4 bg-[#0a0a0a]/30 p-5 rounded-xl border border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-400 uppercase">Kart Görünümü</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Rozet Metni</Label>
              <Input name="badge_text" value={formData.badge_text} onChange={handleChange} className="bg-[#0a0a0a]/50 text-white border-slate-700" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800">
              <Label className="text-white">Rozet Aktif</Label>
              <Switch checked={!!formData.badge_enabled} onCheckedChange={handleSwitch('badge_enabled')} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-300">Kart Açıklaması</Label>
              <Textarea name="card_description" value={formData.card_description} onChange={handleChange} className="bg-[#0a0a0a]/50 text-white border-slate-700 min-h-[70px]" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Buton Yazısı</Label>
              <Input name="button_text" value={formData.button_text} onChange={handleChange} placeholder="WhatsApp ile Satın Al" className="bg-[#0a0a0a]/50 text-white border-slate-700" />
            </div>
          </div>
        </div>

        <div className="space-y-2 bg-[#0a0a0a]/30 p-5 rounded-xl border border-slate-700/50">
          <Label className="text-slate-300">WhatsApp Sipariş Mesajı (İsteğe Bağlı)</Label>
          <Textarea 
            name="whatsapp_message" 
            value={formData.whatsapp_message} 
            onChange={handleChange} 
            placeholder="Örn: Merhaba, 12 Aylık Avrupa paketini satın almak istiyorum."
            className="bg-[#0a0a0a]/50 text-white border-slate-700 min-h-[80px]" 
          />
          <p className="text-xs text-slate-500">Müşteri "Satın Al" butonuna tıkladığında WhatsApp'ta otomatik belirecek mesajdır.</p>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0a0a0a]/30 p-5 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between p-3 bg-[#0a0a0a]/50 rounded-lg border border-slate-800">
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
          <div className="flex items-center justify-between p-3 bg-[#0a0a0a]/50 rounded-lg border border-slate-800">
            <div className="space-y-0.5">
              <Label htmlFor="featured" className="text-white cursor-pointer">Öne Çıkan</Label>
            </div>
            <Switch id="featured" checked={!!formData.featured} onCheckedChange={handleSwitch('featured')} />
          </div>
          <div className="flex items-center justify-between p-3 bg-[#0a0a0a]/50 rounded-lg border border-slate-800">
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
            className="text-slate-300 hover:text-white hover:bg-[#0a0a0a] transition-colors"
          >
            İptal Et
          </Button>
          <Button 
            type="submit" 
            disabled={loading || !isFormValid} 
            className={`min-w-[140px] shadow-lg transition-all duration-300 ${
              isFormValid 
                ? 'bg-primary hover:bg-primary text-white shadow-primary/25 hover:shadow-primary/40' 
                : 'bg-[#0a0a0a] text-slate-400 cursor-not-allowed'
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
