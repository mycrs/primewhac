/** /paketler sayfası CMS varsayılanları — site_content.packagesPageContent */

import { DEFAULT_PACKAGE_QUIZ } from '@/data/defaultPackageQuizContent';

export const DEFAULT_PACKAGES_PAGE_CONTENT = {
  defaults: {
    tier: 'premium',
    region: 'tr',
  },
  page: {
    title: 'IPTV Paketleri ve Fiyatları',
    titleDe: 'Premium IPTV Deutschland – Pakete und Preise',
    shortDescription:
      'İhtiyacınıza uygun IPTV paketlerini inceleyin, fiyatları karşılaştırın ve güvenle satın alın. Standart ve Premium seçeneklerde anında aktivasyon ve 7/24 destek.',
    shortDescriptionDe:
      'Vergleichen Sie IPTV-Pakete und Preise für Deutschland und Europa. Kaufen Sie Standard- oder Premium-IPTV mit stabilem 4K-Stream und schneller Aktivierung.',
    emptyMessage:
      'Bu kategori için şu anda aktif paket bulunmuyor. Detaylı bilgi için WhatsApp üzerinden bize ulaşabilirsiniz.',
    emptyMessageDe:
      'Für diese Kategorie sind derzeit keine aktiven Pakete verfügbar. Kontaktieren Sie uns per WhatsApp für Details.',
  },
  activeTiers: [
    { id: 'economic', enabled: true, labelTr: 'Ekonomik Paketler', labelDe: 'Wirtschaftspakete' },
    { id: 'standard', enabled: true, labelTr: 'Standart Paketler', labelDe: 'Standard Pakete' },
    { id: 'premium', enabled: true, labelTr: 'Premium Paketler', labelDe: 'Premium Pakete' },
  ],
  tiers: {
    economic: {
      title: 'Ekonomik IPTV Paketleri',
      shortDescription: 'Bütçe dostu fiyatlarla temel kanal erişimi, popüler ulusal kanallar ve kesintisiz yayın deneyimi sunar.',
      shortDescriptionDe: 'Budgetfreundliche IPTV-Pakete für den täglichen Bedarf mit den wichtigsten Kanälen.',
      detailDescription:
        'Ekonomik IPTV paketleri, bütçe dostu fiyatlarla temel kanal erişimi, popüler içerikler ve yaygın cihaz desteği isteyen kullanıcılar için hazırlanmıştır.',
    },
    standard: {
      title: 'Standart IPTV Paketleri',
      shortDescription: 'Günlük kullanım için uygun fiyatlı IPTV paketleri.',
      shortDescriptionDe: 'Preiswerte IPTV-Pakete für den täglichen Gebrauch.',
      detailDescription:
        'Standart IPTV paketleri, temel kanal erişimi, film/dizi içerikleri ve yaygın cihaz desteği isteyen kullanıcılar için hazırlanmıştır.',
    },
    premium: {
      title: 'Premium IPTV Paketleri',
      shortDescription:
        'Daha geniş içerik, yüksek kalite yayın ve öncelikli destek isteyen kullanıcılar için.',
      shortDescriptionDe:
        'Für Nutzer mit größerem Inhaltsarchiv, hoher Qualität und priorisiertem Support.',
      detailDescription:
        'Premium IPTV paketleri, daha kapsamlı içerik arşivi, daha stabil yayın deneyimi ve öncelikli destek isteyen kullanıcılar için hazırlanmıştır.',
    },
  },
  regions: {
    tr: {
      title: 'Türkiye Paketleri',
      shortDescription: 'Türkiye içi kullanım için optimize edilmiş IPTV paketleri.',
      detailDescription:
        'Paket seçimi yapılırken kullanım bölgesi önemlidir. Türkiye kullanıcıları için sunulan paket seçenekleri içerik, yayın erişimi ve kullanım koşulları açısından Türkiye lokasyonuna göre yapılandırılmıştır.',
      warning:
        'Önemli: Türkiye paketleri yalnızca Türkiye IP adreslerinde geçerlidir. Yurt dışı ikamet eden izleyicilerimizin Avrupa paketlerini seçmesi önerilir.',
    },
    eu: {
      title: 'Avrupa Paketleri',
      shortDescription: 'Avrupa ülkelerinden kullanım için optimize edilmiş IPTV paketleri.',
      detailDescription:
        'Avrupa kullanıcıları için sunulan paket seçenekleri içerik, yayın erişimi ve kullanım koşulları açısından Avrupa lokasyonuna göre yapılandırılmıştır. EUR ile ödeme yapılabilir.',
      warning:
        'Avrupa paketlerimiz Almanya, Avusturya, Hollanda ve tüm dünyada VPN gerektirmeden, yerel kısıtlamalara takılmadan kesintisiz çalışır.',
    },
  },
  seo: {
    whatIsIptv: {
      title: 'IPTV Paketleri Nedir?',
      paragraphs: [
        'IPTV paketleri, modern çağın en popüler eğlence çözümüdür. Geleneksel uydu alıcılarının ve kablolu yayınların yerini alan bu sistem, internet protokolü üzerinden televizyon yayınlarını ekranınıza taşır. 10.000+ kanal, film ve dizi içeriğine anında erişim sağlayan en iyi IPTV hizmetleri, evinizdeki eğlence anlayışını tamamen değiştirir.',
        'Artık çanak anten kurulumu veya karmaşık kablolama işlemleriyle uğraşmanıza gerek yok. Gelişmiş teknolojik altyapımız sayesinde, kesintisiz yayın kalitesi ve uygun fiyat ile milyonlarca kullanıcının tercih ettiği bir teknoloji haline gelmiştir.',
        'İçerik kütüphanemiz, güncel sinema filmlerinden popüler dizilere, belgesellerden çocuk kanallarına kadar geniş bir yelpazeyi kapsar.',
      ],
    },
    regionDifference: {
      title: 'Türkiye ve Avrupa Paketleri Arasındaki Fark',
      body: 'Paket seçimi yapılırken kullanım bölgesi önemlidir. Türkiye ve Avrupa kullanıcıları için sunulan paket seçenekleri içerik, yayın erişimi ve kullanım koşulları açısından farklılık gösterebilir.',
      warning:
        'Doğru bölge paketini seçmek yayın kararlılığı açısından kritiktir; kararsız kalırsanız canlı destek ekibimizden anında rehberlik alabilirsiniz.',
    },
    howToChoose: {
      title: 'IPTV Paketleri Nasıl Seçilir?',
      paragraphs: [
        'Doğru IPTV paketini seçmek, tamamen sizin günlük izleme alışkanlıklarınıza, evinizdeki cihaz sayısına ve bütçenize bağlıdır. Stabil bir kesintisiz yayın için minimum 10-15 Mbps hıza ihtiyacınız olacaktır.',
        'Hangi cihazları kullanacağınızı belirleyin. Sadece canlı kanalları mı, yoksa geniş bir VOD arşivi mi aradığınıza karar verin. Uzun süreli alımlar genellikle en uygun fiyatlı çözümdür.',
      ],
    },
    featuresDetail: {
      title: 'Paket Özellikleri Detaylı',
      intro:
        'Müşterilerimizin farklı ihtiyaçlarını karşılamak üzere özenle hazırladığımız IPTV paketleri, her bütçeye ve kullanım senaryosuna uygun alternatifler sunar.',
      sections: [
        {
          title: '3 Aylık Paketler',
          content:
            'Kısa süreli deneme yapmak isteyenler veya geçici bir çözüm arayanlar için 3 aylık paketler ideal seçimdir.',
        },
        {
          title: '6 Aylık Paketler',
          content:
            'Orta vadeli bir çözüm arayan kullanıcılar için 6 aylık IPTV paketleri makul bir tasarruf sağlar.',
        },
        {
          title: '12 Aylık Paketler',
          content:
            'Uzun vadeli bir çözüm arayan kullanıcılar ise 12 aylık premium paketler ile önemli bir tasarruf sağlayabilirler.',
        },
      ],
    },
    usageTips: {
      title: 'Kullanım İpuçları',
      intro: 'IPTV paketinizden en iyi şekilde yararlanmak için birkaç önemli ipucu:',
      items: [
        'Mümkünse cihazınızı modeme Wi-Fi yerine Ethernet (kablolu) ile bağlayın.',
        'Smart TV veya TV Box cihazınızın işletim sistemini düzenli güncelleyin.',
        'Zaman zaman uygulamalarınızın önbelleğini temizleyin.',
        'Evde aynı anda yoğun indirme işlemleri yapılıyorsa yayın kaliteniz etkilenebilir.',
      ],
      outro:
        'Herhangi bir teknik sorunda 7/24 müşteri hizmetlerimizle iletişime geçmekten çekinmeyin.',
    },
    faq: {
      title: 'Sıkça Sorulan Sorular',
      description:
        'Paket seçiminden kuruluma, yayın kalitesinden ödeme seçeneklerine kadar aklınıza takılan her konuda size yardımcı olmaya hazırız.',
    },
    whyUs: {
      title: 'Neden Bizim Paketlerimiz?',
      description:
        'Sunduğumuz IPTV paketleri, teknolojik altyapı, yayın kalitesi ve satış sonrası hizmetler açısından sektördeki en iyi seçeneklerdir.',
      items: [
        {
          title: 'Yüksek Performans',
          content:
            'Anti-freeze teknolojimiz ve optimize edilmiş sunucularımız sayesinde kesintisiz yayın deneyimi sağlar.',
        },
        {
          title: 'Güvenli Ödeme',
          content: 'Tüm ödemeleriniz 256-bit SSL şifreleme teknolojisi ile korunur.',
        },
        {
          title: 'Kesintisiz Destek',
          content: '7/24 aktif uzman destek ekibimiz WhatsApp ve canlı destek üzerinden yanınızdadır.',
        },
      ],
    },
  },
  packageQuiz: structuredClone(DEFAULT_PACKAGE_QUIZ),
};
