import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Check, Star, AlertCircle, PackageX } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { getPackageCurrencySymbol } from '@/utils/buildPackagePayload';

/** Supabase bazen features'ı JSON string döndürür; her zaman dizi kullan */
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

const PackagesList = ({ packages, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Paketler yükleniyor...</p>
      </div>
    );
  }

  if (!packages || packages.length === 0) {
    return (
      <div className="py-20 text-center bg-[#0a0a0a]/50 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
        <PackageX className="w-16 h-16 text-slate-600 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">Henüz Paket Bulunmuyor</h3>
        <p className="text-slate-400">Bu bölge için henüz bir paket oluşturmadınız.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pkg, index) => (
        <motion.div
          key={pkg.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className={`relative flex flex-col bg-[#0a0a0a] rounded-xl border ${
            pkg.popular ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/10' : 'border-slate-800'
          } overflow-hidden ${pkg.enabled === false ? 'opacity-70' : ''} hover:shadow-xl transition-all duration-300`}
        >
          {/* Header */}
          <div className={`p-5 border-b ${pkg.popular ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-slate-800 bg-[#0a0a0a]/20'}`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className={`${pkg.region === 'EU' ? 'text-blue-400 border-blue-400/30' : 'text-red-400 border-red-400/30'}`}>
                  {pkg.region === 'EU' ? 'Avrupa' : 'Türkiye'}
                </Badge>
                {pkg.tier && (
                  <Badge variant="outline" className="text-slate-300 border-slate-600 capitalize">
                    {pkg.tier}
                  </Badge>
                )}
              </div>
              {pkg.popular && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black border-none font-bold">
                  <Star className="w-3 h-3 mr-1 fill-black" /> EN POPÜLER
                </Badge>
              )}
              {pkg.enabled === false && (
                <Badge variant="destructive" className="ml-auto">Pasif</Badge>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
            <div className="flex items-baseline gap-1 mt-3 flex-wrap">
              {pkg.original_price != null && Number(pkg.original_price) > Number(pkg.price) && (
                <span className="text-lg text-slate-500 line-through mr-2">
                  {getPackageCurrencySymbol(pkg, pkg.region)}{pkg.original_price}
                </span>
              )}
              <span className="text-3xl font-extrabold text-white">
                {pkg.price}
              </span>
              <span className="text-lg text-slate-400 font-medium">
                {getPackageCurrencySymbol(pkg, pkg.region)}
              </span>
              <span className="text-sm text-slate-500 ml-1">/ {pkg.duration}</span>
              {pkg.campaign_label && (
                <span className="w-full mt-1 text-xs text-amber-400 font-medium">{pkg.campaign_label}</span>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="p-5 flex-1 bg-[#0a0a0a]/50">
            <ul className="space-y-3">
              {ensureFeaturesArray(pkg.features).slice(0, 4).map((feature, i) => (
                <li key={i} className="flex items-start text-sm text-slate-300">
                  <Check className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="leading-snug">{typeof feature === 'string' ? feature : String(feature)}</span>
                </li>
              ))}
              {ensureFeaturesArray(pkg.features).length > 4 && (
                <li className="text-sm text-slate-500 italic pl-6">
                  + {ensureFeaturesArray(pkg.features).length - 4} özellik daha
                </li>
              )}
              {ensureFeaturesArray(pkg.features).length === 0 && (
                <li className="text-sm text-slate-500 italic">Özellik yok</li>
              )}
            </ul>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-slate-800 flex gap-3 bg-[#0a0a0a]/30 mt-auto">
            <Button 
              onClick={() => onEdit(pkg)} 
              variant="secondary"
              className="flex-1 bg-[#0a0a0a] hover:bg-[#0a0a0a] text-white"
            >
              <Edit className="w-4 h-4 mr-2" /> Düzenle
            </Button>
            <Button 
              onClick={() => {
                if(window.confirm(`"${pkg.name}" paketini silmek istediğinize emin misiniz?`)) {
                  onDelete(pkg.id);
                }
              }} 
              variant="destructive"
              className="flex-1 bg-red-950/50 hover:bg-red-900 text-red-400 hover:text-white border border-red-900/50"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Sil
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PackagesList;
