
import React from 'react';
import { Check, X, HelpCircle, Smartphone, Monitor, Tv, Tablet } from 'lucide-react';

const DeviceCompatibilityTable = ({ lang = 'tr' }) => {
  const isDe = lang === 'de';

  const devices = [
    {
      type: "Android TV / Box",
      icon: <Tv className="w-4 h-4" />,
      os: "Android 7.0+",
      app: "XCIPTV, Smarters",
      ram: "2GB+",
      status: isDe ? "Unterstützt" : "Destekleniyor",
      statusColor: "bg-green-500/10 text-green-500 border-green-500/20"
    },
    {
      type: "Amazon Fire TV",
      icon: <Tv className="w-4 h-4" />,
      os: "Fire OS 5+",
      app: "Downloader, Smarters",
      ram: "1GB+",
      status: isDe ? "Unterstützt" : "Destekleniyor",
      statusColor: "bg-green-500/10 text-green-500 border-green-500/20"
    },
    {
      type: "Apple iOS (iPhone/iPad)",
      icon: <Smartphone className="w-4 h-4" />,
      os: "iOS 12+",
      app: "Smarters Lite, iSTB",
      ram: "2GB+",
      status: isDe ? "Unterstützt" : "Destekleniyor",
      statusColor: "bg-green-500/10 text-green-500 border-green-500/20"
    },
    {
      type: "Samsung/LG Smart TV",
      icon: <Monitor className="w-4 h-4" />,
      os: "Tizen / WebOS",
      app: "IBO Player, Smart IPTV",
      ram: "N/A",
      status: isDe ? "Teilweise unterstützt" : "Kısmi Destek",
      statusColor: "bg-amber-500/10 text-amber-500 border-amber-500/20"
    },
    {
      type: "Windows PC",
      icon: <Monitor className="w-4 h-4" />,
      os: "Windows 10/11",
      app: "IPTV Smarters, VLC",
      ram: "4GB+",
      status: isDe ? "Unterstützt" : "Destekleniyor",
      statusColor: "bg-green-500/10 text-green-500 border-green-500/20"
    },
    {
      type: isDe ? "Ältere Satelliten-Receiver" : "Eski Uydu Cihazları",
      icon: <HelpCircle className="w-4 h-4" />,
      os: "Custom",
      app: "Xtream Codes",
      ram: "512MB",
      status: isDe ? "Nicht empfohlen" : "Önerilmez",
      statusColor: "bg-red-500/10 text-red-500 border-red-500/20"
    }
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
      <div className="p-6 border-b border-slate-800">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Monitor className="w-5 h-5 text-blue-500" />
          {isDe ? "Gerätekompatibilitätstabelle" : "Cihaz Uyumluluk Tablosu"}
        </h3>
        <p className="text-slate-400 text-sm mt-1">
          {isDe ? "Geräte und Anforderungen, mit denen Sie unseren Service mit bester Leistung nutzen können." : "Hizmetimizi en iyi performansta kullanabileceğiniz cihazlar ve gereksinimler."}
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/50 text-slate-400 font-medium">
            <tr>
              <th className="px-6 py-4">{isDe ? "Gerätetyp" : "Cihaz Türü"}</th>
              <th className="px-6 py-4">{isDe ? "Empfohlenes OS" : "Önerilen OS"}</th>
              <th className="px-6 py-4">{isDe ? "Empfohlene App" : "Önerilen Uygulama"}</th>
              <th className="px-6 py-4">{isDe ? "Min. RAM" : "Min. RAM"}</th>
              <th className="px-6 py-4">{isDe ? "Status" : "Durum"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {devices.map((device, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                  <span className="p-1.5 bg-slate-800 rounded text-slate-400">{device.icon}</span>
                  {device.type}
                </td>
                <td className="px-6 py-4 text-slate-400">{device.os}</td>
                <td className="px-6 py-4 text-purple-400">{device.app}</td>
                <td className="px-6 py-4 text-slate-500 font-mono">{device.ram}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${device.statusColor}`}>
                    {(device.status === 'Destekleniyor' || device.status === 'Unterstützt') && <Check className="w-3 h-3 mr-1" />}
                    {(device.status === 'Önerilmez' || device.status === 'Nicht empfohlen') && <X className="w-3 h-3 mr-1" />}
                    {(device.status === 'Kısmi Destek' || device.status === 'Teilweise unterstützt') && <HelpCircle className="w-3 h-3 mr-1" />}
                    {device.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeviceCompatibilityTable;
