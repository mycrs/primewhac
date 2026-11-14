import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { MapPin, Check, Globe } from 'lucide-react';

/**
 * Yaşam bölgesi seçimi: Türkiye'de / Türkiye dışında.
 * TR ve DE sayfalarında ortak kullanılır. Zorunlu alan.
 * @param {string} value - 'in_turkey' | 'not_in_turkey' | ''
 * @param {function} onChange - (value: 'in_turkey' | 'not_in_turkey') => void
 * @param {'tr'|'de'} lang - Dil
 * @param {boolean} isTest - Test formu yeşil vurgu, satın al mor vurgu
 */
const TR = {
  label: 'Nerede yaşıyorsunuz?',
  inTurkey: "Türkiye'de yaşıyorum",
  notInTurkey: "Türkiye'de yaşamıyorum",
};

const DE = {
  label: 'Wo wohnen Sie?',
  inTurkey: 'Ich lebe in der Türkei',
  notInTurkey: 'Ich lebe nicht in der Türkei',
};

const LivingRegionSelect = ({ value, onChange, country = '', onCountryChange, lang = 'tr', isTest = true }) => {
  const t = lang === 'de' ? DE : TR;
  const accentClass = isTest
    ? 'border-green-500 shadow-[0_0_10px_-4px_rgba(34,197,94,0.5)]'
    : 'border-primary shadow-[0_0_10px_-4px_rgba(229,9,20,0.5)]';

  return (
    <div className="space-y-2 min-h-[100px]" data-living-region-select>
      <Label className="text-xs uppercase text-slate-400 font-bold tracking-wider ml-1 flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-slate-500" />
        <span>{t.label}</span>
        <span className="text-red-500">*</span>
      </Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange('in_turkey')}
          className={cn(
            'relative flex min-h-[48px] items-center gap-2 rounded-xl border-2 bg-[#0a0a0a]/80 p-2.5 text-left transition-all duration-200 sm:min-h-[52px] sm:gap-3 sm:p-4',
            value === 'in_turkey'
              ? `bg-[#0a0a0a] ${accentClass}`
              : 'border-slate-700 hover:bg-[#0a0a0a] hover:border-slate-600'
          )}
        >
          <div
            className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
              value === 'in_turkey' ? (isTest ? 'bg-green-500 border-green-500' : 'bg-primary border-primary') : 'border-slate-600'
            )}
          >
            {value === 'in_turkey' && <Check className="w-3 h-3 text-white" />}
          </div>
          <img src="https://flagcdn.com/w40/tr.png" alt="Türkiye bayrağı" aria-hidden="true" className="w-5 h-4 rounded-[2px] object-cover shrink-0" />
          <span className={cn('text-sm font-medium', value === 'in_turkey' ? 'text-white' : 'text-slate-300')}>
            {t.inTurkey}
          </span>
        </button>
        <button
          type="button"
          onClick={() => onChange('not_in_turkey')}
          className={cn(
            'relative flex min-h-[48px] items-center gap-2 rounded-xl border-2 bg-[#0a0a0a]/80 p-2.5 text-left transition-all duration-200 sm:min-h-[52px] sm:gap-3 sm:p-4',
            value === 'not_in_turkey'
              ? `bg-[#0a0a0a] ${accentClass}`
              : 'border-slate-700 hover:bg-[#0a0a0a] hover:border-slate-600'
          )}
        >
          <div
            className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
              value === 'not_in_turkey' ? (isTest ? 'bg-green-500 border-green-500' : 'bg-primary border-primary') : 'border-slate-600'
            )}
          >
            {value === 'not_in_turkey' && <Check className="w-3 h-3 text-white" />}
          </div>
          <img src="https://flagcdn.com/w40/eu.png" alt="Avrupa Birliği bayrağı" aria-hidden="true" className="w-5 h-4 rounded-[2px] object-cover shrink-0" />
          <Globe className="w-4 h-4 text-blue-400 shrink-0 -ml-1.5" />
          <span className={cn('text-sm font-medium', value === 'not_in_turkey' ? 'text-white' : 'text-slate-300')}>
            {t.notInTurkey}
          </span>
        </button>
      </div>
      {value === 'not_in_turkey' && onCountryChange && (
        <div className="space-y-1.5 pt-1">
          <Label htmlFor="living-country" className="text-xs font-semibold text-slate-300">
            {lang === 'de' ? 'In welchem Land leben Sie?' : 'Hangi ülkede yaşıyorsunuz?'} <span className="text-red-500">*</span>
          </Label>
          <Input id="living-country" value={country} onChange={(event) => onCountryChange(event.target.value)} maxLength={80} autoComplete="country-name" placeholder={lang === 'de' ? 'z. B. Deutschland' : 'Örn. Almanya'} className="h-11 border-slate-700 bg-[#0a0a0a] text-base text-white" />
        </div>
      )}
    </div>
  );
};

export default LivingRegionSelect;

/** WhatsApp mesajına eklenecek satırı döndürür (TR/DE). */
export const isLivingRegionComplete = (value, country) => Boolean(value && (value !== 'not_in_turkey' || country?.trim()));

export const getLivingRegionWhatsAppLine = (value, lang, country = '') => {
  if (!value || (value !== 'in_turkey' && value !== 'not_in_turkey')) return '';
  if (lang === 'de') {
    return value === 'in_turkey'
      ? 'Wohnortinfo: Ich lebe in der Türkei.'
      : `Wohnortinfo: ${country.trim() || 'Außerhalb der Türkei'}.`;
  }
  return value === 'in_turkey'
    ? "Yaşam bilgim: Türkiye'de yaşıyorum."
    : `Yaşadığım ülke: ${country.trim() || "Türkiye dışında"}.`;
};
