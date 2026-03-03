
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { 
  Loader2, Image as ImageIcon, X, Bold, Italic, Underline, 
  Heading2, Heading3, List, ListOrdered, Link as LinkIcon, 
  ImagePlus, Eye, Code, CheckCircle2, AlertCircle, Wand2, Info
} from 'lucide-react';
import {
  generateSlugFromTitle,
  validateSlug,
  extractExcerptFromContent,
  generateMetaTitle,
  generateMetaDescription,
  generateKeywordsFromTags,
  debounce
} from '@/utils/blogAutomation';
import { validateBlogPostData } from '@/utils/blogValidator';

const CATEGORIES = [
  'IPTV Genel', 'Kurulum Rehberi', 'Sektör Haberleri', 
  'İnceleme', 'Duyuru', 'İpuçları ve Taktikler'
];

const AdminBlogForm = ({ post, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [existingTags, setExistingTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const contentRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    cover_image_url: '',
    author: 'Admin',
    author_bio: '',
    author_image: '',
    excerpt: '',
    category: '',
    seo_title: '',
    seo_description: '',
    focus_keyword: '',
    isDraft: false,
    featured: false,
    allow_comments: true
  });

  const [manualEdits, setManualEdits] = useState({
    slug: false,
    excerpt: false,
    seo_title: false,
    seo_description: false,
    focus_keyword: false
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchExistingTags();
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        cover_image_url: post.cover_image_url || '',
        author: post.author || 'Admin',
        author_bio: post.author_bio || '',
        author_image: post.author_image || '',
        excerpt: post.excerpt || '',
        category: post.category || '',
        seo_title: post.seo_title || '',
        seo_description: post.seo_description || '',
        focus_keyword: post.focus_keyword || '',
        isDraft: !post.published_at,
        featured: post.featured || false,
        allow_comments: post.allow_comments !== false // Ensure fallback to true
      });
      setTags(post.tags || []);
      
      // If editing existing post, assume everything is manually edited to prevent overwriting
      setManualEdits({
        slug: !!post.slug,
        excerpt: !!post.excerpt,
        seo_title: !!post.seo_title,
        seo_description: !!post.seo_description,
        focus_keyword: !!post.focus_keyword
      });
    }
  }, [post]);

  const fetchExistingTags = async () => {
    try {
      const { data, error } = await supabase.from('blog_posts').select('tags');
      if (error) throw error;
      const allTags = new Set();
      data.forEach(p => p.tags?.forEach(t => allTags.add(t)));
      setExistingTags(Array.from(allTags));
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  // Debounced auto-generators
  const debouncedAutoGenerate = useCallback(
    debounce((newFormData, currentManualEdits, newTags) => {
      setFormData(prev => {
        const updates = { ...prev };
        
        if (!currentManualEdits.slug && newFormData.title) {
          updates.slug = generateSlugFromTitle(newFormData.title);
        }
        
        if (!currentManualEdits.excerpt && newFormData.content) {
          updates.excerpt = extractExcerptFromContent(newFormData.content);
        }
        
        if (!currentManualEdits.seo_title && newFormData.title) {
          updates.seo_title = generateMetaTitle(newFormData.title);
        }
        
        // Use the just-generated or existing excerpt for meta description
        const currentExcerpt = updates.excerpt || newFormData.excerpt;
        if (!currentManualEdits.seo_description && currentExcerpt) {
          updates.seo_description = generateMetaDescription(currentExcerpt);
        }
        
        if (!currentManualEdits.focus_keyword && (newTags.length > 0 || newFormData.title)) {
          updates.focus_keyword = generateKeywordsFromTags(newTags, newFormData.title);
        }
        
        return updates;
      });
    }, 500),
    []
  );

  // Trigger debounced updates when title, content, or tags change
  useEffect(() => {
    debouncedAutoGenerate(formData, manualEdits, tags);
  }, [formData.title, formData.content, tags]);

  const validateForm = () => {
    const { isValid, errors } = validateBlogPostData(formData);
    
    // Add additional specific validation for AdminBlogForm
    if (!formData.cover_image_url?.trim()) errors.cover_image_url = "Kapak görseli zorunludur.";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }

    // Set manual edit flags
    if (['slug', 'excerpt', 'seo_title', 'seo_description', 'focus_keyword'].includes(name)) {
      setManualEdits(prev => ({ ...prev, [name]: true }));
    }
  };

  const handleSwitch = (name) => (checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const insertHtml = (prefix, suffix = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content;
    const selectedText = text.substring(start, end);
    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    
    setFormData(prev => ({ ...prev, content: newText }));
    if (formErrors.content) {
      setFormErrors(prev => ({ ...prev, content: null }));
    }
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const forceAutoFill = (field) => {
    setManualEdits(prev => ({ ...prev, [field]: false }));
    
    setFormData(prev => {
      const updates = { ...prev };
      switch(field) {
        case 'slug': updates.slug = generateSlugFromTitle(prev.title); break;
        case 'excerpt': updates.excerpt = extractExcerptFromContent(prev.content); break;
        case 'seo_title': updates.seo_title = generateMetaTitle(prev.title); break;
        case 'seo_description': updates.seo_description = generateMetaDescription(prev.excerpt || extractExcerptFromContent(prev.content)); break;
        case 'focus_keyword': updates.focus_keyword = generateKeywordsFromTags(tags, prev.title); break;
      }
      return updates;
    });
    
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
    
    toast({ title: 'Otomatik Dolduruldu', description: 'Alan başarıyla güncellendi.', duration: 2000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({ variant: 'destructive', title: 'Doğrulama Hatası', description: 'Lütfen formdaki hataları düzeltin.' });
      return;
    }
    
    setLoading(true);
    try {
      // Optional: Check slug uniqueness if not editing or slug changed
      if (!post || post.slug !== formData.slug) {
        const { data: existingSlugs, error: slugCheckError } = await supabase
          .from('blog_posts')
          .select('id')
          .eq('slug', formData.slug);
          
        if (slugCheckError) throw slugCheckError;
        if (existingSlugs.length > 0) {
          setFormErrors(prev => ({ ...prev, slug: "Bu slug zaten kullanılıyor. Lütfen benzersiz bir slug girin." }));
          toast({ variant: 'destructive', title: 'Hata', description: 'Slug benzersiz olmalıdır.' });
          setLoading(false);
          return;
        }
      }

      const payload = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        cover_image_url: formData.cover_image_url,
        author: formData.author,
        author_bio: formData.author_bio,
        author_image: formData.author_image,
        excerpt: formData.excerpt,
        category: formData.category,
        tags: tags,
        seo_title: formData.seo_title,
        seo_description: formData.seo_description,
        focus_keyword: formData.focus_keyword,
        featured: formData.featured,
        allow_comments: formData.allow_comments,
        published_at: formData.isDraft ? null : (post?.published_at || new Date().toISOString()),
      };

      if (post?.id) {
        const { error } = await supabase.from('blog_posts').update(payload).eq('id', post.id);
        if (error) throw error;
        toast({ title: 'Başarılı', description: 'Yazı başarıyla güncellendi.', icon: <CheckCircle2 className="w-5 h-5 text-green-500" /> });
      } else {
        const { error } = await supabase.from('blog_posts').insert([payload]);
        if (error) throw error;
        toast({ title: 'Başarılı', description: 'Yeni yazı başarıyla eklendi.', icon: <CheckCircle2 className="w-5 h-5 text-green-500" /> });
      }
      onSuccess();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Hata', description: error.message, icon: <AlertCircle className="w-5 h-5" /> });
    } finally {
      setLoading(false);
    }
  };

  const renderFieldLabel = (title, field, isManual, tooltip) => (
    <div className="flex items-center justify-between mb-1.5">
      <div className="flex items-center gap-2">
        <Label className="text-gray-300">{title}</Label>
        {tooltip && (
          <div className="group relative flex items-center">
            <Info className="w-3.5 h-3.5 text-gray-500 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
              {tooltip}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        )}
        <Badge variant="outline" className={`text-[10px] py-0 h-4 border-0 ${isManual ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400'}`}>
          {isManual ? 'Manuel' : 'Otomatik'}
        </Badge>
      </div>
      {isManual && (
        <Button type="button" variant="ghost" size="sm" onClick={() => forceAutoFill(field)} className="h-6 px-2 text-xs text-[#A855F7] hover:text-[#9333EA] hover:bg-[#A855F7]/10 flex items-center gap-1">
          <Wand2 className="w-3 h-3" /> Auto-fill
        </Button>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a1a2e] rounded-xl border border-[#2a2a40] text-gray-100 flex flex-col h-full max-h-[90vh]">
      <div className="p-6 border-b border-[#2a2a40] flex items-center justify-between flex-shrink-0">
        <h2 className="text-2xl font-bold text-white">{post ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}</h2>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={onCancel} className="border-[#2a2a40] hover:bg-[#2a2a40] text-gray-300">İptal</Button>
          <Button type="submit" disabled={loading} className="bg-[#A855F7] hover:bg-[#9333EA] text-white">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {post ? 'Güncelle' : 'Yayınla'}
          </Button>
        </div>
      </div>

      <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-6 bg-[#0F0F1E] border border-[#2a2a40]">
            <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
            <TabsTrigger value="content">İçerik Editörü</TabsTrigger>
            <TabsTrigger value="seo">SEO Ayarları</TabsTrigger>
            <TabsTrigger value="settings">Gelişmiş Ayarlar</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Başlık *</Label>
                  <Input name="title" value={formData.title} onChange={handleChange} placeholder="Harika bir blog yazısı..." className={`bg-[#0F0F1E] border-[#2a2a40] text-white mt-1.5 ${formErrors.title ? 'border-red-500' : ''}`} />
                  {formErrors.title && <p className="text-red-400 text-xs mt-1">{formErrors.title}</p>}
                </div>
                
                <div>
                  {renderFieldLabel('Kalıcı Bağlantı (Slug) *', 'slug', manualEdits.slug, 'Başlıktan otomatik üretilir. URL adresini belirler.')}
                  <Input name="slug" value={formData.slug} onChange={handleChange} placeholder="harika-bir-blog-yazisi" className={`bg-[#0F0F1E] border-[#2a2a40] text-white ${formErrors.slug ? 'border-red-500' : ''}`} />
                  {formErrors.slug && <p className="text-red-400 text-xs mt-1">{formErrors.slug}</p>}
                </div>
                
                <div>
                  <Label className="text-gray-300">Kategori</Label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full mt-1.5 bg-[#0F0F1E] border border-[#2a2a40] text-white rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A855F7]">
                    <option value="">Kategori Seçin</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div>
                  <Label className="text-gray-300">Etiketler</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input 
                      value={tagInput} 
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Etiket yazıp Enter'a basın" 
                      className="bg-[#0F0F1E] border-[#2a2a40] text-white" 
                      list="existing-tags"
                    />
                    <datalist id="existing-tags">
                      {existingTags.map(t => <option key={t} value={t} />)}
                    </datalist>
                    <Button type="button" onClick={handleAddTag} variant="secondary" className="bg-[#2a2a40] hover:bg-[#3a3a50] text-white">Ekle</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/30 flex items-center gap-1 py-1 px-3">
                        {tag} <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    {renderFieldLabel('Özet (Excerpt)', 'excerpt', manualEdits.excerpt, 'İçerikten otomatik çıkarılır. Blog listesinde ve SEO açıklamasında kullanılır.')}
                    <span className={`text-xs ${formData.excerpt.length > 200 ? 'text-amber-400' : 'text-gray-500'}`}>
                      {formData.excerpt.length} / 200
                    </span>
                  </div>
                  <Textarea name="excerpt" value={formData.excerpt} onChange={handleChange} placeholder="Yazının kısa bir özeti..." className="h-24 bg-[#0F0F1E] border-[#2a2a40] text-white resize-none" />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-gray-300">Kapak Görseli *</Label>
                <div className={`border-2 border-dashed ${formErrors.cover_image_url ? 'border-red-500' : 'border-[#2a2a40]'} rounded-xl p-4 bg-[#0F0F1E] flex flex-col items-center justify-center gap-4 group hover:border-[#A855F7]/50 transition-colors relative overflow-hidden`}>
                  {formData.cover_image_url ? (
                    <>
                      <img src={formData.cover_image_url} alt="Cover Preview" className="w-full aspect-video object-cover rounded-lg shadow-md" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm rounded-xl">
                        <Button type="button" variant="destructive" size="sm" onClick={() => setFormData(p => ({...p, cover_image_url: ''}))}>
                          Görseli Kaldır
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="py-12 flex flex-col items-center text-gray-500">
                      <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
                      <p className="text-sm text-center">Henüz görsel seçilmedi</p>
                    </div>
                  )}
                </div>
                <Input name="cover_image_url" value={formData.cover_image_url} onChange={handleChange} placeholder="https://ornek.com/gorsel.jpg" className={`bg-[#0F0F1E] border-[#2a2a40] text-white ${formErrors.cover_image_url ? 'border-red-500' : ''}`} />
                {formErrors.cover_image_url && <p className="text-red-400 text-xs">{formErrors.cover_image_url}</p>}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="animate-in fade-in slide-in-from-bottom-2 h-full flex flex-col">
             {formErrors.content && <div className="mb-2 text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4"/> {formErrors.content}</div>}
            <div className={`border ${formErrors.content ? 'border-red-500' : 'border-[#2a2a40]'} rounded-xl overflow-hidden bg-[#0F0F1E] flex flex-col min-h-[500px]`}>
              <div className="bg-[#1a1a2e] border-b border-[#2a2a40] p-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1">
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertHtml('<b>', '</b>')} className="text-gray-300 hover:text-white hover:bg-[#2a2a40] h-8 w-8 p-0" title="Kalın"><Bold className="w-4 h-4" /></Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertHtml('<i>', '</i>')} className="text-gray-300 hover:text-white hover:bg-[#2a2a40] h-8 w-8 p-0" title="İtalik"><Italic className="w-4 h-4" /></Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertHtml('<u>', '</u>')} className="text-gray-300 hover:text-white hover:bg-[#2a2a40] h-8 w-8 p-0" title="Altı Çizili"><Underline className="w-4 h-4" /></Button>
                  <div className="w-px h-5 bg-[#2a2a40] mx-1"></div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertHtml('<h2>', '</h2>')} className="text-gray-300 hover:text-white hover:bg-[#2a2a40] h-8 w-8 p-0" title="Başlık 2"><Heading2 className="w-4 h-4" /></Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertHtml('<h3>', '</h3>')} className="text-gray-300 hover:text-white hover:bg-[#2a2a40] h-8 w-8 p-0" title="Başlık 3"><Heading3 className="w-4 h-4" /></Button>
                  <div className="w-px h-5 bg-[#2a2a40] mx-1"></div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertHtml('<ul>\n  <li>', '</li>\n</ul>')} className="text-gray-300 hover:text-white hover:bg-[#2a2a40] h-8 w-8 p-0" title="Liste"><List className="w-4 h-4" /></Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertHtml('<ol>\n  <li>', '</li>\n</ol>')} className="text-gray-300 hover:text-white hover:bg-[#2a2a40] h-8 w-8 p-0" title="Sıralı Liste"><ListOrdered className="w-4 h-4" /></Button>
                  <div className="w-px h-5 bg-[#2a2a40] mx-1"></div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertHtml('<a href="URL_BURAYA">', '</a>')} className="text-gray-300 hover:text-white hover:bg-[#2a2a40] h-8 w-8 p-0" title="Bağlantı Ekle"><LinkIcon className="w-4 h-4" /></Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertHtml('<img src="GÖRSEL_URL" alt="Açıklama" />')} className="text-gray-300 hover:text-white hover:bg-[#2a2a40] h-8 w-8 p-0" title="Görsel Ekle"><ImagePlus className="w-4 h-4" /></Button>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setIsPreview(!isPreview)} className="border-[#A855F7] text-[#A855F7] hover:bg-[#A855F7]/10 h-8">
                  {isPreview ? <><Code className="w-4 h-4 mr-2"/> Kod Görünümü</> : <><Eye className="w-4 h-4 mr-2"/> Önizleme</>}
                </Button>
              </div>
              <div className="flex-grow relative">
                {isPreview ? (
                  <div 
                    className="absolute inset-0 p-6 overflow-y-auto prose prose-invert max-w-none bg-[#0F0F1E] prose-p:text-gray-300 prose-headings:text-white prose-a:text-[#A855F7]"
                    dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-gray-500 italic">Önizleme yapılacak içerik yok...</p>' }}
                  />
                ) : (
                  <Textarea 
                    ref={contentRef}
                    name="content" 
                    value={formData.content} 
                    onChange={handleChange} 
                    placeholder="İçeriğinizi buraya yazın veya HTML kodlarınızı yapıştırın..." 
                    className="absolute inset-0 h-full bg-[#0F0F1E] border-0 text-gray-300 font-mono text-sm resize-none focus-visible:ring-0 p-6 rounded-none"
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="mb-1.5">
                     {renderFieldLabel('Focus Keyword (SEO)', 'focus_keyword', manualEdits.focus_keyword, 'Main keyword this blog post targets for SEO')}
                  </div>
                  <Input name="focus_keyword" value={formData.focus_keyword} onChange={handleChange} placeholder="Enter main keyword for this blog post. ex: best IPTV service" className={`bg-[#0F0F1E] border-[#2a2a40] text-white ${formErrors.focus_keyword ? 'border-red-500' : ''}`} />
                  {formErrors.focus_keyword && <p className="text-red-400 text-xs mt-1">{formErrors.focus_keyword}</p>}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    {renderFieldLabel('SEO Başlığı', 'seo_title', manualEdits.seo_title, 'Arama sonuçlarında görünen ana başlık. Başlıktan türetilir.')}
                    <span className={`text-xs ${formData.seo_title.length > 60 ? 'text-red-400' : 'text-gray-500'}`}>
                      {formData.seo_title.length} / 60
                    </span>
                  </div>
                  <Input name="seo_title" value={formData.seo_title} onChange={handleChange} placeholder="Arama sonuçlarında görünecek başlık" className="bg-[#0F0F1E] border-[#2a2a40] text-white" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    {renderFieldLabel('Meta Açıklama', 'seo_description', manualEdits.seo_description, 'Arama sonuçlarında başlığın altında görünen açıklama. Özetteki metinden türetilir.')}
                    <span className={`text-xs ${formData.seo_description.length > 160 ? 'text-red-400' : 'text-gray-500'}`}>
                      {formData.seo_description.length} / 160
                    </span>
                  </div>
                  <Textarea name="seo_description" value={formData.seo_description} onChange={handleChange} placeholder="Arama sonuçlarında görünecek açıklama..." className="h-24 bg-[#0F0F1E] border-[#2a2a40] text-white resize-none" />
                </div>
              </div>

              <div>
                <Label className="text-gray-300 mb-3 block">Google Önizlemesi</Label>
                <div className="bg-white p-4 rounded-lg shadow-sm font-sans">
                  <div className="text-[14px] text-[#202124] flex items-center gap-2 mb-1">
                    <span className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">G</span>
                    <div className="flex flex-col">
                      <span className="leading-tight">primewatch.tv</span>
                      <span className="text-[12px] text-[#4d5156] leading-tight">https://primewatch.tv/blog/{formData.slug || 'ornek-yazi'}</span>
                    </div>
                  </div>
                  <h3 className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer mb-1 leading-snug truncate">
                    {formData.seo_title || formData.title || 'SEO Başlığı Burada Görünecek'}
                  </h3>
                  <p className="text-[14px] text-[#4d5156] leading-snug line-clamp-2 break-all">
                    {formData.seo_description || formData.excerpt || 'Meta açıklaması buraya gelecek. Arama motoru sonuç sayfasında kullanıcıların göreceği açıklama metnidir ve tıklama oranını etkiler.'}
                  </p>
                </div>
                
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2"><Info className="w-4 h-4"/> Otomasyon Bilgisi</h4>
                  <ul className="text-xs text-slate-400 space-y-2">
                    <li>• <b>Slug:</b> Başlık yazıldıkça otomatik oluşturulur.</li>
                    <li>• <b>Özet:</b> İçerik editörüne yazdığınız ilk 200 karakterden alınır.</li>
                    <li>• <b>SEO:</b> Başlık, Özet ve Etiketlerden otomatik optimize edilerek doldurulur.</li>
                    <li>Manuel olarak değiştirdiğiniz alanlar ( <Badge variant="outline" className="text-[9px] py-0 h-3 border-0 bg-amber-500/10 text-amber-400 mx-1">Manuel</Badge> ) bir daha otomatik güncellenmez.</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#0F0F1E] border border-[#2a2a40] rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-[#2a2a40] pb-2">Yayın Ayarları</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-200">Durum</Label>
                    <p className="text-sm text-gray-500">Yazıyı taslak olarak kaydet</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{formData.isDraft ? 'Taslak' : 'Yayınla'}</span>
                    <Switch checked={formData.isDraft} onCheckedChange={handleSwitch('isDraft')} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-200">Öne Çıkan Yazı</Label>
                    <p className="text-sm text-gray-500">Blog anasayfasında öne çıkar</p>
                  </div>
                  <Switch checked={formData.featured} onCheckedChange={handleSwitch('featured')} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-200">Yorumlar (Allow Comments)</Label>
                    <p className="text-sm text-gray-500">Bu yazı için yorumlara izin ver</p>
                  </div>
                  <Switch checked={formData.allow_comments} onCheckedChange={handleSwitch('allow_comments')} />
                </div>
              </div>

              <div className="bg-[#0F0F1E] border border-[#2a2a40] rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-[#2a2a40] pb-2">Yazar Bilgileri</h3>
                
                <div>
                  <Label className="text-gray-300">Yazar Adı</Label>
                  <Input name="author" value={formData.author} onChange={handleChange} className="bg-[#1a1a2e] border-[#2a2a40] text-white mt-1.5" />
                </div>
                
                <div>
                  <Label className="text-gray-300">Yazar Görsel URL</Label>
                  <Input name="author_image" value={formData.author_image} onChange={handleChange} placeholder="https://..." className="bg-[#1a1a2e] border-[#2a2a40] text-white mt-1.5" />
                </div>

                <div>
                  <Label className="text-gray-300">Yazar Biyografisi</Label>
                  <Textarea name="author_bio" value={formData.author_bio} onChange={handleChange} className="h-20 bg-[#1a1a2e] border-[#2a2a40] text-white mt-1.5 resize-none" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </form>
  );
};

export default AdminBlogForm;
