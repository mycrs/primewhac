export const defaultFaqData = {
    title: 'Sıkça Sorulan Sorular — QruzeTV Yayın Rehberi',
    description: 'QruzeTV yayın altyapısı, kurulum adımları, cihaz uyumluluğu ve taahhütsüz paketler hakkında merak edilen tüm sorular ve teknik yanıtlar.',
    sections: [
        {
            title: 'Yayın Teknolojisi ve Genel Bilgiler',
            items: [
                {
                    question: 'IPTV Nedir ve Geleneksel Yayından Farkı Nedir?',
                    answer: 'IPTV, televizyon sinyallerinin çanak anten veya kablo yerine doğrudan yüksek hızlı internet bağlantısı üzerinden aktarılması teknolojisidir. Çanak anten montajı, kablo çekimi veya hava koşullarından etkilenme riskini ortadan kaldırır. Smart TV, telefon, tablet, Apple TV veya bilgisayarınız üzerinden dilediğiniz an canlı yayınlara ve elektronik program rehberine (EPG) ulaşabilirsiniz.'
                },
                {
                    question: 'Aynı Anda Kaç Cihazdan İzleyebilirim?',
                    answer: 'Standart bireysel paketler tek eşzamanlı bağlantıyı destekler. Bu, üyeliğinizi evinizdeki televizyona, telefonunuza veya tabletinize kurabileceğiniz, ancak aynı saniye içinde yalnızca tek bir ekranda aktif yayın açabileceğiniz anlamına gelir. Evde aynı anda birden fazla odada yayın izlemek isteyen aileler için çoklu cihaz (2 Kullanıcı) paket seçeneklerimiz mevcuttur.'
                },
                {
                    question: 'İzlemek İçin Smart TV Şart mı?',
                    answer: 'Hayır. Smart TV zorunlu değildir. Evinizdeki eski bir televizyona bağlayacağınız Amazon Fire TV Stick, Xiaomi Mi Box, Google Chromecast veya Apple TV gibi akıllı kutularla sistemi anında kullanabilirsiniz. Ayrıca iOS, Android mobil cihazlar ve bilgisayarlar üzerinden de sorunsuz çalışır.'
                },
                {
                    question: 'Sözleşme veya Otomatik Kart Çekimi Var mı?',
                    answer: 'Kesinlikle hayır. QruzeTV tamamen taahhütsüz ve şeffaf bir modelle çalışır. Satın aldığınız paket süresi (örneğin 3, 6 veya 12 ay) bittiğinde aboneliğiniz kendiliğinden sona erer; kartınızdan bilginiz dışında hiçbir otomatik yenileme ücreti tahsil edilmez.'
                }
            ]
        },
        {
            title: 'Kurulum ve Cihaz Uyumluluğu',
            items: [
                {
                    question: 'Smart TV Kurulumu Nasıl Yapılır?',
                    answer: 'Samsung Tizen ve LG webOS televizyonlarda IBO Player, Smart IPTV veya Nanomid gibi popüler uygulamaları televizyonunuzun uygulama mağazasından indirmeniz yeterlidir. Uygulamanın ekranında beliren MAC adresini destek ekibimize ilettiğinizde veya panelden girdiğinizde kanal listeniz dakikalar içinde aktifleşir.'
                },
                {
                    question: 'Hangi IPTV Oynatıcı Uygulamalarını Öneriyorsunuz?',
                    answer: 'Android TV ve Firestick cihazlarda TiviMate veya IPTV Smarters Pro en akıcı ve kullanıcı dostu arayüzü sunar. Apple TV ve iPhone/iPad cihazlarda IPTVX veya GSE Smart IPTV, Smart TV tarafında ise IBO Player tavsiye edilir. QruzeTV açık M3U ve Xtream Codes protokollerini desteklediği için sizi zorunlu bir uygulamaya bağlamaz.'
                },
                {
                    question: 'M3U Linki ve Xtream Codes Bilgisi Nedir?',
                    answer: 'M3U, oynatıcı uygulamalara yapıştırılan tek satırlık akış bağlantısıdır. Xtream Codes ise Sunucu Adresi (URL), Kullanıcı Adı ve Şifre formatında çalışan pratik bir API giriş yöntemidir. Siparişinizin hemen ardından her iki format da WhatsApp veya e-posta ile tarafınıza iletilir.'
                },
                {
                    question: 'Elektronik Program Rehberi (EPG) Otomatik Yüklenir mi?',
                    answer: 'Evet. Yayın altyapımız canlı EPG entegrasyonuna sahiptir. Xtream Codes veya EPG destekli M3U bağlantısı girdiğinizde, kanalların o anki yayın akışı ve günün program takvimi oynatıcınızın arayüzünde otomatik olarak listelenir.'
                }
            ]
        },
        {
            title: 'Yayın Kalitesi ve İnternet Altyapısı',
            items: [
                {
                    question: 'Yayınlarda Donma veya Takılma Yaşanır mı?',
                    answer: 'Yayın sunucularımız doğrudan Frankfurt (DE-CIX) ve Amsterdam ana internet değişim noktalarındaki yüksek kapasiteli CDN ağlarına bağlıdır. Bu sayede akşam saatlerindeki yoğunlukta veya derbi maçlarında tamponlama (buffering) yaşanmaz. En yüksek verim için evinizde modeme kablolu (Ethernet) bağlanmanızı öneririz.'
                },
                {
                    question: 'İnternet Hızım Minimum Kaç Mbps Olmalı?',
                    answer: 'Full HD 1080p yayınlar için kesintisiz 16 Mbps, gerçek 60 FPS canlı spor ve 4K yayınlar için ise 25-35 Mbps ve üzeri stabil bir bağlantı tavsiye edilir. Önemli olan anlık hızdan ziyade hattın ping ve paket kaybı (jitter) kararlılığıdır.'
                },
                {
                    question: 'Avrupa ve Yurt Dışında VPN Gerekir mi?',
                    answer: 'Hayır. Sunucularımız doğrudan Avrupa lokasyonlu olduğu için Almanya, Hollanda, Fransa, Avusturya ve diğer Avrupa ülkelerinde herhangi bir VPN kullanmanıza gerek kalmadan en düşük gecikmeyle doğrudan bağlanabilirsiniz.'
                }
            ]
        },
        {
            title: 'Sipariş, Deneme ve Destek',
            items: [
                {
                    question: 'Satın Almadan Önce Ücretsiz Test Edebilir miyim?',
                    answer: 'Evet. Altyapımızın görüntü netliğini, kanal akıcılığını ve cihazınızdaki uyumunu kendi gözlerinizle görmeniz için 2 saatlik ücretsiz test yayını sağlıyoruz. Test talebinizi sitemizdeki formdan veya WhatsApp destek hattımızdan iletebilirsiniz.'
                },
                {
                    question: 'Sipariş Sonrası Bilgilerim Ne Kadar Sürede Gelir?',
                    answer: 'Ödemeniz onaylandıktan sonra aktivasyon bilgileriniz genelde 5 ile 15 dakika arasında WhatsApp veya e-posta yoluyla size ulaştırılır. Kurulum adımlarında takıldığınız her an destek uzmanlarımız birebir yardımcı olur.'
                },
                {
                    question: 'Teknik Sorun Yaşadığımda Kiminle Görüşeceğim?',
                    answer: 'Otomatik robot cevapları yerine; televizyonunuzun ve cihazınızın dilinden anlayan gerçek Türkçe destek uzmanlarımız WhatsApp üzerinden 7 gün boyunca hizmet vermektedir.'
                }
            ]
        }
    ]
};
