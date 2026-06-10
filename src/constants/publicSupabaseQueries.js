/** Public sayfa listeleri — gereksiz kolon ve ağır gövde indirilmez */

export const BLOG_LIST_PAGE_SIZE = 24;

/** Kart + şema için; tam içerik yok (okuma süresi excerpt’ten) */
export const BLOG_LIST_COLUMNS =
  'id, slug, title, excerpt, category, featured, cover_image_url, published_at, author';

/** Kanal kartları (liste / slider) */
export const CHANNEL_PUBLIC_COLUMNS =
  'id, name, category, description, image_url, logo_url, background_image_url, is_active';

/** Paket kartları + sipariş modalı */
export const PACKAGE_LIST_COLUMNS =
  'id, name, price, duration, features, region, tier, sort_order, currency, badge_text, badge_enabled, button_text, card_description, featured, popular, enabled, whatsapp_message, original_price, campaign_label, countdown_active, campaign_end_date';

/** Eski Supabase şeması — yeni sütunlar yoksa fallback */
export const PACKAGE_LIST_COLUMNS_FALLBACK =
  'id, name, price, duration, features, region, popular, enabled, whatsapp_message, original_price, campaign_label, countdown_active, campaign_end_date';
