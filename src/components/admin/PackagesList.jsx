
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Check, Star, AlertCircle, PackageX } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const PackagesList = ({ packages, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Paketler yükleniyor...</p>
      </div>
    );
  }

  if (!packages || packages.length === 0) {
    return (
      <div className="py-20 text-center bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
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
          className={`relative flex flex-col bg-slate-900 rounded-xl border ${
            pkg.popular ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/10' : 'border-slate-800'
          } overflow-hidden ${pkg.enabled === false ? 'opacity-70' : ''} hover:shadow-xl transition-all duration-300`}
        >
          {/* Header */}
          <div className={`p-5 border-b ${pkg.popular ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-slate-800 bg-slate-800/20'}`}>
            <div className="flex justify-between items-start mb-2">
              <Badge variant="outline" className={`${pkg.region === 'EU' ? 'text-blue-400 border-blue-400/30' : 'text-red-400 border-red-400/30'}`}>
                {pkg.region === 'EU' ? 'Avrupa' : 'Türkiye'}
              </Badge>
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
            <div className="flex items-baseline gap-1 mt-3">
              <span className="text-3xl font-extrabold text-white">
                {pkg.price}
              </span>
              <span className="text-lg text-slate-400 font-medium">
                {pkg.region === 'EU' ? '€' : '₺'}
              </span>
              <span className="text-sm text-slate-500 ml-1">/ {pkg.duration}</span>
            </div>
          </div>

          {/* Features */}
          <div className="p-5 flex-1 bg-slate-900/50">
            <ul className="space-y-3">
              {(pkg.features || []).slice(0, 4).map((feature, i) => (
                <li key={i} className="flex items-start text-sm text-slate-300">
                  <Check className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="leading-snug">{feature}</span>
                </li>
              ))}
              {(pkg.features || []).length > 4 && (
                <li className="text-sm text-slate-500 italic pl-6">
                  + {(pkg.features || []).length - 4} özellik daha
                </li>
              )}
            </ul>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-slate-800 flex gap-3 bg-slate-950/30 mt-auto">
            <Button 
              onClick={() => onEdit(pkg)} 
              variant="secondary"
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white"
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
