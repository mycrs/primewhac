import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import CustomerForm from '@/components/customers/CustomerForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MessageCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { addDaysYmd, remainingCalendarDaysUntilEnd, formatTrDate } from '@/utils/customerDates';
import { normalizeExternalPanelHref } from '@/utils/portalUrls';
import {
  whatsappHrefForCustomer,
  renewalReminderMessage,
  portalCodeWhatsAppMessage,
} from '@/utils/whatsappCustomer';
import { adminPath } from '@/constants/adminRoutes';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { fetchAdminCustomer } from '@/utils/adminCustomersApi';

/** Müşteri detay ekranı PIN'i (oturum: sessionStorage, sekme kapanınca sıfırlanır) */
const CUSTOMER_DETAIL_PIN = '351672';
const SS_PIN_UNLOCKED = 'qruzetv_customer_detail_pin_ok';
const SS_PIN_LOCK_UNTIL = 'qruzetv_customer_detail_pin_lock_until';
const SS_PIN_FAILS = 'qruzetv_customer_detail_pin_fails';
const PIN_LOCK_MS = 60_000;
const PIN_MAX_FAILS = 3;

function readSessionPinUnlocked() {
  try {
    return sessionStorage.getItem(SS_PIN_UNLOCKED) === '1';
  } catch {
    return false;
  }
}

function readSessionLockUntil() {
  try {
    const v = sessionStorage.getItem(SS_PIN_LOCK_UNTIL);
    if (!v) return 0;
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

export default function CustomerDetailPage() {
  const { id } = useParams();
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isNew = id === 'new';
  const needsDetailPin = !isNew;

  const [pinUnlocked, setPinUnlocked] = useState(() => !needsDetailPin || readSessionPinUnlocked());
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [lockUntil, setLockUntil] = useState(() => {
    const until = readSessionLockUntil();
    return until > Date.now() ? until : 0;
  });
  const [lockTick, setLockTick] = useState(() => Date.now());

  const [customer, setCustomer] = useState(null);
  const [durations, setDurations] = useState([]);
  const [packageTypes, setPackageTypes] = useState([]);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    setCustomer(null);
    setLoading(!isNew);
  }, [id, isNew]);

  const [submitting, setSubmitting] = useState(false);
  const [renewOpen, setRenewOpen] = useState(false);
  const [renewPkgId, setRenewPkgId] = useState('');
  const [renewing, setRenewing] = useState(false);
  const renewFromQueryDone = useRef(false);

  useEffect(() => {
    renewFromQueryDone.current = false;
  }, [id]);

  const loadMeta = useCallback(async () => {
    const [dRes, tRes] = await Promise.all([
      supabase
        .from('customer_packages')
        .select('id,name,days,price,is_active,sort_order,group_id,group_name')
        .order('sort_order', { ascending: true }),
      supabase
        .from('package_types')
        .select('id,name,is_active,sort_order,customer_panel_url,server_url')
        .order('sort_order', { ascending: true }),
    ]);
    setDurations(dRes.data || []);
    setPackageTypes(tRes.data || []);
  }, []);

  const loadCustomer = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    const token = session?.access_token;
    if (token) {
      const { customer: fromApi, httpStatus } = await fetchAdminCustomer(token, id);
      if (fromApi) {
        setCustomer(fromApi);
        setLoading(false);
        return;
      }
      // 404: API projede satır yok — sunucu .env farklı Supabase’e bakıyor olabilir; RLS ile istemci yedeği dene
      if (import.meta.env.DEV && httpStatus === 404) {
        console.warn(
          '[CustomerDetail] GET /api/admin/customers/:id → 404. Lista tarayıcıdan geliyorsa sunucuda SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY ile VITE_SUPABASE_URL aynı projeyi işaret etmeli.',
        );
      }
    }
    const { data, error } = await supabase.from('customers').select('*').eq('id', id).maybeSingle();
    if (error || !data) {
      setLoading(false);
      toast({ variant: 'destructive', title: 'Kayıt bulunamadı' });
      navigate(adminPath('customers'));
      return;
    }
    setCustomer(data);
    setLoading(false);
  }, [id, isNew, navigate, session?.access_token]);

  useEffect(() => {
    loadMeta();
  }, [loadMeta]);

  useEffect(() => {
    if (!lockUntil || Date.now() >= lockUntil) return undefined;
    const t = setInterval(() => setLockTick(Date.now()), 1000);
    return () => clearInterval(t);
  }, [lockUntil]);

  useEffect(() => {
    if (!lockUntil) return;
    if (lockTick < lockUntil) return;
    try {
      sessionStorage.removeItem(SS_PIN_LOCK_UNTIL);
    } catch {
      /* ignore */
    }
    setLockUntil(0);
    setPinError('');
  }, [lockTick, lockUntil]);

  useEffect(() => {
    if (isNew || authLoading || !pinUnlocked) return;
    loadCustomer();
  }, [isNew, authLoading, pinUnlocked, loadCustomer]);

  const submitDetailPin = useCallback(() => {
    const until = readSessionLockUntil();
    const activeLock = until > Date.now() ? until : lockUntil;
    if (activeLock > Date.now()) {
      setPinError('Çok fazla hatalı deneme. Bekleyin…');
      return;
    }
    const raw = String(pinInput || '').replace(/\D/g, '');
    if (raw.length < 4 || raw.length > 6) {
      setPinError('PIN 4–6 hane olmalıdır.');
      return;
    }
    if (raw === CUSTOMER_DETAIL_PIN) {
      try {
        sessionStorage.setItem(SS_PIN_UNLOCKED, '1');
        sessionStorage.removeItem(SS_PIN_FAILS);
        sessionStorage.removeItem(SS_PIN_LOCK_UNTIL);
      } catch {
        /* ignore */
      }
      setLockUntil(0);
      setPinUnlocked(true);
      setPinError('');
      setPinInput('');
      return;
    }
    let fails = 0;
    try {
      fails = parseInt(sessionStorage.getItem(SS_PIN_FAILS) || '0', 10) || 0;
    } catch {
      fails = 0;
    }
    fails += 1;
    if (fails >= PIN_MAX_FAILS) {
      const nextUntil = Date.now() + PIN_LOCK_MS;
      try {
        sessionStorage.setItem(SS_PIN_LOCK_UNTIL, String(nextUntil));
        sessionStorage.removeItem(SS_PIN_FAILS);
      } catch {
        /* ignore */
      }
      setLockUntil(nextUntil);
      setPinError('Çok fazla hatalı deneme. 60 saniye sonra tekrar deneyin.');
    } else {
      try {
        sessionStorage.setItem(SS_PIN_FAILS, String(fails));
      } catch {
        /* ignore */
      }
      setPinError(`Hatalı PIN. (${fails}/${PIN_MAX_FAILS})`);
    }
    setPinInput('');
  }, [pinInput, lockUntil]);

  const lockSecondsLeft =
    lockUntil > Date.now() ? Math.max(0, Math.ceil((lockUntil - lockTick) / 1000)) : 0;
  const pinModalOpen = needsDetailPin && !pinUnlocked;

  useEffect(() => {
    if (isNew || !customer || renewFromQueryDone.current) return;
    if (searchParams.get('renew') !== '1') return;
    renewFromQueryDone.current = true;
    setRenewPkgId(customer.package_id || '');
    setRenewOpen(true);
    const next = new URLSearchParams(searchParams);
    next.delete('renew');
    setSearchParams(next, { replace: true });
  }, [isNew, customer, searchParams, setSearchParams]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    if (isNew) {
      const { data, error } = await supabase.from('customers').insert(payload).select('id').single();
      setSubmitting(false);
      if (error) {
        if (error.code === '23505') {
          toast({ variant: 'destructive', title: 'Bu kullanıcı adı zaten kayıtlı' });
        } else {
          toast({ variant: 'destructive', title: 'Kaydedilemedi', description: error.message });
        }
        return;
      }
      toast({ title: 'Müşteri oluşturuldu' });
      navigate(`${adminPath('customers')}/${data.id}`, { replace: true });
      return;
    }
    const { error } = await supabase.from('customers').update(payload).eq('id', id);
    setSubmitting(false);
    if (error) {
      toast({ variant: 'destructive', title: 'Güncellenemedi', description: error.message });
      return;
    }
    toast({ title: 'Kayıt güncellendi' });
    loadCustomer();
  };

  const doRenew = async () => {
    if (!customer?.end_date || !renewPkgId) {
      toast({ variant: 'destructive', title: 'Bitiş tarihi veya süre eksik' });
      return;
    }
    const pkg = durations.find((p) => p.id === renewPkgId);
    if (!pkg) return;
    const oldEnd = String(customer.end_date).slice(0, 10);
    const newStart = oldEnd;
    const newEnd = addDaysYmd(oldEnd, pkg.days);
    if (!newEnd) {
      toast({ variant: 'destructive', title: 'Tarih hesaplanamadı' });
      return;
    }
    const grpId = pkg.group_id || customer.package_type_id || null;
    const typeRow = grpId ? packageTypes.find((t) => t.id === grpId) : null;
    const typeName = typeRow?.name || customer.package_type_name || '';
    const newName = typeName ? `${typeName} — ${pkg.name}` : pkg.name;

    setRenewing(true);
    const rem = remainingCalendarDaysUntilEnd(newEnd);
    const patch = {
      package_id: pkg.id,
      package_name: newName,
      package_days: pkg.days,
      package_price: pkg.price,
      start_date: newStart,
      end_date: newEnd,
      remaining_days: rem,
      status: 'aktif',
    };
    if (grpId) {
      patch.package_type_id = grpId;
      if (typeRow?.name) patch.package_type_name = typeRow.name;
    }
    const { error } = await supabase.from('customers').update(patch).eq('id', id);
    setRenewing(false);
    if (error) {
      toast({ variant: 'destructive', title: 'Yenileme başarısız', description: error.message });
      return;
    }
    toast({ title: 'Paket yenilendi' });
    setRenewOpen(false);
    loadCustomer();
  };

  const waText = customer
    ? renewalReminderMessage(customer.full_name, customer.package_name, formatTrDate(customer.end_date))
    : '';
  const waLink = customer ? whatsappHrefForCustomer(customer, waText) : '#';
  const portalWaText = customer ? portalCodeWhatsAppMessage(customer.portal_code) : '';
  const portalWaLink = customer ? whatsappHrefForCustomer(customer, portalWaText) : '#';
  const portalCodeTrimmed = customer?.portal_code ? String(customer.portal_code).trim() : '';
  const canPortalWa = portalWaLink && portalWaLink !== '#';
  const customerPanelHref = useMemo(() => {
    if (!customer || !packageTypes.length) return '';
    let panel = '';
    let server = '';
    if (customer.package_type_id) {
      const pt = packageTypes.find((t) => String(t.id) === String(customer.package_type_id));
      panel = pt?.customer_panel_url ? String(pt.customer_panel_url).trim() : '';
      server = pt?.server_url ? String(pt.server_url).trim() : '';
    }
    if ((!panel || !server) && customer.package_type_name) {
      const name = String(customer.package_type_name).trim().toLowerCase();
      const pt = packageTypes.find((t) => String(t.name || '').trim().toLowerCase() === name);
      if (pt) {
        if (!panel && pt.customer_panel_url) panel = String(pt.customer_panel_url).trim();
        if (!server && pt.server_url) server = String(pt.server_url).trim();
      }
    }
    return normalizeExternalPanelHref(panel || server);
  }, [customer, packageTypes]);

  const pinOverlay =
    pinModalOpen &&
    typeof document !== 'undefined' &&
    createPortal(
      <div
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-detail-pin-title"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && lockSecondsLeft === 0) {
            e.preventDefault();
            submitDetailPin();
          }
        }}
      >
        <div
          className="w-full max-w-sm rounded-xl border border-white/15 bg-[#131326] p-6 shadow-2xl"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <h2 id="customer-detail-pin-title" className="text-lg font-semibold text-white">
            Müşteri detayı — PIN
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Bu kaydı görüntülemek için 4–6 haneli PIN girin.
          </p>
          {lockSecondsLeft > 0 ? (
            <p className="mt-4 text-center text-amber-300 tabular-nums text-lg font-medium">
              Kilit: {lockSecondsLeft} sn
            </p>
          ) : (
            <>
              <input
                type="password"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6));
                  if (pinError) setPinError('');
                }}
                className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white tracking-widest"
                placeholder="••••••"
                disabled={lockSecondsLeft > 0}
                aria-invalid={!!pinError}
              />
              {pinError ? (
                <p className="mt-2 text-sm text-red-400" role="alert">
                  {pinError}
                </p>
              ) : null}
              <Button
                type="button"
                className="mt-4 w-full bg-primary hover:bg-primary"
                onClick={submitDetailPin}
                disabled={lockSecondsLeft > 0 || pinInput.replace(/\D/g, '').length < 4}
              >
                Devam
              </Button>
            </>
          )}
        </div>
      </div>,
      document.body,
    );

  return (
    <div className="space-y-6 max-w-3xl">
      {pinOverlay}

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="text-slate-400">
          <Link to={adminPath('customers')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Listeye dön
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-white">
          {isNew ? 'Yeni müşteri' : 'Müşteri detayı'}
        </h1>
      </div>

      {needsDetailPin && !pinUnlocked ? (
        <p className="text-slate-500 text-sm">PIN doğrulaması bekleniyor…</p>
      ) : loading ? (
        <p className="text-slate-400">Yükleniyor…</p>
      ) : (
        <>
          {!isNew && customer && (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="border-white/10" asChild>
                <a href={waLink} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp (hatırlatma)
                </a>
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setRenewPkgId(customer.package_id || '');
                  setRenewOpen(true);
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Paketi yenile
              </Button>
            </div>
          )}

          {!isNew && customer && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e50914]/25 bg-[#e50914]/5 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-300">
                  <span className="text-slate-400">Müşteri Kodu:</span>{' '}
                  <span className="font-mono text-lg font-semibold text-[#e50914]">
                    {portalCodeTrimmed || '—'}
                  </span>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Müşteri bu kodu /musteri-kayit üzerinden bilgilerine erişmek için kullanır.
                </p>
                {customerPanelHref ? (
                  <p className="mt-3 text-sm">
                    <span className="text-slate-400">Müşteri paneli:</span>{' '}
                    <a
                      href={customerPanelHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[#e50914] underline decoration-[#e50914]/40 underline-offset-2 hover:text-[#e50914]"
                    >
                      Paneli aç
                    </a>
                    <span className="ml-2 block truncate font-mono text-xs text-slate-500 sm:inline sm:ml-3">
                      {customerPanelHref}
                    </span>
                  </p>
                ) : (
                  <p className="mt-3 text-xs text-amber-200/90">
                    Müşteri paneli / M3U sunucusu tanımlı değil —{' '}
                    <Link to={adminPath('customers/packages')} className="text-[#e50914] underline underline-offset-2">
                      Paket grupları
                    </Link>{' '}
                    sayfasından panel giriş linki veya IPTV sunucu URL ekleyin.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-white/15"
                  disabled={!portalCodeTrimmed}
                  title={portalCodeTrimmed ? 'Panoya kopyala' : 'Kayıtlı kod yok'}
                  onClick={async () => {
                    if (!portalCodeTrimmed) return;
                    try {
                      await navigator.clipboard.writeText(portalCodeTrimmed);
                      toast({ title: 'Kod kopyalandı' });
                    } catch {
                      toast({ variant: 'destructive', title: 'Kopyalanamadı' });
                    }
                  }}
                >
                  <span className="mr-1.5" aria-hidden>
                    📋
                  </span>
                  Kopyala
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-green-600/40 text-green-200 hover:bg-green-500/10"
                  disabled={!canPortalWa}
                  title={canPortalWa ? 'WhatsApp ile kod gönder' : 'WhatsApp numarası yok'}
                  asChild={canPortalWa}
                >
                  {canPortalWa ? (
                    <a href={portalWaLink} target="_blank" rel="noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp (kod)
                    </a>
                  ) : (
                    <span className="inline-flex items-center opacity-50 cursor-not-allowed">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp (kod)
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-white/10 bg-[#131326] p-6">
            <CustomerForm
              variant="admin"
              packageTypes={packageTypes}
              durations={durations}
              initialCustomer={isNew ? null : customer}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          </div>
        </>
      )}

      <Dialog open={renewOpen} onOpenChange={setRenewOpen}>
        <DialogContent className="bg-[#131326] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Paketi yenile</DialogTitle>
            <p className="text-sm text-slate-400">
              Yeni başlangıç mevcut bitiş tarihi olur; seçilen süre kadar uzatılır. Paket türü aynı kalır.
            </p>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>Yeni süre</Label>
            <Select value={renewPkgId} onValueChange={setRenewPkgId}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Süre seçin" />
              </SelectTrigger>
              <SelectContent>
                {durations
                  .filter((p) => p.is_active !== false)
                  .map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} — {p.days} gün (ref. {p.price} ₺)
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenewOpen(false)}>
              İptal
            </Button>
            <Button className="bg-primary" onClick={doRenew} disabled={renewing || !renewPkgId}>
              {renewing ? 'Uygulanıyor…' : 'Uygula'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
