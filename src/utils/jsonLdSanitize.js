/**
 * JSON-LD çıktısından null/undefined/boş @type ve boş nesneleri çıkarır (Google GSC uyumu).
 */

export function sanitizeJsonLdSchema(input) {
  if (input === null || input === undefined) return undefined;
  if (Array.isArray(input)) {
    const out = input.map(sanitizeJsonLdSchema).filter((x) => x !== undefined && x !== null);
    return out.length ? out : undefined;
  }
  if (typeof input !== 'object') {
    if (typeof input === 'string' && input.trim() === '') return undefined;
    if (typeof input === 'number' && Number.isNaN(input)) return undefined;
    return input;
  }
  const out = {};
  for (const [key, val] of Object.entries(input)) {
    if (val === null || val === undefined) continue;
    if (key === '@type') {
      if (typeof val !== 'string' || val.trim() === '') continue;
      out[key] = val.trim();
      continue;
    }
    const cleaned = sanitizeJsonLdSchema(val);
    if (cleaned === undefined) continue;
    if (Array.isArray(cleaned) && cleaned.length === 0) continue;
    if (
      typeof cleaned === 'object' &&
      cleaned !== null &&
      !Array.isArray(cleaned) &&
      Object.keys(cleaned).length === 0
    ) {
      continue;
    }
    out[key] = cleaned;
  }
  if (Object.keys(out).length === 0) return undefined;
  return out;
}
