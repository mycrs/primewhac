/**
 * Müşteri kayıt (/musteri-kayit) — kullanıcıya gösterilecek hata metinleri.
 */

export function formatCustomerRegisterError(raw, status = 0) {
  const msg = String(raw || '').trim();
  const lower = msg.toLowerCase();

  if (status === 0 || lower.includes('ulaşılamadı') || lower.includes('edge function')) {
    return 'Kayıt sunucusuna ulaşılamadı. İnternet bağlantınızı kontrol edin veya WhatsApp üzerinden bize yazın.';
  }
  if (lower.includes('doğrulama kodu hatalı') || lower.includes('kalan deneme')) {
    // Sunucudan gelen Türkçe mesajı (kalan deneme bilgisiyle) olduğu gibi göster
    return msg;
  }
  if (lower.includes('güvenlik doğrulaması') || lower.includes('doğrulama oturumu') || lower.includes('doğrulama kodu')) {
    return 'Güvenlik doğrulaması başarısız. Sayfayı yenileyip tekrar deneyin.';
  }
  if (lower.includes('service_role') || status === 503) {
    return 'Kayıt servisi geçici olarak yapılandırılmamış. WhatsApp üzerinden kayıt talebi iletebilirsiniz.';
  }
  if (lower.includes('23505') || lower.includes('duplicate') || lower.includes('zaten')) {
    return 'Bu kullanıcı adı veya kayıt zaten mevcut. Farklı bir kullanıcı adı deneyin veya destek ile iletişime geçin.';
  }
  return msg || 'Kayıt sırasında bir hata oluştu. WhatsApp üzerinden bize ulaşabilirsiniz.';
}
