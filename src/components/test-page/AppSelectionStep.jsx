import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AppWindow, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import { useSiteData } from '@/hooks/useSiteData';
import { getIptvDevicePlatformsMap } from '@/constants/iptvFlowDevices';
import { getFlowApps } from '@/constants/iptvFlowApps';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PLATFORM_LABELS_TR = {
  smarttv: 'Smart TV',
  android: 'Android',
  ios: 'iOS',
  pc: 'PC / Mac',
  tablet: 'Tablet',
  windows: 'Windows',
};

const PLATFORM_LABELS_DE = {
  smarttv: 'Smart TV',
  android: 'Android',
  ios: 'iOS',
  pc: 'PC / Mac',
  tablet: 'Tablet',
  windows: 'Windows',
};

function normalizeAppsData(appsData) {
  if (!appsData) return [];
  if (Array.isArray(appsData)) return appsData;
  if (Array.isArray(appsData?.apps)) return appsData.apps;
  return [];
}

const AppSelectionStep = ({ selectedDevice, selectedApp, onSelect, appsData }) => {
  const location = useLocation();
  const { siteData } = useSiteData();
  const isDe = location.pathname.includes('/de');
  const [customApp, setCustomApp] = useState(selectedApp?.id === 'custom' ? selectedApp.name : '');

  const platformLabels = isDe ? PLATFORM_LABELS_DE : PLATFORM_LABELS_TR;

  const allApps = useMemo(() => normalizeAppsData(appsData), [appsData]);

  const platformsMap = useMemo(
    () => getIptvDevicePlatformsMap(siteData?.iptvFlowDevicesData),
    [siteData?.iptvFlowDevicesData]
  );

  const filteredApps = useMemo(() => {
    return getFlowApps(allApps, selectedDevice?.id, platformsMap);
  }, [selectedDevice, allApps, platformsMap]);

  const formatPlatforms = (platforms) => {
    if (!Array.isArray(platforms) || !platforms.length) return null;
    return platforms
      .map((p) => platformLabels[p] || p)
      .filter(Boolean)
      .join(' · ');
  };

  const copy = isDe
    ? {
        title: 'Welche Anwendung möchten Sie verwenden?',
        sub: 'Wählen Sie die App aus, mit der Sie den Test einrichten möchten. Die Liste entspricht Ihrer Gerätewahl.',
        deviceLabel: 'Ausgewähltes Gerät:',
        emptyNoData:
          'Für dieses Gerät ist keine passende App gelistet. Sie können den Namen unten eingeben oder „Andere“ wählen.',
        emptyFiltered:
          'Für dieses Gerät sind in der Liste keine passenden Apps markiert. Wählen Sie „Andere“ oder eine App mit passender Plattform im Admin-Bereich.',
        other: 'Andere / Weiß ich nicht',
        rec: 'Empfohlen',
      }
    : {
        title: 'Hangi uygulamayı kullanmak istiyorsunuz?',
        sub: 'Test yayınını kuracağınız uygulamayı seçin. Liste, seçtiğiniz cihaza uygun uygulamaları gösterir.',
        deviceLabel: 'Seçilen cihaz:',
        emptyNoData:
          'Bu cihaz için listede uygulama bulunamadı. Aşağıya uygulama adını yazabilir veya “Diğer” seçebilirsiniz.',
        emptyFiltered:
          'Bu cihaz için listede uygun uygulama bulunamadı. “Diğer” seçin veya panelde uygulama platform etiketlerini kontrol edin.',
        other: 'Diğer / Bilmiyorum',
        rec: 'Önerilen',
      };

  const genericApp = { id: 'generic', name: copy.other };

  return (
    <div className="space-y-8">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">{copy.title}</h2>
        <p className="text-slate-400">{copy.sub}</p>
        {selectedDevice && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-[#0a0a0a] px-3 py-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{copy.deviceLabel}</span>
            <span className="text-xs font-bold uppercase tracking-widest text-green-400">{selectedDevice.name}</span>
          </div>
        )}
      </div>

      {filteredApps.length === 0 && (
        <p className="mx-auto max-w-2xl rounded-xl border border-dashed border-amber-500/40 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-100/90">
          {copy.emptyNoData}
        </p>
      )}

      <div className="grid max-h-[min(420px,55vh)] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3 custom-scrollbar">
        {filteredApps.map((app, idx) => {
          const isSelected = selectedApp?.id === app.id;
          const platformLine = formatPlatforms(app.platforms);

          return (
            <motion.button
              key={app.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(app)}
              className={cn(
                'group relative flex items-start gap-4 rounded-xl border p-5 text-left transition-all duration-300',
                isSelected
                  ? 'border-green-500/50 bg-green-600/10 ring-1 ring-green-500/20'
                  : 'border-slate-800 bg-[#0a0a0a]/40 hover:border-slate-700'
              )}
            >
              <div
                className={cn(
                  'flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border shadow-inner transition-colors duration-300',
                  isSelected ? 'border-green-500/40 bg-[#0a0a0a]' : 'border-slate-700 bg-[#0a0a0a]'
                )}
              >
                {app.logo ? (
                  <img
                    src={app.logo}
                    alt={`${app.name} uygulama logosu`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <AppWindow className="h-7 w-7 text-slate-500" aria-hidden />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-bold text-white">{app.name}</p>
                {app.description ? (
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">{app.description}</p>
                ) : null}
                {platformLine ? (
                  <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-slate-500">{platformLine}</p>
                ) : null}
                {app.recommended ? (
                  <p className="mt-1.5 text-[11px] font-semibold text-amber-400">⭐ {copy.rec}</p>
                ) : null}
              </div>

              <div className="absolute right-3 top-3 shrink-0">
                {isSelected ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" aria-hidden />
                ) : null}
              </div>

              {isSelected ? <div className="absolute bottom-0 left-0 h-1 w-full rounded-b-xl bg-green-500" aria-hidden /> : null}
            </motion.button>
          );
        })}

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: filteredApps.length * 0.04 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(genericApp)}
          className={cn(
            'group relative flex items-center gap-4 rounded-xl border p-5 text-left transition-all duration-300',
            selectedApp?.id === 'generic'
              ? 'border-green-500/50 bg-green-600/10 ring-1 ring-green-500/20'
              : 'border-slate-700 border-dashed bg-[#0a0a0a]/30 hover:border-slate-600 hover:bg-[#0a0a0a]/40'
          )}
        >
          <div
            className={cn(
              'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border transition-colors',
              selectedApp?.id === 'generic' ? 'border-green-500/40 bg-green-500/15 text-green-400' : 'border-slate-700 bg-[#0a0a0a] text-slate-500'
            )}
          >
            <HelpCircle className="h-7 w-7" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className={cn('font-bold', selectedApp?.id === 'generic' ? 'text-white' : 'text-slate-300')}>{copy.other}</p>
            <p className="mt-1 text-xs text-slate-500">
              {isDe ? 'Wir helfen Ihnen bei der App-Auswahl.' : 'Destek ekibi size uygun uygulamayı önerebilir.'}
            </p>
          </div>
          {selectedApp?.id === 'generic' ? (
            <CheckCircle2 className="absolute right-3 top-3 h-6 w-6 shrink-0 text-green-500" aria-hidden />
          ) : null}
        </motion.button>
      </div>
      <div className="space-y-2 rounded-xl border border-slate-700 bg-[#0a0a0a]/40 p-4">
        <label htmlFor="test-custom-app" className="text-sm font-semibold text-slate-200">{isDe ? 'Andere Anwendung eingeben' : 'Listede yoksa uygulama adını yazın'}</label>
        <div className="flex flex-wrap gap-2">
          <Input id="test-custom-app" value={customApp} onChange={(event) => setCustomApp(event.target.value)} maxLength={100} placeholder={isDe ? 'Name der Anwendung' : 'Uygulama adı'} className="min-w-0 flex-1 border-slate-700 bg-[#0a0a0a] text-base text-white" />
          <Button type="button" disabled={!customApp.trim()} onClick={() => onSelect({ id: 'custom', name: customApp.trim() })}>{isDe ? 'Weiter' : 'Devam'}</Button>
        </div>
        <p className="text-xs text-slate-400">{isDe ? 'Die Verfügbarkeit hängt von Gerät und Land ab.' : 'Uygulama mağazası seçenekleri cihaz modeline ve ülkeye göre değişebilir.'}</p>
      </div>
    </div>
  );
};

export default AppSelectionStep;
