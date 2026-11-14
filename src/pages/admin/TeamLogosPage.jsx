import React, { useEffect, useState, useMemo } from 'react';
import { useAdminData } from '@/hooks/useAdminData';
import { clearSiteDataCache } from '@/hooks/useSiteData';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Save, Trash2, Upload, ImageIcon, RefreshCw } from 'lucide-react';
import { resolveTeamLogoUrl, normalizeTeamName } from '@/utils/teamLogos';

function getTeamInitials(name) {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const STORAGE_BUCKET = 'welcome-images';
const UPLOAD_PREFIX = 'team-logo-';

function emptyRow() {
  return { id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: '', url: '', aliases: '' };
}

const TeamLogosPage = ({ siteData }) => {
  const { updateSettings } = useAdminData();
  const { toast } = useToast();
  const [rows, setRows] = useState([emptyRow()]);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState('');

  const teamLogosKey = useMemo(() => JSON.stringify(siteData?.team_logos ?? null), [siteData?.team_logos]);

  useEffect(() => {
    const raw = siteData?.team_logos;
    const list = Array.isArray(raw?.entries) ? raw.entries : Array.isArray(raw) ? raw : [];
    const cleaned = list.filter((e) => e?.name);
    if (cleaned.length > 0) {
      setRows(
        cleaned.map((e, i) => ({
          id: `saved-${i}-${e.name}`,
          name: e.name,
          url: e.url,
          aliases: Array.isArray(e.aliases) ? e.aliases.join(', ') : (e.aliases || ''),
        })),
      );
    } else {
      setRows([emptyRow()]);
    }
  }, [teamLogosKey]);

  const entriesForSave = useMemo(
    () =>
      rows
        .filter((r) => r.name?.trim())
        .map((r) => ({
          name: r.name.trim(),
          url: (r.url || '').trim(),
          aliases: r.aliases
            ? r.aliases.split(/[,;]/).map((a) => a.trim()).filter(Boolean)
            : [],
        })),
    [rows],
  );

  const handleUpload = async (rowId, file) => {
    if (!file) return;
    setUploadingId(rowId);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const safe = `${UPLOAD_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from(STORAGE_BUCKET).upload(safe, file, {
        upsert: false,
        contentType: file.type || undefined,
      });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(safe);
      const url = pub?.publicUrl;
      if (!url) throw new Error('Public URL alınamadı');
      setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, url } : r)));
      toast({ title: 'Yüklendi', description: 'Logo URL satıra yazıldı.' });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Yükleme hatası',
        description: e.message || String(e),
      });
    } finally {
      setUploadingId(null);
    }
  };

  const syncFromFixtures = async () => {
    setSyncing(true);
    setSyncLogs('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast({ variant: 'destructive', title: 'Oturum yok', description: 'Yeniden giriş yapın.' });
        return;
      }
      const base = import.meta.env.VITE_API_BASE || '';
      const res = await fetch(`${base}/api/admin/sync-team-logos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const extra = [body.details, body.hint].filter(Boolean).join(' ');
        const msg = body.error || `HTTP ${res.status}`;
        throw new Error(extra ? `${msg} — ${extra}` : msg);
      }
      if (Array.isArray(body.logs)) setSyncLogs(body.logs.join('\n'));
      toast({
        title: 'Senkron tamam',
        description: `${body.entryCount ?? '?'} takım satırı. Mevcut logolar korundu; yeni satırlara logo ekleyebilirsiniz.`,
      });
      clearSiteDataCache();
    } catch (e) {
      const isNetwork =
        e?.name === 'TypeError' ||
        /Failed to fetch|NetworkError|ECONNREFUSED|Load failed/i.test(String(e?.message || e));
      toast({
        variant: 'destructive',
        title: 'Senkron hatası',
        description: isNetwork
          ? `${e?.message || e} — API sunucusu çalışıyor olmalı: npm run dev:api veya npm run dev:all (varsayılan port 3001). .env içinde SUPABASE_SERVICE_ROLE_KEY tanımlı olmalı.`
          : e.message || String(e),
      });
    } finally {
      setSyncing(false);
    }
  };

  const save = async () => {
    const entries = entriesForSave.map(({ name, url, aliases }) => ({ name, url, aliases }));
    setSaving(true);
    try {
      const ok = await updateSettings('team_logos', { entries });
      if (ok) clearSiteDataCache();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-7 h-7 text-primary" />
          Takım logoları
        </h1>
        <p className="text-slate-400 mt-2 text-sm leading-relaxed">
          Maç programı ve maç sayfalarında, fikstürdeki takım adıyla eşleşen kayıtlar için logo gösterilir.
          İsim <strong className="text-slate-300">fikstürdeki yazıya</strong> yakın olmalı (ör. <code className="text-primary">Galatasaray</code>,{' '}
          <code className="text-primary">Gençlerbirligi</code>). İsteğe bağlı <strong className="text-slate-300">eş adlar</strong> alanına virgülle
          alternatif yazılışlar ekleyebilirsiniz. Görseller <code className="text-slate-500">welcome-images</code> bucket&apos;ına yüklenir (mevcut karşılama
          görselleriyle aynı izinler).
        </p>
      </div>

      <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Fikstürden takımları çek</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Tüm futbol ve NBA/WNBA/NBL liglerinden takım isimlerini indirir, mevcut liste ile birleştirir (URL’ler silinmez).
              Geliştirmede API sunucusu çalışmalı: <code className="text-slate-500">npm run dev:api</code> veya{' '}
              <code className="text-slate-500">npm run dev:all</code>. Üretimde Node API aynı origin’de{' '}
              <code className="text-slate-500">/api</code> ile yayınlanmalı; sunucu <code className="text-slate-500">SUPABASE_SERVICE_ROLE_KEY</code> içermeli.
            </p>
          </div>
          <Button
            type="button"
            onClick={syncFromFixtures}
            disabled={syncing}
            className="shrink-0 bg-amber-600 hover:bg-amber-500 text-white"
          >
            {syncing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Takımları senkronize et
          </Button>
        </div>
        {syncLogs ? (
          <pre className="text-[11px] text-slate-400 bg-black/40 border border-white/10 rounded-lg p-3 max-h-48 overflow-auto whitespace-pre-wrap font-mono">
            {syncLogs}
          </pre>
        ) : null}
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 space-y-4">
        {rows.map((row) => (
          <div
            key={row.id}
            className="grid gap-4 p-4 rounded-xl border border-white/5 bg-black/20 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end"
          >
            <div className="space-y-2">
              <Label className="text-slate-300">Takım adı (fikstürle uyumlu)</Label>
              <Input
                value={row.name}
                onChange={(e) => setRows((p) => p.map((r) => (r.id === row.id ? { ...r, name: e.target.value } : r)))}
                placeholder="Örn. Trabzonspor"
                className="bg-[#05050A] border-white/10"
              />
              <p className="text-[10px] text-slate-500">
                Normalize: {row.name ? normalizeTeamName(row.name) : '—'}
                {row.name ? (
                  <span className="ml-2 text-slate-400">
                    · Sitede URL yoksa kısaltma: <span className="text-primary font-mono">{getTeamInitials(row.name)}</span>
                  </span>
                ) : null}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Logo URL</Label>
              <Input
                value={row.url}
                onChange={(e) => setRows((p) => p.map((r) => (r.id === row.id ? { ...r, url: e.target.value } : r)))}
                placeholder="https://..."
                className="bg-[#05050A] border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Eş adlar (virgülle)</Label>
              <Input
                value={row.aliases}
                onChange={(e) => setRows((p) => p.map((r) => (r.id === row.id ? { ...r, aliases: e.target.value } : r)))}
                placeholder="Besiktas, Beşiktaş JK"
                className="bg-[#05050A] border-white/10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                id={`team-logo-file-${row.id}`}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                disabled={uploadingId === row.id}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = '';
                  if (f) handleUpload(row.id, f);
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-white/10"
                disabled={uploadingId === row.id}
                onClick={() => document.getElementById(`team-logo-file-${row.id}`)?.click()}
              >
                {uploadingId === row.id ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Upload className="w-4 h-4 mr-1" />}
                Yükle
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-400"
                onClick={() => setRows((p) => (p.length <= 1 ? p : p.filter((r) => r.id !== row.id)))}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            {row.url ? (
              <div className="md:col-span-4 flex items-center gap-3 pt-2 border-t border-white/5">
                <img
                  src={row.url}
                  alt={row.name ? `${row.name} takım logosu` : 'Takım logosu önizlemesi'}
                  draggable={false}
                  className="h-10 w-10 rounded-lg object-contain bg-white/10 border border-white/10 select-none pointer-events-none"
                />
                <span className="text-xs text-slate-500">Önizleme</span>
              </div>
            ) : null}
          </div>
        ))}

        <Button type="button" variant="outline" className="border-white/10" onClick={() => setRows((p) => [...p, emptyRow()])}>
          <Plus className="w-4 h-4 mr-2" />
          Satır ekle
        </Button>
      </div>

      {entriesForSave.length > 0 && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-slate-300">
          <p className="font-semibold text-primary mb-2">Hızlı test</p>
          <p className="text-xs text-slate-500 mb-2">Aşağıya fikstürde görünen tam takım adını yazın:</p>
          <TestMatchInput entries={entriesForSave} />
        </div>
      )}

      <Button type="button" onClick={save} disabled={saving || !entriesForSave.length} className="bg-primary hover:bg-primary">
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        Kaydet (site_content: team_logos)
      </Button>
    </div>
  );
};

function TestMatchInput({ entries }) {
  const [q, setQ] = useState('');
  const url = useMemo(() => resolveTeamLogoUrl(q, entries), [q, entries]);
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Örn. Kasimpasa" className="bg-[#05050A] border-white/10 max-w-md" />
      {q.trim() ? (
        url ? (
          <span className="text-[#e50914] text-xs flex items-center gap-2">
            Eşleşti
            <img src={url} alt={q.trim() ? `${q.trim()} takım logosu` : 'Takım logosu'} draggable={false} className="h-8 w-8 rounded object-contain bg-white/10 select-none pointer-events-none" />
          </span>
        ) : (
          <span className="text-amber-400 text-xs">Eşleşme yok — adı veya eş adları kontrol edin.</span>
        )
      ) : null}
    </div>
  );
}

export default TeamLogosPage;
