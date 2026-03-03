import React from 'react';
import { Input, Textarea } from '@/components/admin/AdminFormControls';

export const ResellerCalculatorTab = ({ siteData, setSiteData }) => {
  const settings = siteData.reseller_calculator_settings || {};

  const handleChange = (key, value) => {
    setSiteData.setReseller_calculator_settings({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4">Hesaplama Parametreleri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Para Birimi Sembolü" 
            value={settings.currency_symbol || '₺'} 
            onChange={(e) => handleChange('currency_symbol', e.target.value)} 
          />
          <Input 
            label="Baz Komisyon Oranı (%)" 
            type="number"
            value={settings.base_commission_rate || '10'} 
            onChange={(e) => handleChange('base_commission_rate', e.target.value)} 
          />
          <Input 
            label="Minimum Ödeme Eşiği" 
            type="number"
            value={settings.min_payment_threshold || '500'} 
            onChange={(e) => handleChange('min_payment_threshold', e.target.value)} 
          />
        </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4">Katman Çarpanları (Tier Multipliers)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input 
            label="Bronz Çarpanı (x)" 
            type="number"
            step="0.1"
            value={settings.tier_bronze_multiplier || '1.0'} 
            onChange={(e) => handleChange('tier_bronze_multiplier', e.target.value)} 
          />
          <Input 
            label="Gümüş Çarpanı (x)" 
            type="number"
            step="0.1"
            value={settings.tier_silver_multiplier || '1.2'} 
            onChange={(e) => handleChange('tier_silver_multiplier', e.target.value)} 
          />
          <Input 
            label="Altın Çarpanı (x)" 
            type="number"
            step="0.1"
            value={settings.tier_gold_multiplier || '1.5'} 
            onChange={(e) => handleChange('tier_gold_multiplier', e.target.value)} 
          />
        </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4">Açıklama Metinleri</h3>
        <Textarea 
          label="Hesaplama Mantığı Açıklaması" 
          rows={4}
          value={settings.calculation_description || ''} 
          onChange={(e) => handleChange('calculation_description', e.target.value)} 
        />
      </div>
    </div>
  );
};

export default ResellerCalculatorTab;