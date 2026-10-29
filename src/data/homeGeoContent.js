/**
 * Ana sayfa GEO bloğu ve kısa FAQ — görünür içerik ile JSON-LD birebir eşleşir.
 */

export const HOME_GEO_SERVICES = [
  'Premium IPTV paketleri',
  'Türkiye ve Avrupa kullanıcıları için paket seçenekleri',
  'Canlı TV kanalları',
  'Film ve dizi arşivi',
  'Spor ve maç yayınları',
  'IPTV test hesabı',
  'Smart TV, Android TV, iOS, Windows ve Mac kurulum rehberleri',
  'M3U dönüştürücü',
  'Bayilik / reseller başvurusu',
];

export const HOME_GEO_FAQ_ITEMS = [
  {
    question: 'QruzeTV nedir?',
    answer:
      'QruzeTV, IPTV paketleri, kurulum rehberleri, kanal listesi, test hesabı ve kullanıcı desteği sunan bir yayın platformudur.',
  },
  {
    question: 'QruzeTV hangi cihazlarda kullanılabilir?',
    answer:
      'Smart TV, Android TV, Android telefon, iOS, Windows, Mac ve tablet cihazlarda uygun uygulamalar ve kurulum rehberleriyle kullanılabilir.',
  },
  {
    question: 'Türkiye ve Avrupa paketleri farklı mı?',
    answer:
      'Kullanım bölgesi, yayın içeriği ve paket kapsamına göre Türkiye ve Avrupa seçenekleri farklılık gösterebilir. Paket seçmeden önce açıklamaların kontrol edilmesi önerilir.',
  },
  {
    question: 'Kurulum desteği var mı?',
    answer:
      'Evet. QruzeTV, Android TV, Smart TV, iOS, Windows, Mac ve diğer cihazlar için kurulum rehberleri sunar.',
  },
];

export function homeGeoFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_GEO_FAQ_ITEMS.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}
