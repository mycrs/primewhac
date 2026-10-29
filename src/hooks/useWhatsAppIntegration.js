import { useCallback } from 'react';
import { useSiteData } from '@/hooks/useSiteData';
import {
  isTelegramEnabled,
  isWhatsAppEnabled,
  openSupportTelegram,
  openSupportWhatsApp,
} from '@/utils/supportChannel';

/**
 * Test / sipariş formlarının WhatsApp / Telegram kanalına devri.
 */
export const useWhatsAppIntegration = () => {
  const { siteData } = useSiteData();
  const isTelegramOrder = (siteData?.contactData?.order_channel || siteData?.contact_info?.order_channel) === 'telegram';
  const isWhatsAppAvailable = isWhatsAppEnabled({ siteData });
  const isTelegramAvailable = isTelegramEnabled({ siteData });

  const buildMessage = useCallback((data) => {
    if (data?.type === 'order') {
      return `Merhaba, ${data.packageName} paketi için sipariş vermek istiyorum.\n\n` +
        `📦 *Paket:* ${data.packageName}\n` +
        `💰 *Fiyat:* ${data.price} TL\n` +
        `👤 *İsim:* ${data.username}\n` +
        (data.note ? `📝 *Not:* ${data.note}\n` : '') +
        `\nDetaylı bilgi alabilir miyim?`;
    }

    if (data?.username && data?.device) {
      // Test talebi
      const livingLine = data.livingRegionMessage ? `${data.livingRegionMessage}\n\n` : '';
      return `Merhaba, Ücretsiz Test Yayını almak istiyorum.\n\n` +
        livingLine +
        `👤 *İsim:* ${data.username}\n` +
        `📱 *Cihaz:* ${data.device}\n` +
        `📲 *Uygulama:* ${data.app || 'Belirtilmedi'}\n` +
        (data.note ? `📝 *Not:* ${data.note}\n` : '') +
        `\nTest yayını için yardımcı olabilir misiniz?`;
    }

    return 'Merhaba, bilgi almak istiyorum.';
  }, []);

  const redirectToWhatsApp = useCallback(
    (data) => {
      const msg = buildMessage(data);
      if (isTelegramOrder) {
        return isTelegramAvailable && openSupportTelegram({ siteData, message: msg });
      }
      return isWhatsAppAvailable && openSupportWhatsApp({ siteData, message: msg });
    },
    [siteData, buildMessage, isTelegramOrder, isTelegramAvailable, isWhatsAppAvailable],
  );

  return {
    isAvailable: isTelegramOrder ? isTelegramAvailable : isWhatsAppAvailable,
    isTelegram: isTelegramOrder,
    redirectToWhatsApp,
  };
};
