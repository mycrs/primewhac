import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const DetailedContentSection = () => {
  const location = useLocation();
  const isDe = location.pathname.startsWith('/de');
  const packagesLink = isDe ? "/de/pakete" : "/paketler";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (isDe) {
    return (
      <section className="container mx-auto px-4 py-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-slate-800/80 rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#141414]/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="relative z-10 space-y-12 text-slate-300 text-lg leading-relaxed">
            
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710]">
                Filme und Serien mit IPTV ansehen – Umfassender Leitfaden
              </h2>
              <p className="max-w-4xl mx-auto">
                Mit dem neuesten Stand der digitalen Übertragungstechnik ist es jetzt viel einfacher, ein einzigartiges Kinoerlebnis bequem zu Hause zu genießen. Ohne sich in der grenzenlosen Inhaltswelt zu verirren, bringt unser Leitfaden Ihr Fernseherlebnis auf die nächste Stufe. Entdecken Sie unsere unterbrechungsfreie Streaming-Infrastruktur und <Link to={packagesLink} className="text-pink-400 hover:text-pink-300 font-semibold underline decoration-pink-500/30 underline-offset-4 transition-colors">prüfen Sie die Pakete, um das IPTV-Filmerlebnis zu starten</Link>.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710] mb-4 inline-block">
                Wie werden beliebte Filme und Serien ausgewählt?
              </h3>
              <p>
                Bei der Erstellung unseres Inhaltsarchivs analysieren wir sorgfältig globale Trends, IMDB-Bewertungen und Zuschaueranfragen. Um ein einwandfreies <strong>IPTV-Erlebnis</strong> zu bieten, fügen wir unserer Bibliothek sofort die aktuellsten Blockbuster hinzu. Wir legen die gleiche Sorgfalt auf Serien, verfolgen beliebte Inhalte globaler Sender und stellen sicher, dass die <strong>besten IPTV-Serien</strong> auf unserer Plattform verfügbar sind.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710] mb-4 inline-block">
                4K- und HD-Filmgenuss – Ultrascharfes Bilderlebnis
              </h3>
              <p>
                Die Auflösungsqualität, unverzichtbar für das Heimkino, ist eine unserer Stärken. Genießen Sie auf Ihren unterstützten Geräten kristallklare Bilder durch unsere <strong>4K IPTV</strong>-Technologie. Vom Naturdokumentarfilm bis zum Sci-Fi-Film – alles wird dank unserer <strong>Premium IPTV</strong>-Server ohne Farbverlust auf Ihren Bildschirm übertragen. Selbst bei höchsten Bitraten gibt es dank unseres intelligenten Netzwerks kein Ruckeln. <Link to={packagesLink} className="text-pink-400 hover:text-pink-300 font-semibold underline decoration-pink-500/30 underline-offset-4 transition-colors">Entdecken Sie unsere 4K IPTV-Pakete</Link>.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12 p-8 bg-white/5 rounded-2xl border border-white/10 text-center">
              <h4 className="text-xl font-bold text-white mb-4">Sind Sie bereit, Grenzen zu überschreiten?</h4>
              <p className="text-slate-400 mb-6">
                Schließen Sie sich Zehntausenden glücklicher Benutzer an und definieren Sie Ihr Fernsehen mit Premium-IPTV neu. Greifen Sie sofort auf die besten Serien und 4K-Filme zu.
              </p>
              <Link 
                to={packagesLink}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[#e50914] to-[#b20710] rounded-full shadow-lg hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
              >
                Zum Angebot
              </Link>
            </motion.div>

          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-slate-800/80 rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#141414]/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 space-y-12 text-slate-300 text-lg leading-relaxed">
          
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710]">
              IPTV ile Film ve Dizi İzleme – Kapsamlı Rehber
            </h2>
            <p className="max-w-4xl mx-auto">
              Dijital yayıncılığın geldiği son noktada, evinizin konforunda eşsiz bir sinema deneyimi yaşamak artık çok daha kolay. Sınırsız içerik dünyasında kaybolmadan, en kaliteli yapımları bulmanız için hazırladığımız bu rehberle, televizyon keyfinizi bir üst seviyeye taşıyacaksınız. Kesintisiz yayın altyapımızla tanışmak ve eğlenceye hemen başlamak için <Link to={packagesLink} className="text-pink-400 hover:text-pink-300 font-semibold underline decoration-pink-500/30 underline-offset-4 transition-colors">IPTV film izleme deneyimini başlatmak için paketleri incele</Link>yin.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710] mb-4 inline-block">
              Popüler Filmler ve Diziler Nasıl Seçiliyor?
            </h3>
            <p>
              İçerik arşivimizi oluştururken global trendleri, IMDB puanlarını ve izleyici taleplerini titizlikle analiz ediyoruz. Kusursuz bir <strong>iptv film izle</strong> deneyimi sunabilmek için en güncel vizyon yapımlarını anında kütüphanemize ekliyoruz. Aynı özeni diziler konusunda da gösteriyor, global yayıncıların popüler içeriklerini takip ederek <strong>en iyi diziler iptv</strong> platformumuzda hemen yerini almasını sağlıyoruz. Amacımız, her zevke hitap eden zengin bir yelpaze sunarken kalite standartlarından asla ödün vermemektir. Dünya standartlarında bir eğlence arşivi oluşturmak, ancak <strong>kaliteli iptv</strong> altyapısının gücüyle mümkündür. Siz de bu devasa arşive katılmak ve <Link to={packagesLink} className="text-pink-400 hover:text-pink-300 font-semibold underline decoration-pink-500/30 underline-offset-4 transition-colors">en iyi diziler IPTV paketlerini keşfet</Link>mek için doğru yerdesiniz.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-rose-300 mb-4 inline-block">
              En Çok İzlenen İçerikler – Trend Filmler ve Diziler
            </h3>
            <p>
              Platformumuzda her zaman en popüler yapımları ana sayfanızda bulabilirsiniz. Kesintisiz <strong>iptv film izle</strong> ayrıcalığıyla gişe rekorları kıran aksiyon filmlerinden, ödüllü dramalara kadar binlerce seçenek elinizin altında. Hafta sonu maratonları için aranan <strong>en iyi diziler iptv</strong> listelerimizde özel olarak kategorize edilmiştir. Kullanıcılarımız, akıllı arama özelliklerini kullanarak istedikleri içeriğe saniyeler içinde ulaşabilirler. Ayrıca <strong>canlı iptv yayın</strong> kanallarında yayınlanan özel sinema kuşakları da nostalji arayanlar için mükemmel bir alternatiftir. Dünyanın en çok konuşulan yapımlarını yüksek kalitede izlemek için hemen <Link to={packagesLink} className="text-pink-400 hover:text-pink-300 font-semibold underline decoration-pink-500/30 underline-offset-4 transition-colors">kaliteli IPTV paketlerine abone ol</Link>un.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710] mb-4 inline-block">
              4K ve HD Film Keyfi – Ultra Net Görüntü Deneyimi
            </h3>
            <p>
              Ev sinemasının vazgeçilmezi olan çözünürlük kalitesi, platformumuzun en iddialı olduğu konulardan biridir. Destekleyen cihazlarınızda <strong>4k film iptv</strong> teknolojisinin sunduğu kristal berraklığındaki görüntülerin tadını çıkarabilirsiniz. Doğadaki belgesellerden bilim kurgu filmlerine kadar her detay, <strong>kaliteli iptv</strong> sunucularımız sayesinde renk kayıpları yaşanmadan ekranınıza yansır. Üstelik bu yüksek çözünürlükleri desteklemek için sürekli optimize edilen <strong>donmayan iptv</strong> ağımız sayesinde, en yüksek bitrate oranlarında bile takılma sorunu yaşamazsınız. Gerçeküstü bir görsel şölene adım atmak istiyorsanız, detaylı inceleme yaparak <Link to={packagesLink} className="text-pink-400 hover:text-pink-300 font-semibold underline decoration-pink-500/30 underline-offset-4 transition-colors">4K film IPTV paketlerini gör</Link>ebilirsiniz.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710] mb-4 inline-block">
              IPTV ile Film İzlemenin Avantajları
            </h3>
            <p>
              Geleneksel yayıncılığın sınırlarını aşan sistemimiz, kullanıcıya tam bir özgürlük sunar. Kendi programınızı kendiniz belirleyebilir, istediğiniz an <strong>iptv film izle</strong> keyfine başlayabilirsiniz. Farklı platformlara ayrı ayrı ücret ödemek yerine, <strong>en iyi diziler iptv</strong> listemizde tek bir çatı altında toplanmıştır. Bununla birlikte, anlık gelişmeleri takip etmek isteyenler için yüksek stabiliteye sahip <strong>canlı iptv yayın</strong> altyapımız 7/24 hizmet vermektedir. Hem VOD (Seç İzle) arşivinin zenginliği hem de canlı kanalların çeşitliliği, <strong>kaliteli iptv</strong> deneyiminin en büyük avantajlarıdır. Bu eşsiz ayrıcalıklardan faydalanmak ve sınırları kaldırmak için <Link to={packagesLink} className="text-pink-400 hover:text-pink-300 font-semibold underline decoration-pink-500/30 underline-offset-4 transition-colors">canlı IPTV yayın paketlerine başla</Link>yabilirsiniz.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300 mb-4 inline-block">
              Donmayan Yayın Deneyimi – Kesintisiz Film İzleme
            </h3>
            <p>
              En heyecanlı sahnede ekranın donması, bir izleyicinin yaşayabileceği en can sıkıcı durumdur. Bu yüzden altyapımızı <strong>donmayan iptv</strong> garantisi üzerine inşa ettik. Gelişmiş veri sıkıştırma algoritmaları ve güçlü CDN ağımız sayesinde <strong>4k film iptv</strong> içeriklerinde bile kesinti yaşanmaz. Güçlü internet bağlantısına sahip olduğunuz sürece, yüksek kapasiteli sunucularımız <strong>canlı iptv yayın</strong> akışını anlık olarak stabilize eder. Kesintisiz <strong>iptv film izle</strong>me deneyimini bir lüks olmaktan çıkarıp standarta dönüştürüyoruz. Evinizde profesyonel bir sinema atmosferi yaratmak ve bu pürüzsüz akışın keyfini sürmek için hemen <Link to={packagesLink} className="text-pink-400 hover:text-pink-300 font-semibold underline decoration-pink-500/30 underline-offset-4 transition-colors">donmayan IPTV yayın paketlerini seç</Link>in ve eğlencenin tadını çıkarın.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 p-8 bg-white/5 rounded-2xl border border-white/10 text-center">
            <h4 className="text-xl font-bold text-white mb-4">Sınırları Kaldırmaya Hazır Mısınız?</h4>
            <p className="text-slate-400 mb-6">
              Siz de on binlerce mutlu kullanıcımız arasına katılın, donmayan yayın teknolojisiyle televizyonunuzu baştan yaratın. En iyi diziler iptv ve 4k film iptv içeriklerine anında ulaşın.
            </p>
            <Link 
              to={packagesLink}
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[#e50914] to-[#b20710] rounded-full shadow-lg hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
            >
              Hemen Paket Seçin
            </Link>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

export default DetailedContentSection;