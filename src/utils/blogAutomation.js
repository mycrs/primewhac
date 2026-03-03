
export const convertTurkishToLatin = (text) => {
  const trMap = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };
  return text.replace(/[çğıöşüÇĞİÖŞÜ]/g, match => trMap[match]);
};

export const generateSlugFromTitle = (title) => {
  if (!title) return '';
  return convertTurkishToLatin(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
};

export const validateSlug = (slug) => {
  if (!slug) return "Slug boş olamaz.";
  if (slug.length < 3) return "Slug en az 3 karakter olmalıdır.";
  if (slug.length > 100) return "Slug en fazla 100 karakter olmalıdır.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return "Slug sadece küçük harf, rakam ve tire içerebilir. Başında veya sonunda tire olamaz.";
  }
  return null;
};

export const extractExcerptFromContent = (content, maxLength = 200) => {
  if (!content) return '';
  // Remove HTML tags
  const textOnly = content.replace(/<[^>]*>?/gm, ' ');
  // Remove multiple spaces and empty lines
  const cleanedText = textOnly.replace(/\s+/g, ' ').trim();
  
  if (cleanedText.length <= maxLength) return cleanedText;
  
  // Truncate and add ellipsis, trying to not break words
  const truncated = cleanedText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
};

export const generateMetaTitle = (title) => {
  if (!title) return '';
  const suffix = " | KaliteliIPTV";
  const maxTitleLength = 60 - suffix.length;
  let cleanTitle = title;
  
  if (cleanTitle.length > maxTitleLength) {
    cleanTitle = cleanTitle.substring(0, maxTitleLength - 3) + '...';
  }
  return `${cleanTitle}${suffix}`;
};

export const generateMetaDescription = (excerpt) => {
  if (!excerpt) return '';
  return excerpt.substring(0, 160);
};

export const generateKeywordsFromTags = (tags, title) => {
  const keywords = new Set();
  
  if (tags && tags.length > 0) {
    tags.forEach(tag => keywords.add(tag.toLowerCase()));
  }
  
  if (title) {
    const titleWords = title.toLowerCase()
      .split(/\s+/)
      .map(w => convertTurkishToLatin(w).replace(/[^a-z0-9]/g, ''))
      .filter(w => w.length > 3); // Ignore short words
      
    titleWords.forEach(word => keywords.add(word));
  }
  
  return Array.from(keywords).join(', ');
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
