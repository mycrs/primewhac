import React, { useCallback } from 'react';
import { Plus, Trash2, Link as LinkIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const DynamicAppLinksEditor = React.memo(({ appLinks, setAppLinks, errors = {} }) => {
  
  // Ensure array
  const links = Array.isArray(appLinks) ? appLinks : [];

  const handleAddLink = useCallback(() => {
    setAppLinks(prev => [
      ...(Array.isArray(prev) ? prev : []),
      { 
        id: crypto.randomUUID(), 
        app_name: '', 
        app_url: '' 
      }
    ]);
  }, [setAppLinks]);

  const handleRemoveLink = useCallback((index) => {
    setAppLinks(prev => prev.filter((_, i) => i !== index));
  }, [setAppLinks]);

  const handleChange = useCallback((index, field, value) => {
    setAppLinks(prev => {
      const newLinks = [...prev];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return newLinks;
    });
  }, [setAppLinks]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-[#0a0a0a]/50 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-white">İndirme Linkleri</h3>
            <p className="text-xs text-slate-400">Cihaz için gerekli uygulama linkleri</p>
          </div>
        </div>
        <Button 
          onClick={handleAddLink}
          type="button"
          size="sm"
          className="bg-primary hover:bg-primary text-white shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Link Ekle
        </Button>
      </div>

      {errors.app_links && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
          {errors.app_links}
        </div>
      )}

      <div className="grid gap-3">
        {links.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl bg-[#0a0a0a]/20">
            <p className="text-slate-500 text-sm">Henüz link eklenmemiş.</p>
          </div>
        ) : (
          links.map((link, index) => (
            <Card key={link.id || index} className="bg-[#0a0a0a] border-slate-800 shadow-sm hover:border-slate-700 transition-colors">
              <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-end">
                <div className="w-full md:w-1/3 grid gap-2">
                  <Label className="text-xs text-slate-400">Uygulama Adı</Label>
                  <Input 
                    value={link.app_name || ''}
                    onChange={(e) => handleChange(index, 'app_name', e.target.value)}
                    placeholder="Örn: Smarters Pro"
                    className={cn(
                      "bg-[#0a0a0a] border-slate-800 h-9 text-sm",
                      errors[`app_links_${index}_name`] && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                </div>
                <div className="w-full md:w-1/2 grid gap-2">
                  <Label className="text-xs text-slate-400">İndirme URL</Label>
                  <Input 
                    value={link.app_url || ''}
                    onChange={(e) => handleChange(index, 'app_url', e.target.value)}
                    placeholder="https://..."
                    className={cn(
                      "bg-[#0a0a0a] border-slate-800 h-9 text-sm font-mono",
                      errors[`app_links_${index}_url`] && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => handleRemoveLink(index)}
                  className="h-9 w-9 text-slate-500 hover:text-red-400 hover:bg-red-900/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
});

DynamicAppLinksEditor.displayName = 'DynamicAppLinksEditor';

export default DynamicAppLinksEditor;