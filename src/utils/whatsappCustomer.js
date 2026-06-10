/**
 * WhatsApp deep link (wa.me).
 * @param {string} raw — 05xx..., +90..., +49... (legacy tek alan)
 */
import { SITE_URL } from '../constants/siteUrl.js';

export function normalizeWhatsAppDigits(raw) {
  if (!raw || typeof raw !== 'string') return '';
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('0') && d.length >= 10) {
    d = `90${d.slice(1)}`;
  }
  return d;
}

/** Ülke kodu (+90) + ulusal rakamlar → wa.me için birleşik rakam */
export function buildWaMeDigits(countryDial, nationalDigits) {
  const cc = String(countryDial || '').replace(/\D/g, '');
  let nat = String(nationalDigits || '').replace(/\D/g, '');
  if (nat.startsWith('0')) nat = nat.slice(1);
  if (!cc || !nat) return '';
  return `${cc}${nat}`;
}

export function formatNationalGrouped(nationalDigits) {
  const d = String(nationalDigits || '').replace(/\D/g, '');
  if (!d) return '';
  const parts = [];
  let i = 0;
  if (d.length <= 3) return d;
  if (d.length % 3 === 1 && d.length > 4) {
    parts.push(d.slice(0, 2));
    i = 2;
  } else if (d.length % 3 === 2 && d.length > 3) {
    parts.push(d.slice(0, 2));
    i = 2;
  }
  for (; i < d.length; i += 3) {
    parts.push(d.slice(i, i + 3));
  }
  return parts.join(' ');
}

export function formatFullPhoneDisplay(countryDial, nationalDigits) {
  const cc = String(countryDial || '').trim();
  const g = formatNationalGrouped(nationalDigits);
  if (!cc && !g) return '';
  return g ? `${cc} ${g}`.trim() : cc;
}

export function whatsappHref(phoneDigits, text) {
  const n = normalizeWhatsAppDigits(phoneDigits);
  if (!n) return '#';
  const q = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${n}${q}`;
}

export function whatsappHrefFromParts(countryDial, nationalDigits, text) {
  const n = buildWaMeDigits(countryDial, nationalDigits);
  if (!n) return '#';
  const q = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${n}${q}`;
}

/** Müşteri satırı: yeni şema (country_code + ulusal) veya eski whatsapp metni */
export function whatsappHrefForCustomer(customer, text) {
  if (!customer) return '#';
  if (customer.country_code && customer.whatsapp != null && String(customer.whatsapp).length > 0) {
    return whatsappHrefFromParts(customer.country_code, customer.whatsapp, text);
  }
  return whatsappHref(customer.whatsapp, text);
}

export function displayWhatsAppCell(customer) {
  if (!customer) return '—';
  if (customer.country_code) {
    return formatFullPhoneDisplay(customer.country_code, customer.whatsapp);
  }
  return customer.whatsapp || '—';
}

export function renewalReminderMessage(fullName, packageName, endDateTrFormatted) {
  const ad = (fullName || 'Müşteri').trim();
  const paket = packageName || 'abonelik';
  return `Merhaba ${ad}, ${paket} paketiniz ${endDateTrFormatted} tarihinde sona erecek. Yenilemek için bizimle iletişime geçin.`;
}

/** Müşteri portalı — admin’den kod gönderimi (wa.me metni) */
export const PORTAL_CUSTOMER_PAGE_URL = `${SITE_URL}/musteri-kayit`;

export function portalCodeWhatsAppMessage(portalCode) {
  const code = String(portalCode || '').trim();
  const line = code ? code : '—';
  return `Müşteri kodunuz: ${line}\nBilgilerinize ulaşmak için:\n${PORTAL_CUSTOMER_PAGE_URL}`;
}
