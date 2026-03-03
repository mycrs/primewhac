export const defaultDetailedGuides = {
    title: "Detaylı Kurulum Rehberleri",
    subtitle: "Tüm popüler IPTV uygulamaları için adım adım kurulum talimatları ve en iyi ipuçları.",
    guides: [
        { 
            id: 1, 
            title: 'Xtreme Codes API ile Kurulum', 
            description: 'En popüler ve kolay yöntem. Sadece kullanıcı adı, şifre ve sunucu adresi girmeniz yeterlidir.', 
            iconUrl: 'https://img.icons8.com/fluency/48/api-settings.png',
            content: 'Xtreme Codes API, IPTV hizmetinize erişmenin en stabil yollarından biridir. Çoğu modern IPTV uygulaması bu yöntemi destekler.\n\n1. IPTV uygulamanızı açın.\n2. "Add Playlist" veya "Login with Xtreme Codes API" gibi bir seçenek arayın.\n3. Size WhatsApp üzerinden verdiğimiz "Playlist Adı" (herhangi bir şey yazabilirsiniz), "Kullanıcı Adı", "Şifre" ve "Sunucu URL" bilgilerini ilgili alanlara girin.\n4. "Ekle" veya "Giriş Yap" butonuna basın.\n5. Kanallarınız ve içerikleriniz otomatik olarak yüklenecektir. İyi seyirler!'
        },
        { 
            id: 2, 
            title: 'M3U Linki ile Kurulum', 
            description: 'VLC Player gibi uygulamalar veya MAC adresi tabanlı kurulumlar için kullanılır.',
            iconUrl: 'https://img.icons8.com/fluency/48/link.png', 
            content: 'M3U linki, kanal listenizi içeren özel bir URL adresidir. VLC Player gibi oynatıcılar veya SET IPTV, NET IPTV gibi Smart TV uygulamaları bu yöntemi kullanır.\n\n**VLC Player (PC/Mac) için:**\n1. VLC Player\'ı açın.\n2. Üst menüden "Ortam" > "Ağ Akışı Aç" (Media > Open Network Stream) seçeneğine tıklayın.\n3. "Ağ" sekmesinde, size verdiğimiz M3U linkini yapıştırın ve "Oynat" butonuna basın.\n\n**Smart TV (SET IPTV vb.) için:**\n1. TV\'nize ilgili uygulamayı (örn: SET IPTV) kurun ve açın.\n2. Ekranda beliren MAC adresini not alın.\n3. Uygulamanın web sitesine (örn: siptv.app) gidin.\n4. MAC adresinizi ve M3U linkinizi ilgili alanlara girerek listenizi yükleyin.\n5. TV\'nizdeki uygulamayı yeniden başlatın.'
        },
        { 
            id: 3, 
            title: 'VLC Player ile Kurulum', 
            description: 'Bilgisayarınızda M3U linkinizi kullanarak anında izlemeye başlayın.',
            iconUrl: 'https://img.icons8.com/color/48/vlc-media-player.png',
            content: 'VLC Media Player, M3U listelerini oynatmak için en iyi ve en basit programlardan biridir.\n\n1. Öncelikle vlc-media-player.org adresinden VLC\'yi indirip kurun.\n2. Programı çalıştırın.\n3. Sol üst köşedeki "Ortam" (Media) menüsüne tıklayın.\n4. Açılan menüden "Ağ Akışı Aç..." (Open Network Stream...) seçeneğini seçin.\n5. Karşınıza çıkan pencerede, "Ağ" (Network) sekmesinin seçili olduğundan emin olun.\n6. Size WhatsApp üzerinden ilettiğimiz M3U linkini "Lütfen bir ağ URL\'si girin:" (Please enter a network URL:) yazan kutucuğa yapıştırın.\n7. "Oynat" (Play) butonuna basın. Kanal listeniz yüklenecek ve ilk kanal oynamaya başlayacaktır.\n8. Tüm kanalları görmek için "Görünüm" (View) > "Oynatma Listesi" (Playlist) menüsünü (veya CTRL+L kısayolunu) kullanabilirsiniz.'
        }
    ]
};