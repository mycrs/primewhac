import React, { useState, useEffect } from 'react';
import { Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useSetupPage } from '@/hooks/useSetupPage';
import { validateSetupSteps } from '@/utils/validateSetupSteps';
import { cn } from '@/lib/utils';
import DynamicAppLinksEditor from './DynamicAppLinksEditor';
import DynamicStepsEditor from './DynamicStepsEditor';
import { useToast } from '@/components/ui/use-toast';

const DeviceInstallationForm = ({ deviceKey, deviceName, existingData }) => {
  const { updateDeviceData } = useSetupPage();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Initialize state with default structure to prevent null errors
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    hero_image: '', // This acts as the device-specific cover image
    app_links: [],
    steps: []
  });

  // Sync state when props change
  useEffect(() => {
    if (existingData) {
      console.log(`[DeviceInstallationForm] Loaded existing data for ${deviceKey}:`, {
          hasSteps: existingData.steps?.length > 0,
          stepsCount: existingData.steps?.length,
          title: existingData.title,
          hero_image: existingData.hero_image
      });
      
      setFormData({
        title: existingData.title || '',
        description: existingData.description || '',
        hero_image: existingData.hero_image || '',
        app_links: Array.isArray(existingData.app_links) ? existingData.app_links : [],
        steps: Array.isArray(existingData.steps) ? existingData.steps : []
      });
    } else {
      // Reset if no data
      console.log(`[DeviceInstallationForm] No existing data for ${deviceKey}, initializing defaults.`);
      setFormData({
        title: `${deviceName} Kurulumu`,
        description: '',
        hero_image: '',
        app_links: [],
        steps: []
      });
    }
    setErrors({});
  }, [existingData, deviceName, deviceKey]);

  const handleSave = async () => {
    setSaving(true);
    console.log(`[DeviceInstallationForm] Starting save process for ${deviceKey}...`);
    console.log(`[DeviceInstallationForm] Payload Steps Count:`, formData.steps.length);
    console.log(`[DeviceInstallationForm] Cover Image (hero_image):`, formData.hero_image);
    
    // Validate
    const validation = validateSetupSteps(formData);
    
    // Validation Logging
    if (!validation.isValid) {
      console.warn(`[DeviceInstallationForm] Validation failed for ${deviceKey}:`, validation.errors);
      setErrors(validation.errors);
      toast({
        variant: "destructive",
        title: "Doğrulama Hatası",
        description: "Lütfen işaretli alanları kontrol ediniz."
      });
      setSaving(false);
      return;
    }

    setErrors({});

    try {
      // Send to backend
      const result = await updateDeviceData(deviceKey, formData);
      
      if (!result.success) {
        throw new Error(result.error?.message || "Kaydetme işlemi başarısız oldu.");
      }
      
      console.log(`[DeviceInstallationForm] Save successful for ${deviceKey}.`);
    } catch (error) {
      console.error(`[DeviceInstallationForm] Critical error during save:`, error);
      toast({
        variant: "destructive",
        title: "Kritik Hata",
        description: "Veriler kaydedilemedi: " + error.message
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 py-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex items-center justify-between sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md p-4 -mx-4 border-b border-slate-800/50 shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            {deviceName} Ayarları
            {existingData && <span className="text-xs font-normal bg-slate-800 text-slate-400 px-2 py-1 rounded-full">Düzenleniyor</span>}
          </h2>
          <p className="text-sm text-slate-400">Bu cihaz için kurulum rehberini ve adımlarını düzenleyin.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className={cn(
            "min-w-[120px] shadow-lg transition-all",
            saving ? "bg-slate-700" : "bg-green-600 hover:bg-green-700 shadow-green-900/20"
          )}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-red-400 font-semibold text-sm">Lütfen aşağıdaki hataları düzeltin:</h4>
            <ul className="list-disc list-inside text-xs text-red-300/80">
              {Object.entries(errors).map(([key, msg]) => (
                typeof msg === 'string' ? <li key={key}>{msg}</li> : null
              ))}
              {errors.stepErrors && <li>Adımlarda eksik bilgiler var (kırmızı alanları kontrol edin).</li>}
            </ul>
          </div>
        </div>
      )}

      {/* Main Info Card */}
      <Card className="bg-slate-900 border-slate-800 shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="grid gap-2">
            <Label className="text-slate-300">Rehber Başlığı *</Label>
            <Input 
              value={formData.title}
              onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
              placeholder="Örn: Android TV Kurulum Rehberi"
              className={cn(
                "bg-slate-950 border-slate-800 text-lg font-semibold",
                errors.title && "border-red-500 ring-1 ring-red-500"
              )}
            />
          </div>
          
          <div className="grid gap-2">
            <Label className="text-slate-300">Kısa Açıklama</Label>
            <Textarea 
              value={formData.description}
              onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
              placeholder="Rehber hakkında kısa bir açıklama..."
              className="bg-slate-950 border-slate-800 min-h-[80px]"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-slate-300">Kapak Görseli URL (Device Cover)</Label>
            <Input 
              value={formData.hero_image}
              onChange={(e) => setFormData(p => ({ ...p, hero_image: e.target.value }))}
              placeholder="https://example.com/device-specific-cover.jpg"
              className="bg-slate-950 border-slate-800 font-mono text-sm"
            />
            <p className="text-xs text-slate-500">Bu görsel, cihaz seçildiğinde arka planda görünecektir.</p>
            {formData.hero_image && (
              <div className="mt-2 h-40 rounded-lg overflow-hidden border border-slate-800 relative bg-slate-950 group">
                <img 
                  src={formData.hero_image} 
                  alt="Preview" 
                  className="w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-100"
                  onError={(e) => e.target.style.display = 'none'}
                />
                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                    Görsel Önizleme
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Links Editor */}
      <DynamicAppLinksEditor 
        appLinks={formData.app_links}
        setAppLinks={(newLinksOrFn) => {
          setFormData(prev => ({
            ...prev,
            app_links: typeof newLinksOrFn === 'function' ? newLinksOrFn(prev.app_links) : newLinksOrFn
          }));
        }}
        errors={errors}
      />

      {/* Steps Editor */}
      <DynamicStepsEditor 
        steps={formData.steps}
        setSteps={(newStepsOrFn) => {
          setFormData(prev => ({
            ...prev,
            steps: typeof newStepsOrFn === 'function' ? newStepsOrFn(prev.steps) : newStepsOrFn
          }));
        }}
        errors={errors}
      />
      
      {/* Bottom Save Button (Floating) */}
      <div className="sticky bottom-6 flex justify-end z-20 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-lg border border-slate-700/50 p-2 rounded-xl shadow-2xl pointer-events-auto transform transition-all hover:scale-105">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white min-w-[160px] font-bold shadow-lg shadow-green-900/30"
          >
            {saving ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Kaydediliyor...
                </>
            ) : (
                <>
                    <Save className="w-4 h-4 mr-2" />
                    Değişiklikleri Kaydet
                </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeviceInstallationForm;