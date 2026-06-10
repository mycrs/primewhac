import React, { useState, useEffect } from 'react';
import { Input, Textarea } from '@/components/admin/AdminFormControls';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { DEFAULT_PACKAGES_PAGE_CONTENT } from '@/data/defaultPackagesPageContent';
import { mergePackageQuizContent } from '@/utils/packageRecommendationQuiz';
import { PACKAGE_TIER_OPTIONS } from '@/constants/packageAdminFields';
import { clearSiteDataCache } from '@/hooks/useSiteData';

const tierIds = ['standard', 'premium'];

const PackagesPageContentTab = ({ siteData, setSiteData }) => {
  const { toast } = useToast();
  const [form, setForm] = useState(DEFAULT_PACKAGES_PAGE_CONTENT);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (siteData?.packagesPageContent) {
      setForm({
        ...DEFAULT_PACKAGES_PAGE_CONTENT,
        ...siteData.packagesPageContent,
        defaults: { ...DEFAULT_PACKAGES_PAGE_CONTENT.defaults, ...siteData.packagesPageContent.defaults },
        page: { ...DEFAULT_PACKAGES_PAGE_CONTENT.page, ...siteData.packagesPageContent.page },
        tiers: { ...DEFAULT_PACKAGES_PAGE_CONTENT.tiers, ...siteData.packagesPageContent.tiers },
        regions: { ...DEFAULT_PACKAGES_PAGE_CONTENT.regions, ...siteData.packagesPageContent.regions },
        seo: { ...DEFAULT_PACKAGES_PAGE_CONTENT.seo, ...siteData.packagesPageContent.seo },
        packageQuiz: mergePackageQuizContent(siteData.packagesPageContent.packageQuiz),
      });
    }
  }, [siteData?.packagesPageContent]);

  const patchQuiz = (field, value) => {
    setForm((prev) => ({
      ...prev,
      packageQuiz: { ...prev.packageQuiz, [field]: value },
    }));
  };

  const patchQuizStep = (stepIndex, field, value) => {
    setForm((prev) => {
      const steps = [...(prev.packageQuiz?.steps || [])];
      steps[stepIndex] = { ...steps[stepIndex], [field]: value };
      return { ...prev, packageQuiz: { ...prev.packageQuiz, steps } };
    });
  };

  const patchQuizOption = (stepIndex, optionIndex, field, value) => {
    setForm((prev) => {
      const steps = [...(prev.packageQuiz?.steps || [])];
      const options = [...(steps[stepIndex]?.options || [])];
      options[optionIndex] = { ...options[optionIndex], [field]: value };
      steps[stepIndex] = { ...steps[stepIndex], options };
      return { ...prev, packageQuiz: { ...prev.packageQuiz, steps } };
    });
  };

  const patch = (path, value) => {
    setForm((prev) => {
      const next = { ...prev };
      const keys = path.split('.');
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const handleSave = async () => {
    if (!setSiteData?.updateSiteContent) return;
    setSaving(true);
    try {
      const { success } = await setSiteData.updateSiteContent('packagesPageContent', form);
      if (success) {
        clearSiteDataCache();
        toast({ title: 'Başarılı', description: 'Paket sayfası içerikleri kaydedildi.' });
      }
    } catch {
      toast({ variant: 'destructive', title: 'Hata', description: 'Kaydedilemedi.' });
    } finally {
      setSaving(false);
    }
  };

  const activeTiers = form.activeTiers || DEFAULT_PACKAGES_PAGE_CONTENT.activeTiers;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Paket Sayfası İçerikleri</h3>
          <p className="text-sm text-slate-400">
            Standart/Premium butonlarının altındaki kısa metinler, bölge açıklamaları ve paket kartlarının altındaki SEO metinleri.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Kaydet
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-[#0a0a0a] flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="general">Genel</TabsTrigger>
          <TabsTrigger value="tiers">Paket Tipleri</TabsTrigger>
          <TabsTrigger value="regions">Bölgeler</TabsTrigger>
          <TabsTrigger value="seo">SEO / GEO</TabsTrigger>
          <TabsTrigger value="quiz">Paket Yardımcısı</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-4 bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-700">
          <p className="text-sm text-slate-400 rounded-lg border border-slate-700 bg-[#0a0a0a]/40 px-3 py-2">
            Sayfa üstü H1 ve kısa açıklama — paket kartlarından <strong>önce</strong> görünür. Uzun SEO metinleri için <strong>SEO / GEO</strong> sekmesini kullanın.
          </p>
          <Input label="Sayfa Başlığı (H1) — TR /paketler" value={form.page?.title || ''} onChange={(e) => patch('page.title', e.target.value)} />
          <Textarea label="Kısa Açıklama — TR" value={form.page?.shortDescription || ''} onChange={(e) => patch('page.shortDescription', e.target.value)} />
          <Input label="Sayfa Başlığı (H1) — DE /de/pakete" value={form.page?.titleDe || ''} onChange={(e) => patch('page.titleDe', e.target.value)} />
          <Textarea label="Kısa Açıklama — DE" value={form.page?.shortDescriptionDe || ''} onChange={(e) => patch('page.shortDescriptionDe', e.target.value)} />
          <Textarea label="Boş Kategori Mesajı — TR" value={form.page?.emptyMessage || ''} onChange={(e) => patch('page.emptyMessage', e.target.value)} />
          <Textarea label="Boş Kategori Mesajı — DE" value={form.page?.emptyMessageDe || ''} onChange={(e) => patch('page.emptyMessageDe', e.target.value)} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700">
            <div>
              <Label className="text-slate-300 mb-2 block">Varsayılan Paket Tipi</Label>
              <select
                className="w-full bg-[#0a0a0a] border border-slate-700 rounded-lg px-3 py-2 text-white"
                value={form.defaults?.tier || 'premium'}
                onChange={(e) => patch('defaults.tier', e.target.value)}
              >
                {PACKAGE_TIER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-slate-300 mb-2 block">Varsayılan Bölge</Label>
              <select
                className="w-full bg-[#0a0a0a] border border-slate-700 rounded-lg px-3 py-2 text-white"
                value={form.defaults?.region || 'tr'}
                onChange={(e) => patch('defaults.region', e.target.value)}
              >
                <option value="tr">Türkiye (tr)</option>
                <option value="eu">Avrupa (eu)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700 space-y-3">
            <p className="text-sm font-semibold text-slate-300">Aktif Paket Tipi Butonları</p>
            {activeTiers.map((tier, idx) => (
              <div key={tier.id} className="flex flex-wrap items-center gap-4 p-3 rounded-lg border border-slate-700 bg-[#0a0a0a]/40">
                <span className="text-white font-medium w-24">{tier.id}</span>
                <Input
                  label="Buton Metni (TR)"
                  value={tier.labelTr || ''}
                  onChange={(e) => {
                    const next = [...activeTiers];
                    next[idx] = { ...tier, labelTr: e.target.value };
                    patch('activeTiers', next);
                  }}
                  className="flex-1 min-w-[200px]"
                />
                <div className="flex items-center gap-2">
                  <Switch
                    checked={tier.enabled !== false}
                    onCheckedChange={(checked) => {
                      const next = [...activeTiers];
                      next[idx] = { ...tier, enabled: checked };
                      patch('activeTiers', next);
                    }}
                  />
                  <span className="text-xs text-slate-400">Göster</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tiers" className="mt-4 space-y-6">
          <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-3 text-sm text-purple-100">
            <strong>/paketler</strong> sayfasında <strong>Standart Paketler</strong> veya <strong>Premium Paketler</strong>{' '}
            butonuna tıklanınca, butonların hemen altında görünen 1–2 satırlık metin buradan düzenlenir.
          </div>
          {tierIds.map((id) => (
            <div key={id} className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-700 space-y-3">
              <h4 className="text-lg font-bold text-white capitalize">{id} Paketleri</h4>
              <Input label="Başlık (SEO alanı)" value={form.tiers?.[id]?.title || ''} onChange={(e) => patch(`tiers.${id}.title`, e.target.value)} />
              <Input
                label="Kısa Açıklama — TR (butonların altı)"
                value={form.tiers?.[id]?.shortDescription || ''}
                onChange={(e) => patch(`tiers.${id}.shortDescription`, e.target.value)}
              />
              <Input
                label="Kısa Açıklama — DE (/de/pakete)"
                value={form.tiers?.[id]?.shortDescriptionDe || ''}
                onChange={(e) => patch(`tiers.${id}.shortDescriptionDe`, e.target.value)}
              />
              {(form.tiers?.[id]?.shortDescription || form.tiers?.[id]?.shortDescriptionDe) && (
                <div className="rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 space-y-1">
                  <p className="text-slate-500 uppercase tracking-wide">Önizleme</p>
                  {form.tiers?.[id]?.shortDescription && (
                    <p><span className="text-slate-500">TR:</span> {form.tiers[id].shortDescription}</p>
                  )}
                  {form.tiers?.[id]?.shortDescriptionDe && (
                    <p><span className="text-slate-500">DE:</span> {form.tiers[id].shortDescriptionDe}</p>
                  )}
                </div>
              )}
              <Textarea label="Detaylı Açıklama (paket kartlarının altı SEO)" value={form.tiers?.[id]?.detailDescription || ''} onChange={(e) => patch(`tiers.${id}.detailDescription`, e.target.value)} />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="regions" className="mt-4 space-y-6">
          {['tr', 'eu'].map((id) => (
            <div key={id} className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-700 space-y-3">
              <h4 className="text-lg font-bold text-white">{id === 'tr' ? 'Türkiye' : 'Avrupa'}</h4>
              <Input label="Başlık" value={form.regions?.[id]?.title || ''} onChange={(e) => patch(`regions.${id}.title`, e.target.value)} />
              <Input label="Kısa Açıklama" value={form.regions?.[id]?.shortDescription || ''} onChange={(e) => patch(`regions.${id}.shortDescription`, e.target.value)} />
              <Textarea label="Detaylı Açıklama" value={form.regions?.[id]?.detailDescription || ''} onChange={(e) => patch(`regions.${id}.detailDescription`, e.target.value)} />
              <Textarea label="Uyarı Metni" value={form.regions?.[id]?.warning || ''} onChange={(e) => patch(`regions.${id}.warning`, e.target.value)} />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="seo" className="mt-4 space-y-6">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            Bu metinler <strong>paket kartlarının altında</strong> görünür (TR: /paketler, DE: /de/pakete). Üstteki H1 ve tier kısa metinleri için <strong>Genel</strong> ve <strong>Paket Tipleri</strong> sekmelerini kullanın.
          </div>
          <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-700 space-y-3">
            <h4 className="font-bold text-white">IPTV Paketleri Nedir?</h4>
            <Input label="Başlık" value={form.seo?.whatIsIptv?.title || ''} onChange={(e) => patch('seo.whatIsIptv.title', e.target.value)} />
            <Textarea
              label="Paragraflar (her satır bir paragraf)"
              value={(form.seo?.whatIsIptv?.paragraphs || []).join('\n\n')}
              onChange={(e) => patch('seo.whatIsIptv.paragraphs', e.target.value.split('\n\n').map((p) => p.trim()).filter(Boolean))}
            />
          </div>

          <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-700 space-y-3">
            <h4 className="font-bold text-white">Bölge Farkı (SEO)</h4>
            <Input label="Başlık" value={form.seo?.regionDifference?.title || ''} onChange={(e) => patch('seo.regionDifference.title', e.target.value)} />
            <Textarea label="İçerik" value={form.seo?.regionDifference?.body || ''} onChange={(e) => patch('seo.regionDifference.body', e.target.value)} />
          </div>

          <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-700 space-y-3">
            <h4 className="font-bold text-white">Nasıl Seçilir?</h4>
            <Input label="Başlık" value={form.seo?.howToChoose?.title || ''} onChange={(e) => patch('seo.howToChoose.title', e.target.value)} />
            <Textarea
              label="Paragraflar"
              value={(form.seo?.howToChoose?.paragraphs || []).join('\n\n')}
              onChange={(e) => patch('seo.howToChoose.paragraphs', e.target.value.split('\n\n').map((p) => p.trim()).filter(Boolean))}
            />
          </div>

          <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-700 space-y-3">
            <h4 className="font-bold text-white">Paket Özellikleri Detaylı</h4>
            <Input label="Başlık" value={form.seo?.featuresDetail?.title || ''} onChange={(e) => patch('seo.featuresDetail.title', e.target.value)} />
            <Textarea label="Giriş" value={form.seo?.featuresDetail?.intro || ''} onChange={(e) => patch('seo.featuresDetail.intro', e.target.value)} />
          </div>

          <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-700 space-y-3">
            <h4 className="font-bold text-white">Kullanım İpuçları</h4>
            <Input label="Başlık" value={form.seo?.usageTips?.title || ''} onChange={(e) => patch('seo.usageTips.title', e.target.value)} />
            <Textarea label="Giriş" value={form.seo?.usageTips?.intro || ''} onChange={(e) => patch('seo.usageTips.intro', e.target.value)} />
            <Textarea
              label="Madde listesi (her satır bir madde)"
              value={(form.seo?.usageTips?.items || []).join('\n')}
              onChange={(e) => patch('seo.usageTips.items', e.target.value.split('\n').map((p) => p.trim()).filter(Boolean))}
            />
          </div>

          <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-700 space-y-3">
            <h4 className="font-bold text-white">SSS Teaser</h4>
            <Input label="Başlık" value={form.seo?.faq?.title || ''} onChange={(e) => patch('seo.faq.title', e.target.value)} />
            <Textarea label="Açıklama" value={form.seo?.faq?.description || ''} onChange={(e) => patch('seo.faq.description', e.target.value)} />
          </div>
        </TabsContent>

        <TabsContent value="quiz" className="mt-4 space-y-6">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            <strong>Hangi paketi almalıyım?</strong> butonu ve açılan soru-cevap penceresi. Öneri mantığı (Standart/Premium puanları) sabittir; burada yalnızca <strong>metinleri</strong> düzenlersiniz.
          </div>

          <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-700 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <Label className="text-white font-semibold">Yardımcı aktif</Label>
              <Switch
                checked={form.packageQuiz?.enabled !== false}
                onCheckedChange={(checked) => patchQuiz('enabled', checked)}
              />
            </div>
            <Input
              label="Buton metni — TR"
              value={form.packageQuiz?.buttonLabel || ''}
              onChange={(e) => patchQuiz('buttonLabel', e.target.value)}
            />
            <Input
              label="Buton metni — DE"
              value={form.packageQuiz?.buttonLabelDe || ''}
              onChange={(e) => patchQuiz('buttonLabelDe', e.target.value)}
            />
            <Input
              label="Pencere başlığı — TR"
              value={form.packageQuiz?.dialogTitle || ''}
              onChange={(e) => patchQuiz('dialogTitle', e.target.value)}
            />
            <Input
              label="Pencere başlığı — DE"
              value={form.packageQuiz?.dialogTitleDe || ''}
              onChange={(e) => patchQuiz('dialogTitleDe', e.target.value)}
            />
            <Textarea
              label="Sonuç açıklaması — TR"
              value={form.packageQuiz?.resultIntro || ''}
              onChange={(e) => patchQuiz('resultIntro', e.target.value)}
            />
            <Textarea
              label="Sonuç açıklaması — DE"
              value={form.packageQuiz?.resultIntroDe || ''}
              onChange={(e) => patchQuiz('resultIntroDe', e.target.value)}
            />
            <Input
              label="Uygula butonu — TR"
              value={form.packageQuiz?.applyButtonLabel || ''}
              onChange={(e) => patchQuiz('applyButtonLabel', e.target.value)}
            />
            <Input
              label="Uygula butonu — DE"
              value={form.packageQuiz?.applyButtonLabelDe || ''}
              onChange={(e) => patchQuiz('applyButtonLabelDe', e.target.value)}
            />
          </div>

          {(form.packageQuiz?.steps || []).map((step, stepIdx) => (
            <div key={step.id || stepIdx} className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-700 space-y-3">
              <h4 className="text-lg font-bold text-white">
                Adım {stepIdx + 1}: {step.id}
              </h4>
              <Input
                label="Soru — TR"
                value={step.question || ''}
                onChange={(e) => patchQuizStep(stepIdx, 'question', e.target.value)}
              />
              <Input
                label="Soru — DE"
                value={step.questionDe || ''}
                onChange={(e) => patchQuizStep(stepIdx, 'questionDe', e.target.value)}
              />
              <Input
                label="İpucu — TR"
                value={step.hint || ''}
                onChange={(e) => patchQuizStep(stepIdx, 'hint', e.target.value)}
              />
              <Input
                label="İpucu — DE"
                value={step.hintDe || ''}
                onChange={(e) => patchQuizStep(stepIdx, 'hintDe', e.target.value)}
              />
              <div className="pt-2 space-y-3 border-t border-slate-700">
                <p className="text-sm font-semibold text-slate-300">Seçenekler</p>
                {(step.options || []).map((opt, optIdx) => (
                  <div key={opt.id || optIdx} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg bg-[#0a0a0a]/40 border border-slate-800">
                    <span className="text-xs text-slate-500 md:col-span-2">ID: {opt.id}</span>
                    <Input
                      label="Seçenek TR"
                      value={opt.label || ''}
                      onChange={(e) => patchQuizOption(stepIdx, optIdx, 'label', e.target.value)}
                    />
                    <Input
                      label="Seçenek DE"
                      value={opt.labelDe || ''}
                      onChange={(e) => patchQuizOption(stepIdx, optIdx, 'labelDe', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-700 space-y-3">
            <h4 className="font-bold text-white">Sonuç gerekçeleri (her satır bir madde)</h4>
            <Textarea
              label="Standart — TR"
              value={(form.packageQuiz?.reasons?.standardTr || []).join('\n')}
              onChange={(e) =>
                patchQuiz('reasons', {
                  ...form.packageQuiz?.reasons,
                  standardTr: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                })
              }
            />
            <Textarea
              label="Premium — TR"
              value={(form.packageQuiz?.reasons?.premiumTr || []).join('\n')}
              onChange={(e) =>
                patchQuiz('reasons', {
                  ...form.packageQuiz?.reasons,
                  premiumTr: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                })
              }
            />
            <Input
              label="Türkiye bölgesi — TR"
              value={form.packageQuiz?.reasons?.regionTrTr || ''}
              onChange={(e) =>
                patchQuiz('reasons', { ...form.packageQuiz?.reasons, regionTrTr: e.target.value })
              }
            />
            <Input
              label="Avrupa bölgesi — TR"
              value={form.packageQuiz?.reasons?.regionEuTr || ''}
              onChange={(e) =>
                patchQuiz('reasons', { ...form.packageQuiz?.reasons, regionEuTr: e.target.value })
              }
            />
            <Textarea
              label="Standart — DE"
              value={(form.packageQuiz?.reasons?.standardDe || []).join('\n')}
              onChange={(e) =>
                patchQuiz('reasons', {
                  ...form.packageQuiz?.reasons,
                  standardDe: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                })
              }
            />
            <Textarea
              label="Premium — DE"
              value={(form.packageQuiz?.reasons?.premiumDe || []).join('\n')}
              onChange={(e) =>
                patchQuiz('reasons', {
                  ...form.packageQuiz?.reasons,
                  premiumDe: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                })
              }
            />
            <Input
              label="Türkiye bölgesi — DE"
              value={form.packageQuiz?.reasons?.regionTrDe || ''}
              onChange={(e) =>
                patchQuiz('reasons', { ...form.packageQuiz?.reasons, regionTrDe: e.target.value })
              }
            />
            <Input
              label="Avrupa bölgesi — DE"
              value={form.packageQuiz?.reasons?.regionEuDe || ''}
              onChange={(e) =>
                patchQuiz('reasons', { ...form.packageQuiz?.reasons, regionEuDe: e.target.value })
              }
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PackagesPageContentTab;
