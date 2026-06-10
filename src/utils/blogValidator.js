
export const validateSlugFormat = (slug) => {
  if (!slug || slug.trim() === '') return "Slug boş olamaz.";
  if (slug.length < 3) return "Slug en az 3 karakter olmalıdır.";
  if (slug.length > 100) return "Slug en fazla 100 karakter olmalıdır.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return "Slug sadece küçük harf, rakam ve tire içerebilir. Başında veya sonunda tire olamaz.";
  }
  return null;
};

export const validateBlogPostData = (data) => {
  const errors = {};
  
  if (!data.title || data.title.trim().length < 3) {
    errors.title = "Başlık en az 3 karakter olmalıdır.";
  }
  
  const slugError = validateSlugFormat(data.slug);
  if (slugError) {
    errors.slug = slugError;
  }
  
  if (!data.content || data.content.trim().length < 10) {
    errors.content = "İçerik çok kısa.";
  }

  if (data.allow_comments !== undefined && typeof data.allow_comments !== 'boolean') {
    errors.allow_comments = "Yorum izni boolean (doğru/yanlış) olmalıdır.";
  }

  if (data.featured !== undefined && typeof data.featured !== 'boolean') {
    errors.featured = "Öne çıkan alanı boolean (doğru/yanlış) olmalıdır.";
  }

  if (data.focus_keyword && data.focus_keyword.trim().length > 100) {
    errors.focus_keyword = "Odak anahtar kelime en fazla 100 karakter olabilir.";
  }

  if (data.seo_title && data.seo_title.trim().length > 60) {
    errors.seo_title = "SEO başlığı en fazla 60 karakter olabilir.";
  }

  if (data.seo_description && data.seo_description.trim().length > 160) {
    errors.seo_description = "Meta açıklama en fazla 160 karakter olabilir.";
  }

  if (data.tags && Array.isArray(data.tags) && data.tags.length > 60) {
    errors.tags = "En fazla 60 etiket ekleyebilirsiniz.";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
