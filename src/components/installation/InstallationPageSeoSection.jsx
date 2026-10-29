
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  FlaskConical,
  HelpCircle,
  FileText,
  Tv,
  Smartphone,
  Wifi,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Users,
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

const stagger = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4 },
};

const CONTENT_TR = {
  title: 'IPTV Kurulumu ve Kullanım Rehberi',
  deviceTitle: 'Cihazınıza Göre IPTV Kurulumu',
  connectionReady: 'Bağlantı hazır',
  streamCaption: 'Kurulum sonrası yayın akışı',
  m3uTitle: 'M3U Linki ve Xtream Codes ile Kurulum',
  paketlerBtn: 'Paketleri inceleyin',
  testBtn: 'Ücretsiz test',
  troubleshootTitle: 'Kurulum Sonrası Sorun Giderme',
  relatedTitle: 'İlgili Sayfalar ve Kaynaklar',
  ctaTitle: 'Kuruluma Başlamadan Önce',
  ctaTest: 'Ücretsiz Test',
  ctaPaketler: 'Paketleri Görüntüle',
  checklist: ['Stabil internet (min. 16 Mbps)', 'Doğru kullanıcı adı ve şifre', 'Güncel IPTV uygulaması', 'M3U veya Xtream bilgileri'],
  links: [
    { to: '/paketler/', label: 'IPTV Paketleri', desc: 'Fiyatlar ve süreler', icon: Package },
    { to: '/test/', label: 'Ücretsiz Test', desc: 'Denemeden karar vermeyin', icon: FlaskConical },
    { to: '/sss/', label: 'Sık Sorulan Sorular', desc: 'Kurulum ve teknik SSS', icon: HelpCircle },
    { to: '/blog/', label: 'Blog', desc: 'İpuçları ve günceller', icon: FileText },
    { to: '/guide/iptv-kurulum-rehberi/', label: 'Detaylı Kurulum Rehberi', desc: 'Adım adım rehber', icon: BookOpen },
    { to: '/channels/', label: 'Kanal Listesi', desc: 'Mevcut kanallar', icon: Tv },
    { to: '/hakkimizda/', label: 'Hakkımızda', desc: 'Destek ve iletişim', icon: Users },
  ],
};

const CONTENT_DE = {
  title: 'IPTV Einrichtung und Nutzungsanleitung',
  deviceTitle: 'IPTV Einrichtung nach Gerät',
  connectionReady: 'Verbindung bereit',
  streamCaption: 'Stream nach der Einrichtung',
  m3uTitle: 'Einrichtung mit M3U-Link und Xtream Codes',
  paketlerBtn: 'Pakete ansehen',
  testBtn: 'Kostenlos testen',
  troubleshootTitle: 'Fehlerbehebung nach der Einrichtung',
  relatedTitle: 'Weitere Seiten und Ressourcen',
  ctaTitle: 'Vor dem Start der Einrichtung',
  ctaTest: 'Kostenlos testen',
  ctaPaketler: 'Pakete ansehen',
  checklist: ['Stabiles Internet (min. 16 Mbit/s)', 'Korrekte Zugangsdaten', 'Aktuelle IPTV-App', 'M3U- oder Xtream-Daten'],
  links: [
    { to: '/de/paketler/', label: 'IPTV Pakete', desc: 'Preise und Laufzeiten', icon: Package },
    { to: '/de/test/', label: 'Kostenlos testen', desc: 'Erst testen, dann entscheiden', icon: FlaskConical },
    { to: '/de/sss/', label: 'Häufig gestellte Fragen', desc: 'Einrichtung & Technik', icon: HelpCircle },
    { to: '/de/blog/', label: 'Blog', desc: 'Tipps und Updates', icon: FileText },
    { to: '/de/guide/iptv-kurulum-rehberi/', label: 'Detaillierte Anleitung', desc: 'Schritt-für-Schritt', icon: BookOpen },
    { to: '/de/kanale/', label: 'Senderliste', desc: 'Verfügbare Sender', icon: Tv },
    { to: '/de/uber-uns/', label: 'Über uns', desc: 'Support & Kontakt', icon: Users },
  ],
};

const InstallationPageSeoSection = ({ isDe = false }) => {
  const t = isDe ? CONTENT_DE : CONTENT_TR;
  const paketlerPath = isDe ? '/de/paketler/' : '/paketler/';
  const testPath = isDe ? '/de/test/' : '/test/';

  return (
    <section className="mt-24 space-y-20">
      <motion.h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4" {...fadeInUp}>
        {t.title}
      </motion.h2>
      <motion.p className="text-slate-400 text-center max-w-2xl mx-auto text-lg font-light" {...fadeInUp}>
        {isDe ? (
          <>Hier finden Sie Erklärungen zur <strong className="text-slate-300">IPTV Einrichtungsanleitung</strong>, gerätespezifische Tipps und Verweise auf unsere FAQ. Weitere Infos zu <Link to="/de/paketler/" className="text-primary hover:text-primary underline underline-offset-2">IPTV Paketen</Link> oder zum <Link to="/de/test/" className="text-primary hover:text-primary underline underline-offset-2">kostenlosen IPTV Test</Link> erhalten Sie auf den verlinkten Seiten.</>
        ) : (
          <>Aşağıda <strong className="text-slate-300">IPTV kurulum rehberi</strong> ile uyumlu açıklamalar, cihaz bazlı ipuçları ve sık sorulan sorulara yönlendirmeler bulabilirsiniz. <Link to="/paketler/" className="text-primary hover:text-primary underline underline-offset-2">IPTV paketleri</Link> veya <Link to="/test/" className="text-primary hover:text-primary underline underline-offset-2">ücretsiz IPTV testi</Link> hakkında bilgi almak için ilgili sayfalarımıza göz atın.</>
        )}
      </motion.p>

      {/* Cihaz bazlı kısa açıklamalar + animasyonlu kutu */}
      <div className="grid lg:grid-cols-5 gap-8 items-start">
        <motion.div
          className="lg:col-span-3 space-y-6"
          {...fadeInUp}
        >
          <h3 className="text-2xl font-bold text-white border-b border-slate-800 pb-3">
            {t.deviceTitle}
          </h3>
          {isDe ? (
            <>
              <p className="text-slate-300 font-light leading-relaxed">Für die <strong className="text-slate-200">Smart TV IPTV Einrichtung</strong> (Samsung, LG) laden Sie einfach eine passende App wie IPTV Smarters Pro oder Tivimate aus dem Store. Auch <strong className="text-slate-200">Android TV</strong>- und Fire TV Stick-Nutzer können mit denselben Apps in wenigen Minuten <strong className="text-slate-200">stabile IPTV</strong>-Streams nutzen. In unserer <Link to="/de/guide/iptv-kurulum-rehberi/" className="text-primary hover:text-primary underline underline-offset-2">detaillierten Einrichtungsanleitung</Link> finden Sie Schritt-für-Schritt-Anleitungen für jedes Gerät.</p>
              <p className="text-slate-300 font-light leading-relaxed">Für <strong className="text-slate-200">iOS und iPhone IPTV Einrichtung</strong> wählen Sie im App Store einen kompatiblen Player und tragen Ihre Abodaten (M3U oder Xtream Codes) ein. <strong className="text-slate-200">Windows PC</strong>- und <strong className="text-slate-200">Mac</strong>-Nutzer können mit Desktop-Apps oder VLC <strong className="text-slate-200">hochwertiges IPTV</strong> genießen. Alle Schritte sind in unserer <strong className="text-slate-200">IPTV Einrichtungsanleitung</strong> beschrieben.</p>
            </>
          ) : (
            <>
              <p className="text-slate-300 font-light leading-relaxed">
            <strong className="text-slate-200">Smart TV IPTV kurulumu</strong> (Samsung, LG) için mağazadan IPTV Smarters Pro veya Tivimate benzeri uygulamaları indirmeniz yeterlidir. <strong className="text-slate-200">Android TV</strong> ve Fire TV Stick kullanıcıları da aynı uygulamalarla dakikalar içinde <strong className="text-slate-200">donmayan IPTV</strong> deneyimine başlayabilir. <Link to="/guide/iptv-kurulum-rehberi/" className="text-primary hover:text-primary underline underline-offset-2">Detaylı kurulum rehberi</Link> sayfamızda her cihaz için adım adım anlatım bulunmaktadır.
          </p>
          <p className="text-slate-300 font-light leading-relaxed">
            <strong className="text-slate-200">iOS ve iPhone IPTV kurulumu</strong> için App Store’dan uyumlu bir oynatıcı seçip abonelik bilgilerinizi (M3U veya Xtream Codes) girmeniz yeterli. <strong className="text-slate-200">Windows PC</strong> ve <strong className="text-slate-200">Mac</strong> kullanıcıları masaüstü uygulamaları veya VLC ile <strong className="text-slate-200">kaliteli IPTV</strong> izleyebilir. Tüm bu süreçler <strong className="text-slate-200">IPTV kurulum rehberi</strong> bölümümüzde görsellerle desteklenmektedir.
          </p>
            </>
          )}
        </motion.div>

        {/* Animasyonlu / GIF alanı */}
        <motion.div
          className="lg:col-span-2 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative w-full max-w-sm aspect-video rounded-2xl overflow-hidden border border-slate-700 bg-[#0a0a0a]/80 shadow-xl">
            {/* Basit animasyon: sinyal / bağlantı simgesi */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <motion.div
                className="flex flex-col items-center gap-4"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="relative">
                  <Tv className="w-20 h-20 text-primary/80" />
                  <motion.span
                    className="absolute -top-1 -right-1 flex h-5 w-5"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#e50914] opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-[#e50914]" />
                  </motion.span>
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-2 w-2 rounded-full bg-primary"
                      animate={{
                        height: [8, 20, 8],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-400 font-medium">{t.connectionReady}</span>
              </motion.div>
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-3 text-center">{t.streamCaption}</p>
        </motion.div>
      </div>

      <motion.div className="bg-[#0a0a0a]/50 border border-slate-800 rounded-2xl p-8 md:p-10" {...fadeInUp}>
        <h3 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-3">{t.m3uTitle}</h3>
        <p className="text-slate-300 font-light leading-relaxed mb-6">
          {isDe ? (
            <>Mit dem nach dem Abo zugesendeten <strong className="text-slate-200">M3U-Link</strong> oder den <strong className="text-slate-200">Xtream Codes</strong> (Server, Benutzername, Passwort) können Sie die <strong className="text-slate-200">IPTV Einrichtung</strong> in allen kompatiblen Apps durchführen. M3U lädt alle Sender und VOD mit einem Link; die Xtream API bietet EPG und mehr. Beide Wege liefern über unsere <strong className="text-slate-200">hochwertigen IPTV</strong>-Server stabile Streams. Bei Problemen helfen unsere <Link to="/de/sss/" className="text-primary hover:text-primary underline underline-offset-2">FAQ</Link> und der Support.</>
          ) : (
            <>Abonelik sonrası size iletilen <strong className="text-slate-200">M3U linki</strong> veya <strong className="text-slate-200">Xtream Codes</strong> (sunucu adresi, kullanıcı adı, şifre) bilgileriyle tüm uyumlu uygulamalarda <strong className="text-slate-200">IPTV kurulumu</strong> yapabilirsiniz. M3U tek link ile tüm kanal ve VOD listesini çeker; Xtream API ise EPG ve daha zengin özellik sunar. Her iki yöntem de <strong className="text-slate-200">kaliteli IPTV</strong> sunucularımız üzerinden kesintisiz yayın sağlar. Sorun yaşarsanız <Link to="/sss/" className="text-primary hover:text-primary underline underline-offset-2">Sık Sorulan Sorular</Link> ve destek hattımız size yardımcı olacaktır.</>
          )}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to={paketlerPath} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/50 transition-colors text-sm font-medium">
            <Package className="w-4 h-4" />{t.paketlerBtn}
          </Link>
          <Link to={testPath} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e50914]/20 border border-[#e50914]/40 text-[#e50914] hover:bg-[#e50914]/30 transition-colors text-sm font-medium">
            <FlaskConical className="w-4 h-4" />{t.testBtn}
          </Link>
        </div>
      </motion.div>

      <motion.div {...fadeInUp}>
        <h3 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-3">{t.troubleshootTitle}</h3>
        <p className="text-slate-300 font-light leading-relaxed mb-8">
          {isDe ? (
            <>Öffnen sich keine Sender, prüfen Sie zuerst Ihre Internetgeschwindigkeit; für <strong className="text-slate-200">stabile IPTV</strong>-Streams empfehlen wir mindestens 16 Mbit/s. Benutzername und Passwort sind case-sensitive. Halten Sie die App aktuell. Weitere Hilfe finden Sie in unseren <Link to="/de/sss/" className="text-primary hover:text-primary underline underline-offset-2">FAQ</Link> zur <strong className="text-slate-200">IPTV Einrichtung</strong> oder unter <Link to="/de/uber-uns/" className="text-primary hover:text-primary underline underline-offset-2">Über uns</Link> und in unserem 7/24 Support.</>
          ) : (
            <>Kanallar açılmıyorsa önce internet hızınızı kontrol edin; <strong className="text-slate-200">donmayan IPTV</strong> için 16 Mbps ve üzeri önerilir. Kullanıcı adı ve şifreyi büyük/küçük harf duyarlı girin. Uygulama güncel değilse mağazadan güncelleyin. Hâlâ sorun varsa <Link to="/sss/" className="text-primary hover:text-primary underline underline-offset-2">SSS</Link> sayfamızdaki <strong className="text-slate-200">IPTV kurulumu</strong> ve teknik destek cevaplarına bakın; dilerseniz <Link to="/hakkimizda/" className="text-primary hover:text-primary underline underline-offset-2">Hakkımızda</Link> ve iletişim kanallarımızdan 7/24 destek alabilirsiniz.</>
          )}
        </p>
        <ul className="grid sm:grid-cols-2 gap-4">
          {[Wifi, CheckCircle2, Tv, Smartphone].map((Icon, i) => (
            <motion.li key={i} className="flex items-center gap-3 p-4 rounded-xl bg-[#0a0a0a]/50 border border-slate-700/50 text-slate-300" {...stagger} transition={{ delay: i * 0.08 }}>
              <Icon className="w-5 h-5 text-primary shrink-0" />
              <span>{t.checklist[i]}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div {...fadeInUp}>
        <h3 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-3">{t.relatedTitle}</h3>
        <p className="text-slate-400 font-light mb-8">
          {isDe ? <>Neben der <strong className="text-slate-300">IPTV Einrichtungsanleitung</strong> können Sie die folgenden Seiten für Paketwahl, kostenlosen Test und Senderliste nutzen.</> : <> <strong className="text-slate-300">IPTV kurulum rehberi</strong> dışında paket seçimi, ücretsiz deneme ve kanal listesi için aşağıdaki sayfaları kullanabilirsiniz.</>}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.links.map(({ to, label, desc, icon: Icon }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Link
                to={to}
                className="block p-5 rounded-xl bg-[#0a0a0a]/50 border border-slate-700/50 hover:border-primary/40 hover:bg-[#0a0a0a]/80 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-white group-hover:text-primary transition-colors flex items-center gap-1">
                      {label}
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                    </span>
                    <p className="text-slate-500 text-sm mt-0.5">{desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-[#e50914]/30 to-[#141414] border border-primary/20 text-center" {...fadeInUp}>
        <h3 className="text-2xl font-bold text-white mb-4">{t.ctaTitle}</h3>
        <p className="text-slate-300 font-light max-w-2xl mx-auto mb-8">
          {isDe ? (
            <>Wenn Sie noch kein <strong className="text-slate-200">IPTV Abo</strong> haben, können Sie zuerst unseren <Link to="/de/test/" className="text-primary hover:text-primary underline underline-offset-2">kostenlosen IPTV Test</Link> nutzen oder auf der Seite <Link to="/de/paketler/" className="text-primary hover:text-primary underline underline-offset-2">IPTV Pakete</Link> das passende Paket wählen. Für <strong className="text-slate-200">hochwertiges IPTV</strong> und stabile Streams sind sowohl die richtige Einrichtung als auch der richtige Anbieter wichtig.</>
          ) : (
            <>Henüz <strong className="text-slate-200">IPTV aboneliği</strong> yoksa önce <Link to="/test/" className="text-primary hover:text-primary underline underline-offset-2">ücretsiz IPTV testi</Link> ile kaliteyi deneyebilir veya <Link to="/paketler/" className="text-primary hover:text-primary underline underline-offset-2">IPTV paketleri</Link> sayfamızdan size uygun paketi seçebilirsiniz. <strong className="text-slate-200">Kaliteli IPTV</strong> ve kesintisiz yayın için doğru kurulum kadar doğru sağlayıcı da önemlidir.</>
          )}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to={testPath} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#e50914] hover:bg-[#e50914] text-white font-semibold transition-colors">
            <FlaskConical className="w-5 h-5" />{t.ctaTest}
          </Link>
          <Link to={paketlerPath} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-[#0a0a0a] hover:text-white font-semibold transition-colors">
            <Package className="w-5 h-5" />{t.ctaPaketler}
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default InstallationPageSeoSection;
