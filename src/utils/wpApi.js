/**
 * Simplified WhatsApp Messaging Utility
 * Replaces previous WordPress API integration.
 * Opens WhatsApp directly with pre-filled message.
 * whatsappNumber: İletişim Bilgileri'nden alınan numara (sadece rakam)
 */

export const submitToWordpress = async ({ username, appName, deviceType, category, specialNote, whatsappNumber }) => {
  try {
    // 1. Format the message in the requested Turkish format
    const text = `Cihaz: ${deviceType || 'Belirtilmedi'}, Uygulama: ${appName || 'Belirtilmedi'}, Kullanıcı: ${username || 'Belirtilmedi'}, Not: ${specialNote || 'Yok'}`;

    // 2. Encode the message for URL
    const encodedText = encodeURIComponent(text);

    // 3. Construct WhatsApp URL - Öncelik: Parametre > .env VITE_WHATSAPP_PHONE
    const waNum = (whatsappNumber || '').replace(/\D/g, '') || (import.meta.env.VITE_WHATSAPP_PHONE || '').replace(/\D/g, '') || '4916345869030';
    const url = `https://api.whatsapp.com/send/?phone=${waNum}&text=${encodedText}`;

    // 4. Open in new tab to initiate sending
    // We use window.open instead of fetch because WhatsApp Web/App requires user interaction
    // and cannot be triggered via a background fetch call from a browser due to CORS/Security.
    window.open(url, '_blank');

    // 5. Return success immediately
    return Promise.resolve({ success: true });
    
  } catch (error) {
    console.error("WhatsApp redirection failed:", error);
    // Even if something weird happens, we return success so the UI doesn't block the user
    // The user will see if the tab didn't open.
    return Promise.resolve({ success: true });
  }
};