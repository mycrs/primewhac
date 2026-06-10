import { useCallback } from 'react';
import { useSiteData } from '@/hooks/useSiteData';
import { defaultData } from '@/data/defaultSiteData';

const getEnvWhatsApp = () => (import.meta.env.VITE_WHATSAPP_PHONE || '').replace(/\D/g, '');

export const useWhatsAppIntegration = () => {
  const { siteData } = useSiteData();
  const fromDb = siteData?.contact_info || siteData?.contactData;
  const contactInfo = fromDb || defaultData?.contactData || {};
  // phone / whatsapp bazen DB'den number gelir; .replace yalnızca stringde güvenli
  const fromContact = String(contactInfo?.whatsapp || contactInfo?.phone || '').replace(/\D/g, '');
  const phoneNumber = fromContact || getEnvWhatsApp() || (fromDb ? '' : '4916345869030');

  const createWhatsAppLink = useCallback((message) => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }, [phoneNumber]);

  const redirectToWhatsApp = useCallback((data) => {
    // Generate different messages based on context
    let message = "";
    
    if (data.type === 'order') {
      message = `Merhaba, ${data.packageName} paketi için sipariş vermek istiyorum.\n\n` +
        `📦 *Paket:* ${data.packageName}\n` +
        `💰 *Fiyat:* ${data.price} TL\n` +
        `👤 *İsim:* ${data.username}\n` +
        (data.note ? `📝 *Not:* ${data.note}\n` : '') +
        `\nDetaylı bilgi alabilir miyim?`;
    } 
    else if (data.username && data.device) {
      // Test Request
      const livingLine = data.livingRegionMessage ? `${data.livingRegionMessage}\n\n` : '';
      message = `Merhaba, Ücretsiz Test Yayını almak istiyorum.\n\n` +
        livingLine +
        `👤 *İsim:* ${data.username}\n` +
        `📱 *Cihaz:* ${data.device}\n` +
        `📲 *Uygulama:* ${data.app || 'Belirtilmedi'}\n` +
        (data.note ? `📝 *Not:* ${data.note}\n` : '') +
        `\nTest yayını için yardımcı olabilir misiniz?`;
    }
    else {
      // Generic Contact
      message = `Merhaba, bilgi almak istiyorum.`;
    }

    if (!phoneNumber) return false;
    const link = createWhatsAppLink(message);
    window.open(link, '_blank');
    return true;
  }, [createWhatsAppLink, phoneNumber]);

  return {
    phoneNumber,
    createWhatsAppLink,
    redirectToWhatsApp
  };
};