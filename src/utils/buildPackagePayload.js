import { datetimeLocalInputToIso } from '@/utils/packageCampaignDatetime';
import { PACKAGES_TIER_MIGRATION_DOC } from '@/utils/packageTierMigration';

const OPTIONAL_PACKAGE_COLUMNS = [
  'tier',
  'sort_order',
  'currency',
  'badge_text',
  'badge_enabled',
  'button_text',
  'card_description',
  'featured',
  'original_price',
  'campaign_label',
  'countdown_active',
  'campaign_end_date',
];

export function normalizeRegionForDB(region) {
  if (!region) return 'TR';
  const lower = String(region).toLowerCase();
  if (['eu', 'europe', 'avrupa'].includes(lower)) return 'EU';
  return 'TR';
}

function featuresToArray(features) {
  if (Array.isArray(features)) return features.map((f) => String(f).trim()).filter(Boolean);
  if (typeof features === 'string') {
    return features.split('\n').map((f) => f.trim()).filter(Boolean);
  }
  return [];
}

/**
 * Admin form → Supabase packages satırı
 */
export function buildPackagePayload(formData) {
  const region = normalizeRegionForDB(formData.region);
  const durationCustom = formData.duration_custom?.trim();
  const durationPreset = formData.duration_preset?.trim();
  const duration = durationCustom || durationPreset || String(formData.duration || '').trim();

  const payload = {
    name: String(formData.name || '').trim(),
    tier: formData.tier || 'standard',
    region,
    duration,
    price: parseFloat(formData.price),
    features: featuresToArray(formData.features),
    currency: formData.currency || (region === 'EU' ? '€' : '₺'),
    sort_order: parseInt(formData.sort_order, 10) || 0,
    popular: Boolean(formData.popular),
    featured: Boolean(formData.featured ?? formData.popular),
    enabled: formData.enabled !== false,
    whatsapp_message: String(formData.whatsapp_message || '').trim(),
    badge_text: (formData.badge_text || '').trim() || null,
    badge_enabled: Boolean(formData.badge_enabled),
    button_text: (formData.button_text || '').trim() || null,
    card_description: (formData.card_description || '').trim() || null,
    countdown_active: !!formData.countdown_active,
    campaign_end_date:
      formData.countdown_active && String(formData.campaign_end_datetime || '').trim()
        ? datetimeLocalInputToIso(String(formData.campaign_end_datetime).trim())
        : null,
  };

  const hasOriginalPrice = formData.original_price !== '' && formData.original_price != null;
  const hasCampaign = (formData.campaign_label || '').trim() !== '';
  if (hasOriginalPrice) payload.original_price = parseFloat(formData.original_price);
  if (hasCampaign) payload.campaign_label = formData.campaign_label.trim();

  return payload;
}

function isMissingColumnError(error) {
  const msg = error?.message || '';
  return msg.includes('column') || msg.includes('schema cache') || msg.includes('does not exist');
}

/**
 * Eksik DB sütunlarında kademeli kayıt (production uyumluluğu)
 */
export async function savePackageToSupabase(supabase, { id, payload }) {
  const run = (data) =>
    id
      ? supabase.from('packages').update(data).eq('id', id)
      : supabase.from('packages').insert([data]).select();

  let { data, error } = await run(payload);
  if (!error) return { data, error: null, stripped: [] };

  if (!isMissingColumnError(error)) return { data, error, stripped: [] };

  const safe = { ...payload };
  const stripped = OPTIONAL_PACKAGE_COLUMNS.filter((col) => {
    if (col in safe) delete safe[col];
    return true;
  });

  const retry = await run(safe);
  if (!retry.error) {
    return { data: retry.data, error: null, stripped, migrationDoc: PACKAGES_TIER_MIGRATION_DOC };
  }

  return { data: retry.data, error: retry.error, stripped, migrationDoc: PACKAGES_TIER_MIGRATION_DOC };
}

/** Liste sıralaması: sort_order → fiyat */
export function sortPackagesForDisplay(packages) {
  if (!Array.isArray(packages)) return [];
  return [...packages].sort((a, b) => {
    const orderA = Number(a.sort_order ?? 9999);
    const orderB = Number(b.sort_order ?? 9999);
    if (orderA !== orderB) return orderA - orderB;
    return Number(a.price ?? 0) - Number(b.price ?? 0);
  });
}

export function getPackageCurrencySymbol(pkg, regionTab) {
  if (pkg?.currency) return pkg.currency;
  const r = String(pkg?.region || regionTab || '').toUpperCase();
  return r === 'EU' ? '€' : '₺';
}
