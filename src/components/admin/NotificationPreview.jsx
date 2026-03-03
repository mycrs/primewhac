
import React from 'react';
import { Info, AlertTriangle, Megaphone, CheckCircle2, X, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const NotificationPreview = ({ data }) => {
  const { title, message, type, color, link } = data;

  const getColorStyles = (colorName) => {
    switch (colorName) {
      case 'kırmızı': return 'bg-red-500/10 border-red-500/50 text-red-100';
      case 'sarı': return 'bg-yellow-500/10 border-yellow-500/50 text-yellow-100';
      case 'yeşil': return 'bg-green-500/10 border-green-500/50 text-green-100';
      case 'mavi': return 'bg-blue-500/10 border-blue-500/50 text-blue-100';
      case 'mor': return 'bg-purple-500/10 border-purple-500/50 text-purple-100';
      default: return 'bg-slate-500/10 border-slate-500/50 text-slate-100';
    }
  };

  const getIconColor = (colorName) => {
    switch (colorName) {
      case 'kırmızı': return 'text-red-400';
      case 'sarı': return 'text-yellow-400';
      case 'yeşil': return 'text-green-400';
      case 'mavi': return 'text-blue-400';
      case 'mor': return 'text-purple-400';
      default: return 'text-slate-400';
    }
  };

  const getIcon = (typeName) => {
    switch (typeName) {
      case 'Uyarı': return <AlertTriangle className={`w-5 h-5 ${getIconColor(color)}`} />;
      case 'Duyuru': return <Megaphone className={`w-5 h-5 ${getIconColor(color)}`} />;
      case 'Promosyon': return <CheckCircle2 className={`w-5 h-5 ${getIconColor(color)}`} />;
      default: return <Info className={`w-5 h-5 ${getIconColor(color)}`} />;
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Canlı Önizleme</h3>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative w-full overflow-hidden rounded-xl border p-4 backdrop-blur-md ${getColorStyles(color)}`}
      >
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-1">
            {getIcon(type)}
          </div>
          <div className="flex-1 pr-8">
            <h4 className={`font-bold text-lg mb-1 ${getIconColor(color).replace('text-', 'text-').replace('400', '300')}`}>
              {title || 'Bildirim Başlığı'}
            </h4>
            <p className="text-sm opacity-90 leading-relaxed">
              {message || 'Kullanıcılara gösterilecek bildirim mesajı burada yer alacaktır.'}
            </p>
            {link && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors cursor-pointer">
                  <span>Tıklayınız</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            )}
          </div>
          <button className="absolute top-4 right-4 p-1 rounded-md hover:bg-black/20 transition-colors opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationPreview;
