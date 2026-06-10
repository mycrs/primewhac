
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { pingIndexNowBlogSlug } from '@/utils/pingIndexNow';

const AddBlogPostModal = ({ isOpen, onClose, postToEdit, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image_url: '',
    category: '',
    tags: '',
    author: '',
    author_bio: '',
    author_image: '',
    seo_title: '',
    seo_description: ''
  });

  useEffect(() => {
    if (postToEdit) {
      setFormData({
        title: postToEdit.title || '',
        slug: postToEdit.slug || '',
        excerpt: postToEdit.excerpt || '',
        content: postToEdit.content || '',
        cover_image_url: postToEdit.cover_image_url || '',
        category: postToEdit.category || '',
        tags: postToEdit.tags ? postToEdit.tags.join(', ') : '',
        author: postToEdit.author || '',
        author_bio: postToEdit.author_bio || '',
        author_image: postToEdit.author_image || '',
        seo_title: postToEdit.seo_title || '',
        seo_description: postToEdit.seo_description || ''
      });
    } else {
      setFormData({
        title: '', slug: '', excerpt: '', content: '', cover_image_url: '',
        category: '', tags: '', author: '', author_bio: '', author_image: '',
        seo_title: '', seo_description: ''
      });
    }
  }, [postToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title if not editing
    if (name === 'title' && !postToEdit) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content) {
      toast({ variant: "destructive", title: "Hata", description: "Başlık, URL ve İçerik zorunludur." });
      return;
    }

    setLoading(true);
    try {
      const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      
      const postData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image_url: formData.cover_image_url,
        category: formData.category,
        tags: tagsArray,
        author: formData.author,
        author_bio: formData.author_bio,
        author_image: formData.author_image,
        seo_title: formData.seo_title,
        seo_description: formData.seo_description,
        ...(postToEdit ? {} : { published_at: new Date().toISOString() }),
      };

      if (postToEdit) {
        const { error } = await supabase.from('blog_posts').update(postData).eq('id', postToEdit.id);
        if (error) throw error;
        toast({ title: "Başarılı", description: "Yazı güncellendi." });
        if (postToEdit.published_at && formData.slug) {
          void pingIndexNowBlogSlug(formData.slug);
        }
      } else {
        const { error } = await supabase.from('blog_posts').insert([postData]);
        if (error) throw error;
        toast({ title: "Başarılı", description: "Yeni yazı eklendi." });
        if (formData.slug) {
          void pingIndexNowBlogSlug(formData.slug);
        }
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      toast({ variant: "destructive", title: "Hata", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle>{postToEdit ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Başlık *</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required className="bg-[#0a0a0a] border-slate-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL (Slug) *</Label>
              <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required className="bg-[#0a0a0a] border-slate-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Input id="category" name="category" value={formData.category} onChange={handleChange} className="bg-[#0a0a0a] border-slate-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Etiketler (Virgülle ayırın)</Label>
              <Input id="tags" name="tags" value={formData.tags} onChange={handleChange} className="bg-[#0a0a0a] border-slate-700 text-white" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="excerpt">Özet (Excerpt)</Label>
              <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} className="bg-[#0a0a0a] border-slate-700 text-white" rows={2} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="content">İçerik *</Label>
              <Textarea id="content" name="content" value={formData.content} onChange={handleChange} required className="bg-[#0a0a0a] border-slate-700 text-white min-h-[200px]" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cover_image_url">Kapak Görseli URL</Label>
              <Input id="cover_image_url" name="cover_image_url" value={formData.cover_image_url} onChange={handleChange} className="bg-[#0a0a0a] border-slate-700 text-white" />
            </div>
            
            {/* SEO & Author Section */}
            <div className="space-y-2">
              <Label htmlFor="author">Yazar</Label>
              <Input id="author" name="author" value={formData.author} onChange={handleChange} className="bg-[#0a0a0a] border-slate-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author_image">Yazar Görsel URL</Label>
              <Input id="author_image" name="author_image" value={formData.author_image} onChange={handleChange} className="bg-[#0a0a0a] border-slate-700 text-white" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="author_bio">Yazar Biyografisi</Label>
              <Textarea id="author_bio" name="author_bio" value={formData.author_bio} onChange={handleChange} className="bg-[#0a0a0a] border-slate-700 text-white" rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo_title">SEO Başlık</Label>
              <Input id="seo_title" name="seo_title" value={formData.seo_title} onChange={handleChange} className="bg-[#0a0a0a] border-slate-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo_description">SEO Açıklama</Label>
              <Textarea id="seo_description" name="seo_description" value={formData.seo_description} onChange={handleChange} className="bg-[#0a0a0a] border-slate-700 text-white" rows={2} />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="border-slate-700 text-white hover:bg-[#0a0a0a]">İptal</Button>
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary text-white">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {postToEdit ? 'Güncelle' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBlogPostModal;
