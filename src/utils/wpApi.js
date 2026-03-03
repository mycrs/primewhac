/**
 * Simplified WhatsApp Messaging Utility
 * Replaces previous WordPress API integration.
 * Opens WhatsApp directly with pre-filled message.
 */

export const submitToWordpress = async ({ username, appName, deviceType, category, specialNote }) => {
  try {
    // 1. Format the message in the requested Turkish format
    // Format: "Cihaz: [deviceType], Uygulama: [appName], Kullanıcı: [username], Not: [specialNote]"
    const text = `Cihaz: ${deviceType || 'Belirtilmedi'}, Uygulama: ${appName || 'Belirtilmedi'}, Kullanıcı: ${username || 'Belirtilmedi'}, Not: ${specialNote || 'Yok'}`;

    // 2. Encode the message for URL
    const encodedText = encodeURIComponent(text);

    // 3. Construct WhatsApp URL
    // Target Number: +44 7542 953 987
    const url = `https://api.whatsapp.com/send/?phone=447542953987&text=${encodedText}`;

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