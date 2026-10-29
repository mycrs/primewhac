/**
 * Cihaz/uygulama seçim formunun WhatsApp'a devri.
 *
 * Numara burada SABİT DEĞİL — runtime'da Supabase'den (yedeği base64 env)
 * çözülür ve yalnızca kullanıcı gönder'e bastığında açılır.
 * Bkz. src/utils/supportChannel.js
 */
import { openSupportWhatsApp } from '@/utils/supportChannel';

export const submitToWordpress = async ({
  username,
  appName,
  deviceType,
  category,
  specialNote,
  siteData,
  contactData,
}) => {
  try {
    const text =
      `Cihaz: ${deviceType || 'Belirtilmedi'}, ` +
      `Uygulama: ${appName || 'Belirtilmedi'}, ` +
      `Kullanıcı: ${username || 'Belirtilmedi'}, ` +
      `Not: ${specialNote || 'Yok'}` +
      (category ? `, Kategori: ${category}` : '');

    // Link DOM'a yazılmaz; kullanıcı etkileşimi anında yeni sekmede açılır.
    const opened = openSupportWhatsApp({ siteData, contactData, message: text });

    if (!opened) {
      return {
        success: false,
        error:
          'Destek numarası tanımlı değil. Admin panel > İletişim Bilgileri bölümünden WhatsApp numarasını ekleyin.',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('WhatsApp redirection failed:', error);
    return { success: false, error: 'Yönlendirme başarısız oldu.' };
  }
};
