
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';

export const useBlogBlockManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const fetchPosts = useCallback(async () => {
    console.log('[useBlogBlockManager] fetchPosts: Fetching blog posts from Supabase...');
    setLoading(true);
    try {
      const { data, error } = await executeSupabaseQuery(() =>
        supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false })
      );

      if (error) {
        console.error('[useBlogBlockManager] fetchPosts Error:', error);
        toast({ variant: "destructive", title: "Hata", description: "Blog yazıları yüklenemedi." });
      } else {
        console.log(`[useBlogBlockManager] fetchPosts: Successfully fetched ${data?.length || 0} posts.`, data);
        setPosts(data || []);
      }
    } catch (err) {
      console.error('[useBlogBlockManager] fetchPosts Unexpected Error:', err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    console.log('[useBlogBlockManager] Hook mounted, initial fetch starting.');
    fetchPosts();
  }, [fetchPosts]);

  const uploadImage = async (imageFile) => {
    console.log('[useBlogBlockManager] uploadImage: Starting upload for file:', imageFile?.name);
    if (!imageFile) return null;
    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `blog_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      console.log(`[useBlogBlockManager] uploadImage: Generated filePath: ${filePath}`);

      const { error: uploadError } = await supabase.storage
        .from('welcome-images')
        .upload(filePath, imageFile, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error('[useBlogBlockManager] uploadImage Supabase Error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('welcome-images')
        .getPublicUrl(filePath);

      console.log(`[useBlogBlockManager] uploadImage: Upload successful. Public URL: ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      console.error("[useBlogBlockManager] uploadImage Exception:", error);
      toast({ variant: "destructive", title: "Yükleme Hatası", description: "Görsel yüklenirken bir hata oluştu." });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (url) => {
    console.log(`[useBlogBlockManager] deleteImage: Attempting to delete image: ${url}`);
    if (!url || !url.includes('welcome-images/blog/')) {
      console.log('[useBlogBlockManager] deleteImage: URL is not valid or not from welcome-images/blog/ bucket. Skipping.');
      return;
    }
    try {
      const pathParts = url.split('welcome-images/');
      if (pathParts.length > 1) {
        const path = pathParts[1];
        const { error } = await supabase.storage.from('welcome-images').remove([path]);
        if (error) {
          console.error('[useBlogBlockManager] deleteImage Supabase Error:', error);
        } else {
          console.log(`[useBlogBlockManager] deleteImage: Successfully deleted ${path}`);
        }
      }
    } catch (error) {
      console.error("[useBlogBlockManager] deleteImage Exception:", error);
    }
  };

  const savePost = async (postData, imageFile) => {
    console.log('[useBlogBlockManager] savePost: Initiating save operation. Data:', postData, 'Image:', imageFile?.name);
    setIsSaving(true);
    try {
      let finalImageUrl = postData.cover_image_url;
      
      if (imageFile) {
        console.log('[useBlogBlockManager] savePost: Image file detected, starting upload process...');
        finalImageUrl = await uploadImage(imageFile);
        if (editingPost && editingPost.cover_image_url && editingPost.cover_image_url !== finalImageUrl) {
          console.log('[useBlogBlockManager] savePost: Deleting old cover image...');
          await deleteImage(editingPost.cover_image_url);
        }
      }

      // Auto-generate excerpt if empty
      let finalExcerpt = postData.excerpt;
      if (!finalExcerpt && postData.content) {
        finalExcerpt = postData.content.substring(0, 150).replace(/<[^>]*>?/gm, '') + '...';
        console.log('[useBlogBlockManager] savePost: Auto-generated excerpt:', finalExcerpt);
      }

      // Auto-generate slug if empty
      let finalSlug = postData.slug;
      if (!finalSlug && postData.title) {
        finalSlug = postData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
        console.log('[useBlogBlockManager] savePost: Auto-generated slug:', finalSlug);
      }

      const payload = { 
        ...postData, 
        cover_image_url: finalImageUrl,
        excerpt: finalExcerpt,
        slug: finalSlug
      };

      console.log('[useBlogBlockManager] savePost: Final payload for DB:', payload);

      const queryFn = editingPost
        ? () => supabase.from('blog_posts').update(payload).eq('id', editingPost.id).select()
        : () => supabase.from('blog_posts').insert([payload]).select();

      const { data, error } = await executeSupabaseQuery(queryFn);

      if (error) {
        console.error('[useBlogBlockManager] savePost DB Error:', error);
        throw error;
      }

      console.log('[useBlogBlockManager] savePost: Successfully saved data:', data);

      toast({
        title: "Başarılı",
        description: editingPost ? "Blog yazısı başarıyla güncellendi." : "Yeni blog yazısı başarıyla eklendi.",
        className: "bg-green-600 text-white border-none"
      });

      closeModal();
      fetchPosts();
      return data;
    } catch (error) {
      console.error("[useBlogBlockManager] savePost Exception:", error);
      toast({ variant: "destructive", title: "Hata", description: error.message || "Kaydetme işlemi başarısız oldu." });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const deletePost = async (post) => {
    console.log(`[useBlogBlockManager] deletePost: Initiating deletion for post ID: ${post.id}`);
    if (!window.confirm(`"${post.title}" başlıklı yazıyı silmek istediğinize emin misiniz?`)) {
      console.log('[useBlogBlockManager] deletePost: User cancelled deletion.');
      return;
    }

    try {
      if (post.cover_image_url) {
        console.log('[useBlogBlockManager] deletePost: Deleting associated cover image...');
        await deleteImage(post.cover_image_url);
      }

      const { error } = await executeSupabaseQuery(
        () => supabase.from('blog_posts').delete().eq('id', post.id)
      );

      if (error) {
        console.error('[useBlogBlockManager] deletePost DB Error:', error);
        throw error;
      }

      console.log('[useBlogBlockManager] deletePost: Post deleted successfully.');
      toast({ title: "Silindi", description: "Blog yazısı başarıyla silindi." });
      fetchPosts();
    } catch (error) {
      console.error("[useBlogBlockManager] deletePost Exception:", error);
      toast({ variant: "destructive", title: "Hata", description: "Silme işlemi başarısız oldu." });
    }
  };

  const openModal = (post = null) => {
    console.log(`[useBlogBlockManager] openModal: Opening modal. Mode: ${post ? 'Edit' : 'Create'}`, post);
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('[useBlogBlockManager] closeModal: Closing modal and resetting editing state.');
    setEditingPost(null);
    setIsModalOpen(false);
  };

  return {
    posts,
    loading,
    isModalOpen,
    editingPost,
    isSaving,
    isUploading,
    openModal,
    closeModal,
    savePost,
    deletePost,
    fetchPosts
  };
};
