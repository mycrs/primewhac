
export const convertTurkishToLatin = (text) => {
  const trMap = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };
  return text.replace(/[çğıöşüÇĞİÖŞÜ]/g, match => trMap[match]);
};

export const generateSlugFromTitle = (title) => {
  if (!title || typeof title !== 'string') return '';
  const cleaned = convertTurkishToLatin(title.trim())
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned ? cleaned.substring(0, 100) : '';
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
  let cleaned = content;
  // Remove <style>...</style> blocks (including CSS content)
  cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ');
  // Remove <script>...</script> blocks
  cleaned = cleaned.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ');
  // Remove HTML comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, ' ');
  // Remove remaining HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, ' ');
  // Decode common HTML entities
  cleaned = cleaned.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  // Collapse whitespace
  const textOnly = cleaned.replace(/\s+/g, ' ').trim();
  
  if (!textOnly || textOnly.length <= maxLength) return textOnly;
  
  const truncated = textOnly.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
};

export const generateMetaTitle = (title, suffix = 'QruzeTV') => {
  if (!title) return '';
  const suffixPart = suffix ? ` | ${suffix}` : '';
  const maxTitleLength = 60 - suffixPart.length;
  let cleanTitle = title;
  
  if (cleanTitle.length > maxTitleLength) {
    cleanTitle = cleanTitle.substring(0, maxTitleLength - 3) + '...';
  }
  return `${cleanTitle}${suffixPart}`;
};

export const generateMetaDescription = (excerpt, maxLength = 160) => {
  if (!excerpt) return '';
  const text = excerpt.replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  const reserve = 3; // for "..."
  const truncated = text.substring(0, maxLength - reserve);
  const lastSpace = truncated.lastIndexOf(' ');
  const cut = lastSpace > (maxLength - reserve) * 0.7 ? truncated.substring(0, lastSpace) : truncated;
  return cut + '...';
};

const FOCUS_KEYWORD_MAX_LENGTH = 100;

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
  
  const result = Array.from(keywords).join(', ');
  if (result.length <= FOCUS_KEYWORD_MAX_LENGTH) return result;
  const truncated = result.substring(0, FOCUS_KEYWORD_MAX_LENGTH);
  const lastComma = truncated.lastIndexOf(',');
  return lastComma > FOCUS_KEYWORD_MAX_LENGTH * 0.5 ? truncated.substring(0, lastComma).trim() : truncated.trim();
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
