import { useCallback } from 'react';

export const useWhatsAppIntegration = () => {
  // Use the specific UK number requested: +44 7542 953987
  // Removing any non-numeric characters for the link
  const phoneNumber = "447542953987";

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
      message = `Merhaba, Ücretsiz Test Yayını almak istiyorum.\n\n` +
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

    const link = createWhatsAppLink(message);
    window.open(link, '_blank');
  }, [createWhatsAppLink]);

  return {
    phoneNumber,
    createWhatsAppLink,
    redirectToWhatsApp
  };
};