import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { adminPath } from '@/constants/adminRoutes';
import { STANDARD_PACKAGE_DURATION_TEMPLATES } from '@/constants/standardPackageDurations';
import {
  savePackageTypeToSupabase,
  packageTypesNeedServerColumnsMigration,
  packageTypesServerMigrationHint,
} from '@/utils/packageTypeServerColumns';

function logSupabaseError(context, error) {
  if (!error) return;
  console.error(`[CustomerPackagesPage] ${context}`, {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
  });
}

const emptyTypeForm = {
  name: '',
  description: '',
  customer_panel_url: '',
  server_url: '',
  server_port: '',
  sort_order: '0',
  is_active: true,
};

const emptyDurationForm = {
  group_id: '',
  name: '',
  days: '',
  price: '0',
  sort_order: '0',
  is_active: true,
};

export default function CustomerPackagesPage() {
  const [typeRows, setTypeRows] = useState([]);
  const [durationRows, setDurationRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [typeEditId, setTypeEditId] = useState(null);
  const [typeForm, setTypeForm] = useState(emptyTypeForm);
  const [typeSaving, setTypeSaving] = useState(false);

  const [durEditId, setDurEditId] = useState(null);
  const [durForm, setDurForm] = useState(emptyDurationForm);
  const [durSaving, setDurSaving] = useState(false);
  const [seedingStandardDurations, setSeedingStandardDurations] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [tRes, dRes] = await Promise.all([
      supabase.from('package_types').select('*').order('sort_order', { ascending: true }),
      supabase.from('customer_packages').select('*').order('sort_order', { ascending: true }),
    ]);
    if (tRes.error) {
      logSupabaseError('load package_types', tRes.error);
      toast({ variant: 'destructive', title: 'Paket grupları yüklenemedi', description: tRes.error.message });
    } else setTypeRows(tRes.data || []);
    if (dRes.error) {
      logSupabaseError('load customer_packages', dRes.error);
      toast({ variant: 'destructive', title: 'Süreler yüklenemedi', description: dRes.error.message });
    }
    else setDurationRows(dRes.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* ——— Paket türü ——— */
  const startTypeCreate = () => {
    setTypeEditId('new');
    setTypeForm(emptyTypeForm);
  };

  const startTypeEdit = (row) => {
    setTypeEditId(row.id);
    setTypeForm({
      name: row.name,
      description: row.description || '',
      customer_panel_url: row.customer_panel_url || '',
      server_url: row.server_url || '',
      server_port: row.server_port != null ? String(row.server_port) : '',
      sort_order: String(row.sort_order ?? 0),
      is_active: !!row.is_active,
    });
  };

  const cancelTypeEdit = () => {
    setTypeEditId(null);
    setTypeForm(emptyTypeForm);
  };

  const saveType = async () => {
    if (!typeForm.name.trim()) {
      toast({ variant: 'destructive', title: 'İsim gerekli' });
      return;
    }
    const sort_order = parseInt(typeForm.sort_order, 10) || 0;
    setTypeSaving(true);
    const payload = {
      name: typeForm.name.trim(),
      description: typeForm.description.trim() || null,
      customer_panel_url: typeForm.customer_panel_url.trim() || null,
      server_url: typeForm.server_url.trim() || null,
      server_port: typeForm.server_port.trim() || null,
      sort_order,
      is_active: typeForm.is_active,
    };
    const { error: err, stripped } = await savePackageTypeToSupabase(supabase, {
      id: typeEditId,
      payload,
    });
    setTypeSaving(false);
    if (err) {
      logSupabaseError('saveType package_types', err);
      toast({ variant: 'destructive', title: 'Kaydedilemedi', description: err.message });
      return;
    }
    if (stripped?.length > 0) {
      toast({
        title: typeEditId === 'new' ? 'Paket grubu eklendi (kısmi)' : 'Paket grubu güncellendi (kısmi)',
        description: `Sunucu alanları kaydedilemedi: ${stripped.join(', ')}. ${packageTypesServerMigrationHint()}`,
        className: 'bg-amber-600 border-none text-white',
        duration: 10000,
      });
    } else {
      toast({ title: typeEditId === 'new' ? 'Paket grubu eklendi' : 'Paket grubu güncellendi' });
    }
    cancelTypeEdit();
    load();
  };

  const removeType = async (row) => {
    if (!window.confirm(`“${row.name}” silinsin mi? Bağlı müşteri varsa pasife alınır.`)) return;
    const { error } = await supabase.from('package_types').delete().eq('id', row.id);
    if (error) {
      logSupabaseError('removeType delete package_types', error);
      const { error: uerr } = await supabase
        .from('package_types')
        .update({ is_active: false })
        .eq('id', row.id);
      if (uerr) {
        logSupabaseError('removeType soft-update package_types', uerr);
        toast({ variant: 'destructive', title: 'Silinemedi', description: error.message });
        return;
      }
      toast({ title: 'Paket türü pasife alındı' });
    } else {
      toast({ title: 'Paket türü silindi' });
    }
    load();
  };

  /* ——— Süre (customer_packages) ——— */
  const startDurCreate = () => {
    setDurEditId('new');
    setDurForm(emptyDurationForm);
  };

  const startDurEdit = (row) => {
    setDurEditId(row.id);
    setDurForm({
      group_id: row.group_id || '',
      name: row.name,
      days: String(row.days),
      price: String(row.price ?? 0),
      sort_order: String(row.sort_order ?? 0),
      is_active: !!row.is_active,
    });
  };

  const cancelDurEdit = () => {
    setDurEditId(null);
    setDurForm(emptyDurationForm);
  };

  const saveDuration = async () => {
    const days = parseInt(durForm.days, 10);
    const price = Number(durForm.price);
    const sort_order = parseInt(durForm.sort_order, 10) || 0;
    if (!durForm.group_id) {
      toast({ variant: 'destructive', title: 'Paket grubu seçin' });
      return;
    }
    if (!durForm.name.trim() || Number.isNaN(days) || days < 1 || Number.isNaN(price) || price < 0) {
      toast({ variant: 'destructive', title: 'Eksik veya hatalı alan' });
      return;
    }
    const grp = typeRows.find((t) => t.id === durForm.group_id);
    setDurSaving(true);
    const payload = {
      group_id: durForm.group_id,
      group_name: grp?.name || null,
      name: durForm.name.trim(),
      days,
      price,
      sort_order,
      is_active: durForm.is_active,
    };
    let err;
    if (durEditId === 'new') {
      const res = await supabase.from('customer_packages').insert(payload);
      err = res.error;
      if (err) logSupabaseError('saveDuration insert customer_packages', err);
    } else {
      const res = await supabase.from('customer_packages').update(payload).eq('id', durEditId);
      err = res.error;
      if (err) logSupabaseError('saveDuration update customer_packages', err);
    }
    setDurSaving(false);
    if (err) {
      toast({ variant: 'destructive', title: 'Kaydedilemedi', description: err.message });
      return;
    }
    toast({ title: durEditId === 'new' ? 'Süre eklendi' : 'Süre güncellendi' });
    cancelDurEdit();
    load();
  };

  const removeDuration = async (row) => {
    if (!window.confirm(`“${row.name}” silinsin mi? Bağlı müşteri varsa pasife alınır.`)) return;
    const { error } = await supabase.from('customer_packages').delete().eq('id', row.id);
    if (error) {
      logSupabaseError('removeDuration delete customer_packages', error);
      const { error: uerr } = await supabase
        .from('customer_packages')
        .update({ is_active: false })
        .eq('id', row.id);
      if (uerr) {
        logSupabaseError('removeDuration soft-update customer_packages', uerr);
        toast({ variant: 'destructive', title: 'Silinemedi', description: error.message });
        return;
      }
      toast({ title: 'Süre pasife alındı (bağlı müşteri olabilir).' });
    } else {
      toast({ title: 'Süre silindi' });
    }
    load();
  };

  /** Her paket grubu için 3·6·9·12·15·24 Ay (90/180/270/365/450/730 gün) eksikse ekler */
  const seedStandardDurationsForAllGroups = async () => {
    if (!typeRows.length) {
      toast({ variant: 'destructive', title: 'Önce en az bir paket grubu oluşturun' });
      return;
    }
    setSeedingStandardDurations(true);
    try {
      const rows = [];
      for (const pt of typeRows) {
        for (const t of STANDARD_PACKAGE_DURATION_TEMPLATES) {
          const exists = durationRows.some(
            (d) => d.group_id === pt.id && Number(d.days) === t.days,
          );
          if (!exists) {
            rows.push({
              group_id: pt.id,
              group_name: pt.name,
              name: t.name,
              days: t.days,
              price: t.price,
              sort_order: t.sort_order,
              is_active: true,
            });
          }
        }
      }
      if (!rows.length) {
        toast({
          title: 'Zaten tamam',
          description: 'Tüm gruplarda 3·6·9·12·15·24 Ay süreleri mevcut.',
        });
        return;
      }
      const { error } = await supabase.from('customer_packages').insert(rows);
      if (error) {
        logSupabaseError('seedStandardDurationsForAllGroups', error);
        toast({ variant: 'destructive', title: 'Süreler eklenemedi', description: error.message });
        return;
      }
      toast({
        title: `${rows.length} süre eklendi`,
        description: 'Her gruba 3·6·9·12·15·24 Ay (referans fiyat 0; düzenleyebilirsiniz).',
      });
      load();
    } finally {
      setSeedingStandardDurations(false);
    }
  };

  const serverColumnsPending = packageTypesNeedServerColumnsMigration(typeRows);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="text-slate-400">
            <Link to={adminPath('customers')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Müşteriler
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-white">Paket grupları & süreler</h1>
        </div>
      </div>

      <Tabs defaultValue="types" className="w-full">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="types">Paket grupları</TabsTrigger>
          <TabsTrigger value="durations">Süreler</TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="mt-6 space-y-4">
          {serverColumnsPending && (
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              {packageTypesServerMigrationHint()} Müşteri portalında M3U linki üretilemez.
            </div>
          )}

          <div className="flex flex-wrap items-center justify-end gap-2">
            {!typeEditId && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  className="border border-white/15 bg-white/5 hover:bg-white/10"
                  disabled={seedingStandardDurations || loading || !typeRows.length}
                  onClick={seedStandardDurationsForAllGroups}
                >
                  {seedingStandardDurations ? 'Ekleniyor…' : 'Tüm gruplara 3·6·9·12·15·24 Ay'}
                </Button>
                <Button onClick={startTypeCreate} className="bg-primary hover:bg-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Grup ekle
                </Button>
              </>
            )}
          </div>

          {typeEditId && (
            <div className="rounded-xl border border-white/10 bg-[#131326] p-6 space-y-4 max-w-lg">
              <h2 className="text-lg font-semibold text-white">
                {typeEditId === 'new' ? 'Yeni paket grubu' : 'Paket grubunu düzenle'}
              </h2>
              <div className="space-y-2">
                <Label>Ad</Label>
                <Input
                  value={typeForm.name}
                  onChange={(e) => setTypeForm((f) => ({ ...f, name: e.target.value }))}
                  className="bg-white/5 border-white/10"
                  placeholder="Örn. QruzeHD"
                />
              </div>
              <div className="space-y-2">
                <Label>Açıklama (isteğe bağlı)</Label>
                <Textarea
                  value={typeForm.description}
                  onChange={(e) => setTypeForm((f) => ({ ...f, description: e.target.value }))}
                  className="bg-white/5 border-white/10 min-h-[72px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Müşteri paneli giriş linki</Label>
                <Input
                  value={typeForm.customer_panel_url}
                  onChange={(e) => setTypeForm((f) => ({ ...f, customer_panel_url: e.target.value }))}
                  className="bg-white/5 border-white/10 font-mono text-sm"
                  placeholder="https://panel.ornek.com/login"
                />
                <p className="text-xs text-slate-500">
                  Web’de panele giriş için tam URL (M3U / Xtream sunucu adresinden farklı olabilir). Boşsa aşağıdaki
                  sunucu URL’si “Panele git” için yedek olarak kullanılır.
                </p>
              </div>
              <div className="space-y-2">
                <Label>IPTV sunucu URL (M3U / Xtream)</Label>
                <Input
                  value={typeForm.server_url}
                  onChange={(e) => setTypeForm((f) => ({ ...f, server_url: e.target.value }))}
                  className="bg-white/5 border-white/10 font-mono text-sm"
                  placeholder="https://örnek.com veya http://ip"
                />
              </div>
              <div className="space-y-2">
                <Label>Sunucu portu (isteğe bağlı)</Label>
                <Input
                  value={typeForm.server_port}
                  onChange={(e) => setTypeForm((f) => ({ ...f, server_port: e.target.value }))}
                  className="bg-white/5 border-white/10 font-mono text-sm"
                  placeholder="Örn. 8080"
                />
                <p className="text-xs text-slate-500">
                  URL’de port yoksa buraya yazılır; müşteri-kayıt sayfasında M3U ve Xtream adresi buradan üretilir.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Sıra</Label>
                <Input
                  type="number"
                  value={typeForm.sort_order}
                  onChange={(e) => setTypeForm((f) => ({ ...f, sort_order: e.target.value }))}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={typeForm.is_active}
                  onCheckedChange={(v) => setTypeForm((f) => ({ ...f, is_active: v }))}
                />
                <span className="text-sm text-slate-300">Aktif</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={saveType} disabled={typeSaving} className="bg-primary">
                  Kaydet
                </Button>
                <Button type="button" variant="outline" onClick={cancelTypeEdit}>
                  Vazgeç
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-white/10 overflow-hidden">
            {loading ? (
              <p className="p-6 text-slate-400">Yükleniyor…</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-slate-300">Ad</TableHead>
                    <TableHead className="text-slate-300">Panel giriş</TableHead>
                    <TableHead className="text-slate-300">Sunucu (M3U)</TableHead>
                    <TableHead className="text-slate-300">Sıra</TableHead>
                    <TableHead className="text-slate-300">Aktif</TableHead>
                    <TableHead className="text-slate-300 text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {typeRows.map((r) => (
                    <TableRow key={r.id} className="border-white/10">
                      <TableCell className="font-medium text-white">{r.name}</TableCell>
                      <TableCell className="max-w-[160px] truncate font-mono text-xs text-[#e50914]/90">
                        {r.customer_panel_url ? String(r.customer_panel_url) : '—'}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate font-mono text-xs text-slate-400">
                        {r.server_url
                          ? `${r.server_url}${r.server_port ? `:${r.server_port}` : ''}`
                          : '—'}
                      </TableCell>
                      <TableCell className="text-slate-300">{r.sort_order}</TableCell>
                      <TableCell className="text-slate-300">{r.is_active ? 'Evet' : 'Hayır'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => startTypeEdit(r)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-400" onClick={() => removeType(r)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {!loading && typeRows.length > 0 && (
            <div className="space-y-4 mt-8">
              <h3 className="text-lg font-semibold text-white">Gruplara göre süreler</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {typeRows.map((g) => {
                  const subs = durationRows.filter((d) => d.group_id === g.id);
                  return (
                    <div key={g.id} className="rounded-xl border border-white/10 bg-[#0c0c14] p-4">
                      <h4 className="font-semibold text-[#e50914] mb-2">{g.name}</h4>
                      {subs.length === 0 ? (
                        <p className="text-sm text-slate-500">Bu gruba süre yok. Süreler sekmesinden ekleyin.</p>
                      ) : (
                        <ul className="text-sm text-slate-300 space-y-1">
                          {subs.map((s) => (
                            <li key={s.id}>
                              • {s.name} <span className="text-slate-500">({s.days} gün)</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
              {durationRows.some((d) => !d.group_id) && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                  <p className="text-sm font-medium text-amber-200">Grubu atanmamış süreler</p>
                  <ul className="mt-2 text-sm text-slate-300 space-y-1">
                    {durationRows
                      .filter((d) => !d.group_id)
                      .map((s) => (
                        <li key={s.id}>
                          • {s.name} ({s.days} gün)
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="durations" className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-end gap-2">
            {!durEditId && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  className="border border-white/15 bg-white/5 hover:bg-white/10"
                  disabled={seedingStandardDurations || loading || !typeRows.length}
                  onClick={seedStandardDurationsForAllGroups}
                >
                  {seedingStandardDurations ? 'Ekleniyor…' : 'Tüm gruplara 3·6·9·12·15·24 Ay ekle'}
                </Button>
                <Button onClick={startDurCreate} className="bg-primary hover:bg-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Süre ekle
                </Button>
              </>
            )}
          </div>
          {!durEditId && typeRows.length > 0 && (
            <p className="text-xs text-slate-500">
              Eksik süreleri doldurur:{' '}
              <strong className="text-slate-400">3 Ay (90 gün)</strong>, <strong className="text-slate-400">6 Ay (180)</strong>,{' '}
              <strong className="text-slate-400">9 Ay (270)</strong>, <strong className="text-slate-400">12 Ay (365)</strong>,{' '}
              <strong className="text-slate-400">15 Ay (450)</strong>, <strong className="text-slate-400">24 Ay (730)</strong>. Aynı gün
              sayısı zaten varsa atlanır.
            </p>
          )}

          {durEditId && (
            <div className="rounded-xl border border-white/10 bg-[#131326] p-6 space-y-4 max-w-lg">
              <h2 className="text-lg font-semibold text-white">
                {durEditId === 'new' ? 'Yeni süre' : 'Süreyi düzenle'}
              </h2>
              <div className="space-y-2">
                <Label>Paket grubu *</Label>
                <Select value={durForm.group_id} onValueChange={(v) => setDurForm((f) => ({ ...f, group_id: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Grup seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeRows.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Süre adı</Label>
                <Input
                  value={durForm.name}
                  onChange={(e) => setDurForm((f) => ({ ...f, name: e.target.value }))}
                  className="bg-white/5 border-white/10"
                  placeholder="Örn. 3 Ay"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Gün</Label>
                  <Input
                    type="number"
                    min={1}
                    value={durForm.days}
                    onChange={(e) => setDurForm((f) => ({ ...f, days: e.target.value }))}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Referans fiyat (₺)</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={durForm.price}
                    onChange={(e) => setDurForm((f) => ({ ...f, price: e.target.value }))}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sıra</Label>
                <Input
                  type="number"
                  value={durForm.sort_order}
                  onChange={(e) => setDurForm((f) => ({ ...f, sort_order: e.target.value }))}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={durForm.is_active}
                  onCheckedChange={(v) => setDurForm((f) => ({ ...f, is_active: v }))}
                />
                <span className="text-sm text-slate-300">Aktif (müşteri formunda)</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={saveDuration} disabled={durSaving} className="bg-primary">
                  Kaydet
                </Button>
                <Button type="button" variant="outline" onClick={cancelDurEdit}>
                  Vazgeç
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-white/10 overflow-hidden">
            {loading ? (
              <p className="p-6 text-slate-400">Yükleniyor…</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-slate-300">Grup</TableHead>
                    <TableHead className="text-slate-300">Ad</TableHead>
                    <TableHead className="text-slate-300">Gün</TableHead>
                    <TableHead className="text-slate-300">Ref. fiyat</TableHead>
                    <TableHead className="text-slate-300">Sıra</TableHead>
                    <TableHead className="text-slate-300">Aktif</TableHead>
                    <TableHead className="text-slate-300 text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {durationRows.map((r) => (
                    <TableRow key={r.id} className="border-white/10">
                      <TableCell className="text-slate-400 text-sm">{r.group_name || '—'}</TableCell>
                      <TableCell className="font-medium text-white">{r.name}</TableCell>
                      <TableCell className="text-slate-300">{r.days}</TableCell>
                      <TableCell className="text-slate-300">{r.price} ₺</TableCell>
                      <TableCell className="text-slate-300">{r.sort_order}</TableCell>
                      <TableCell className="text-slate-300">{r.is_active ? 'Evet' : 'Hayır'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => startDurEdit(r)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-400" onClick={() => removeDuration(r)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
