
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { validateBlogPostData } from '@/utils/blogValidator';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';
import { pingIndexNowBlogSlug } from '@/utils/pingIndexNow';

const initialFormState = {
  title: '',
  content: '',
  excerpt: '',
  slug: '',
  category: '',
  tags: [],
  cover_image_url: '',
  seo_title: '',
  seo_description: '',
  focus_keyword: '',
  published_at: new Date().toISOString().split('T')[0],
  isDraft: false,
  allow_comments: true,
  featured: false,
};

export const useBlogPostForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'excerpt' && value.length > 200) {
      return;
    }

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === 'title' && !prev.slug) {
        newData.slug = generateSlug(value);
      }
      return newData;
    });
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleTagsChange = (e) => {
    const tagsArray = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({ ...prev, tags: tagsArray }));
  };

  const handleSwitchChange = (field) => (checked) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const ensureUniqueSlug = async (baseSlug, postId = null) => {
    let uniqueSlug = baseSlug;
    let isUnique = false;
    let counter = 1;
    
    while (!isUnique) {
      let query = supabase.from('blog_posts').select('id').eq('slug', uniqueSlug);
      if (postId) query = query.neq('id', postId);
      
      const { data, error: queryError } = await executeSupabaseQuery(() => query);
      
      if (queryError) throw queryError;
      
      if (data && data.length > 0) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      } else {
        isUnique = true;
      }
    }
    return uniqueSlug;
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `blog_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await executeSupabaseQuery(
        () => supabase.storage
          .from('welcome-images')
          .upload(filePath, file, { cacheControl: '3600', upsert: false })
      );

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('welcome-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, cover_image_url: publicUrl }));
      toast({ title: "Başarılı", description: "Görsel başarıyla yüklendi." });
      return publicUrl;
    } catch (err) {
      console.error("[useBlogPostForm] Upload error context:", err);
      toast({ variant: "destructive", title: "Hata", description: "Görsel yüklenemedi." });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const fetchPost = useCallback(async (idOrSlug) => {
    setIsLoading(true);
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug);
      let query = supabase.from('blog_posts').select('*');
      
      if (isUUID) {
        query = query.eq('id', idOrSlug);
      } else {
        query = query.eq('slug', idOrSlug);
      }

      const { data, error } = await executeSupabaseQuery(() => query.single());

      if (error) throw error;
      
      setFormData({
        ...data,
        excerpt: data.excerpt || '',
        isDraft: !data.published_at,
        published_at: data.published_at ? data.published_at.split('T')[0] : new Date().toISOString().split('T')[0],
        tags: data.tags || [],
        allow_comments: data.allow_comments !== false,
        featured: data.featured || false,
        focus_keyword: data.focus_keyword || ''
      });
    } catch (err) {
      console.error("[useBlogPostForm] Fetch post error context:", err);
      toast({ variant: "destructive", title: "Hata", description: "Blog yazısı bulunamadı." });
      navigate('/blog');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  const handleSubmit = async (e, postId = null) => {
    if (e) e.preventDefault();
    
    const { isValid, errors } = validateBlogPostData(formData);
    
    if (!isValid) {
      setValidationErrors(errors);
      toast({ variant: "destructive", title: "Doğrulama Hatası", description: "Lütfen formdaki hataları düzeltin." });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let baseSlug = formData.slug || generateSlug(formData.title);
      const uniqueSlug = await ensureUniqueSlug(baseSlug, postId);

      const payload = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt.trim(),
        slug: uniqueSlug,
        category: formData.category,
        tags: formData.tags,
        cover_image_url: formData.cover_image_url,
        seo_title: formData.seo_title,
        seo_description: formData.seo_description,
        focus_keyword: formData.focus_keyword || null,
        published_at: formData.isDraft ? null : new Date(formData.published_at).toISOString(),
        author: 'Admin',
        allow_comments: formData.allow_comments,
        featured: formData.featured
      };

      if (postId) {
        const { error } = await executeSupabaseQuery(
          () => supabase.from('blog_posts').update(payload).eq('id', postId).select()
        );
        if (error) throw error;
      } else {
        const { error } = await executeSupabaseQuery(
          () => supabase.from('blog_posts').insert([payload]).select()
        );
        if (error) throw error;
      }

      toast({ 
        title: "Başarılı", 
        description: `Blog yazısı başarıyla ${postId ? 'güncellendi' : 'oluşturuldu'}.`,
        className: "bg-green-600 text-white border-none"
      });

      if (!formData.isDraft && uniqueSlug) {
        void pingIndexNowBlogSlug(uniqueSlug);
      }
      
      if (!postId) {
        resetForm();
      }
      navigate('/blog');
      
    } catch (err) {
      console.error("[useBlogPostForm] Save operation failed with exception:", err);
      setError(err.message || "Kaydetme işlemi başarısız oldu.");
      toast({ variant: "destructive", title: "Hata", description: err.message || "Kaydetme işlemi başarısız oldu." });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setValidationErrors({});
    setError(null);
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleTagsChange,
    handleSwitchChange,
    handleImageUpload,
    handleSubmit,
    fetchPost,
    isLoading,
    isUploading,
    error,
    validationErrors,
    resetForm
  };
};
