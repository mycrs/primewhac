
import React, { useState } from 'react';
import { useUpdateSitemapEntry } from '@/hooks/useUpdateSitemapEntry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Plus, Edit2, Trash2, Map, Download, ListPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SitemapManagementTab = () => {
  const { entries, loading, addEntry, updateEntry, deleteEntry, getPublishedEntries, refresh } = useUpdateSitemapEntry();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [filterLang, setFilterLang] = useState('ALL');
  const [isAddingMissing, setIsAddingMissing] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    url: '', page_name: '', language: 'TR', published: true, priority: 0.8, changefreq: 'monthly'
  });

  const frequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

  const missingPages = [
    // TR Pages
    { url: '/blog', page_name: 'Blog Ana Sayfa', language: 'TR', published: true, priority: 0.8, changefreq: 'weekly' },
    { url: '/blog/[slug]', page_name: 'Blog Yazısı', language: 'TR', published: true, priority: 0.7, changefreq: 'weekly' },
    { url: '/blog-kategorileri', page_name: 'Blog Kategorileri', language: 'TR', published: true, priority: 0.7, changefreq: 'monthly' },
    { url: '/video-rehberleri', page_name: 'Video Rehberleri', language: 'TR', published: true, priority: 0.7, changefreq: 'weekly' },
    { url: '/urun-detay', page_name: 'Ürün Detay', language: 'TR', published: true, priority: 0.8, changefreq: 'weekly' },
    { url: '/galeri', page_name: 'Galeri', language: 'TR', published: true, priority: 0.6, changefreq: 'monthly' },
    { url: '/referans', page_name: 'Referanslar', language: 'TR', published: true, priority: 0.6, changefreq: 'monthly' },
    
    // DE Pages
    { url: '/de/blog', page_name: 'Blog Startseite', language: 'DE', published: true, priority: 0.8, changefreq: 'weekly' },
    { url: '/de/blog/[slug]', page_name: 'Blog Artikel', language: 'DE', published: true, priority: 0.7, changefreq: 'weekly' },
    { url: '/de/blog-kategorien', page_name: 'Blog Kategorien', language: 'DE', published: true, priority: 0.7, changefreq: 'monthly' },
    { url: '/de/video-anleitungen', page_name: 'Video Anleitungen', language: 'DE', published: true, priority: 0.7, changefreq: 'weekly' },
    { url: '/de/produkt-details', page_name: 'Produktdetails', language: 'DE', published: true, priority: 0.8, changefreq: 'weekly' },
    { url: '/de/galerie', page_name: 'Galerie', language: 'DE', published: true, priority: 0.6, changefreq: 'monthly' },
    { url: '/de/referenzen', page_name: 'Referenzen', language: 'DE', published: true, priority: 0.6, changefreq: 'monthly' }
  ];

  const handleAddMissingPages = async () => {
    setIsAddingMissing(true);
    let addedCount = 0;
    
    try {
      for (const page of missingPages) {
        // Check if page already exists
        const exists = entries.some(entry => entry.url === page.url);
        if (!exists) {
          await addEntry(page);
          addedCount++;
        }
      }
      
      if (addedCount > 0) {
        toast({
          title: "Success",
          description: `Successfully added ${addedCount} missing pages to the sitemap.`
        });
        if (refresh) await refresh();
      } else {
        toast({
          title: "Info",
          description: "All these pages already exist in the sitemap."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add some pages.",
        variant: "destructive"
      });
    } finally {
      setIsAddingMissing(false);
    }
  };

  const handleOpenModal = (entry = null) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        url: entry.url, page_name: entry.page_name, language: entry.language,
        published: entry.published, priority: parseFloat(entry.priority) || 0.8, changefreq: entry.changefreq
      });
    } else {
      setEditingEntry(null);
      setFormData({ url: '', page_name: '', language: 'TR', published: true, priority: 0.8, changefreq: 'monthly' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = editingEntry 
      ? await updateEntry(editingEntry.id, formData)
      : await addEntry(formData);
    if (success) setIsModalOpen(false);
  };

  const downloadSitemap = async () => {
    try {
      const { generateSitemapXml } = await import('@/utils/sitemapGenerator');
      const baseUrl = window.location.origin || `https://${window.location.hostname}`;
      const xml = await generateSitemapXml(baseUrl);
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "İndirildi", description: "Sitemap (statik + blog + kayıtlar) indirildi." });
    } catch (e) {
      toast({ title: "Hata", description: "Sitemap oluşturulamadı.", variant: "destructive" });
    }
  };

  const filteredEntries = entries.filter(e => filterLang === 'ALL' || e.language === filterLang);

  if (loading && entries.length === 0) return <div className="text-white p-8 text-center">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-6 rounded-xl border border-slate-800 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Map className="w-6 h-6 text-purple-500" />
            Sitemap Management
          </h2>
          <p className="text-gray-400 mt-1">Manage XML sitemap entries and download the generated sitemap.</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={filterLang} onValueChange={setFilterLang}>
            <SelectTrigger className="w-[120px] bg-slate-950 border-slate-800 text-white">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Langs</SelectItem>
              <SelectItem value="TR">TR</SelectItem>
              <SelectItem value="DE">DE</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleAddMissingPages} 
            disabled={isAddingMissing}
            variant="outline" 
            className="border-blue-600 text-blue-400 hover:bg-blue-600/10"
          >
            <ListPlus className="w-4 h-4 mr-2" />
            {isAddingMissing ? 'Adding...' : 'Add Missing Pages'}
          </Button>

          <Button onClick={downloadSitemap} variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600/10">
            <Download className="w-4 h-4 mr-2" />
            Download XML
          </Button>
          <Button onClick={() => handleOpenModal()} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-gray-400">Page Name</TableHead>
                  <TableHead className="text-gray-400">URL</TableHead>
                  <TableHead className="text-gray-400">Lang</TableHead>
                  <TableHead className="text-gray-400">Published</TableHead>
                  <TableHead className="text-gray-400">Priority</TableHead>
                  <TableHead className="text-gray-400">Freq</TableHead>
                  <TableHead className="text-right text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id} className="border-slate-800">
                    <TableCell className="font-medium text-gray-200">{entry.page_name}</TableCell>
                    <TableCell className="text-gray-400 text-sm">{entry.url}</TableCell>
                    <TableCell className="text-gray-400">{entry.language}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${entry.published ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {entry.published ? 'Yes' : 'No'}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-400">{entry.priority}</TableCell>
                    <TableCell className="text-gray-400 capitalize">{entry.changefreq}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(entry)} className="text-blue-400">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteEntry(entry.id)} className="text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>{editingEntry ? 'Edit Entry' : 'New Entry'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Page Name</Label>
                <Input value={formData.page_name} onChange={(e) => setFormData({ ...formData, page_name: e.target.value })} required className="bg-slate-950 border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} required className="bg-slate-950 border-slate-800" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={formData.language} onValueChange={(val) => setFormData({ ...formData, language: val })}>
                  <SelectTrigger className="bg-slate-950 border-slate-800"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="TR">TR</SelectItem><SelectItem value="DE">DE</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Change Frequency</Label>
                <Select value={formData.changefreq} onValueChange={(val) => setFormData({ ...formData, changefreq: val })}>
                  <SelectTrigger className="bg-slate-950 border-slate-800"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {frequencies.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <Label>Priority ({formData.priority})</Label>
              <Slider value={[formData.priority]} min={0} max={1} step={0.1} onValueChange={(val) => setFormData({ ...formData, priority: val[0] })} />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch checked={formData.published} onCheckedChange={(val) => setFormData({ ...formData, published: val })} />
              <Label>Published (Include in XML)</Label>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">{editingEntry ? 'Update' : 'Add'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SitemapManagementTab;
