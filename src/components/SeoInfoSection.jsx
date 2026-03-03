import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Server, Tv, ShieldCheck, Users, Zap, Globe } from 'lucide-react';

const InfoCard = ({ title, content, icon: Icon, gradient }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="group relative h-full bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:bg-slate-900/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/10"
  >
    {/* Gradient Overlay */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500 bg-gradient-to-br ${gradient}`} />
    
    <div className="relative z-10">
      <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${gradient} shadow-lg`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-4 tracking-tight group-hover:text-purple-300 transition-colors">
        {title}
      </h3>
      
      <div className="text-slate-400 text-sm leading-relaxed space-y-4 text-justify">
        {content}
      </div>
    </div>
  </motion.div>
);

const SeoInfoSection = () => {
  return (
    <section id="contact" className="py-20 relative bg-slate-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      <div className="absolute -left-40 top-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -right-40 bottom-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="inline-block py-1 px-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-widest mb-4"
          >
            Premium Yayın Deneyimi
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
            Neden <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">QruzeHD</span> Tercih Edilmeli?
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Yüksek teknoloji altyapımız ve kesintisiz yayın garantimiz ile dijital eğlence dünyasının kapılarını aralıyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          
          <InfoCard 
            title="Kesintisiz Streaming Teknolojisi"
            icon={Server}
            gradient="from-blue-500 to-cyan-500"
            content={
              <>
                <p>
                  QruzeHD, en son teknoloji CDN (İçerik Dağıtım Ağı) sunucuları ile güçlendirilmiş, yüksek bant genişliğine sahip bir altyapı sunar. Donma, takılma veya görüntü kaybı yaşamadan <strong>4K Ultra HD</strong> ve <strong>Full HD</strong> kalitesinde yayınları izlemenizi sağlarız. Geleneksel yayıncılığın ötesine geçen teknolojimiz, internet hızınıza göre otomatik optimize edilen görüntü kalitesi sunar.
                </p>
                <p>
                  Avrupa ve Türkiye lokasyonlu yedekli sunucularımız sayesinde, yoğun maç saatlerinde veya prime-time izleme sürelerinde bile performans düşüklüğü yaşamazsınız. <strong>Donmayan IPTV</strong> deneyimi için özel olarak optimize edilmiş load balancer sistemlerimiz, yükü dengeli bir şekilde dağıtarak her zaman en akıcı görüntüyü garanti eder.
                </p>
              </>
            }
          />

          <InfoCard 
            title="Geniş İçerik Yelpazesi & Paketler"
            icon={Tv}
            gradient="from-purple-500 to-pink-500"
            content={
              <>
                <p>
                  Platformumuz, binlerce ulusal ve uluslararası canlı kanal seçeneği ile sınırları ortadan kaldırır. Spor, belgesel, haber, çocuk ve sinema kanalları dahil olmak üzere kategorize edilmiş listelerimizle aradığınız içeriğe anında ulaşırsınız. Ayrıca, sürekli güncellenen devasa <strong>VOD (Seç İzle)</strong> arşivimiz sayesinde en yeni vizyon filmleri ve popüler dizileri dilediğiniz zaman izleyebilirsiniz.
                </p>
                <p>
                  Smart TV (Samsung, LG, Android), TV Box, Apple TV, Bilgisayar, Tablet ve Telefon gibi tüm cihazlarla tam uyumlu çalışır. Tek bir abonelik ile evinizin konforunda veya seyahatteyken, dilediğiniz cihaz üzerinden yayınlara erişim sağlayabilirsiniz. Esnek paket seçeneklerimiz her bütçeye ve ihtiyaca uygun çözümler sunar.
                </p>
              </>
            }
          />

          <InfoCard 
            title="7/24 Profesyonel Destek & Güven"
            icon={Users}
            gradient="from-amber-500 to-orange-500"
            content={
              <>
                <p>
                  Müşteri memnuniyeti bizim için birincil önceliktir. Satış öncesi ve sonrası, teknik kurulumdan kanal listesi düzenlemeye kadar her adımda yanınızdayız. Uzman teknik ekibimiz, WhatsApp ve canlı destek hatlarımız üzerinden 7/24 sorularınızı yanıtlamak ve olası sorunlara anında çözüm üretmek için hazırdır.
                </p>
                <p>
                  Şeffaf hizmet politikamız gereği, kullanıcılarımıza taahhütsüz ve gizli ücret içermeyen abonelik modelleri sunuyoruz. Platformumuzda sunulan hizmetler, kullanıcı gizliliğini ön planda tutarak güvenli bir izleme ortamı yaratır. Yılların verdiği tecrübe ve binlerce mutlu müşterimizin referansı ile sektörün en güvenilir markası olmaktan gurur duyuyoruz.
                </p>
              </>
            }
          />

          <InfoCard 
            title="Kalite Güvencesi & Sürekli Güncellemeler"
            icon={ShieldCheck}
            gradient="from-emerald-500 to-green-500"
            content={
              <>
                <p>
                  Dijital dünyada süreklilik esastır. QruzeHD ekibi olarak, kanal listelerimizi ve içerik arşivimizi günlük olarak kontrol ediyor ve güncelliyoruz. Yeni çıkan içerikler anında sisteme eklenirken, yayın kalitesi sürekli monitör edilerek olası aksaklıklar kullanıcı fark etmeden giderilir.
                </p>
                <p>
                  Yüksek güvenlik standartlarına sahip altyapımız, verilerinizi korurken kesintisiz bir eğlence akışı sağlar. EPG (Elektronik Program Rehberi) desteğimiz ile yayın akışlarını takip edebilir, kaçırdığınız programları geri sar izle özelliği (destekleyen kanallarda) ile telafi edebilirsiniz. QruzeHD, sadece bir yayın sağlayıcı değil, evinizin tam kapsamlı dijital eğlence merkezidir.
                </p>
              </>
            }
          />

        </div>
        
        {/* Trust Indicators Footer */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex flex-col items-center gap-2">
                <Zap className="w-8 h-8 text-yellow-400" />
                <span className="text-xs font-bold text-slate-400">Hızlı Aktivasyon</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <Globe className="w-8 h-8 text-blue-400" />
                <span className="text-xs font-bold text-slate-400">Global Erişim</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-green-400" />
                <span className="text-xs font-bold text-slate-400">%99.9 Uptime</span>
             </div>
        </div>
      </div>
    </section>
  );
};

export default memo(SeoInfoSection);