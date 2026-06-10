import React, { useCallback, useEffect } from 'react';
import { Plus, Trash2, ListOrdered, ChevronUp, ChevronDown, FileImage as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const DynamicStepsEditor = React.memo(({ steps, setSteps, errors = {} }) => {
  
  // Ensure we're working with an array
  const stepsList = Array.isArray(steps) ? steps : [];

  useEffect(() => {
    // Debug logging for steps state changes
    console.log("[DynamicStepsEditor] Current steps count:", stepsList.length);
  }, [stepsList.length]);

  const handleAddStep = useCallback(() => {
    console.log("[DynamicStepsEditor] Adding new step...");
    setSteps(prev => {
      const current = Array.isArray(prev) ? prev : [];
      const newStep = { 
        id: crypto.randomUUID(), 
        title: '', 
        description: '',
        image: ''
      };
      return [...current, newStep];
    });
  }, [setSteps]);

  const handleRemoveStep = useCallback((index) => {
    console.log("[DynamicStepsEditor] Removing step at index:", index);
    setSteps(prev => prev.filter((_, i) => i !== index));
  }, [setSteps]);

  const handleMoveStep = useCallback((index, direction) => {
    console.log(`[DynamicStepsEditor] Moving step ${index} ${direction}`);
    setSteps(prev => {
      const newSteps = [...prev];
      if (direction === 'up' && index > 0) {
        [newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]];
      } else if (direction === 'down' && index < newSteps.length - 1) {
        [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
      }
      return newSteps;
    });
  }, [setSteps]);

  const handleChange = useCallback((index, field, value) => {
    // We don't log every keystroke to avoid console spam, but critical for debugging if needed
    setSteps(prev => {
      const newSteps = [...prev];
      newSteps[index] = { ...newSteps[index], [field]: value };
      return newSteps;
    });
  }, [setSteps]);

  return (
    <div className="space-y-6 mt-8">
      <div className="flex items-center justify-between bg-[#0a0a0a]/50 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#141414]/10 rounded-lg border border-blue-500/20">
            <ListOrdered className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Kurulum Adımları</h3>
            <p className="text-xs text-slate-400">
              Toplam {stepsList.length} adım. Sürükleyerek veya oklarla sıralayabilirsiniz.
            </p>
          </div>
        </div>
        <Button 
          onClick={handleAddStep}
          type="button"
          size="sm"
          className="bg-[#141414] hover:bg-[#0a0a0a] text-white shadow-lg shadow-blue-900/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adım Ekle
        </Button>
      </div>

      {errors.steps && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4" />
          {errors.steps}
        </div>
      )}

      <div className="grid gap-4">
        {stepsList.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl bg-[#0a0a0a]/20 hover:bg-[#0a0a0a]/40 transition-colors">
            <p className="text-slate-500 font-medium">Henüz adım eklenmemiş.</p>
            <p className="text-slate-600 text-sm mt-1 mb-4">Kurulum rehberi için en az bir adım ekleyin.</p>
            <Button variant="outline" size="sm" onClick={handleAddStep} className="border-slate-700 text-slate-300 hover:text-white">
              <Plus className="w-4 h-4 mr-2" />
              İlk Adımı Ekle
            </Button>
          </div>
        ) : (
          stepsList.map((step, index) => (
            <Card key={step.id || `step-${index}`} className="bg-[#0a0a0a] border-slate-800 overflow-hidden group hover:border-slate-700 transition-colors duration-300">
              <CardHeader className="py-3 px-4 bg-[#0a0a0a]/30 border-b border-slate-800 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-[#0a0a0a] text-slate-400 w-6 h-6 rounded flex items-center justify-center text-xs font-mono border border-slate-700">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-300 truncate max-w-[200px] md:max-w-md">
                    {step.title || 'Başlıksız Adım'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => handleMoveStep(index, 'up')}
                    disabled={index === 0}
                    className="h-7 w-7 text-slate-400 hover:text-white hover:bg-[#0a0a0a]"
                    title="Yukarı Taşı"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => handleMoveStep(index, 'down')}
                    disabled={index === stepsList.length - 1}
                    className="h-7 w-7 text-slate-400 hover:text-white hover:bg-[#0a0a0a]"
                    title="Aşağı Taşı"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-4 bg-[#0a0a0a] mx-2" />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => handleRemoveStep(index)}
                    className="h-7 w-7 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                    title="Adımı Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <div className="p-4 grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label className="text-xs text-slate-400 uppercase tracking-wider">Adım Başlığı</Label>
                    <Input 
                      value={step.title || ''}
                      onChange={(e) => handleChange(index, 'title', e.target.value)}
                      placeholder="Örn: Uygulamayı Açın"
                      className={cn(
                        "bg-[#0a0a0a] border-slate-800 focus:border-blue-500/50 transition-colors",
                        errors.stepErrors?.[index]?.title && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    {errors.stepErrors?.[index]?.title && (
                      <span className="text-[10px] text-red-400">{errors.stepErrors[index].title}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs text-slate-400 uppercase tracking-wider">Açıklama</Label>
                    <Textarea 
                      value={step.description || ''}
                      onChange={(e) => handleChange(index, 'description', e.target.value)}
                      placeholder="Adım detaylarını buraya yazın..."
                      className={cn(
                        "bg-[#0a0a0a] border-slate-800 min-h-[100px] focus:border-blue-500/50 transition-colors resize-y",
                        errors.stepErrors?.[index]?.description && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    {errors.stepErrors?.[index]?.description && (
                      <span className="text-[10px] text-red-400">{errors.stepErrors[index].description}</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-400 uppercase tracking-wider">Görsel URL (Opsiyonel)</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={step.image || ''}
                      onChange={(e) => handleChange(index, 'image', e.target.value)}
                      placeholder="https://..."
                      className="bg-[#0a0a0a] border-slate-800 font-mono text-xs"
                    />
                  </div>
                  <div className="aspect-video bg-[#0a0a0a] rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden relative group-hover:border-slate-700 transition-colors">
                    {step.image ? (
                      <img 
                        src={step.image} 
                        alt="Kurulum adımı görsel önizlemesi"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          // Show fallback icon if image fails
                          const parent = e.target.parentElement;
                          if (parent && !parent.querySelector('.fallback-icon')) {
                              // We can't easily inject react component here, so we rely on the else block mostly
                          }
                        }} 
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-700">
                        <ImageIcon className="w-8 h-8 opacity-50" />
                        <span className="text-xs">Görsel Yok</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
});

DynamicStepsEditor.displayName = 'DynamicStepsEditor';

export default DynamicStepsEditor;