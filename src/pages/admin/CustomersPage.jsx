import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package,
  Search,
  UserPlus,
  Users,
  Clock,
  Wallet,
  AlertTriangle,
  Trash2,
  RefreshCw,
  MessageSquare,
  UserCheck,
  Download,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { showPublicMaintenanceToastOnce } from '@/utils/supabaseMaintenanceToast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { remainingCalendarDaysUntilEnd, formatTrDate } from '@/utils/customerDates';
import {
  whatsappHrefForCustomer,
  renewalReminderMessage,
  displayWhatsAppCell,
  portalCodeWhatsAppMessage,
} from '@/utils/whatsappCustomer';
import { fetchAdminCustomers, patchAdminCustomer } from '@/utils/adminCustomersApi';
import { adminPath } from '@/constants/adminRoutes';

/** Müşteri CSV indirme + CustomerDetailPage ile aynı oturum PIN'i */
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

const CURRENCY_SYM = { TRY: '₺', EUR: '€', GBP: '£' };

function customerRem(c) {
  const end = c.end_date ? String(c.end_date).slice(0, 10) : null;
  if (!end) return null;
  return remainingCalendarDaysUntilEnd(end);
}

function matchesListTab(c, tab) {
  const rem = customerRem(c);
  if (tab === 'all') return true;
  if (tab === 'aktif') return c.status === 'aktif' && (rem == null || rem >= 0);
  if (tab === 'yakinda') return c.status === 'aktif' && rem != null && rem >= 0 && rem <= 7;
  if (tab === 'bitti') return c.status === 'bitti' || (rem != null && rem < 0);
  if (tab === 'beklemede') return c.status === 'beklemede';
  if (tab === 'iptal') return c.status === 'iptal';
  return true;
}

/** CSV hücresi: virgül, tırnak, satır sonu güvenli */
function csvEscapeCell(val) {
  const s = val == null ? '' : String(val);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function splitFullName(full) {
  const t = String(full || '').trim();
  if (!t) return { first: '', last: '' };
  const i = t.indexOf(' ');
  if (i === -1) return { first: t, last: '' };
  return { first: t.slice(0, i), last: t.slice(i + 1).trim() };
}

function ymdLocal(d) {
  if (d == null || d === '') return '';
  const x = typeof d === 'string' ? d.slice(0, 10) : new Date(d).toISOString().slice(0, 10);
  return x || '';
}

function packageTypeLabel(id, packageTypes) {
  if (id == null || id === '') return '';
  const row = packageTypes.find((p) => String(p.id) === String(id));
  return row?.name ?? '';
}

function buildCustomersCsvRows(rows, packageTypes) {
  const headers = [
    'İsim',
    'Soyisim',
    'E-posta',
    'Telefon',
    'Portal Kodu',
    'Paket',
    'Durum',
    'Kayıt Tarihi',
    'Kullanıcı Adı',
    'Paket Grubu',
    'Başlangıç Tarihi',
    'Bitiş Tarihi',
    'Tutar',
    'Para Birimi',
    'Kalan Gün',
    'Notlar',
  ];
  const lines = [headers.map(csvEscapeCell).join(',')];
  for (const c of rows) {
    const { first, last } = splitFullName(c.full_name);
    const rem = customerRem(c);
    const remStr = rem == null ? '' : String(rem);
    const line = [
      first,
      last,
      c.email ?? '',
      displayWhatsAppCell(c),
      c.portal_code != null ? String(c.portal_code).trim() : '',
      c.package_name ?? '',
      c.status ?? '',
      ymdLocal(c.created_at),
      c.username ?? '',
      packageTypeLabel(c.package_type_id, packageTypes),
      ymdLocal(c.start_date),
      c.end_date ? String(c.end_date).slice(0, 10) : '',
      c.package_price != null ? String(c.package_price) : '',
      c.currency ?? '',
      remStr,
      c.notes ?? '',
    ].map(csvEscapeCell);
    lines.push(line.join(','));
  }
  return lines.join('\r\n');
}

function rowBorderClass(c) {
  if (c.status === 'beklemede') return 'border-l-4 border-l-slate-500';
  if (c.status === 'iptal') return 'border-l-4 border-l-zinc-600 opacity-75';
  if (!c.end_date) return 'border-l-4 border-l-slate-400';
  const rem = customerRem(c);
  if (rem == null) return 'border-l-4 border-l-slate-400';
  if (rem < 0) return 'border-l-4 border-l-red-500';
  if (rem <= 14) return 'border-l-4 border-l-amber-400';
  return 'border-l-4 border-l-emerald-500';
}

export default function CustomersPage() {
  const { session, user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [durations, setDurations] = useState([]);
  const [packageTypes, setPackageTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDuration, setFilterDuration] = useState('all');
  const [filterPackageType, setFilterPackageType] = useState('all');
  const [listTab, setListTab] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkWaOpen, setBulkWaOpen] = useState(false);
  const [csvPinOpen, setCsvPinOpen] = useState(false);
  const [csvPinInput, setCsvPinInput] = useState('');
  const [csvPinError, setCsvPinError] = useState('');
  const [csvLockUntil, setCsvLockUntil] = useState(0);
  const [csvLockTick, setCsvLockTick] = useState(() => Date.now());
  const snapshotRef = useRef([]);

  const load = useCallback(async () => {
    setLoading(true);
    const token = session?.access_token;
    /**
     * Tablo: public.customers
     * Sorgu: select('*').order('created_at')
     * RLS: docs/supabase-customers-rls.sql — SELECT yalnızca authenticated + is_customers_admin().
     *      Hata yokken [] dönebilir (yetki yok / gerçekten boş).
     */
    const [apiWrap, cRes, dRes, tRes] = await Promise.all([
      fetchAdminCustomers(token),
      supabase.from('customers').select('*').order('created_at', { ascending: false }),
      supabase.from('customer_packages').select('id,name,group_id').order('sort_order'),
      supabase.from('package_types').select('id,name').order('sort_order'),
    ]);

    const fromApi = apiWrap.customers;

    const fromDb = cRes.error ? [] : cRes.data || [];
    if (cRes.error) {
      showPublicMaintenanceToastOnce(toast);
      if (import.meta.env.DEV) {
        console.error('[CustomersPage] customers sorgusu hata:', cRes.error);
      }
    }

    // API boş dönebiliyor (sunucu .env yanlış proje / API kapalı); tarayıcıdaki Supabase’de satır varsa onu kullan
    let raw;
    if (fromApi != null && fromApi.length > 0) {
      raw = fromApi;
    } else if (fromDb.length > 0) {
      raw = fromDb;
    } else if (fromApi != null) {
      raw = fromApi;
    } else {
      raw = fromDb;
    }

    const activeRows = raw.filter((c) => c.deleted_at == null);
    setCustomers(activeRows);
    snapshotRef.current = activeRows;

    if (import.meta.env.DEV) {
      if (raw.length > 0 && activeRows.length === 0) {
        console.warn(
          '[CustomersPage] Tüm satırlar deleted_at nedeniyle elendi. Supabase’de deleted_at NULL yapın veya kayıtları kontrol edin.',
        );
      }
      if (!cRes.error && fromDb.length === 0 && (fromApi == null || fromApi.length === 0)) {
        console.warn(
          'Boş veri: (1) Tabloda satır yok, (2) RLS, (3) API+DB farklı proje — npm run dev:all ile proxy dene.',
        );
      }
    }

    if (!dRes.error) setDurations(dRes.data || []);
    if (!tRes.error) setPackageTypes(tRes.data || []);
    setLoading(false);
  }, [session?.access_token, user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = useCallback(async (id, newStatus) => {
    const prev = snapshotRef.current;
    setCustomers((cs) => cs.map((x) => (x.id === id ? { ...x, status: newStatus } : x)));
    snapshotRef.current = snapshotRef.current.map((x) => (x.id === id ? { ...x, status: newStatus } : x));

    const token = session?.access_token;
    const api = await patchAdminCustomer(token, id, { status: newStatus });
    if (api.ok) return;
    const { error } = await supabase.from('customers').update({ status: newStatus }).eq('id', id);
    if (error) {
      setCustomers(prev);
      snapshotRef.current = prev;
      toast({ variant: 'destructive', title: 'Durum güncellenemedi', description: error.message });
    }
  }, [session?.access_token]);

  const confirmSoftDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const prev = snapshotRef.current;
    setCustomers((cs) => cs.filter((x) => x.id !== id));
    snapshotRef.current = snapshotRef.current.filter((x) => x.id !== id);
    setDeleteTarget(null);

    const token = session?.access_token;
    const api = await patchAdminCustomer(token, id, { deleted_at: new Date().toISOString() });
    if (!api.ok) {
      const { error } = await supabase
        .from('customers')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);
      if (error) {
        setCustomers(prev);
        snapshotRef.current = prev;
        toast({ variant: 'destructive', title: 'Silinemedi', description: error.message });
        return;
      }
    }
    toast({ title: 'Müşteri listeden kaldırıldı (geri almak için veritabanında deleted_at temizleyin).' });
  }, [deleteTarget, session?.access_token]);

  const stats = useMemo(() => {
    const today = new Date();
    const som = new Date(today.getFullYear(), today.getMonth(), 1);
    let active = 0;
    let expWeek = 0;
    let pending = 0;
    let monthRevenue = 0;
    for (const c of customers) {
      if (c.status === 'beklemede') pending += 1;
      const rem = customerRem(c);
      if (c.status === 'aktif' && rem != null && rem >= 0) active += 1;
      if (c.status === 'aktif' && rem != null && rem >= 0 && rem <= 7) expWeek += 1;
      const created = c.created_at ? new Date(c.created_at) : null;
      if (created && created >= som && c.package_price != null) {
        monthRevenue += Number(c.package_price) || 0;
      }
    }
    return { active, expWeek, pending, monthRevenue };
  }, [customers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const out = customers.filter((c) => {
      if (!matchesListTab(c, listTab)) return false;
      if (filterDuration !== 'all' && c.package_id !== filterDuration) return false;
      if (filterPackageType !== 'all' && c.package_type_id !== filterPackageType) return false;
      if (!q) return true;
      const u = (c.username || '').toLowerCase();
      const w = (displayWhatsAppCell(c) || '').toLowerCase();
      const n = (c.full_name || '').toLowerCase();
      const pc = (c.portal_code || '').toLowerCase();
      return u.includes(q) || w.includes(q) || n.includes(q) || pc.includes(q);
    });
    if (import.meta.env.DEV && customers.length > 0 && out.length === 0) {
      console.warn(
        '[CustomersPage] customers dolu ama filtered boş — sekme / paket filtresi / arama metnini sıfırlayın veya package_id ile Süre filtresi tipini kontrol edin.',
      );
    }
    return out;
  }, [customers, search, filterDuration, filterPackageType, listTab]);

  const expiredForBulk = useMemo(
    () => filtered.filter((c) => customerRem(c) != null && customerRem(c) < 0),
    [filtered],
  );

  useEffect(() => {
    if (!csvLockUntil || Date.now() >= csvLockUntil) return undefined;
    const t = setInterval(() => setCsvLockTick(Date.now()), 1000);
    return () => clearInterval(t);
  }, [csvLockUntil]);

  useEffect(() => {
    if (!csvLockUntil) return;
    if (csvLockTick < csvLockUntil) return;
    try {
      sessionStorage.removeItem(SS_PIN_LOCK_UNTIL);
    } catch {
      /* ignore */
    }
    setCsvLockUntil(0);
    setCsvPinError('');
  }, [csvLockTick, csvLockUntil]);

  const runCustomersCsvDownload = useCallback(() => {
    if (!customers.length) {
      toast({ variant: 'destructive', title: 'İndirilecek müşteri yok', description: 'Liste boş.' });
      return;
    }
    const body = buildCustomersCsvRows(customers, packageTypes);
    const bom = '\uFEFF';
    const blob = new Blob([bom + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const day = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `musteriler_${day}.csv`;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: 'CSV indirildi', description: `${customers.length} müşteri (tüm liste)` });
  }, [customers, packageTypes]);

  const openCsvDownloadFlow = useCallback(() => {
    if (!customers.length) {
      toast({ variant: 'destructive', title: 'İndirilecek müşteri yok', description: 'Liste boş.' });
      return;
    }
    if (readSessionPinUnlocked()) {
      runCustomersCsvDownload();
      return;
    }
    const until = readSessionLockUntil();
    setCsvLockUntil(until > Date.now() ? until : 0);
    setCsvLockTick(Date.now());
    setCsvPinInput('');
    setCsvPinError('');
    setCsvPinOpen(true);
  }, [customers.length, runCustomersCsvDownload]);

  const submitCsvPin = useCallback(() => {
    const until = readSessionLockUntil();
    const activeLock = until > Date.now() ? until : csvLockUntil;
    if (activeLock > Date.now()) {
      setCsvPinError('Çok fazla hatalı deneme. Bekleyin…');
      return;
    }
    const raw = String(csvPinInput || '').replace(/\D/g, '');
    if (raw.length < 4 || raw.length > 6) {
      setCsvPinError('PIN 4–6 hane olmalıdır.');
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
      setCsvLockUntil(0);
      setCsvPinError('');
      setCsvPinInput('');
      setCsvPinOpen(false);
      runCustomersCsvDownload();
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
      setCsvLockUntil(nextUntil);
      setCsvPinError('Çok fazla hatalı deneme. 60 saniye sonra tekrar deneyin.');
    } else {
      try {
        sessionStorage.setItem(SS_PIN_FAILS, String(fails));
      } catch {
        /* ignore */
      }
      setCsvPinError(`Hatalı PIN. (${fails}/${PIN_MAX_FAILS})`);
    }
    setCsvPinInput('');
  }, [csvPinInput, csvLockUntil, runCustomersCsvDownload]);

  const csvLockSecondsLeft =
    csvLockUntil > Date.now() ? Math.max(0, Math.ceil((csvLockUntil - csvLockTick) / 1000)) : 0;

  const csvPinOverlay =
    csvPinOpen &&
    typeof document !== 'undefined' &&
    createPortal(
      <div
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customers-csv-pin-title"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && csvLockSecondsLeft === 0) {
            e.preventDefault();
            submitCsvPin();
          }
        }}
      >
        <div
          className="w-full max-w-sm rounded-xl border border-white/15 bg-[#131326] p-6 shadow-2xl"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <h2 id="customers-csv-pin-title" className="text-lg font-semibold text-white">
            Liste indirme — PIN
          </h2>
          <p className="mt-2 text-sm text-slate-400">CSV indirmek için 4–6 haneli PIN girin.</p>
          {csvLockSecondsLeft > 0 ? (
            <p className="mt-4 text-center text-amber-300 tabular-nums text-lg font-medium">
              Kilit: {csvLockSecondsLeft} sn
            </p>
          ) : (
            <>
              <input
                type="password"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={csvPinInput}
                onChange={(e) => {
                  setCsvPinInput(e.target.value.replace(/\D/g, '').slice(0, 6));
                  if (csvPinError) setCsvPinError('');
                }}
                className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white tracking-widest"
                placeholder="••••••"
                disabled={csvLockSecondsLeft > 0}
                aria-invalid={!!csvPinError}
              />
              {csvPinError ? (
                <p className="mt-2 text-sm text-red-400" role="alert">
                  {csvPinError}
                </p>
              ) : null}
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-white/15"
                  onClick={() => {
                    setCsvPinOpen(false);
                    setCsvPinInput('');
                    setCsvPinError('');
                  }}
                >
                  Vazgeç
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-primary hover:bg-primary"
                  onClick={submitCsvPin}
                  disabled={csvLockSecondsLeft > 0 || csvPinInput.replace(/\D/g, '').length < 4}
                >
                  İndir
                </Button>
              </div>
            </>
          )}
        </div>
      </div>,
      document.body,
    );

  return (
    <div className="space-y-6">
      {csvPinOverlay}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Müşteriler</h1>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-white/10"
            onClick={openCsvDownloadFlow}
            disabled={loading || customers.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Müşteri Listesini İndir
          </Button>
          <Button variant="outline" asChild className="border-white/10">
            <Link to={adminPath('customers/packages')}>
              <Package className="mr-2 h-4 w-4" />
              Paket yönetimi
            </Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary">
            <Link to={adminPath('customers/new')}>
              <UserPlus className="mr-2 h-4 w-4" />
              Müşteri ekle
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-white/10 bg-[#131326]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Users className="h-4 w-4 text-[#e50914]" />
              Aktif müşteri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{stats.active}</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#131326]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              7 gün içinde biten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{stats.expWeek}</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#131326]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-slate-300" />
              Beklemede
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">
              {stats.pending}
              {stats.pending > 0 && (
                <span className="ml-2 inline-flex rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">
                  işlem gerekli
                </span>
              )}
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#131326]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Wallet className="h-4 w-4 text-[#e50914]" />
              Bu ay kayıt tutarı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{stats.monthRevenue.toLocaleString('tr-TR')}</p>
            <p className="text-xs text-slate-500 mt-1">Ay içi kayıtların tutarı (para birimleri karışık olabilir)</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Liste görünümü</p>
        <Tabs value={listTab} onValueChange={setListTab} className="w-full">
          <TabsList className="flex h-auto min-h-10 w-full flex-wrap justify-start gap-1 bg-white/5 p-1 border border-white/10">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              Tümü
            </TabsTrigger>
            <TabsTrigger value="aktif" className="text-xs sm:text-sm">
              Aktif
            </TabsTrigger>
            <TabsTrigger value="yakinda" className="text-xs sm:text-sm">
              Yakında bitiyor (7 gün)
            </TabsTrigger>
            <TabsTrigger value="bitti" className="text-xs sm:text-sm data-[state=active]:bg-red-600/40 data-[state=active]:text-red-100">
              Süresi bitti
            </TabsTrigger>
            <TabsTrigger value="beklemede" className="text-xs sm:text-sm">
              Beklemede
            </TabsTrigger>
            <TabsTrigger value="iptal" className="text-xs sm:text-sm">
              İptal
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {listTab === 'bitti' && expiredForBulk.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-red-500/40 text-red-200 hover:bg-red-500/10"
              onClick={() => setBulkWaOpen(true)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Toplu WhatsApp hatırlatma ({expiredForBulk.length})
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-xs text-slate-400">Ara (isim / kullanıcı / telefon / müşteri kodu)</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ara…"
              className="bg-white/5 border-white/10 pl-9"
            />
          </div>
        </div>
        <div className="space-y-2 w-full sm:w-48">
          <label className="text-xs text-slate-400">Paket grubu</label>
          <Select value={filterPackageType} onValueChange={setFilterPackageType}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              {packageTypes.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 w-full sm:w-48">
          <label className="text-xs text-slate-400">Süre</label>
          <Select value={filterDuration} onValueChange={setFilterDuration}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              {durations.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 overflow-x-auto">
        {loading ? (
          <p className="p-6 text-slate-400">Yükleniyor…</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-300">İsim</TableHead>
                <TableHead className="text-slate-300">Kullanıcı</TableHead>
                <TableHead className="text-slate-300 whitespace-nowrap">Müşteri kodu</TableHead>
                <TableHead className="text-slate-300">Telefon</TableHead>
                <TableHead className="text-slate-300">Paket</TableHead>
                <TableHead className="text-slate-300">Tutar</TableHead>
                <TableHead className="text-slate-300">Bitiş</TableHead>
                <TableHead className="text-slate-300">Kalan</TableHead>
                <TableHead className="text-slate-300 min-w-[140px]">Durum</TableHead>
                <TableHead className="text-slate-300 text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const end = c.end_date ? String(c.end_date).slice(0, 10) : null;
                const rem = customerRem(c);
                const waMsg = renewalReminderMessage(c.full_name, c.package_name, formatTrDate(end));
                const waLink = whatsappHrefForCustomer(c, waMsg);
                const portalWaLink = whatsappHrefForCustomer(c, portalCodeWhatsAppMessage(c.portal_code));
                const canPortalWa = portalWaLink && portalWaLink !== '#';
                const sym = CURRENCY_SYM[c.currency] || CURRENCY_SYM.TRY;
                const isExpiredTab = listTab === 'bitti';
                const showRenew = isExpiredTab && rem != null && rem < 0;
                return (
                  <TableRow
                    key={c.id}
                    className={`border-white/10 ${rowBorderClass(c)} ${isExpiredTab ? 'bg-red-950/35' : ''}`}
                  >
                    <TableCell className="font-medium text-white max-w-[120px] truncate">{c.full_name}</TableCell>
                    <TableCell className="text-slate-300">{c.username}</TableCell>
                    <TableCell className="font-mono text-sm text-[#e50914]/90 whitespace-nowrap">
                      {c.portal_code ? String(c.portal_code).trim() : '—'}
                    </TableCell>
                    <TableCell className="text-slate-300 whitespace-nowrap text-sm">
                      {displayWhatsAppCell(c)}
                    </TableCell>
                    <TableCell className="text-slate-300 max-w-[200px] text-sm">{c.package_name}</TableCell>
                    <TableCell className="text-slate-300 whitespace-nowrap">
                      {c.package_price != null ? `${sym}${Number(c.package_price).toLocaleString('tr-TR')}` : '—'}
                    </TableCell>
                    <TableCell className="text-slate-300 whitespace-nowrap">{end ? formatTrDate(end) : '—'}</TableCell>
                    <TableCell className={rem != null && rem < 0 ? 'text-red-400 font-medium' : 'text-slate-300'}>
                      {rem == null ? '—' : `${rem} gün`}
                    </TableCell>
                    <TableCell className="p-2" onClick={(e) => e.stopPropagation()}>
                      <Select value={c.status || 'beklemede'} onValueChange={(v) => updateStatus(c.id, v)}>
                        <SelectTrigger className="h-9 w-[130px] bg-white/5 border-white/10 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beklemede">Beklemede</SelectItem>
                          <SelectItem value="aktif">Aktif</SelectItem>
                          <SelectItem value="iptal">İptal</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right space-x-1 whitespace-nowrap">
                      {showRenew && (
                        <Button size="sm" variant="outline" className="border-orange-500/50 text-orange-200" asChild>
                          <Link to={`${adminPath('customers')}/${c.id}?renew=1`}>
                            <RefreshCw className="mr-1 h-3.5 w-3.5" />
                            Yenile
                          </Link>
                        </Button>
                      )}
                      {c.status === 'beklemede' && (
                        <Button
                          type="button"
                          size="sm"
                          className="bg-[#e50914] hover:bg-[#e50914] text-white"
                          onClick={() => updateStatus(c.id, 'aktif')}
                          title="Durumu aktif yap"
                        >
                          <UserCheck className="mr-1 h-3.5 w-3.5" />
                          Onayla
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" asChild>
                        <a href={waLink} target="_blank" rel="noreferrer">
                          WA
                        </a>
                      </Button>
                      {canPortalWa && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-400 hover:text-green-300"
                          asChild
                          title="Müşteri kodunu WhatsApp ile gönder"
                        >
                          <a href={portalWaLink} target="_blank" rel="noreferrer">
                            Kod
                          </a>
                        </Button>
                      )}
                      <Button size="sm" variant="secondary" asChild>
                        <Link to={`${adminPath('customers')}/${c.id}`}>Detay</Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => setDeleteTarget(c)}
                        aria-label="Müşteriyi sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
      {!loading && filtered.length === 0 && (
        <p className="text-center text-slate-500">Kayıt bulunamadı.</p>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-[#131326] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Müşteriyi kaldır</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Bu müşteriyi silmek istediğinizden emin misiniz? Kayıt listeden kalkar (soft delete).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 bg-transparent text-slate-300">Vazgeç</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={(e) => {
                e.preventDefault();
                confirmSoftDelete();
              }}
            >
              Evet, kaldır
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={bulkWaOpen} onOpenChange={setBulkWaOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto bg-[#131326] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Süresi biten müşteriler — WhatsApp</DialogTitle>
            <p className="text-sm text-slate-400">
              Her satırda ayrı sohbet açılır. Sırayla göndermek için tek tek &quot;WA&quot;ya tıklayın.
            </p>
          </DialogHeader>
          <ul className="space-y-2 pt-2">
            {expiredForBulk.map((c) => {
              const end = c.end_date ? String(c.end_date).slice(0, 10) : null;
              const msg = renewalReminderMessage(c.full_name, c.package_name, formatTrDate(end));
              const href = whatsappHrefForCustomer(c, msg);
              return (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                >
                  <span className="truncate text-slate-200">{c.full_name}</span>
                  <Button size="sm" variant="outline" className="shrink-0 border-green-600/50 text-green-300" asChild>
                    <a href={href} target="_blank" rel="noreferrer">
                      WA
                    </a>
                  </Button>
                </li>
              );
            })}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
