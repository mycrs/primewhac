import React, { useState, useEffect, useCallback } from 'react';
import {
  Save, Loader2, AlertCircle, Plus, Trash2, ChevronDown, ChevronUp,
  Layers, Smartphone, ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useSetupPage } from '@/hooks/useSetupPage';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import DynamicAppLinksEditor from './DynamicAppLinksEditor';
import DynamicStepsEditor from './DynamicStepsEditor';
import {
  INSTALLATION_HUBS,
  HUB_APP_THEMES,
  normalizeHubDeviceConfig,
  createEmptyHubApp,
  validateHubAppsConfig,
} from '@/utils/hubAppsConfig';

const HubAppFaqEditor = ({ faq, setFaq }) => {
  const items = Array.isArray(faq) ? faq : [];

  const addItem = () => {
    setFaq((prev) => [
      ...(Array.isArray(prev) ? prev : []),
      { id: crypto.randomUUID(), q: '', a: '', qDe: '', aDe: '' },
    ]);
  };

  const updateItem = (index, field, value) => {
    setFaq((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeItem = (index) => {
    setFaq((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-slate-300">SSS (isteğe bağlı)</Label>
        <Button type="button" size="sm" variant="outline" onClick={addItem} className="border-slate-700 text-slate-300">
          <Plus className="w-3 h-3 mr-1" /> Soru Ekle
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={item.id || index} className="p-4 rounded-xl border border-slate-800 bg-[#0a0a0a]/40 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Soru {index + 1}</span>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)} className="h-7 w-7 text-red-400">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <Input value={item.q || ''} onChange={(e) => updateItem(index, 'q', e.target.value)} placeholder="Soru (TR)" className="bg-[#0a0a0a] border-slate-800" />
          <Textarea value={item.a || ''} onChange={(e) => updateItem(index, 'a', e.target.value)} placeholder="Cevap (TR)" className="bg-[#0a0a0a] border-slate-800 min-h-[60px]" />
          <Input value={item.qDe || ''} onChange={(e) => updateItem(index, 'qDe', e.target.value)} placeholder="Frage (DE)" className="bg-[#0a0a0a] border-slate-800 text-sm" />
          <Textarea value={item.aDe || ''} onChange={(e) => updateItem(index, 'aDe', e.target.value)} placeholder="Antwort (DE)" className="bg-[#0a0a0a] border-slate-800 min-h-[60px] text-sm" />
        </div>
      ))}
    </div>
  );
};

const HubAppEditor = ({ app, index, hub, errors, onChange, onRemove, onMove, isFirst, isLast, expanded, onToggle }) => {
  const patch = (field, value) => onChange(index, { ...app, [field]: value });

  const applyTheme = (themeValue) => {
    const theme = HUB_APP_THEMES.find((t) => t.value === themeValue) || HUB_APP_THEMES[0];
    onChange(index, {
      ...app,
      theme: theme.value,
      color: theme.color,
      colorLight: theme.colorLight,
      bg: theme.bg,
    });
  };

  const appErrors = errors?.appErrors?.[index] || {};

  return (
    <Card className={cn('bg-[#0a0a0a] border-slate-800 overflow-hidden', expanded && 'border-primary/30')}>
      <CardHeader className="py-3 px-4 bg-[#0a0a0a]/50 border-b border-slate-800 flex flex-row items-center justify-between gap-3">
        <button type="button" onClick={onToggle} className="flex items-center gap-3 min-w-0 text-left flex-1">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black shrink-0', app.bg || 'bg-primary/10', app.colorLight || 'text-primary')}>
            {app.logoInitials || 'APP'}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-white truncate">{app.name || 'Yeni Uygulama'}</div>
            <div className="text-xs text-slate-500 truncate">/{app.slug || 'slug-yok'} · {app.steps?.length || 0} adım</div>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <Button type="button" variant="ghost" size="icon" disabled={isFirst} onClick={() => onMove(index, 'up')} className="h-8 w-8"><ChevronUp className="w-4 h-4" /></Button>
          <Button type="button" variant="ghost" size="icon" disabled={isLast} onClick={() => onMove(index, 'down')} className="h-8 w-8"><ChevronDown className="w-4 h-4" /></Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(index)} className="h-8 w-8 text-red-400"><Trash2 className="w-4 h-4" /></Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="p-5 space-y-6">
          {Object.keys(appErrors).length > 0 && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {Object.values(appErrors).join(' · ')}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-slate-400 text-xs">Uygulama adı (TR) *</Label>
              <Input value={app.name || ''} onChange={(e) => patch('name', e.target.value)} className="bg-[#0a0a0a] border-slate-800" />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-400 text-xs">Uygulama adı (DE)</Label>
              <Input value={app.nameDe || ''} onChange={(e) => patch('nameDe', e.target.value)} className="bg-[#0a0a0a] border-slate-800" />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-400 text-xs">Sayfa slug *</Label>
              <Input value={app.slug || ''} onChange={(e) => patch('slug', e.target.value)} placeholder={`${hub.slugPrefix}-uygulama`} className="bg-[#0a0a0a] border-slate-800 font-mono text-sm" />
              <p className="text-[10px] text-slate-600">URL: /kurulum/{app.slug || '...'}</p>
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-400 text-xs">App ID (kod)</Label>
              <Input value={app.appId || ''} onChange={(e) => patch('appId', e.target.value)} className="bg-[#0a0a0a] border-slate-800 font-mono text-sm" />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-400 text-xs">Kategori etiketi (TR)</Label>
              <Input value={app.categoryTr || ''} onChange={(e) => patch('categoryTr', e.target.value)} placeholder="Örn: XC Player · APK" className="bg-[#0a0a0a] border-slate-800" />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-400 text-xs">Kategori etiketi (DE)</Label>
              <Input value={app.categoryDe || ''} onChange={(e) => patch('categoryDe', e.target.value)} className="bg-[#0a0a0a] border-slate-800" />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label className="text-slate-400 text-xs">Kısa açıklama (TR)</Label>
              <Input value={app.taglineTr || ''} onChange={(e) => patch('taglineTr', e.target.value)} className="bg-[#0a0a0a] border-slate-800" />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label className="text-slate-400 text-xs">Kısa açıklama (DE)</Label>
              <Input value={app.taglineDe || ''} onChange={(e) => patch('taglineDe', e.target.value)} className="bg-[#0a0a0a] border-slate-800" />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-400 text-xs">Logo kısaltması</Label>
              <Input value={app.logoInitials || ''} onChange={(e) => patch('logoInitials', e.target.value.toUpperCase().slice(0, 4))} className="bg-[#0a0a0a] border-slate-800 w-24" />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-400 text-xs">Tema rengi</Label>
              <select
                value={app.theme || 'red'}
                onChange={(e) => applyTheme(e.target.value)}
                className="h-10 rounded-md border border-slate-800 bg-[#0a0a0a] px-3 text-sm text-white"
              >
                {HUB_APP_THEMES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-400 text-xs">İndirme kaynağı (TR)</Label>
              <Input value={app.installSourceTr || ''} onChange={(e) => patch('installSourceTr', e.target.value)} placeholder="APK linki" className="bg-[#0a0a0a] border-slate-800" />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-400 text-xs">İndirme kaynağı (DE)</Label>
              <Input value={app.installSourceDe || ''} onChange={(e) => patch('installSourceDe', e.target.value)} className="bg-[#0a0a0a] border-slate-800" />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label className="text-slate-400 text-xs flex items-center gap-1">Resmi / indirme URL <ExternalLink className="w-3 h-3" /></Label>
              <Input value={app.officialUrl || ''} onChange={(e) => patch('officialUrl', e.target.value)} placeholder="https://..." className="bg-[#0a0a0a] border-slate-800 font-mono text-sm" />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label className="text-slate-400 text-xs">Platform bilgisi (TR)</Label>
              <Input value={app.platformsTr || ''} onChange={(e) => patch('platformsTr', e.target.value)} className="bg-[#0a0a0a] border-slate-800" />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label className="text-slate-400 text-xs">Platform bilgisi (DE)</Label>
              <Input value={app.platformsDe || ''} onChange={(e) => patch('platformsDe', e.target.value)} className="bg-[#0a0a0a] border-slate-800" />
            </div>
          </div>

          <DynamicAppLinksEditor
            appLinks={app.app_links || []}
            setAppLinks={(fn) => {
              const next = typeof fn === 'function' ? fn(app.app_links || []) : fn;
              patch('app_links', next);
            }}
          />

          <DynamicStepsEditor
            steps={app.steps || []}
            setSteps={(fn) => {
              const next = typeof fn === 'function' ? fn(app.steps || []) : fn;
              patch('steps', next);
            }}
          />

          <HubAppFaqEditor
            faq={app.faq || []}
            setFaq={(fn) => {
              const next = typeof fn === 'function' ? fn(app.faq || []) : fn;
              patch('faq', next);
            }}
          />
        </CardContent>
      )}
    </Card>
  );
};

const HubAppsInstallationForm = ({ hubId, existingData }) => {
  const hub = INSTALLATION_HUBS[hubId];
  const { updateDeviceData } = useSetupPage();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [formData, setFormData] = useState(() => normalizeHubDeviceConfig(existingData, hubId));

  useEffect(() => {
    setFormData(normalizeHubDeviceConfig(existingData, hubId));
    setErrors({});
  }, [existingData, hubId]);

  const handleSave = async () => {
    const validation = validateHubAppsConfig(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast({ variant: 'destructive', title: 'Doğrulama hatası', description: 'Lütfen işaretli alanları doldurun.' });
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const result = await updateDeviceData(hub.dbKey, formData);
      if (!result.success) throw new Error(result.error?.message || 'Kayıt başarısız');
    } catch (err) {
      toast({ variant: 'destructive', title: 'Hata', description: err.message });
    } finally {
      setSaving(false);
    }
  };

  const updateApp = useCallback((index, nextApp) => {
    setFormData((prev) => {
      const apps = [...prev.apps];
      apps[index] = nextApp;
      return { ...prev, apps };
    });
  }, []);

  const addApp = () => {
    setFormData((prev) => ({
      ...prev,
      apps: [...(prev.apps || []), createEmptyHubApp(hub.slugPrefix)],
    }));
    setExpandedIndex(formData.apps?.length || 0);
  };

  const removeApp = (index) => {
    if (!window.confirm('Bu uygulamayı silmek istediğinize emin misiniz?')) return;
    setFormData((prev) => ({
      ...prev,
      apps: prev.apps.filter((_, i) => i !== index),
    }));
    setExpandedIndex(Math.max(0, index - 1));
  };

  const moveApp = (index, direction) => {
    setFormData((prev) => {
      const apps = [...prev.apps];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= apps.length) return prev;
      [apps[index], apps[target]] = [apps[target], apps[index]];
      return { ...prev, apps };
    });
  };

  if (!hub) return null;

  return (
    <div className="space-y-8 py-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-md p-4 -mx-4 border-b border-slate-800/50">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" />
            {hub.deviceName} — Hub & Uygulamalar
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Hub kartları ve her uygulama için ayrı kurulum adımları. &quot;Yeni Uygulama&quot; ile ekleyin.
          </p>
          <p className="text-xs text-slate-600 mt-1">Hub: /kurulum/{hub.hubSlug}</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 shrink-0">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Kaydet
        </Button>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <div className="text-sm text-red-300 space-y-1">
            {errors.title && <p>{errors.title}</p>}
            {errors.apps && <p>{errors.apps}</p>}
            {errors.appErrors && <p>Bazı uygulamalarda eksik alan var.</p>}
          </div>
        </div>
      )}

      <Card className="bg-[#0a0a0a] border-slate-800">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-white">Hub genel ayarları</h3>
          <div className="grid gap-2">
            <Label className="text-slate-300">Hub başlığı *</Label>
            <Input
              value={formData.title || ''}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              className={cn('bg-[#0a0a0a] border-slate-800', errors.title && 'border-red-500')}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-slate-300">Hub açıklaması (TR)</Label>
              <Textarea
                value={formData.hub_intro_tr || ''}
                onChange={(e) => setFormData((p) => ({ ...p, hub_intro_tr: e.target.value }))}
                className="bg-[#0a0a0a] border-slate-800 min-h-[80px]"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-300">Hub açıklaması (DE)</Label>
              <Textarea
                value={formData.hub_intro_de || ''}
                onChange={(e) => setFormData((p) => ({ ...p, hub_intro_de: e.target.value }))}
                className="bg-[#0a0a0a] border-slate-800 min-h-[80px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-primary" />
          Uygulamalar ({formData.apps?.length || 0})
        </h3>
        <Button type="button" onClick={addApp} className="bg-primary hover:bg-primary">
          <Plus className="w-4 h-4 mr-2" /> Yeni Uygulama
        </Button>
      </div>

      <div className="space-y-4">
        {(formData.apps || []).map((app, index) => (
          <HubAppEditor
            key={app.id || app.slug || index}
            app={app}
            index={index}
            hub={hub}
            errors={errors}
            expanded={expandedIndex === index}
            onToggle={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
            onChange={updateApp}
            onRemove={removeApp}
            onMove={moveApp}
            isFirst={index === 0}
            isLast={index === formData.apps.length - 1}
          />
        ))}
      </div>

      <div className="sticky bottom-6 flex justify-end z-20">
        <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 shadow-lg">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Değişiklikleri Kaydet
        </Button>
      </div>
    </div>
  );
};

export default HubAppsInstallationForm;
