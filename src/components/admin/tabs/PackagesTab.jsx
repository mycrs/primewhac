import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminTabWrapper from '@/components/admin/AdminTabWrapper';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';
import { Package as PackageIcon, Smartphone, Check, Edit, Trash2, Plus, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/admin/AdminFormControls';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Import new enhanced components
import EnhancedPackageForm from '../EnhancedPackageForm';
import PackagesList from '../PackagesList';
import PackagesPageContentTab from './PackagesPageContentTab';
import { buildPackagePayload, savePackageToSupabase, sortPackagesForDisplay } from '@/utils/buildPackagePayload';
import { inferPackageTier } from '@/constants/packageTiers';
import { packagesNeedTierMigration, packagesTierMigrationHint } from '@/utils/packageTierMigration';

/** Supabase bazen features'ı JSON string döndürür; düzenlerken dizi gönder */
function ensureFeaturesArray(features) {
  if (Array.isArray(features)) return features;
  if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return features.split('\n').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

const AppEditor = ({ appData, onSave, onCancel }) => {
  const [formData, setFormData] = useState(appData);
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
  
  const togglePlatform = (platform) => {
    const platforms = formData.platforms || [];
    setFormData({ ...formData, platforms: platforms.includes(platform) ? platforms.filter(p => p !== platform) : [...platforms, platform] });
  };

  const allPlatforms = ['smarttv', 'ios', 'android', 'pc'];

  return (
    <div className="admin-card">
      <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <h4 className="text-xl font-bold text-white">{appData.id ? 'Uygulamayı Düzenle' : 'Yeni Uygulama Ekle'}</h4>
        <Button onClick={onCancel} variant="ghost" className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input label="Uygulama Adı" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        <Textarea label="Açıklama" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        
        <div>
          <label className="admin-label mb-2">Desteklenen Platformlar</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {allPlatforms.map(platform => (
              <label key={platform} className={`flex items-center justify-center space-x-2 cursor-pointer p-3 rounded-lg border transition-all ${(formData.platforms || []).includes(platform) ? 'bg-primary/20 border-primary text-white' : 'bg-[#0a0a0a]/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                <input type="checkbox" checked={(formData.platforms || []).includes(platform)} onChange={() => togglePlatform(platform)} className="hidden" />
                <span className="capitalize font-medium">{platform === 'smarttv' ? 'Smart TV' : platform === 'ios' ? 'iOS' : platform}</span>
                {(formData.platforms || []).includes(platform) && <Check className="w-4 h-4 text-primary ml-1" />}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2 p-4 bg-[#0a0a0a]/50 rounded-lg border border-slate-700">
           <Switch id="app-rec" checked={formData.recommended || false} onCheckedChange={(checked) => setFormData({...formData, recommended: checked})} className="data-[state=checked]:bg-green-500" />
            <Label htmlFor="app-rec" className="text-white cursor-pointer">Önerilen Uygulama</Label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
          <Button type="button" onClick={onCancel} variant="ghost" className="text-slate-300">İptal</Button>
          <Button type="submit" className="admin-button-success"><Save className="w-4 h-4 mr-2" /> Kaydet</Button>
        </div>
      </form>
    </div>
  );
};

export const PackagesTab = ({ siteData, setSiteData }) => {
  const { toast } = useToast();
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [activeRegion, setActiveRegion] = useState('TR');
  const [editingApp, setEditingApp] = useState(null);
  
  const safeAppsData = Array.isArray(siteData?.appsData) ? siteData.appsData : [];

  const fetchPackages = useCallback(async () => {
    setLoadingPackages(true);
    const { data, error, isFallback, message } = await executeSupabaseQuery(
      () => supabase.from('packages').select('*').order('price', { ascending: true }),
      { retries: 3, context: 'fetch_packages', fallback: [], timeoutMs: 15000 }
    );

    if (error && isFallback) {
      toast({ variant: "destructive", title: "Hata", description: message || "Paketler alınamadı." });
    } else {
      const rows = (data || []).map((p) => ({
        ...p,
        tier: p.tier ?? inferPackageTier(p),
      }));
      setPackages(sortPackagesForDisplay(rows));
    }
    setLoadingPackages(false);
  }, [toast]);

  useEffect(() => { fetchPackages(); }, [fetchPackages]);

  const handleSavePackage = async (formData) => {
    setLoadingPackages(true);
    try {
      const payload = buildPackagePayload(formData);
      const { error, stripped } = await savePackageToSupabase(supabase, {
        id: formData.id,
        payload,
      });

      if (error) {
        toast({ variant: 'destructive', title: 'Hata', description: error.message || 'Paket kaydedilemedi.' });
        return;
      }

      if (stripped?.length > 0) {
        toast({
          title: 'Uyarı',
          description: `Paket kaydedildi. Eksik DB sütunları: ${stripped.join(', ')}. docs/supabase-packages-tier-migration.sql çalıştırın.`,
          className: 'bg-amber-600 border-none text-white',
          duration: 9000,
        });
      } else {
        toast({
          title: 'Başarılı',
          description: formData.id ? 'Paket güncellendi.' : 'Yeni paket oluşturuldu.',
          className: 'bg-green-600 border-none text-white',
        });
      }

      setEditingPackage(null);
      fetchPackages();
    } catch {
      toast({ variant: 'destructive', title: 'Hata', description: 'Beklenmeyen bir hata oluştu.' });
    } finally {
      setLoadingPackages(false);
    }
  };

  const handleDeletePackage = async (id) => {
    setLoadingPackages(true);
    const { error, message } = await executeSupabaseQuery(
        () => supabase.from('packages').delete().eq('id', id),
        { retries: 2, context: 'delete_package' }
    );

    if (error) {
      toast({ variant: "destructive", title: "Hata", description: message || "Silme işlemi başarısız." });
    } else {
      toast({ title: "Başarılı", description: "Paket başarıyla silindi." });
      fetchPackages();
    }
    setLoadingPackages(false);
  };

  const handleSaveApp = (appData) => {
    if(!setSiteData) return;
    const currentApps = Array.isArray(siteData?.appsData) ? siteData.appsData : [];
    const updatedApps = (editingApp && editingApp.id) 
        ? currentApps.map(app => app.id === editingApp.id ? { ...appData, id: editingApp.id } : app)
        : [...currentApps, { ...appData, id: `app_${Date.now()}` }];
    
    setSiteData({ ...siteData, appsData: updatedApps });
    toast({ title: "Başarılı", description: "Uygulama güncellendi" });
    setEditingApp(null);
  };

  const handleDeleteApp = (id) => {
    if(!confirm("Bu uygulamayı silmek istediğinize emin misiniz?")) return;
    if(!setSiteData) return;
    setSiteData({
      ...siteData, 
      appsData: Array.isArray(siteData?.appsData) ? siteData.appsData.filter(app => app.id !== id) : []
    });
    toast({ title: "Başarılı", description: "Uygulama silindi." });
  };

  const tierMigrationPending = packagesNeedTierMigration(packages);

  const filteredPackages = packages.filter(p => {
    const region = (p.region || 'TR').toLowerCase(); 
    if (activeRegion === 'TR') return ['tr', 'turkiye', 'türkiye', 'turkey'].includes(region);
    if (activeRegion === 'EU') return ['eu', 'europe', 'avrupa'].includes(region);
    return false;
  });

  return (
    <AdminTabWrapper title="Paket Yönetimi" description="IPTV paketleri, sayfa içerikleri ve form uygulamalarını yönetin." icon={PackageIcon}>
      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-[#0a0a0a] p-1 rounded-xl">
          <TabsTrigger value="packages" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Paketler</TabsTrigger>
          <TabsTrigger value="page-content" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Sayfa İçeriği</TabsTrigger>
          <TabsTrigger value="apps" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Form Uygulamaları</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-6">
          {editingPackage ? (
            <EnhancedPackageForm 
              initialData={{
                ...editingPackage,
                features: ensureFeaturesArray(editingPackage.features)
              }} 
              loading={loadingPackages} 
              onSubmit={handleSavePackage} 
              onCancel={() => setEditingPackage(null)} 
            />
          ) : (
            <div className="space-y-6">
              {/* Controls Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a0a0a]/50 p-4 rounded-xl border border-slate-800">
                <div className="flex bg-[#0a0a0a] rounded-lg p-1 border border-slate-800">
                  <button 
                    onClick={() => setActiveRegion('TR')} 
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeRegion === 'TR' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-[#0a0a0a]'}`}
                  >
                    Türkiye (TR)
                  </button>
                  <button 
                    onClick={() => setActiveRegion('EU')} 
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeRegion === 'EU' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-[#0a0a0a]'}`}
                  >
                    Avrupa (EU)
                  </button>
                </div>
                
                <Button 
                  onClick={() => setEditingPackage({ features: [], region: activeRegion, enabled: true, popular: false, tier: 'standard', sort_order: 0 })} 
                  className="bg-primary hover:bg-primary text-white shadow-lg shadow-primary/20"
                >
                  <Plus className="w-4 h-4 mr-2" /> Yeni Paket Ekle
                </Button>
              </div>

              {tierMigrationPending && (
                <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                  {packagesTierMigrationHint()}
                </div>
              )}

              {/* Package List */}
              <PackagesList 
                packages={filteredPackages} 
                onEdit={setEditingPackage} 
                onDelete={handleDeletePackage} 
                loading={loadingPackages} 
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="page-content" className="space-y-6">
          <PackagesPageContentTab siteData={siteData} setSiteData={setSiteData} />
        </TabsContent>

        <TabsContent value="apps" className="space-y-6">
          {editingApp ? (
            <AppEditor appData={editingApp} onSave={handleSaveApp} onCancel={() => setEditingApp(null)} />
          ) : (
            <>
               <div className="flex justify-end mb-4">
                    <Button onClick={() => setEditingApp({ platforms: [] })} className="bg-primary hover:bg-primary text-white">
                        <Plus className="w-4 h-4 mr-2" />Yeni Uygulama Ekle
                    </Button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {safeAppsData.map((app) => (
                <div key={app.id} className="admin-card group relative hover:shadow-xl transition-all border border-slate-800 bg-[#0a0a0a] rounded-xl p-5">
                    <div className="absolute top-4 right-4 bg-[#0a0a0a]/80 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 border border-slate-800">
                         <button onClick={() => setEditingApp(app)} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-[#0a0a0a] rounded-md"><Edit className="w-4 h-4"/></button>
                         <button onClick={() => handleDeleteApp(app.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-[#0a0a0a] rounded-md"><Trash2 className="w-4 h-4"/></button>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <Smartphone className="w-6 h-6" />
                        </div>
                        <div>
                            <h5 className="font-bold text-white text-lg">{app.name}</h5>
                            {app.recommended && <span className="inline-block mt-1 text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30 uppercase tracking-wider font-bold">Önerilen</span>}
                        </div>
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-5 line-clamp-2 min-h-[40px]">{app.description}</p>
                    
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
                    {(app.platforms || []).map(platform => (
                        <span key={platform} className="bg-[#0a0a0a] border border-slate-800 text-slate-300 text-[10px] px-2.5 py-1 rounded-md capitalize font-medium">
                        {platform === 'smarttv' ? 'Smart TV' : platform === 'ios' ? 'iOS' : platform}
                        </span>
                    ))}
                    </div>
                </div>
                ))}
            </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </AdminTabWrapper>
  );
};

export default PackagesTab;