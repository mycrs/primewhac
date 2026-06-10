/** Site üstü duyuru banner temaları (notifications.theme) */

export const NOTIFICATION_THEME_KEYS = ['info', 'warning', 'campaign', 'urgent', 'success'];

export const NOTIFICATION_THEME_LABELS = {
  info: 'Genel Bilgi',
  warning: 'Uyarı',
  campaign: 'Kampanya',
  urgent: 'Acil',
  success: 'Başarı',
};

export function resolveNotificationTheme(raw) {
  const t = String(raw || 'info').toLowerCase().trim();
  return NOTIFICATION_THEME_KEYS.includes(t) ? t : 'info';
}

/**
 * Banner görünümü: gradient, kenarlık, emoji, opsiyonel parlaklık
 */
export function getNotificationBannerTheme(themeKey) {
  const t = resolveNotificationTheme(themeKey);

  const commonText = { color: '#ffffff' };

  switch (t) {
    case 'warning':
      return {
        key: t,
        emoji: '⚠️',
        borderClass: 'border-amber-400/45',
        extraGlowClass: '',
        containerStyle: {
          ...commonText,
          background:
            'radial-gradient(circle at top left, rgba(251, 191, 36, 0.55), transparent 52%), radial-gradient(circle at bottom right, rgba(245, 158, 11, 0.5), transparent 55%), #1a1208',
          boxShadow: '0 24px 80px rgba(120, 53, 15, 0.55)',
        },
      };
    case 'campaign':
      return {
        key: t,
        emoji: '🔥',
        borderClass: 'border-emerald-400/50 ring-2 ring-amber-400/40 ring-offset-0',
        extraGlowClass: 'shadow-[0_0_42px_rgba(250,204,21,0.35)]',
        containerStyle: {
          ...commonText,
          background:
            'radial-gradient(circle at top left, rgba(52, 211, 153, 0.55), transparent 48%), radial-gradient(circle at bottom right, rgba(245, 158, 11, 0.55), transparent 50%), #07130f',
          boxShadow: '0 28px 90px rgba(6, 78, 59, 0.65), 0 0 40px rgba(250, 204, 21, 0.2)',
        },
      };
    case 'urgent':
      return {
        key: t,
        emoji: '🚨',
        borderClass: 'border-red-500/55',
        extraGlowClass: '',
        containerStyle: {
          ...commonText,
          background:
            'radial-gradient(circle at top left, rgba(248, 113, 113, 0.55), transparent 50%), radial-gradient(circle at bottom right, rgba(220, 38, 38, 0.5), transparent 52%), #1c0808',
          boxShadow: '0 24px 80px rgba(127, 29, 29, 0.6)',
        },
      };
    case 'success':
      return {
        key: t,
        emoji: '✅',
        borderClass: 'border-emerald-400/45',
        extraGlowClass: '',
        containerStyle: {
          ...commonText,
          background:
            'radial-gradient(circle at top left, rgba(74, 222, 128, 0.5), transparent 52%), radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.45), transparent 54%), #061510',
          boxShadow: '0 24px 80px rgba(6, 78, 59, 0.55)',
        },
      };
    case 'info':
    default:
      return {
        key: 'info',
        emoji: '📢',
        borderClass: 'border-purple-400/40',
        extraGlowClass: '',
        containerStyle: {
          ...commonText,
          background:
            'radial-gradient(circle at top left, rgba(129, 140, 248, 0.55), transparent 55%), radial-gradient(circle at bottom right, rgba(236, 72, 153, 0.45), transparent 55%), #020617',
          boxShadow: '0 24px 80px rgba(15, 23, 42, 0.9)',
        },
      };
  }
}
