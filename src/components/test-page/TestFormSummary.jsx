import React from 'react';
import { Edit2, ShieldCheck, Send, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

const TestFormSummary = ({ formData, selectedDevice, selectedApp, onEditStep, onSubmit, loading }) => {
  const location = useLocation();
  const isDe = location.pathname.includes('/de');

  const t = isDe
    ? { device: 'Gerät', app: 'Anwendung', username: 'Benutzername', note: 'Beschreibung', noNote: 'Keine Notiz', heading: 'Zusammenfassung', sub: 'Überprüfen Sie Ihre Angaben und schließen Sie die Anfrage ab.', report: 'Prüfbericht', ready: 'Bereit zum Absenden', edit: 'Bearbeiten', info: 'Ihre Testanfrage wird sofort bearbeitet. Nachdem Sie auf', submit: 'Absenden', info2: 'geklickt haben, werden Sie zu WhatsApp weitergeleitet, um Ihren Account zu aktivieren.', back: 'Zurück', sending: 'Wird gesendet...', submitBtn: 'Absenden' }
    : { device: 'Cihaz', app: 'Uygulama', username: 'Kullanıcı adı', note: 'Not', noNote: 'Not yok', heading: 'Özet', sub: 'Bilgilerinizi kontrol edin ve talebi tamamlayın.', report: 'Özet rapor', ready: 'Göndermeye hazır', edit: 'Düzenle', info: 'Test talebiniz anında işlenecektir.', submit: 'Gönder', info2: 'butonuna tıkladığınızda hesabınızı aktive etmek için WhatsApp\'a yönlendirileceksiniz.', back: 'Geri', sending: 'Gönderiliyor...', submitBtn: 'Gönder' };

  const summaryItems = [
    { label: t.device, value: selectedDevice?.name, step: 0 },
    { label: t.app, value: selectedApp?.name, step: 1 },
    { label: t.username, value: formData.username, step: 2 },
    { label: t.note, value: formData.special_note || t.noNote, step: 2 },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{t.heading}</h2>
        <p className="text-slate-400">{t.sub}</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-slate-800 bg-slate-800/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-green-500" />
            <span className="font-bold text-white uppercase tracking-widest text-sm">{t.report}</span>
          </div>
          <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">{t.ready}</span>
        </div>

        <div className="p-8 space-y-6">
          {summaryItems.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row md:items-center justify-between gap-2 group">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                <p className="text-lg font-medium text-white">{item.value}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditStep(item.step)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 h-8 gap-2 w-fit"
              >
                <Edit2 className="w-3 h-3" /> {t.edit}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-600/10 border border-green-500/20 p-6 rounded-2xl flex items-start gap-4">
        <Zap className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
        <p className="text-sm text-slate-300 leading-relaxed">
          {t.info} <strong className="text-white">{t.submitBtn}</strong> {t.info2}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button
          variant="outline"
          onClick={() => onEditStep(2)}
          className="h-14 px-8 border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl"
        >
          {t.back}
        </Button>
        <Button
          onClick={onSubmit}
          disabled={loading}
          className="h-14 px-12 bg-green-600 hover:bg-green-700 text-white font-black text-lg rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:scale-105 transition-all duration-300"
        >
          {loading ? t.sending : t.submitBtn} <Send className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TestFormSummary;