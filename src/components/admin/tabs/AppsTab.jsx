import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Star, Check, Smartphone, Monitor, Tv, Tablet, RefreshCw, Info } from 'lucide-react';
import { Input, Textarea } from '@/components/admin/AdminFormControls';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { defaultData } from '@/data/defaultSiteData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const AppsTab = ({ siteData, setSiteData }) => {
    const { appsData } = siteData;
    const { setAppsData } = setSiteData;
    const [showConfirm, setShowConfirm] = useState(false);

    // Defensive check: Ensure appsData is an array
    const safeApps = Array.isArray(appsData) ? appsData : [];

    const platforms = [
        { id: 'smarttv', label: 'Smart TV', icon: Tv },
        { id: 'ios', label: 'iOS (Apple)', icon: Smartphone },
        { id: 'android', label: 'Android', icon: Tablet },
        { id: 'pc', label: 'PC / Laptop', icon: Monitor }
    ];

    const handleAddApp = () => {
        const newApp = {
            id: `app-${Date.now()}`,
            name: 'Yeni Uygulama',
            description: '',
            platforms: [],
            recommended: false
        };
        setAppsData([...safeApps, newApp]);
    };

    const handleLoadDefaults = () => {
        setShowConfirm(true);
    };

    const confirmLoadDefaults = () => {
        // Ensure defaultData.appsData is used, fallback to empty array if missing
        setAppsData(defaultData.appsData || []);
        setShowConfirm(false);
    };

    const handleRemoveApp = (index) => {
        const newApps = [...safeApps];
        newApps.splice(index, 1);
        setAppsData(newApps);
    };

    const handleChange = (index, field, value) => {
        const newApps = [...safeApps];
        newApps[index][field] = value;
        setAppsData(newApps);
    };

    const togglePlatform = (appIndex, platformId) => {
        const newApps = [...safeApps];
        const currentPlatforms = Array.isArray(newApps[appIndex].platforms) ? newApps[appIndex].platforms : [];
        
        if (currentPlatforms.includes(platformId)) {
            newApps[appIndex].platforms = currentPlatforms.filter(p => p !== platformId);
        } else {
            newApps[appIndex].platforms = [...currentPlatforms, platformId];
        }
        setAppsData(newApps);
    };

    return (
        <div className="space-y-8 h-full flex flex-col">
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogTitle>Varsayılan Listeyi Yükle</AlertDialogTitle>
                    <AlertDialogDescription>
                        Mevcut uygulama listeniz silinecek ve varsayılan tam liste yüklenecek. Onaylıyor musunuz?
                    </AlertDialogDescription>
                    <div className="flex gap-3 justify-end">
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmLoadDefaults} className="bg-yellow-600 hover:bg-yellow-700">
                            Yükle
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex items-center justify-between flex-shrink-0">
                <div>
                    <h3 className="text-2xl font-bold text-white">Akıllı Form Uygulamaları</h3>
                    <p className="text-gray-400 text-sm mt-1">Sitedeki formlarda kullanılacak uygulamaları yönetin.</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleLoadDefaults} variant="outline" className="border-yellow-600 text-yellow-500 hover:bg-yellow-900/20">
                        <RefreshCw className="w-4 h-4 mr-2" /> Varsayılan Listeyi Yükle
                    </Button>
                    <Button onClick={handleAddApp} className="bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4 mr-2" /> Yeni Uygulama Ekle
                    </Button>
                </div>
            </div>

            {/* Info Alert */}
            <Alert className="bg-purple-900/20 border-purple-800 text-purple-200">
                <Info className="h-4 w-4" />
                <AlertTitle>Bilgilendirme</AlertTitle>
                <AlertDescription className="mt-2 text-sm">
                    Bu listedeki uygulamalar hem <strong>"Satın Al"</strong> (Sipariş Formu) hem de <strong>"Test Al"</strong> (Test Formu) ekranlarında müşterilere gösterilir.
                    <br />
                    Her uygulama için seçtiğiniz platformlar, müşterinin seçtiği cihaza göre filtreleme yapılmasını sağlar.
                </AlertDescription>
            </Alert>

            {/* Scrollable Area for Apps List */}
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar min-h-0" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                <div className="grid grid-cols-1 gap-6 pb-4">
                    {safeApps.map((app, index) => (
                        <div key={app.id || index} className="glass-effect p-6 rounded-xl border border-gray-700/50 relative group">
                            <div className="absolute top-4 right-4 flex items-center gap-2">
                                <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-gray-700">
                                    <Label htmlFor={`rec-${index}`} className="text-xs font-medium text-gray-300 cursor-pointer select-none">Önerilen</Label>
                                    <Switch
                                        id={`rec-${index}`}
                                        checked={app.recommended}
                                        onCheckedChange={(checked) => handleChange(index, 'recommended', checked)}
                                        className="data-[state=checked]:bg-yellow-400"
                                    />
                                    {app.recommended && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 ml-1" />}
                                </div>
                                <Button 
                                    onClick={() => handleRemoveApp(index)} 
                                    variant="destructive" 
                                    size="icon"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                <div className="space-y-4">
                                    <Input 
                                        label="Uygulama Adı" 
                                        value={app.name} 
                                        onChange={(e) => handleChange(index, 'name', e.target.value)} 
                                        placeholder="Örn: Qruze Player"
                                    />
                                    <Input 
                                        label="Benzersiz ID (Otomatik)" 
                                        value={app.id} 
                                        disabled
                                        className="opacity-50 cursor-not-allowed font-mono text-xs"
                                    />
                                    <Textarea 
                                        label="Kısa Açıklama" 
                                        value={app.description} 
                                        onChange={(e) => handleChange(index, 'description', e.target.value)} 
                                        placeholder="Uygulama hakkında kısa bilgi..."
                                        rows={2}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-gray-300 text-sm font-medium block mb-2">Desteklenen Platformlar</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {platforms.map(platform => {
                                            const Icon = platform.icon;
                                            const isSelected = app.platforms?.includes(platform.id);
                                            return (
                                                <button
                                                    key={platform.id}
                                                    onClick={() => togglePlatform(index, platform.id)}
                                                    className={cn(
                                                        "flex items-center gap-3 p-3 rounded-lg border transition-all text-sm font-medium text-left",
                                                        isSelected 
                                                            ? "bg-blue-600/20 border-blue-500 text-blue-100" 
                                                            : "bg-slate-800/50 border-gray-700 text-gray-400 hover:border-gray-600 hover:bg-slate-800"
                                                    )}
                                                >
                                                    <Icon className={cn("w-4 h-4", isSelected ? "text-blue-400" : "text-gray-500")} />
                                                    <span>{platform.label}</span>
                                                    {isSelected && <Check className="w-3 h-3 ml-auto text-blue-400" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {!app.platforms?.length && (
                                        <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                                            * En az bir platform seçmelisiniz.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {safeApps.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-xl bg-slate-800/30">
                            <p className="text-gray-400 mb-4">Henüz hiç uygulama eklenmemiş.</p>
                            <div className="flex gap-4 justify-center">
                                <Button onClick={handleLoadDefaults} variant="default" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                                    <RefreshCw className="w-4 h-4 mr-2" /> Varsayılanları Yükle
                                </Button>
                                <Button onClick={handleAddApp} variant="outline" className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700">
                                    <Plus className="w-4 h-4 mr-2" /> Boş Ekle
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppsTab;