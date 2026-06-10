import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/admin/AdminFormControls';

export const FontOptimizationTab = ({ siteData, setSiteData }) => {
  const settings = siteData.font_optimization_settings || {};

  const handleChange = (key, value) => {
    setSiteData.setFont_optimization_settings({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-6">Font Yükleme ve FOUC Önleme</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="preload-fonts" className="text-gray-300 font-medium">Font Preloading Aktif Et</Label>
            <Switch 
              id="preload-fonts"
              checked={settings.enable_preloading !== false}
              onCheckedChange={(checked) => handleChange('enable_preloading', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Font Display Stratejisi</Label>
            <Select 
                value={settings.font_display || 'swap'} 
                onValueChange={(val) => handleChange('font_display', val)}
            >
              <SelectTrigger className="bg-white/10 border-gray-600 text-white">
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] text-white border-slate-700">
                <SelectItem value="swap">Swap (Önerilen)</SelectItem>
                <SelectItem value="block">Block</SelectItem>
                <SelectItem value="fallback">Fallback</SelectItem>
                <SelectItem value="optional">Optional</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Swap: Font yüklenene kadar sistem fontunu gösterir, sonra değiştirir.</p>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="preload-critical" className="text-gray-300 font-medium">Kritik Fontları Önden Yükle (Preload Critical)</Label>
            <Switch 
              id="preload-critical"
              checked={settings.preload_critical !== false}
              onCheckedChange={(checked) => handleChange('preload_critical', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="lazy-fonts" className="text-gray-300 font-medium">Kritik Olmayanları Lazy Load Yap</Label>
            <Switch 
              id="lazy-fonts"
              checked={settings.lazy_load_others || false}
              onCheckedChange={(checked) => handleChange('lazy_load_others', checked)}
            />
          </div>

           <Input 
            label="Font Yükleme Zaman Aşımı (ms)" 
            type="number"
            value={settings.font_timeout || '3000'} 
            onChange={(e) => handleChange('font_timeout', e.target.value)} 
          />

           <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <Label htmlFor="css-opt" className="text-gray-300 font-medium">CSS-in-JS Optimizasyonu</Label>
            <Switch 
              id="css-opt"
              checked={settings.css_optimization || true}
              onCheckedChange={(checked) => handleChange('css_optimization', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontOptimizationTab;