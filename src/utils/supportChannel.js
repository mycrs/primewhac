/**
 * Destek (WhatsApp) kanalı — tek çıkış noktası.
 *
 * AMAÇ
 * Numara hiçbir statik çıktıda düz metin olarak bulunmasın:
 * ne prerender edilmiş HTML'de, ne JSON-LD'de, ne de JS bundle'ında.
 * Yalnızca kullanıcı formu doldurup butona bastığı anda bellekte kurulur
 * ve window.open ile açılır. Böylece kaynak kodu tarayan botlar numarayı
 * hasat edemez, gerçek müşteri ise sorunsuz WhatsApp'a ulaşır.
 *
 * KAYNAK
 * Supabase → contact_info.whatsapp (admin panel > İletişim Bilgileri).
 * Runtime'da çekilir; numara HTML'e, meta etiketlerine veya JS bundle'ına girmez.
 *
 * KURAL
 * Bu numarayı ASLA href / DOM / meta / JSON-LD içine yazma.
 * Sadece openSupportWhatsApp() üzerinden kullan.
 */

import { normalizeBoolean, normalizeContactSettings } from '@/utils/contactSettings';

const onlyDigits = (value) => String(value ?? '').replace(/\D/g, '');

const resolveContactSettings = ({ siteData, contactData } = {}) =>
  normalizeContactSettings({
    contactInfo: siteData?.contact_info,
    contactData: {
      ...(siteData?.contactData || {}),
      ...(contactData || {}),
    },
  });

/**
 * Destek numarasını runtime'da çöz.
 * @param {object} sources
 * @param {object} [sources.siteData]    useSiteData() çıktısı
 * @param {object} [sources.contactData] bileşene prop olarak geçilen iletişim datası
 * @returns {string} sadece rakamlar; bulunamazsa ''
 */
export const resolveSupportWhatsAppDigits = ({ siteData, contactData } = {}) => {
  const resolvedContact = resolveContactSettings({ siteData, contactData });
  const fromDb = resolvedContact.whatsapp || resolvedContact.phone || '';

  return onlyDigits(fromDb);
};

/** Destek numarası tanımlı mı? */
export const hasSupportWhatsApp = (sources) =>
  Boolean(resolveSupportWhatsAppDigits(sources));

/** WhatsApp admin panelinden aktif edilmiş ve numara girilmiş mi? */
export const isWhatsAppEnabled = (sources = {}) => {
  const resolvedContact = resolveContactSettings(sources);
  return normalizeBoolean(resolvedContact.whatsapp_enabled, true) && hasSupportWhatsApp(sources);
};

/**
 * WhatsApp'ı yeni sekmede aç. Link DOM'a hiç yazılmaz.
 * @returns {boolean} numara bulunamazsa false
 */
export const openSupportWhatsApp = ({ siteData, contactData, message } = {}) => {
  if (!isWhatsAppEnabled({ siteData, contactData })) return false;
  const digits = resolveSupportWhatsAppDigits({ siteData, contactData });
  if (!digits) return false;

  const resolvedContact = resolveContactSettings({ siteData, contactData });
  const defaultMsg = resolvedContact.whatsapp_message || 'Merhaba, paketler hakkında bilgi almak istiyorum.';

  const finalMsg = message !== undefined ? message : defaultMsg;
  const query = finalMsg ? `?text=${encodeURIComponent(finalMsg)}` : '';
  window.open(`https://wa.me/${digits}${query}`, '_blank', 'noopener,noreferrer');
  return true;
};

/**
 * Telegram kullanıcı adı veya linkini runtime'da çöz.
 */
export const resolveSupportTelegram = ({ siteData, contactData } = {}) => {
  const resolvedContact = resolveContactSettings({ siteData, contactData });
  const fromDb = resolvedContact.telegram || '';

  return String(fromDb || '').trim().replace(/^@/, '');
};

/** Telegram tanımlı mı? */
export const hasSupportTelegram = (sources) =>
  Boolean(resolveSupportTelegram(sources));

/** Telegram admin panelinden aktif edilmiş ve link girilmiş mi? */
export const isTelegramEnabled = (sources = {}) => {
  const resolvedContact = resolveContactSettings(sources);
  return normalizeBoolean(resolvedContact.telegram_enabled, true) && hasSupportTelegram(sources);
};

/**
 * Telegram'ı yeni sekmede aç.
 */
export const openSupportTelegram = ({ siteData, contactData, message } = {}) => {
  if (!isTelegramEnabled({ siteData, contactData })) return false;
  const raw = resolveSupportTelegram({ siteData, contactData });
  if (!raw) return false;

  let url = raw;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://t.me/${raw}`;
  }

  const resolvedContact = resolveContactSettings({ siteData, contactData });
  const defaultMsg = message ?? resolvedContact.telegram_message;

  if (defaultMsg && !url.includes('?text=')) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}text=${encodeURIComponent(defaultMsg)}`;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
};

/**
 * Her sayfada gezen (floating) butonların görünürlük konfigürasyonunu çöz.
 */
export const getFloatingActionsConfig = ({ siteData, contactData } = {}) => {
  const cfg = resolveContactSettings({ siteData, contactData }).floating_actions;

  return {
    enabled: normalizeBoolean(cfg.enabled, true),
    show_whatsapp: normalizeBoolean(cfg.show_whatsapp, true),
    show_telegram: normalizeBoolean(cfg.show_telegram, true),
    show_buy: normalizeBoolean(cfg.show_buy, true),
    show_test: normalizeBoolean(cfg.show_test, true),
  };
};
