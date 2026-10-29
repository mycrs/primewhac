import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import PhoneWhatsAppInput from '@/components/customers/PhoneWhatsAppInput';
import { getDialForIso, preferredIsoForDial } from '@/data/phoneCountries';
import { toast } from '@/components/ui/use-toast';
import MathCaptcha from '@/components/MathCaptcha';
import {
  formatTrDate,
  adminModAStartPackage,
  adminModBRemainingPackage,
  publicOptionA,
  publicOptionB,
  remainingCalendarDaysUntilEnd,
  parseYmd,
} from '@/utils/customerDates';

const STATUS_OPTIONS = [
  { value: 'beklemede', label: 'Beklemede' },
  { value: 'aktif', label: 'Aktif' },
  { value: 'iptal', label: 'İptal' },
];

const CURRENCY_OPTIONS = [
  { value: 'TRY', label: '₺ TRY' },
  { value: 'EUR', label: '€ EUR' },
  { value: 'GBP', label: '£ GBP' },
];

/** Süre satırı seçilen paket grubuna ait mi? (group_id + yaygın veri tutarsızlığı için group_name) */
function durationMatchesPackageGroup(d, packageTypeId, packageTypeName) {
  if (!packageTypeId || !d) return false;
  const gid = d.group_id != null ? String(d.group_id) : '';
  const pid = String(packageTypeId);
  const gidMatch = gid === pid;
  const tName = String(packageTypeName || '')
    .trim()
    .toLowerCase();
  const rowName = String(d.group_name || '')
    .trim()
    .toLowerCase();
  const nameMatch = tName.length > 0 && rowName === tName;
  return gidMatch || nameMatch;
}

function derivePhoneFromCustomer(c) {
  if (!c) return { country: '+90', national: '', iso: 'TR' };
  if (c.country_code) {
    const national = String(c.whatsapp || '').replace(/\D/g, '');
    return {
      country: c.country_code,
      national,
      iso: preferredIsoForDial(c.country_code),
    };
  }
  const d = String(c.whatsapp || '').replace(/\D/g, '');
  if (d.startsWith('90') && d.length >= 12) return { country: '+90', national: d.slice(2), iso: 'TR' };
  if (d.startsWith('49') && d.length >= 11) return { country: '+49', national: d.slice(2), iso: 'DE' };
  if (d.startsWith('0') && d.length >= 10) return { country: '+90', national: d.slice(1), iso: 'TR' };
  return { country: '+90', national: d, iso: 'TR' };
}

function DateModeRadios({ value, onChange, labels, name = 'dateMode' }) {
  return (
    <div className="space-y-2" role="radiogroup" aria-label="Tarih seçeneği">
      {labels.map((opt) => (
        <label
          key={opt.id}
          className={cn(
            'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors',
            value === opt.id ? 'border-primary/60 bg-primary/10' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]',
          )}
        >
          <input
            type="radio"
            name={name}
            checked={value === opt.id}
            onChange={() => onChange(opt.id)}
            className="mt-1"
          />
          <div>
            <span className="font-medium text-white">{opt.title}</span>
            <p className="text-sm text-slate-400">{opt.desc}</p>
          </div>
        </label>
      ))}
    </div>
  );
}

function LivePreview({ startYmd, endYmd }) {
  const rem =
    endYmd && parseYmd(endYmd) ? remainingCalendarDaysUntilEnd(endYmd) : null;
  return (
    <div className="rounded-xl border border-[#e50914]/20 bg-[#e50914]/5 p-4 text-sm text-slate-200">
      <p>
        <span className="text-slate-400">Başlangıç:</span>{' '}
        <strong>{formatTrDate(startYmd)}</strong>
      </p>
      <p className="mt-1">
        <span className="text-slate-400">Bitiş:</span>{' '}
        <strong>{formatTrDate(endYmd)}</strong>
      </p>
      <p className="mt-1">
        <span className="text-slate-400">Kalan:</span>{' '}
        <strong>{rem == null ? '—' : `${rem} gün`}</strong>
      </p>
    </div>
  );
}

/**
 * @param {'public' | 'admin'} variant
 * @param {boolean} [hideFullName] — public: İsim alanını gösterme; kayıtta full_name = kullanıcı adı (veya —).
 * @param {string} [serverError] — üst bileşenden gelen hata (matematik doğrulamayı yenilemek için)
 * @param {boolean} [visualAccent] — müşteri kayıt sayfası: input glow + gradient gönder
 * @param {Array<{id:string,name:string,is_active?:boolean}>} packageTypes
 * @param {Array<{id:string,name:string,days:number,price?:number,is_active?:boolean,group_id?:string|null}>} durations — customer_packages
 */
export default function CustomerForm({
  variant = 'public',
  hideFullName = false,
  packageTypes = [],
  durations = [],
  initialCustomer = null,
  onSubmit,
  submitting = false,
  serverError = '',
  className = '',
  visualAccent = false,
}) {
  const isAdmin = variant === 'admin';
  const fieldSurface = isAdmin
    ? 'bg-white/5 border-white/10'
    : visualAccent
      ? 'rounded-xl border-white/20 bg-black/35 text-white shadow-sm transition-[box-shadow,border-color] duration-300 focus-visible:border-primary/55 focus-visible:shadow-[0_0_22px_rgba(229, 9, 20,0.28)] focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-0'
      : 'bg-white/5 border-white/10';
  const [mathCaptcha, setMathCaptcha] = useState(null);
  const [captchaRefresh, setCaptchaRefresh] = useState(0);

  const resetMathCaptcha = useCallback(() => {
    setMathCaptcha(null);
    setCaptchaRefresh((s) => s + 1);
  }, []);

  useEffect(() => {
    if (isAdmin || !serverError) return;
    resetMathCaptcha();
  }, [serverError, isAdmin, resetMathCaptcha]);

  const [full_name, setFullName] = useState(initialCustomer?.full_name || '');
  const [phoneCountryIso, setPhoneCountryIso] = useState('TR');
  const [nationalDigits, setNationalDigits] = useState('');
  const countryDial = useMemo(() => getDialForIso(phoneCountryIso), [phoneCountryIso]);
  const [username, setUsername] = useState(initialCustomer?.username || '');
  const [packageTypeId, setPackageTypeId] = useState(initialCustomer?.package_type_id || '');
  const [durationId, setDurationId] = useState(initialCustomer?.package_id || '');
  const [pricePaid, setPricePaid] = useState(
    initialCustomer?.package_price != null ? String(initialCustomer.package_price) : '',
  );
  const [currency, setCurrency] = useState(initialCustomer?.currency || 'TRY');
  const [status, setStatus] = useState(initialCustomer?.status || 'beklemede');
  const [notes, setNotes] = useState(initialCustomer?.notes || '');
  const [iptvPassword, setIptvPassword] = useState(() => {
    const c = initialCustomer;
    if (!c) return '';
    const col = c.iptv_password != null && String(c.iptv_password).trim() ? String(c.iptv_password).trim() : '';
    const legacy = c.notes?.match?.(/şifre:\s*(.+)/i)?.[1]?.trim() || '';
    return col || legacy;
  });

  const [dateMode, setDateMode] = useState(() => {
    if (!initialCustomer) return isAdmin ? 'A' : 'A';
    if (initialCustomer.start_date && initialCustomer.end_date && isAdmin) return 'C';
    if (initialCustomer.start_date && !initialCustomer.end_date) return 'A';
    return 'C';
  });

  const [startYmd, setStartYmd] = useState(
    initialCustomer?.start_date
      ? String(initialCustomer.start_date).slice(0, 10)
      : '',
  );
  const [endYmd, setEndYmd] = useState(
    initialCustomer?.end_date ? String(initialCustomer.end_date).slice(0, 10) : '',
  );
  const [remainingInput, setRemainingInput] = useState(
    initialCustomer?.remaining_days != null ? String(initialCustomer.remaining_days) : '',
  );

  useEffect(() => {
    if (!initialCustomer) {
      setPhoneCountryIso('TR');
      setNationalDigits('');
      setIptvPassword('');
      return;
    }
    setFullName(initialCustomer.full_name || '');
    const ph = derivePhoneFromCustomer(initialCustomer);
    setPhoneCountryIso(ph.iso);
    setNationalDigits(ph.national);
    setUsername(initialCustomer.username || '');
    setPackageTypeId(initialCustomer.package_type_id || '');
    setDurationId(initialCustomer.package_id || '');
    setPricePaid(
      initialCustomer.package_price != null ? String(initialCustomer.package_price) : '',
    );
    setCurrency(initialCustomer.currency || 'TRY');
    setStatus(initialCustomer.status || 'beklemede');
    setNotes(initialCustomer.notes || '');
    const col =
      initialCustomer.iptv_password != null && String(initialCustomer.iptv_password).trim()
        ? String(initialCustomer.iptv_password).trim()
        : '';
    const legacyPw = initialCustomer.notes?.match?.(/şifre:\s*(.+)/i)?.[1]?.trim() || '';
    setIptvPassword(col || legacyPw);
    setStartYmd(initialCustomer.start_date ? String(initialCustomer.start_date).slice(0, 10) : '');
    setEndYmd(initialCustomer.end_date ? String(initialCustomer.end_date).slice(0, 10) : '');
    setRemainingInput(
      initialCustomer.remaining_days != null ? String(initialCustomer.remaining_days) : '',
    );
    if (isAdmin) {
      const sd = initialCustomer.start_date ? String(initialCustomer.start_date).slice(0, 10) : '';
      const ed = initialCustomer.end_date ? String(initialCustomer.end_date).slice(0, 10) : '';
      if (sd && ed) setDateMode('C');
      else if (sd) setDateMode('A');
      else if (initialCustomer.remaining_days != null && !ed) setDateMode('B');
      else setDateMode('C');
    }
  }, [initialCustomer, isAdmin]);

  const selectedType = useMemo(
    () => packageTypes.find((p) => p.id === packageTypeId) || null,
    [packageTypes, packageTypeId],
  );

  const durationsForGroup = useMemo(() => {
    if (!packageTypeId) return [];
    const typeName = selectedType?.name ?? '';
    const seen = new Set();
    const list = [];
    for (const d of durations) {
      if (!isAdmin && d.is_active === false) continue;
      if (!durationMatchesPackageGroup(d, packageTypeId, typeName)) continue;
      if (seen.has(d.id)) continue;
      seen.add(d.id);
      list.push(d);
    }
    list.sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));
    let base = list;
    if (isAdmin && durationId) {
      const cur = durations.find((d) => d.id === durationId);
      if (cur && !base.some((d) => d.id === cur.id)) base = [...base, cur];
    }
    return base;
  }, [durations, packageTypeId, selectedType?.name, isAdmin, durationId]);

  useEffect(() => {
    if (!packageTypeId) {
      setDurationId('');
      return;
    }
    const typeName = selectedType?.name ?? '';
    setDurationId((prev) => {
      if (!prev) return prev;
      const row = durations.find((d) => d.id === prev);
      if (!row) return '';
      if (!isAdmin && row.is_active === false) return '';
      const still = durationMatchesPackageGroup(row, packageTypeId, typeName);
      return still ? prev : '';
    });
  }, [packageTypeId, durations, isAdmin, selectedType?.name]);

  /** Yeni müşteri kaydı (public): ilk paket + süre otomatik */
  useEffect(() => {
    if (isAdmin || initialCustomer) return;
    if (packageTypeId) return;
    const firstId = packageTypes[0]?.id;
    if (firstId) setPackageTypeId(firstId);
  }, [isAdmin, initialCustomer, packageTypes, packageTypeId]);

  useEffect(() => {
    if (isAdmin || initialCustomer) return;
    if (!packageTypeId) return;
    if (durationId && durationsForGroup.some((d) => d.id === durationId)) return;
    const first = durationsForGroup[0];
    if (first) setDurationId(first.id);
  }, [isAdmin, initialCustomer, packageTypeId, durationId, durationsForGroup]);

  const selectedDur = useMemo(
    () => durationsForGroup.find((p) => p.id === durationId) || durations.find((p) => p.id === durationId) || null,
    [durationsForGroup, durations, durationId],
  );

  const packageDays = selectedDur ? Number(selectedDur.days) : 0;

  const compositePackageName = useMemo(() => {
    if (!selectedType || !selectedDur) return '';
    return `${selectedType.name} — ${selectedDur.name}`;
  }, [selectedType, selectedDur]);

  const preview = useMemo(() => {
    if (!selectedDur) {
      return { start_date: null, end_date: null, remaining_days: null };
    }
    if (dateMode === 'C' && isAdmin) {
      const rem = endYmd ? remainingCalendarDaysUntilEnd(endYmd) : null;
      return {
        start_date: startYmd || null,
        end_date: endYmd || null,
        remaining_days: rem,
      };
    }
    if (dateMode === 'A') {
      if (!startYmd) return { start_date: null, end_date: null, remaining_days: null };
      return isAdmin
        ? adminModAStartPackage(startYmd, packageDays)
        : publicOptionA(startYmd, packageDays);
    }
    if (dateMode === 'B') {
      const r = parseInt(remainingInput, 10);
      if (Number.isNaN(r) || r < 0) return { start_date: null, end_date: null, remaining_days: null };
      return isAdmin
        ? adminModBRemainingPackage(r, packageDays)
        : publicOptionB(r, packageDays);
    }
    if (dateMode === 'C' && !isAdmin) {
      return { start_date: null, end_date: null, remaining_days: null };
    }
    return { start_date: null, end_date: null, remaining_days: null };
  }, [dateMode, startYmd, endYmd, remainingInput, packageDays, selectedDur, isAdmin]);

  const publicLabels = [
    {
      id: 'A',
      title: 'Başlangıç tarihimi biliyorum',
      desc: 'Takvimden başlangıç seçin; bitiş otomatik hesaplanır.',
    },
    {
      id: 'B',
      title: 'Kaç gün kaldığını biliyorum',
      desc: 'Kalan günü yazın; bitiş bugünden itibaren hesaplanır.',
    },
    {
      id: 'C',
      title: 'Tarih bilmiyorum',
      desc: 'Boş bırakılır; yönetici belirleyecek.',
    },
  ];

  const adminLabels = [
    {
      id: 'A',
      title: 'MOD A — Başlangıç tarihi',
      desc: 'Bitiş = başlangıç + paket süresi (gün).',
    },
    {
      id: 'B',
      title: 'MOD B — Kalan gün',
      desc: 'Bitiş = bugün + kalan gün; başlangıç = bitiş − paket süresi.',
    },
    {
      id: 'C',
      title: 'MOD C — Manuel',
      desc: 'Başlangıç ve bitişi elle girin.',
    },
  ];

  const priceNum = parseFloat(String(pricePaid).replace(',', '.'));
  const priceValid = !Number.isNaN(priceNum) && priceNum >= 0 && String(pricePaid).trim() !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!packageTypeId || !durationId || !selectedType || !selectedDur) return;
    if (!nationalDigits.replace(/\D/g, '')) return;
    if (!priceValid) return;

    if (!isAdmin) {
      if (!mathCaptcha?.id || !String(mathCaptcha?.answer ?? '').trim()) {
        toast({
          variant: 'destructive',
          title: 'Güvenlik doğrulaması gerekli',
          description: 'Lütfen Gönder’den önce güvenlik sorusunu yanıtlayın.',
        });
        return;
      }
    }

    const { start_date, end_date, remaining_days } = preview;

    const payload = {
      full_name: hideFullName ? (username.trim() || '—') : full_name.trim(),
      whatsapp: nationalDigits.replace(/\D/g, ''),
      country_code: countryDial,
      username: username.trim(),
      package_id: durationId,
      package_type_id: packageTypeId,
      package_type_name: selectedType.name,
      package_name: compositePackageName,
      package_days: packageDays,
      package_price: priceNum,
      currency,
      start_date: start_date || null,
      end_date: end_date || null,
      remaining_days:
        remaining_days != null && !Number.isNaN(remaining_days) ? remaining_days : null,
      notes: isAdmin ? (notes || null) : null,
    };

    if (isAdmin) {
      payload.status = status;
      payload.iptv_password = iptvPassword.trim() || null;
    } else {
      payload.mathCaptchaId = mathCaptcha.id;
      payload.mathCaptchaAnswer = String(mathCaptcha.answer).trim();
    }

    await onSubmit(payload);
  };

  const publicSummary =
    !isAdmin && dateMode === 'A' && preview.end_date ? (
      <p className="rounded-lg bg-white/5 p-3 text-sm text-slate-300">
        Aboneliğiniz <strong>{formatTrDate(preview.start_date)}</strong> tarihinde başladı,{' '}
        <strong>{formatTrDate(preview.end_date)}</strong> tarihinde sona erecek.
      </p>
    ) : !isAdmin && dateMode === 'B' && preview.end_date ? (
      <p className="rounded-lg bg-white/5 p-3 text-sm text-slate-300">
        Aboneliğiniz <strong>{formatTrDate(preview.end_date)}</strong> tarihinde sona erecek.
      </p>
    ) : null;

  /** Public: güvenlik sorusu (id + cevap) dolmadan gönderim kapalı */
  const captchaOk =
    isAdmin || !!(mathCaptcha?.id && String(mathCaptcha?.answer ?? '').trim().length > 0);
  const canSubmit =
    packageTypeId &&
    durationId &&
    selectedType &&
    selectedDur &&
    nationalDigits.replace(/\D/g, '').length > 0 &&
    priceValid &&
    captchaOk;

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        {!hideFullName && (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cf-name">İsim *</Label>
            <Input
              id="cf-name"
              value={full_name}
              onChange={(e) => setFullName(e.target.value)}
              required
              className={fieldSurface}
              disabled={submitting}
            />
          </div>
        )}
        <div className="space-y-2 sm:col-span-2">
          <PhoneWhatsAppInput
            countryIso={phoneCountryIso}
            nationalDigits={nationalDigits}
            onCountryIsoChange={setPhoneCountryIso}
            onNationalDigitsChange={setNationalDigits}
            disabled={submitting}
            idPrefix="cf-wa"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="cf-user">Kullanıcı adı *</Label>
          <Input
            id="cf-user"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={fieldSurface}
            disabled={submitting}
          />
        </div>
      </div>

      <div
        className={cn(
          'space-y-4 rounded-xl border p-4',
          !isAdmin && visualAccent
            ? 'border-primary/20 bg-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
            : 'border-white/10 bg-white/[0.02]',
        )}
      >
        <p className="text-sm font-semibold text-white">1. Paket grubu *</p>
        <Select value={packageTypeId} onValueChange={setPackageTypeId} disabled={submitting}>
          <SelectTrigger className={fieldSurface}>
            <SelectValue placeholder="Örn. QruzeTV" />
          </SelectTrigger>
          <SelectContent>
            {packageTypes.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
                {p.is_active === false ? ' (pasif)' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-sm font-semibold text-white pt-2">2. Süre (seçilen gruba ait) *</p>
        <Select
          value={durationId}
          onValueChange={setDurationId}
          disabled={submitting || !packageTypeId || durationsForGroup.length === 0}
        >
          <SelectTrigger className={fieldSurface}>
            <SelectValue placeholder={packageTypeId ? 'Süre seçin' : 'Önce grup seçin'} />
          </SelectTrigger>
          <SelectContent>
            {durationsForGroup.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name} ({p.days} gün)
                {p.is_active === false ? ' (pasif)' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {packageTypeId && durationsForGroup.length === 0 && (
          <p className="text-xs text-amber-400">
            Bu gruba bağlı süre yok. Admin panelinden süre ekleyip &quot;Paket grubu&quot; atayın.
          </p>
        )}

        {compositePackageName && (
          <p className="text-xs text-slate-400">
            Birleşik paket adı: <span className="text-[#e50914]/90 font-medium">{compositePackageName}</span>
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cf-price-paid">Ödediğiniz tutar *</Label>
          <Input
            id="cf-price-paid"
            type="text"
            inputMode="decimal"
            value={pricePaid}
            onChange={(e) => setPricePaid(e.target.value)}
            placeholder="0"
            className={fieldSurface}
            disabled={submitting}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Para birimi *</Label>
          <Select value={currency} onValueChange={setCurrency} disabled={submitting}>
            <SelectTrigger className={fieldSurface}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCY_OPTIONS.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isAdmin && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Durum</Label>
            <Select value={status} onValueChange={setStatus} disabled={submitting}>
              <SelectTrigger className={fieldSurface}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cf-iptv-pw">IPTV şifresi</Label>
            <Input
              id="cf-iptv-pw"
              type="text"
              autoComplete="off"
              value={iptvPassword}
              onChange={(e) => setIptvPassword(e.target.value)}
              placeholder="Müşteri IPTV şifresi"
              className={cn(fieldSurface, 'font-mono')}
              disabled={submitting}
            />
            <p className="text-xs text-slate-500">
              Müşteri portalında kaydedilen şifre burada görünür; ana kaydet ile birlikte güncellenir.
            </p>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cf-notes">Notlar</Label>
            <Textarea
              id="cf-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={fieldSurface}
              disabled={submitting}
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Label className="text-base">Tarih</Label>
        <DateModeRadios
          value={dateMode}
          onChange={setDateMode}
          labels={isAdmin ? adminLabels : publicLabels}
          name={isAdmin ? 'adminDateMode' : 'publicDateMode'}
        />
      </div>

      {dateMode === 'A' && (
        <div className="space-y-2">
          <Label htmlFor="cf-start">Başlangıç tarihi</Label>
          <Input
            id="cf-start"
            type="date"
            value={startYmd}
            onChange={(e) => setStartYmd(e.target.value)}
            required={dateMode === 'A'}
            className={fieldSurface}
            disabled={submitting}
          />
        </div>
      )}

      {dateMode === 'B' && (
        <div className="space-y-2">
          <Label htmlFor="cf-rem">Kalan gün</Label>
          <Input
            id="cf-rem"
            type="number"
            min="0"
            value={remainingInput}
            onChange={(e) => setRemainingInput(e.target.value)}
            required={dateMode === 'B'}
            placeholder="örn. 138"
            className={fieldSurface}
            disabled={submitting}
          />
        </div>
      )}

      {isAdmin && dateMode === 'C' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cf-man-start">Başlangıç</Label>
            <Input
              id="cf-man-start"
              type="date"
              value={startYmd}
              onChange={(e) => setStartYmd(e.target.value)}
              className={fieldSurface}
              disabled={submitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cf-man-end">Bitiş</Label>
            <Input
              id="cf-man-end"
              type="date"
              value={endYmd}
              onChange={(e) => setEndYmd(e.target.value)}
              className={fieldSurface}
              disabled={submitting}
            />
          </div>
        </div>
      )}

      {isAdmin && <LivePreview startYmd={preview.start_date} endYmd={preview.end_date} />}

      {publicSummary}

      {!isAdmin && (
        <MathCaptcha onChange={setMathCaptcha} refreshSignal={captchaRefresh} disabled={submitting} />
      )}

      <Button
        type="submit"
        disabled={submitting || !canSubmit}
        className={cn(
          'w-full sm:w-auto',
          !isAdmin && visualAccent
            ? 'rounded-xl bg-gradient-to-r from-[#e50914] via-[#e50914] to-amber-600/95 px-8 py-6 text-base font-semibold text-white shadow-lg shadow-primary/45 transition-all duration-300 hover:scale-[1.02] hover:brightness-110 hover:shadow-primary/35 disabled:hover:scale-100 disabled:opacity-60'
            : 'bg-primary hover:bg-primary',
        )}
      >
        {submitting ? 'Kaydediliyor…' : isAdmin ? 'Kaydet' : 'Gönder'}
      </Button>
    </form>
  );
}
