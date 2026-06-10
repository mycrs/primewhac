
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Search, Edit, Trash2, Eye, EyeOff, X, Save, MessageSquare, MessageSquare as MessageSquareOff, Star, ExternalLink } from 'lucide-react';
import { validateBlogPostData } from '@/utils/blogValidator';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';
import { pingIndexNowBlogSlug } from '@/utils/pingIndexNow';

const BlogManagementTab = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  
  const [editingPost, setEditingPost] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogPosts();
    
    const channel = supabase.channel('blog_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, () => {
        fetchBlogPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = posts.filter(post => 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.focus_keyword?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.slug?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchTerm, posts]);

  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await executeSupabaseQuery(
        () => supabase
          .from('blog_posts')
          .select('*, allow_comments, featured, focus_keyword, slug')
          .order('created_at', { ascending: false })
      );
        
      if (error) throw error;
      setPosts(data || []);
      setFilteredPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({ variant: "destructive", title: "Hata", description: "Yazılar yüklenemedi. Blog sistemi güncelleniyor olabilir, lütfen birazdan tekrar deneyin." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`"${title}" başlıklı yazıyı silmek istediğinize emin misiniz?`)) return;
    try {
      const { error } = await executeSupabaseQuery(
        () => supabase.from('blog_posts').delete().eq('id', id)
      );
      if (error) throw error;
      toast({ title: "Başarılı", description: "Yazı silindi." });
      fetchBlogPosts();
    } catch (error) {
      toast({ variant: "destructive", title: "Hata", description: "Yazı silinemedi." });
    }
  };

  const togglePublishStatus = async (post) => {
    try {
      const newPublishedAt = post.published_at ? null : new Date().toISOString();
      const { error } = await executeSupabaseQuery(
        () => supabase.from('blog_posts').update({ published_at: newPublishedAt }).eq('id', post.id)
      );
      if (error) throw error;
      toast({ title: "Başarılı", description: newPublishedAt ? "Yazı yayınlandı." : "Yazı taslağa çekildi." });
      if (newPublishedAt && post.slug) {
        void pingIndexNowBlogSlug(post.slug);
      }
      fetchBlogPosts();
    } catch (error) {
      console.error("Error updating publish status:", error);
      toast({ variant: "destructive", title: "Hata", description: "Durum güncellenemedi." });
    }
  };

  const toggleFeaturedStatus = async (post) => {
    try {
      const { error } = await executeSupabaseQuery(
        () => supabase.from('blog_posts').update({ featured: !post.featured }).eq('id', post.id)
      );
      if (error) throw error;
      toast({ title: "Başarılı", description: !post.featured ? "Yazı öne çıkarıldı." : "Öne çıkarma iptal edildi." });
      fetchBlogPosts();
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast({ variant: "destructive", title: "Hata", description: "Öne çıkan durumu güncellenemedi." });
    }
  };

  const handleEditClick = (post) => {
    setEditingPost({ 
      ...post,
      allow_comments: post.allow_comments !== false, // default true
      featured: post.featured || false,
      focus_keyword: post.focus_keyword || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateBlogPost = async (e) => {
    e.preventDefault();
    if (!editingPost || !editingPost.id) return;

    const { isValid, errors } = validateBlogPostData(editingPost);
    if (!isValid) {
      const firstError = Object.values(errors)[0];
      toast({ variant: "destructive", title: "Doğrulama Hatası", description: firstError });
      return;
    }
    
    setIsUpdating(true);
    try {
      const { error } = await executeSupabaseQuery(
        () => supabase
          .from('blog_posts')
          .update({
            title: editingPost.title,
            content: editingPost.content,
            slug: editingPost.slug,
            excerpt: editingPost.excerpt,
            category: editingPost.category,
            tags: editingPost.tags || [],
            seo_title: editingPost.seo_title,
            seo_description: editingPost.seo_description,
            focus_keyword: editingPost.focus_keyword || null,
            author: editingPost.author,
            author_bio: editingPost.author_bio,
            author_image: editingPost.author_image,
            author_url: editingPost.author_url,
            allow_comments: editingPost.allow_comments,
            featured: editingPost.featured
          })
          .eq('id', editingPost.id)
      );

      if (error) throw error;

      toast({ title: "Başarılı", description: "Blog yazısı güncellendi." });
      if (editingPost.published_at && editingPost.slug) {
        void pingIndexNowBlogSlug(editingPost.slug);
      }
      setEditingPost(null);
      setShowEditModal(false);
      fetchBlogPosts();
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast({ variant: "destructive", title: "Hata", description: error.message });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditingPost(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Blog Yönetimi</h2>
          <p className="text-slate-400">Blog yazılarınızı buradan ekleyebilir ve düzenleyebilirsiniz.</p>
        </div>
        <Button onClick={() => toast({ description: "Yeni yazı ekleme modülü BlogManager üzerinden kullanılmalıdır." })} className="bg-primary hover:bg-primary text-white">
          <Plus className="w-4 h-4 mr-2" /> Yeni Yazı Ekle
        </Button>
      </div>

      <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-4 sm:p-6">
        <div className="relative max-w-md mb-6">
          <Input 
            placeholder="Yazılarda veya URL'de (slug) ara..." 
            className="pl-10 bg-[#0a0a0a] border-slate-700 focus:border-primary text-white placeholder-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            Kayıtlı yazı bulunamadı.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className={`bg-[#0a0a0a] border ${post.featured ? 'border-amber-500/50' : 'border-slate-800'} rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${post.published_at ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {post.published_at ? 'Yayında' : 'Taslak'}
                    </span>
                    {post.category && <span className="text-xs text-slate-400">{post.category}</span>}
                    {post.focus_keyword && <span className="text-xs text-blue-400 border border-blue-400/30 bg-[#141414]/10 px-1.5 py-0.5 rounded ml-1 truncate max-w-[120px]">🔑 {post.focus_keyword}</span>}
                    <span className="flex items-center text-xs text-slate-500 ml-2" title={post.allow_comments !== false ? 'Yorumlar Açık' : 'Yorumlar Kapalı'}>
                      {post.allow_comments !== false ? <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> : <MessageSquareOff className="w-3.5 h-3.5 text-red-400" />}
                    </span>
                    {post.featured && (
                      <span className="flex items-center text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded ml-2 font-medium">
                        <Star className="w-3 h-3 mr-1 fill-current" /> Öne Çıkan
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold truncate">{post.title}</h3>
                  <p className="text-sm text-slate-400 truncate">/{post.slug}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white">
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Görüntüle
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toggleFeaturedStatus(post)} className={post.featured ? "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10" : "text-slate-400 hover:text-amber-400"}>
                    <Star className={`w-4 h-4 mr-1 ${post.featured ? 'fill-current' : ''}`} />
                    {post.featured ? 'Öne Çıkarıldı' : 'Öne Çıkar'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => togglePublishStatus(post)} className="text-slate-300 hover:text-white">
                    {post.published_at ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                    {post.published_at ? 'Gizle' : 'Yayınla'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(post)} className="border-slate-700 text-blue-400 hover:text-blue-300">
                    <Edit className="w-4 h-4 mr-1" /> Düzenle
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(post.id, post.title)} className="border-slate-700 text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4 mr-1" /> Sil
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showEditModal && editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto mt-10 mb-10">
            <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-[#0a0a0a]/50">
              <h3 className="text-xl font-bold text-white">Yazıyı Düzenle</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateBlogPost} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 font-medium">Başlık *</label>
                  <Input 
                    value={editingPost.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    className="bg-[#0a0a0a] border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 font-medium">URL (Slug) *</label>
                  <Input 
                    value={editingPost.slug || ''}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    required
                    className="bg-[#0a0a0a] border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400 font-medium">Özet (Excerpt)</label>
                <Textarea 
                  value={editingPost.excerpt || ''}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  className="bg-[#0a0a0a] border-slate-700 text-white h-20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400 font-medium">İçerik (Markdown/HTML) *</label>
                <Textarea 
                  value={editingPost.content || ''}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  required
                  className="bg-[#0a0a0a] border-slate-700 text-white h-40 font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 font-medium">SEO Başlığı</label>
                  <Input 
                    value={editingPost.seo_title || ''}
                    onChange={(e) => handleInputChange('seo_title', e.target.value)}
                    className="bg-[#0a0a0a] border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 font-medium">SEO Açıklaması</label>
                  <Input 
                    value={editingPost.seo_description || ''}
                    onChange={(e) => handleInputChange('seo_description', e.target.value)}
                    className="bg-[#0a0a0a] border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 font-medium">Focus Keyword (SEO)</label>
                  <Input 
                    value={editingPost.focus_keyword || ''}
                    onChange={(e) => handleInputChange('focus_keyword', e.target.value)}
                    placeholder="örn: best IPTV service"
                    className="bg-[#0a0a0a] border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 font-medium">Kategori</label>
                  <Input 
                    value={editingPost.category || ''}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="bg-[#0a0a0a] border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between bg-[#0a0a0a] p-4 rounded-lg border border-slate-700">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium text-white">Yorumlar (Allow Comments)</label>
                    <p className="text-xs text-slate-400">Yorumlara izin ver</p>
                  </div>
                  <Switch 
                    checked={editingPost.allow_comments} 
                    onCheckedChange={(checked) => handleInputChange('allow_comments', checked)} 
                  />
                </div>
                
                <div className="flex items-center justify-between bg-[#0a0a0a] p-4 rounded-lg border border-slate-700">
                  <div className="space-y-0.5 flex flex-col">
                    <label className="text-sm font-medium text-white flex items-center gap-1.5">
                      <Star className={`w-3.5 h-3.5 ${editingPost.featured ? 'text-amber-400 fill-current' : 'text-slate-400'}`} />
                      Öne Çıkan Yazı
                    </label>
                    <p className="text-xs text-slate-400">Blog sayfasında üstte göster</p>
                  </div>
                  <Switch 
                    checked={editingPost.featured} 
                    onCheckedChange={(checked) => handleInputChange('featured', checked)} 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowEditModal(false)}
                  className="border-slate-700 text-slate-300 hover:text-white hover:bg-[#0a0a0a]"
                >
                  İptal
                </Button>
                <Button 
                  type="submit" 
                  disabled={isUpdating}
                  className="bg-primary hover:bg-primary text-white"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Değişiklikleri Kaydet
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagementTab;
