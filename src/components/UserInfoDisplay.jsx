import React from 'react';
import { CheckCircle2, User, Mail, Phone, Smartphone, FileText, Monitor } from 'lucide-react';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0a0a0a]/50 border border-slate-800">
    <div className="mt-0.5 p-1.5 rounded-md bg-primary/10">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-medium text-white break-words">{value || '-'}</p>
    </div>
  </div>
);

const UserInfoDisplay = ({ data }) => {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 ring-2 ring-green-500/20">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-white">Başvurunuz Alındı!</h3>
        <p className="text-slate-400 text-sm max-w-[80%] mx-auto">
          Test yayını bilgileriniz aşağıdadır. WhatsApp üzerinden de bilgilendirme yapılacaktır.
        </p>
      </div>

      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
            <InfoRow icon={User} label="Kullanıcı Adı" value={data.username} />
            <InfoRow icon={Smartphone} label="Cihaz" value={data.device_type} />
        </div>
        <div className="grid grid-cols-2 gap-3">
             <InfoRow icon={Mail} label="E-Posta" value={data.email} />
             <InfoRow icon={Phone} label="Telefon" value={data.phone} />
        </div>
        <InfoRow icon={Monitor} label="Uygulama" value={data.selected_app} />
        {data.note && (
          <InfoRow icon={FileText} label="Not" value={data.note} />
        )}
      </div>

      <div className="bg-[#141414]/10 border border-blue-500/20 rounded-lg p-3 text-center">
        <p className="text-blue-200 text-xs">
          Bu pencere otomatik olarak kapanacaktır...
        </p>
      </div>
    </div>
  );
};

export default UserInfoDisplay;