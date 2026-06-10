import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Save, RefreshCw, Info, ChevronUp, ChevronDown, Loader2, MonitorPlay } from 'lucide-react';
import { Input, Textarea } from '@/components/admin/AdminFormControls';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { clearSiteDataCache } from '@/hooks/useSiteData';
import { useToast } from '@/components/ui/use-toast';
import {
  DEFAULT_IPTV_FLOW_DEVICES_DATA,
  IPTV_FLOW_DEVICE_ICON_OPTIONS,
  normalizeIptvFlowDevicesData,
} from '@/constants/iptvFlowDevices';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import AdminTabWrapper from '@/components/admin/AdminTabWrapper';

const PLATFORM_OPTS = [
  { id: 'smarttv', label: 'Smart TV' },
  { id: 'android', label: 'Android' },
  { id: 'ios', label: 'iOS' },
  { id: 'tablet', label: 'Tablet' },
  { id: 'pc', label: 'PC / Mac' },
];

const emptyRow = () => ({
  id: `cihaz-${Date.now()}`,
  icon: 'tv',
  platforms: ['smarttv', 'android'],
  needsTvBrand: false,
  tr: { name: 'Yeni cihaz', desc: 'Kısa açıklama' },
  de: { name: 'Neues Gerät', desc: 'Kurzbeschreibung' },
});

function cloneRows(source) {
  return JSON.parse(JSON.stringify(source));
}

export const IptvFlowDevicesTab = ({ siteData, setSiteData }) => {
  const { toast } = useToast();
  const [rows, setRows] = useState(() => cloneRows(DEFAULT_IPTV_FLOW_DEVICES_DATA));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const raw = siteData?.iptvFlowDevicesData;
    const norm = normalizeIptvFlowDevicesData(raw);
    setRows(cloneRows(norm || DEFAULT_IPTV_FLOW_DEVICES_DATA));
  }, [siteData?.iptvFlowDevicesData]);

  const move = (index, dir) => {
    const next = [...rows];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setRows(next);
  };

  const updateRow = (index, patch) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const updateNested = (index, lang, field, value) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [lang]: { ...next[index][lang], [field]: value },
      };
      return next;
    });
  };

  const togglePlatform = (index, pid) => {
    setRows((prev) => {
      const next = [...prev];
      const pl = [...(next[index].platforms || [])];
      const i = pl.indexOf(pid);
      if (i >= 0) pl.splice(i, 1);
      else pl.push(pid);
      next[index] = { ...next[index], platforms: pl };
      return next;
    });
  };

  const handleSave = async () => {
    const norm = normalizeIptvFlowDevicesData(rows);
    if (!norm?.length) {
      toast({
        variant: 'destructive',
        title: 'Geçersiz liste',
        description: 'En az bir cihaz olmalı; TR ve DE adları dolu olmalı.',
      });
      return;
    }
    setSaving(true);
    try {
      await setSiteData.setIptvFlowDevicesData(norm);
      clearSiteDataCache();
      toast({
        title: 'Kaydedildi',
        description: 'Test ve sipariş formlarındaki cihaz butonları güncellendi.',
        className: 'bg-green-600 text-white border-none',
      });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Hata', description: String(e?.message || e) });
    } finally {
      setSaving(false);
    }
  };

  const resetDefaults = () => {
    if (!window.confirm('Liste varsayılan 7 cihaza sıfırlanacak. Emin misiniz?')) return;
    setRows(cloneRows(DEFAULT_IPTV_FLOW_DEVICES_DATA));
  };

  return (
    <AdminTabWrapper
      title="Test & sipariş cihazları"
      description="Ücretsiz test modalı, /test sayfası ve satın alma formundaki cihaz kutucuklarını buradan yönetin. Benzer seçenekleri tek satırda birleştirebilirsiniz."
      icon={MonitorPlay}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="border-amber-600/60 text-amber-400" onClick={resetDefaults}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Varsayılanları yükle
          </Button>
          <Button type="button" className="bg-green-600 hover:bg-green-700" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Kaydet
          </Button>
        </div>
      }
    >
      <Alert className="border-primary bg-primary/40 text-primary">
        <Info className="h-4 w-4" />
        <AlertTitle>Uygulama filtresi</AlertTitle>
        <AlertDescription className="text-sm">
          Her cihaz için işaretlediğiniz platformlar, o cihaz seçildiğinde <strong>Akıllı Form Uygulamaları</strong>{' '}
          listesinde hangi uygulamaların görüneceğini belirler (uygulama kartlarındaki platform etiketleri ile eşleşir).
          <br />
          <strong>TV markası sor</strong> açıksa, kullanıcıdan TV marka/model bilgisi istenir (akıllı TV türleri için).
        </AlertDescription>
      </Alert>

      <div className="mt-6 flex justify-end">
        <Button
          type="button"
          variant="secondary"
          className="bg-[#0a0a0a] text-white hover:bg-[#0a0a0a]"
          onClick={() => setRows((r) => [...r, emptyRow()])}
        >
          <Plus className="mr-2 h-4 w-4" />
          Cihaz ekle
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        {rows.map((row, index) => (
          <div
            key={`${row.id}-${index}`}
            className="rounded-xl border border-slate-700/80 bg-[#0a0a0a]/60 p-4 sm:p-6"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Sıra {index + 1}</span>
              <div className="flex flex-wrap items-center gap-1">
                <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => move(index, -1)}>
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => move(index, 1)}>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-red-400 hover:bg-red-500/10"
                  onClick={() => rows.length > 1 && setRows((r) => r.filter((_, i) => i !== index))}
                  disabled={rows.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <Input
                  label="Teknik ID (URL-benzeri)"
                  value={row.id}
                  onChange={(e) => updateRow(index, { id: e.target.value })}
                  className="font-mono text-sm"
                />
                <p className="text-[11px] text-slate-500">Kayıtta küçük harf ve tireye normalize edilir. Örn: smart-tv, tek-tv-secenegi</p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="space-y-1">
                    <Label className="text-slate-400">İkon</Label>
                    <Select value={row.icon} onValueChange={(v) => updateRow(index, { icon: v })}>
                      <SelectTrigger className="w-[180px] border-slate-700 bg-[#0a0a0a] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {IPTV_FLOW_DEVICE_ICON_OPTIONS.map((k) => (
                          <SelectItem key={k} value={k}>
                            {k}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch
                      id={`tvb-${index}`}
                      checked={row.needsTvBrand}
                      onCheckedChange={(c) => updateRow(index, { needsTvBrand: c })}
                    />
                    <Label htmlFor={`tvb-${index}`} className="cursor-pointer text-sm text-slate-300">
                      TV markası sor
                    </Label>
                  </div>
                </div>
              </div>

              <div>
                <Label className="mb-2 block text-slate-400">Uyumlu platformlar (uygulama filtresi)</Label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORM_OPTS.map((p) => {
                    const on = row.platforms?.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePlatform(index, p.id)}
                        className={cn(
                          'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                          on ? 'border-green-500/60 bg-green-500/15 text-green-200' : 'border-slate-700 text-slate-500 hover:border-slate-600'
                        )}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-lg border border-slate-800 bg-[#0a0a0a]/50 p-4">
                <p className="text-xs font-bold uppercase text-green-400">Türkçe</p>
                <Input label="Ad" value={row.tr.name} onChange={(e) => updateNested(index, 'tr', 'name', e.target.value)} />
                <Textarea
                  label="Alt açıklama"
                  value={row.tr.desc}
                  onChange={(e) => updateNested(index, 'tr', 'desc', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-3 rounded-lg border border-slate-800 bg-[#0a0a0a]/50 p-4">
                <p className="text-xs font-bold uppercase text-blue-400">Deutsch</p>
                <Input label="Name" value={row.de.name} onChange={(e) => updateNested(index, 'de', 'name', e.target.value)} />
                <Textarea
                  label="Kurzbeschreibung"
                  value={row.de.desc}
                  onChange={(e) => updateNested(index, 'de', 'desc', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminTabWrapper>
  );
};

export default IptvFlowDevicesTab;
