/**
 * Contact settings are stored in site_content as JSON. Older deployments used
 * both `contact_info` and `contactData`, and some rows contain string/number
 * versions of boolean flags. Keep the compatibility rules in one place.
 */

const hasOwn = (value, key) =>
  value != null && Object.prototype.hasOwnProperty.call(value, key);

const isRecord = (value) => value != null && typeof value === 'object' && !Array.isArray(value);

/**
 * Convert legacy boolean representations without treating the string "false"
 * or the number 0 as truthy.
 */
export const normalizeBoolean = (value, fallback = false) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'on', 'yes', 'enabled', 'active', 'açık', 'acik', 'evet'].includes(normalized)) {
      return true;
    }
    if (['false', '0', 'off', 'no', 'disabled', 'inactive', 'kapalı', 'kapali', 'hayır', 'hayir'].includes(normalized)) {
      return false;
    }
  }
  return fallback;
};

const readValue = (canonical, legacy, keys, fallback = undefined) => {
  const canonicalObject = isRecord(canonical) ? canonical : {};
  const legacyObject = isRecord(legacy) ? legacy : {};

  for (const key of keys) {
    if (hasOwn(canonicalObject, key)) return canonicalObject[key];
  }
  for (const key of keys) {
    if (hasOwn(legacyObject, key)) return legacyObject[key];
  }
  return fallback;
};

/**
 * Merge the canonical contact_info row with the legacy contactData row.
 * contact_info wins for fields that are explicitly present, including an
 * intentional empty string or false value.
 */
export const normalizeContactSettings = ({ contactInfo, contactData } = {}) => {
  const canonical = isRecord(contactInfo) ? contactInfo : {};
  const legacy = isRecord(contactData) ? contactData : {};
  const canonicalFloating = isRecord(canonical.floating_actions) ? canonical.floating_actions : {};
  const legacyFloating = isRecord(legacy.floating_actions) ? legacy.floating_actions : {};

  const merged = {
    ...legacy,
    ...canonical,
  };

  const whatsappMessage = readValue(canonical, legacy, ['whatsapp_message', 'whatsappMessage'], '');
  const telegramMessage = readValue(canonical, legacy, ['telegram_message', 'telegramMessage'], '');
  const orderChannel = String(readValue(canonical, legacy, ['order_channel'], 'whatsapp') || '').toLowerCase();

  merged.whatsapp = String(readValue(canonical, legacy, ['whatsapp'], '') ?? '');
  merged.phone = String(readValue(canonical, legacy, ['phone'], '') ?? '');
  merged.email = String(readValue(canonical, legacy, ['email'], '') ?? '');
  merged.telegram = String(readValue(canonical, legacy, ['telegram'], '') ?? '');
  merged.whatsapp_message = String(whatsappMessage ?? '');
  merged.telegram_message = String(telegramMessage ?? '');
  merged.whatsappMessage = merged.whatsapp_message;
  merged.telegramMessage = merged.telegram_message;
  merged.order_channel = orderChannel === 'telegram' ? 'telegram' : 'whatsapp';
  merged.whatsapp_enabled = normalizeBoolean(
    readValue(canonical, legacy, ['whatsapp_enabled'], true),
    true,
  );
  merged.telegram_enabled = normalizeBoolean(
    readValue(canonical, legacy, ['telegram_enabled'], true),
    true,
  );
  merged.floating_actions = {
    ...legacyFloating,
    ...canonicalFloating,
    enabled: normalizeBoolean(
      readValue(canonicalFloating, legacyFloating, ['enabled'], true),
      true,
    ),
    show_whatsapp: normalizeBoolean(
      readValue(canonicalFloating, legacyFloating, ['show_whatsapp'], true),
      true,
    ),
    show_telegram: normalizeBoolean(
      readValue(canonicalFloating, legacyFloating, ['show_telegram'], true),
      true,
    ),
    show_buy: normalizeBoolean(
      readValue(canonicalFloating, legacyFloating, ['show_buy'], true),
      true,
    ),
    show_test: normalizeBoolean(
      readValue(canonicalFloating, legacyFloating, ['show_test'], true),
      true,
    ),
  };

  return merged;
};

/**
 * Produce the stable shape written by the admin settings screen. Unknown
 * fields are intentionally preserved for older consumers.
 */
export const serializeContactSettings = (value) => {
  const normalized = normalizeContactSettings({ contactData: value });
  return {
    ...normalized,
    whatsapp: normalized.whatsapp.trim(),
    phone: normalized.phone.trim(),
    email: normalized.email.trim(),
    telegram: normalized.telegram.trim(),
    whatsapp_enabled: normalized.whatsapp_enabled,
    telegram_enabled: normalized.telegram_enabled,
    whatsapp_message: normalized.whatsapp_message,
    whatsappMessage: normalized.whatsapp_message,
    telegram_message: normalized.telegram_message,
    telegramMessage: normalized.telegram_message,
    order_channel: normalized.order_channel,
    floating_actions: {
      ...normalized.floating_actions,
      enabled: normalized.floating_actions.enabled,
      show_whatsapp: normalized.floating_actions.show_whatsapp,
      show_telegram: normalized.floating_actions.show_telegram,
      show_buy: normalized.floating_actions.show_buy,
      show_test: normalized.floating_actions.show_test,
    },
  };
};

export const parseSiteContentValue = (value) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed || (!trimmed.startsWith('{') && !trimmed.startsWith('['))) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
};
