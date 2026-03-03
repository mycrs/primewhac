
export const sanitizeEnvVar = (val) => {
  if (!val) return '';
  let cleaned = val.toString().trim();
  // Remove surrounding quotes if present
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || 
      (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned;
};

export const maskValue = (val, showFirst = 15, showLast = 5) => {
  if (!val) return 'undefined';
  const cleaned = sanitizeEnvVar(val);
  if (cleaned.length <= showFirst + showLast) return '***';
  return `${cleaned.substring(0, showFirst)}...${cleaned.substring(cleaned.length - showLast)}`;
};

export const getEnvStatus = () => {
  const rawUrl = import.meta.env.VITE_SUPABASE_URL;
  const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const url = sanitizeEnvVar(rawUrl);
  const key = sanitizeEnvVar(rawKey);

  const hasQuotesUrl = rawUrl && (rawUrl.trim().startsWith('"') || rawUrl.trim().startsWith("'"));
  const hasQuotesKey = rawKey && (rawKey.trim().startsWith('"') || rawKey.trim().startsWith("'"));

  return {
    rawUrlMasked: maskValue(rawUrl),
    rawKeyMasked: maskValue(rawKey, 10, 5),
    url,
    key,
    hasQuotesUrl,
    hasQuotesKey,
    hasWhitespaceUrl: rawUrl !== url,
    hasWhitespaceKey: rawKey !== key,
  };
};
