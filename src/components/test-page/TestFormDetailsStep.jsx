import React, { useEffect, useState } from 'react';
import { User, MessageSquare, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from 'react-router-dom';

const TestFormDetailsStep = ({ formData, onChange, setIsValid }) => {
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const isDe = location.pathname.includes('/de');

  useEffect(() => {
    const isNameValid = formData.username?.trim().length >= 3;
    setIsValid(isNameValid);
  }, [formData, setIsValid]);

  const titles = isDe
    ? { heading: 'Benutzerdetails', sub: 'Geben Sie Ihre Informationen ein, um Ihren Test-Account zu personalisieren.', username: 'Benutzername', usernamePlaceholder: 'Ihr Name oder Pseudonym', minChars: 'Mindestens 3 Zeichen erforderlich', note: 'Beschreibung (Optional)', notePlaceholder: 'Besondere Wünsche oder Fragen...', hint: 'Bitte füllen Sie alle Felder aus, um fortzufahren.' }
    : { heading: 'Kullanıcı bilgileri', sub: 'Test hesabınızı kişiselleştirmek için bilgilerinizi girin.', username: 'Kullanıcı adı', usernamePlaceholder: 'Adınız veya takma adınız', minChars: 'En az 3 karakter gerekli', note: 'Not (İsteğe bağlı)', notePlaceholder: 'Özel istek veya sorularınız...', hint: 'Devam etmek için alanları doldurun.' };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{titles.heading}</h2>
        <p className="text-slate-400">{titles.sub}</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl space-y-6 backdrop-blur-sm">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-slate-300 font-bold flex items-center gap-2">
            <User className="w-4 h-4 text-green-500" />
            {titles.username} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="username"
            placeholder={titles.usernamePlaceholder}
            value={formData.username}
            onChange={(e) => onChange('username', e.target.value)}
            className="bg-slate-950 border-slate-800 text-white h-12 focus:ring-green-500/20 focus:border-green-500"
          />
          {formData.username && formData.username.trim().length < 3 && (
            <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" /> {titles.minChars}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="special_note" className="text-slate-300 font-bold flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-green-500" />
            {titles.note}
          </Label>
          <Textarea
            id="special_note"
            placeholder={titles.notePlaceholder}
            value={formData.special_note}
            onChange={(e) => onChange('special_note', e.target.value)}
            className="bg-slate-950 border-slate-800 text-white min-h-[120px] focus:ring-green-500/20 focus:border-green-500 resize-none"
          />
        </div>

        <div className="pt-2 text-center">
          <p className="text-xs text-slate-500 italic">{titles.hint}</p>
        </div>
      </div>
    </div>
  );
};

export default TestFormDetailsStep;