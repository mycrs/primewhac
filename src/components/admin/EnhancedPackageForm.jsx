
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Save, X, Loader2, Package, Euro, Clock, MapPin, MessageCircle } from 'lucide-react';
import { validatePackageForm } from '@/utils/validatePackageForm';
import FeaturesList from './FeaturesList';
import { motion } from 'framer-motion';

const EnhancedPackageForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    region: 'TR',
    popular: false,
    enabled: true,
    whatsapp_message: '',
    features: [],
    ...initialData
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
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
    const { isValid, errors: validationErrors } = validatePackageForm(formData);
    
    if (isValid) {
      onSubmit(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden"
    >
      <div className="bg-slate-800/50 p-6 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Package className="w-5 h-5 text-purple-400" />
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
                  className={`bg-slate-950/50 border-slate-700 text-white ${errors.name ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Süre <span className="text-red-400">*</span></Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  name="duration"
                  value={formData.duration || ''}
                  onChange={handleChange}
                  placeholder="Örn: 3 AY"
                  className={`pl-10 bg-slate-950/50 border-slate-700 text-white ${errors.duration ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.duration && <p className="text-xs text-red-400">{errors.duration}</p>}
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
                  className={`pl-10 bg-slate-950/50 border-slate-700 text-white ${errors.price ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.price && <p className="text-xs text-red-400">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Bölge <span className="text-red-400">*</span></Label>
              <div className="flex gap-4 p-2 bg-slate-950/50 rounded-lg border border-slate-700">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="radio"
                    name="region"
                    value="TR"
                    checked={formData.region === 'TR'}
                    onChange={handleChange}
                    className="text-purple-600 focus:ring-purple-500"
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
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>Avrupa (EU)</span>
                </label>
              </div>
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
              <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-700">
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

              <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-700">
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
                  className="pl-10 min-h-[120px] bg-slate-950/50 border-slate-700 text-white resize-none"
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
          <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white min-w-[120px]">
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
