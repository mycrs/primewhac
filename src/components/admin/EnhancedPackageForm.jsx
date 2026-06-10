
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Save, X, Loader2, Package, Euro, Clock, MapPin, MessageCircle } from 'lucide-react';
import { validatePackageForm } from '@/utils/validatePackageForm';
import { isoToDatetimeLocalInput } from '@/utils/packageCampaignDatetime';
import FeaturesList from './FeaturesList';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PACKAGE_TIER_OPTIONS,
  PACKAGE_CURRENCY_OPTIONS,
  PACKAGE_DURATION_PRESETS,
  PACKAGE_BADGE_PRESETS,
} from '@/constants/packageAdminFields';

/** Supabase bazen features'ı JSON string döndürür; formda her zaman dizi kullan */
function ensureFeaturesArray(features) {
  if (Array.isArray(features)) return features;
  if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return features.split('\n').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

const EnhancedPackageForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const presetMatch = PACKAGE_DURATION_PRESETS.includes(initialData?.duration);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    original_price: '',
    campaign_label: '',
    duration: '',
    duration_preset: presetMatch ? initialData?.duration : '',
    duration_custom: presetMatch ? '' : (initialData?.duration || ''),
    tier: 'standard',
    sort_order: 0,
    currency: '₺',
    region: 'TR',
    popular: false,
    featured: false,
    enabled: true,
    badge_text: '',
    badge_enabled: false,
    button_text: '',
    card_description: '',
    whatsapp_message: '',
    features: [],
    countdown_active: false,
    campaign_end_datetime: '',
    ...initialData,
    features: ensureFeaturesArray(initialData?.features ?? []),
    countdown_active: Boolean(initialData?.countdown_active),
    campaign_end_datetime: isoToDatetimeLocalInput(initialData?.campaign_end_date) || '',
    tier: initialData?.tier || 'standard',
    sort_order: initialData?.sort_order ?? 0,
    currency: initialData?.currency || (initialData?.region === 'EU' ? '€' : '₺'),
    featured: Boolean(initialData?.featured),
    badge_enabled: Boolean(initialData?.badge_enabled),
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      const isPreset = PACKAGE_DURATION_PRESETS.includes(initialData.duration);
      setFormData({
        ...initialData,
        features: ensureFeaturesArray(initialData.features ?? []),
        countdown_active: Boolean(initialData.countdown_active),
        campaign_end_datetime: isoToDatetimeLocalInput(initialData.campaign_end_date) || '',
        duration_preset: isPreset ? initialData.duration : '',
        duration_custom: isPreset ? '' : (initialData.duration || ''),
        tier: initialData.tier || 'standard',
        sort_order: initialData.sort_order ?? 0,
        currency: initialData.currency || (initialData.region === 'EU' ? '€' : '₺'),
        featured: Boolean(initialData.featured),
        badge_enabled: Boolean(initialData.badge_enabled),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFeaturesChange = (features) => {
    setFormData(prev => ({ ...prev, features }));
    if (errors.features) {
      setErrors(prev => ({ ...prev, features: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      duration: formData.duration_preset || formData.duration_custom || formData.duration,
    };
    const { isValid, errors: validationErrors } = validatePackageForm(submitData);
    
    if (isValid) {
      onSubmit(submitData);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0a0a0a] rounded-xl border border-slate-800 shadow-xl overflow-hidden"
    >
      <div className="bg-[#0a0a0a]/50 p-6 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-white">
            {formData.id ? 'Paketi Düzenle' : 'Yeni Paket Ekle'}
          </h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Basic Info Section */}
        <div className="space-y-6">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Temel Bilgiler</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-300">Paket Adı <span className="text-red-400">*</span></Label>
              <div className="relative">
                <Input
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  placeholder="Örn: 3 Aylık Paket"
                  className={`bg-[#0a0a0a]/50 border-slate-700 text-white ${errors.name ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Paket Tipi (Tier) <span className="text-red-400">*</span></Label>
              <Select value={formData.tier || 'standard'} onValueChange={(val) => setFormData((prev) => ({ ...prev, tier: val }))}>
                <SelectTrigger className="bg-[#0a0a0a]/50 border-slate-700 text-white">
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
              <Select
                value={formData.duration_preset || '_custom'}
                onValueChange={(val) => setFormData((prev) => ({
                  ...prev,
                  duration_preset: val === '_custom' ? '' : val,
                  duration: val === '_custom' ? prev.duration_custom : val,
                }))}
              >
                <SelectTrigger className="bg-[#0a0a0a]/50 border-slate-700 text-white">
                  <SelectValue placeholder="Süre seçin" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-slate-700 text-white">
                  {PACKAGE_DURATION_PRESETS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                  <SelectItem value="_custom">Manuel süre</SelectItem>
                </SelectContent>
              </Select>
              {(!formData.duration_preset || formData.duration_preset === '') && (
                <div className="relative mt-2">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    name="duration_custom"
                    value={formData.duration_custom || ''}
                    onChange={(e) => setFormData((prev) => ({
                      ...prev,
                      duration_custom: e.target.value,
                      duration: e.target.value,
                    }))}
                    placeholder="Örn: 18 Ay"
                    className={`pl-10 bg-[#0a0a0a]/50 border-slate-700 text-white ${errors.duration ? 'border-red-500' : ''}`}
                  />
                </div>
              )}
              {errors.duration && <p className="text-xs text-red-400">{errors.duration}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Para Birimi</Label>
              <Select value={formData.currency || '₺'} onValueChange={(val) => setFormData((prev) => ({ ...prev, currency: val }))}>
                <SelectTrigger className="bg-[#0a0a0a]/50 border-slate-700 text-white">
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
              <Input
                name="sort_order"
                type="number"
                value={formData.sort_order ?? 0}
                onChange={handleChange}
                placeholder="0 = en üstte"
                className="bg-[#0a0a0a]/50 border-slate-700 text-white"
              />
              <span className="text-xs text-slate-500">Küçük numara önce listelenir.</span>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Fiyat <span className="text-red-400">*</span></Label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={handleChange}
                  placeholder="Örn: 29.99"
                  className={`pl-10 bg-[#0a0a0a]/50 border-slate-700 text-white ${errors.price ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.price && <p className="text-xs text-red-400">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Orijinal fiyat (indirimde göstermek için)</Label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  name="original_price"
                  type="number"
                  step="0.01"
                  value={formData.original_price ?? ''}
                  onChange={handleChange}
                  placeholder="Boş bırakırsanız indirim gösterilmez"
                  className="pl-10 bg-[#0a0a0a]/50 border-slate-700 text-white"
                />
              </div>
              <span className="text-xs text-slate-500">Doluysa sitede “eski fiyat” üstü çizili, şu anki fiyat indirimli gösterilir.</span>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-300">Kampanya etiketi</Label>
              <Input
                name="campaign_label"
                value={formData.campaign_label ?? ''}
                onChange={handleChange}
                placeholder="Örn: +3 ay kampanya, 3 ay + 1 ay hediye, Sınırlı süre"
                className="bg-[#0a0a0a]/50 border-slate-700 text-white"
              />
              <span className="text-xs text-slate-500">Kartta fiyatın altında küçük etiket olarak gösterilir. Boş bırakabilirsiniz.</span>
            </div>

            <div className="space-y-4 md:col-span-2 rounded-lg border border-slate-700/60 bg-[#0a0a0a]/40 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <Label htmlFor="countdown-active-enh" className="text-slate-300">Geri sayım aktif</Label>
                  <p className="text-xs text-slate-500">Açıkken paket kartında kampanya bitişine kadar canlı geri sayım gösterilir.</p>
                </div>
                <Switch
                  id="countdown-active-enh"
                  checked={!!formData.countdown_active}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => ({
                      ...prev,
                      countdown_active: checked,
                      ...(checked ? {} : { campaign_end_datetime: '' })
                    }));
                    setErrors((prev) => ({ ...prev, campaign_end_datetime: null }));
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
                    className={`bg-[#0a0a0a]/50 border-slate-700 text-white ${errors.campaign_end_datetime ? 'border-red-500' : ''}`}
                  />
                  {errors.campaign_end_datetime && (
                    <p className="text-xs text-red-400">{errors.campaign_end_datetime}</p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Bölge <span className="text-red-400">*</span></Label>
              <div className="flex gap-4 p-2 bg-[#0a0a0a]/50 rounded-lg border border-slate-700">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="radio"
                    name="region"
                    value="TR"
                    checked={formData.region === 'TR'}
                    onChange={handleChange}
                    className="text-primary focus:ring-primary"
                  />
                  <span>Türkiye (TR)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="radio"
                    name="region"
                    value="EU"
                    checked={formData.region === 'EU'}
                    onChange={handleChange}
                    className="text-primary focus:ring-primary"
                  />
                  <span>Avrupa (EU)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Card Display */}
        <div className="space-y-6">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Kart Görünümü</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-300">Rozet Metni</Label>
              <Input
                name="badge_text"
                value={formData.badge_text || ''}
                onChange={handleChange}
                placeholder="En Popüler, Avantajlı..."
                className="bg-[#0a0a0a]/50 border-slate-700 text-white"
                list="badge-presets"
              />
              <datalist id="badge-presets">
                {PACKAGE_BADGE_PRESETS.map((b) => <option key={b} value={b} />)}
              </datalist>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a]/50 rounded-lg border border-slate-700">
              <Label className="text-white">Rozet Aktif</Label>
              <Switch
                checked={!!formData.badge_enabled}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, badge_enabled: checked }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-300">Kart Açıklaması</Label>
              <Textarea
                name="card_description"
                value={formData.card_description || ''}
                onChange={handleChange}
                placeholder="Kart altında görünen kısa açıklama"
                className="bg-[#0a0a0a]/50 border-slate-700 text-white min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Buton Yazısı</Label>
              <Input
                name="button_text"
                value={formData.button_text || ''}
                onChange={handleChange}
                placeholder="WhatsApp ile Satın Al"
                className="bg-[#0a0a0a]/50 border-slate-700 text-white"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a]/50 rounded-lg border border-slate-700">
              <div>
                <Label className="text-white font-medium block">Öne Çıkan Paket</Label>
                <span className="text-xs text-slate-400">featured — vurgulu kart</span>
              </div>
              <Switch
                checked={!!formData.featured}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-6">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Paket Özellikleri</h4>
          <FeaturesList 
            features={formData.features || []} 
            onChange={handleFeaturesChange} 
            error={errors.features}
          />
        </div>

        {/* Advanced Settings */}
        <div className="space-y-6">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Gelişmiş Ayarlar</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#0a0a0a]/50 rounded-lg border border-slate-700">
                <div>
                  <Label htmlFor="popular-toggle" className="text-white font-medium block">En Popüler Paket</Label>
                  <span className="text-xs text-slate-400">Bu paketi öne çıkarın</span>
                </div>
                <Switch
                  id="popular-toggle"
                  checked={formData.popular}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, popular: checked }))}
                  className="data-[state=checked]:bg-yellow-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0a0a0a]/50 rounded-lg border border-slate-700">
                <div>
                  <Label htmlFor="enabled-toggle" className="text-white font-medium block">Paket Aktif</Label>
                  <span className="text-xs text-slate-400">Sitede göster/gizle</span>
                </div>
                <Switch
                  id="enabled-toggle"
                  checked={formData.enabled !== false} // Default to true
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">WhatsApp Sipariş Mesajı</Label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <Textarea
                  name="whatsapp_message"
                  value={formData.whatsapp_message || ''}
                  onChange={handleChange}
                  placeholder="Sipariş butonuna tıklandığında WhatsApp'a gönderilecek mesaj..."
                  className="pl-10 min-h-[120px] bg-[#0a0a0a]/50 border-slate-700 text-white resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading} className="text-slate-300 hover:text-white">
            İptal
          </Button>
          <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary text-white min-w-[120px]">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Kaydet
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default EnhancedPackageForm;
