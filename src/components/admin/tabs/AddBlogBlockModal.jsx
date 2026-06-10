
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Image as ImageIcon, UploadCloud, Loader2, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AddBlogBlockModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  isSaving, 
  isUploading 
}) => {
  const { toast } = useToast();
  const initialFormState = {
    title: '', slug: '', content: '', excerpt: '', category: '', tags: '',
    author: 'Admin', cover_image_url: '', seo_title: '', seo_description: '',
    published_at: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    console.log(`[AddBlogBlockModal] Modal state changed. isOpen: ${isOpen}, initialData provided: ${!!initialData}`);
    if (isOpen) {
      if (initialData) {
        console.log('[AddBlogBlockModal] Populating form with initialData:', initialData);
        setFormData({
          ...initialData,
          tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || '',
          published_at: initialData.published_at ? initialData.published_at.split('T')[0] : new Date().toISOString().split('T')[0]
        });
        setImagePreview(initialData.cover_image_url || '');
      } else {
        console.log('[AddBlogBlockModal] Resetting form to initial state for new post creation.');
        setFormData(initialFormState);
        setImagePreview('');
      }
      setImageFile(null);
      setLocalError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log(`[AddBlogBlockModal] Input changed - Name: ${name}, Value: ${value}`);
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'title' && !initialData) {
        newData.slug = value.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
      }
      return newData;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log('[AddBlogBlockModal] Image selection changed:', file?.name);
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      console.warn('[AddBlogBlockModal] Image selection failed: File exceeds 5MB limit.');
      toast({ variant: "destructive", title: "Hata", description: "Görsel boyutu 5MB'dan küçük olmalıdır." });
      setLocalError("Görsel boyutu 5MB'dan küçük olmalıdır.");
      return;
    }
    if (!file.type.startsWith('image/')) {
      console.warn('[AddBlogBlockModal] Image selection failed: Invalid file type.');
      toast({ variant: "destructive", title: "Hata", description: "Lütfen geçerli bir görsel yükleyin." });
      setLocalError("Lütfen geçerli bir görsel yükleyin.");
      return;
    }

    console.log('[AddBlogBlockModal] Image selected successfully:', file.name);
    setLocalError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[AddBlogBlockModal] Submit triggered. Validating form...');
    
    setLocalError(null);

    if (!formData.title?.trim() || !formData.content?.trim()) {
      console.error('[AddBlogBlockModal] Validation Error: Title and content are required.');
      toast({ variant: "destructive", title: "Uyarı", description: "Başlık ve içerik alanları zorunludur." });
      setLocalError("Başlık ve içerik alanları zorunludur.");
      return;
    }

    const tagsArray = typeof formData.tags === 'string' 
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) 
      : formData.tags;

    console.log('[AddBlogBlockModal] Form is valid. Calling onSave handler.');
    try {
      await onSave({ ...formData, tags: tagsArray }, imageFile);
      console.log('[AddBlogBlockModal] onSave handler completed successfully.');
    } catch (err) {
      console.error('[AddBlogBlockModal] Exception during save process:', err);
      setLocalError(err.message || 'Kaydetme işlemi sırasında bir hata oluştu.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl w-full max-w-4xl my-auto shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-800 sticky top-0 bg-[#0a0a0a] z-10 rounded-t-xl">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Ekle'}
          </h2>
          <Button variant="ghost" onClick={onClose} disabled={isSaving || isUploading} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {localError && (
          <div className="mx-6 mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            <strong>Hata:</strong> {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-300">Başlık <span className="text-red-500">*</span></Label>
              <Input 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                required 
                disabled={isSaving} 
                className="bg-[#0a0a0a] border-slate-700 text-white"
                placeholder="Blog yazısı başlığı..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">URL (Slug) <span className="text-red-500">*</span></Label>
              <Input 
                name="slug" 
                value={formData.slug} 
                onChange={handleInputChange} 
                required 
                disabled={isSaving} 
                className="bg-[#0a0a0a] border-slate-700 text-white font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Kapak Görseli (Maks 5MB)</Label>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 border border-dashed border-slate-700 rounded-lg bg-[#0a0a0a]/50">
              {imagePreview ? (
                <div className="relative group">
                  <img src={imagePreview} alt="Görsel önizlemesi" className="h-32 w-auto max-w-[200px] object-cover rounded-md border border-slate-700" />
                  <button 
                    type="button"
                    onClick={() => { 
                      console.log('[AddBlogBlockModal] Removing selected image/preview.');
                      setImageFile(null); 
                      setImagePreview(''); 
                      setFormData({...formData, cover_image_url: ''})
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="h-32 w-48 bg-[#0a0a0a] border border-slate-800 rounded-md flex flex-col items-center justify-center text-slate-500 gap-2">
                  <ImageIcon className="w-8 h-8 opacity-50" />
                  <span className="text-xs">Görsel Yok</span>
                </div>
              )}
              
              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 bg-[#0a0a0a] hover:bg-[#0a0a0a] text-white rounded-md h-11 px-4 transition-colors">
                    <UploadCloud className="w-4 h-4" />
                    {imageFile ? 'Görseli Değiştir' : 'Bilgisayardan Seç'}
                  </div>
                  <input 
                    id="image-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange}
                    disabled={isSaving || isUploading}
                  />
                </Label>
                <div className="flex items-center gap-2">
                  <div className="h-px bg-[#0a0a0a] flex-1"></div>
                  <span className="text-xs text-slate-500">VEYA</span>
                  <div className="h-px bg-[#0a0a0a] flex-1"></div>
                </div>
                <Input 
                  name="cover_image_url" 
                  value={formData.cover_image_url} 
                  onChange={(e) => {
                    handleInputChange(e);
                    if(!imageFile) setImagePreview(e.target.value);
                  }} 
                  placeholder="Görsel URL'si yapıştırın" 
                  disabled={isSaving || isUploading || imageFile} 
                  className="bg-[#0a0a0a] border-slate-700 text-white"
                />
              </div>
            </div>
            {isUploading && <div className="text-sm text-primary flex items-center mt-2"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Görsel yükleniyor, lütfen bekleyin...</div>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-300">Kategori</Label>
              <Input name="category" value={formData.category} onChange={handleInputChange} disabled={isSaving} className="bg-[#0a0a0a] border-slate-700 text-white"/>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Etiketler</Label>
              <Input name="tags" value={formData.tags} onChange={handleInputChange} placeholder="virgülle ayırın" disabled={isSaving} className="bg-[#0a0a0a] border-slate-700 text-white"/>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Yazar</Label>
              <Input name="author" value={formData.author} onChange={handleInputChange} disabled={isSaving} className="bg-[#0a0a0a] border-slate-700 text-white"/>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Yayın Tarihi</Label>
              <Input type="date" name="published_at" value={formData.published_at} onChange={handleInputChange} disabled={isSaving} className="bg-[#0a0a0a] border-slate-700 text-white"/>
            </div>
          </div>
          
          <div className="space-y-2">
              <Label className="text-slate-300">Özet (Excerpt) <span className="text-slate-500 text-xs font-normal ml-2">(Boş bırakılırsa içerikten otomatik oluşturulur)</span></Label>
              <Input name="excerpt" value={formData.excerpt} onChange={handleInputChange} disabled={isSaving} className="bg-[#0a0a0a] border-slate-700 text-white" placeholder="Kısa bir özet yazın..."/>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">İçerik <span className="text-red-500">*</span></Label>
            <Textarea 
              name="content" 
              value={formData.content} 
              onChange={handleInputChange} 
              className="h-64 font-mono text-sm bg-[#0a0a0a] border-slate-700 text-white p-4" 
              required 
              disabled={isSaving}
              placeholder="Blog yazınızın içeriğini buraya girin (HTML formatı desteklenir)..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 sticky bottom-0 bg-[#0a0a0a] p-4 -mx-6 -mb-6 rounded-b-xl">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving || isUploading} className="text-slate-300 hover:text-white hover:bg-[#0a0a0a]">
              İptal
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary text-white min-w-[140px]" disabled={isSaving || isUploading}>
              {(isSaving || isUploading) ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : <Save className="w-5 h-5 mr-2" />} 
              {isUploading ? 'Yükleniyor...' : isSaving ? 'Kaydediliyor...' : (initialData ? 'Güncelle' : 'Kaydet')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogBlockModal;
