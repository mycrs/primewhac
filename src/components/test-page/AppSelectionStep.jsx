import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

const appsBase = [
  { id: 'iptv-smarters', name: 'IPTV Smarters Pro', providerKey: 'recommended' },
  { id: 'tivimate', name: 'TiviMate', providerKey: 'premium' },
  { id: 'ibo-player', name: 'IBO Player', providerKey: 'popular' },
  { id: 'set-iptv', name: 'SET IPTV', providerKey: 'stable' },
  { id: 'net-iptv', name: 'Net IPTV', providerKey: 'alternative' },
  { id: 'ss-iptv', name: 'SS IPTV', providerKey: 'free' },
  { id: 'ott-navigator', name: 'OTT Navigator', providerKey: 'advanced' },
  { id: 'gse-smart', name: 'GSE Smart IPTV', providerKey: 'multi' },
  { id: 'other', nameKey: 'other_app', providerKey: 'custom' },
];

const AppSelectionStep = ({ selectedDevice, selectedApp, onSelect }) => {
  const location = useLocation();
  const isDe = location.pathname.includes('/de');

  const providerLabels = isDe
    ? { recommended: 'Recommended', premium: 'Premium Experience', popular: 'Popular', stable: 'Stable', alternative: 'Alternative', free: 'Free', advanced: 'Advanced', multi: 'Multi-platform', custom: 'Custom' }
    : { recommended: 'Önerilen', premium: 'Premium', popular: 'Popüler', stable: 'Stabil', alternative: 'Alternatif', free: 'Ücretsiz', advanced: 'Gelişmiş', multi: 'Çoklu platform', custom: 'Özel' };

  const apps = appsBase.map((a) => ({
    ...a,
    name: a.nameKey ? (isDe ? 'Ich werde eine andere App verwenden' : 'Başka bir uygulama kullanacağım') : a.name,
    provider: providerLabels[a.providerKey],
  }));

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          {isDe ? 'Welche Anwendung möchten Sie verwenden?' : 'Hangi uygulamayı kullanmak istiyorsunuz?'}
        </h2>
        <p className="text-slate-400">
          {isDe ? 'Wählen Sie die Anwendung aus, auf der Sie den Test-Stream einrichten möchten.' : 'Test yayınını kuracağınız uygulamayı seçin.'}
        </p>
        {selectedDevice && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              {isDe ? 'Ausgewähltes Gerät:' : 'Seçilen cihaz:'}
            </span>
            <span className="text-xs font-bold text-green-400 uppercase tracking-widest">{selectedDevice.name}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map((app) => {
          const isSelected = selectedApp?.id === app.id;

          return (
            <motion.button
              key={app.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(app)}
              className={cn(
                "relative group flex items-center gap-4 p-5 rounded-xl border transition-all duration-300 text-left",
                isSelected 
                  ? "bg-green-600/10 border-green-500/50 ring-1 ring-green-500/20" 
                  : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300",
                isSelected ? "bg-green-500 text-white" : "bg-slate-800 text-slate-500 group-hover:bg-slate-700"
              )}>
                {isSelected ? <CheckCircle2 className="w-5 h-5" /> : <Download className="w-5 h-5" />}
              </div>

              <div>
                <h3 className="font-bold text-white">{app.name}</h3>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">{app.provider}</p>
              </div>

              {isSelected && (
                <div className="absolute top-0 right-0 w-2 h-full bg-green-500 rounded-r-xl"></div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default AppSelectionStep;