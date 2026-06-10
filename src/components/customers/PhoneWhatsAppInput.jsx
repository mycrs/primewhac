import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getDialForIso, getPhoneCountriesSorted } from '@/data/phoneCountries';
import { formatFullPhoneDisplay } from '@/utils/whatsappCustomer';
import { cn } from '@/lib/utils';

const sortedCountries = getPhoneCountriesSorted();

/**
 * @param {string} countryIso PHONE_COUNTRIES.iso (Select value benzersiz; +1 için US/CA ayrılır)
 * @param {string} nationalDigits sadece rakam (ulusal)
 */
export default function PhoneWhatsAppInput({
  countryIso,
  nationalDigits,
  onCountryIsoChange,
  onNationalDigitsChange,
  disabled = false,
  idPrefix = 'phone',
  className = '',
}) {
  const countryDial = getDialForIso(countryIso);

  const onNationalInput = (e) => {
    const v = e.target.value.replace(/\D/g, '');
    onNationalDigitsChange(v);
  };

  const preview = formatFullPhoneDisplay(countryDial, nationalDigits);

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={`${idPrefix}-national`}>Telefon / WhatsApp *</Label>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <Select value={countryIso} onValueChange={onCountryIsoChange} disabled={disabled}>
          <SelectTrigger className="w-full sm:w-[200px] shrink-0 bg-white/5 border-white/10">
            <SelectValue placeholder="Ülke" />
          </SelectTrigger>
          <SelectContent className="max-h-[280px]">
            {sortedCountries.map((c, index) => (
              <SelectItem
                key={`${c.dial}-${index}`}
                value={c.iso}
                textValue={`${c.dial} ${c.name}`}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden>{c.flag}</span>
                  <span>{c.dial}</span>
                  <span className="text-slate-500 truncate max-w-[140px]">{c.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          id={`${idPrefix}-national`}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={nationalDigits}
          onChange={onNationalInput}
          placeholder="Örn. 1634586930"
          className="flex-1 bg-white/5 border-white/10 font-mono text-sm"
          disabled={disabled}
          required
        />
      </div>
      {preview && (
        <p className="text-xs text-slate-400">
          Örnek görünüm: <span className="text-[#e50914]/90 font-mono">{preview}</span>
        </p>
      )}
    </div>
  );
}
