import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, CalendarDays, MapPinned, Users, Goal, Sparkles } from 'lucide-react';

/** Metindeki anahtar ifadeleri renklendirir */
function highlightText(text, phrases) {
  if (!phrases?.length) return text;
  let parts = [text];
  phrases.forEach(([phrase, cls]) => {
    parts = parts.flatMap((p) =>
      typeof p === 'string' && p.includes(phrase)
        ? p.split(phrase).flatMap((seg, i) => (i === 0 ? [seg] : [<span key={`${phrase}-${i}`} className={cls}>{phrase}</span>, seg]))
        : [p]
    );
  });
  return <>{parts}</>;
}

const PARAGRAPH_HIGHLIGHTS = [
  [['maç programını', 'text-primary/90'], ['Maç programı sayfası', 'text-amber-200/90'], ['Tarih çubuğu', 'text-[#e50914]/90']],
  [['Farklı ülkelerin ligleri', 'text-primary/90'], ['maç programını komple görmek', 'text-amber-200/90'], ['futbol maratonu', 'text-[#e50914]/90']],
  [['Derbi haftaları', 'text-amber-200/90'], ['Maç programı sayfası', 'text-primary/90'], ['şampiyonluk yarışını', 'text-[#e50914]/90']],
  [['Maç programı sayfasındaki saat bilgileri', 'text-primary/90'], ['Zaman yönetimi', 'text-amber-200/90']],
  [['IPTV', 'text-primary/90'], ['Maç programı sayfası', 'text-amber-200/90']],
  [['fikstürüne kuşbakışı bakmak', 'text-primary/90'], ['Maç programı sayfası', 'text-[#e50914]/90']],
  [['fikstüre göz atıp', 'text-amber-200/90'], ['Maç programı sayfası', 'text-primary/90']],
  [['şampiyonluk yarışını', 'text-amber-200/90'], ['Maç programı sayfası', 'text-primary/90'], ['kader belirleyici', 'text-[#e50914]/90']],
  [['QruzeTV', 'text-primary/90'], ['izleme deneyiminin başlangıç noktası', 'text-amber-200/90']],
  [['Tarih çubuğunu', 'text-primary/90'], ['yayın planı', 'text-[#e50914]/90']],
];

const LONG_PARAGRAPHS = [
  'Futbol takvimi yoğunlaştıkça, maç programını düzenli takip etmek hem keyif hem de zaman yönetimi açısından büyük fark yaratır. Özellikle hafta içi iş çıkışı veya hafta sonu aile programları yapılırken, hangi gün hangi ligde kaç maç olduğunu bilmek izleme planı kurmayı kolaylaştırır. Maç programı sayfası bu yüzden sadece bir liste değil, futbol gününüzü organize etmenizi sağlayan bir rehber gibi düşünülmelidir. Tarih çubuğu üzerinden günü seçtiğiniz anda, o günün tüm resmi karşılaşmaları liglere göre ayrılmış şekilde önünüzde olur. Böylece hem desteklediğiniz takımın maç saatini kaçırmazsınız hem de arka arkaya izlenebilecek maçları daha bilinçli seçebilirsiniz.',
  'Pek çok futbolsever yalnızca kendi takımının maçına odaklanırken, aslında aynı gün farklı liglerde birbirinden keyifli karşılaşmalar oynanır. Farklı ülkelerin ligleri aynı akşam içinde çakışan saatlere sahip olabilir. Bu noktada maç programını komple görmek, önceliklendirme yapmanıza izin verir. Örneğin derbi saatiyle çakışmayan erken saat bir maç, maça ısınma niteliğinde izlenebilir. Geç saat maçları ise günü kapatan bir kapanış seansı gibi planlanabilir. Günün tamamını düşündüğünüzde, doğru planlama ile neredeyse aralıksız bir futbol maratonu oluşturmak mümkündür.',
  'Derbi haftaları futbol takviminin en özel dönemleridir. İki ezeli rakibin karşı karşıya geldiği günlerde, yalnızca 90 dakika değil, öncesi ve sonrası da ayrı bir hikâye taşır. Maç programı sayfası derbi günlerini diğer karşılaşmaların arasında kaybolmadan görmenizi sağlar. Taraftarlar için bu günlerde hem kendi takımının maçını hem de şampiyonluk yarışını etkileyebilecek diğer maçları aynı ekranda takip edebilmek önemlidir. Derbiden önce oynanan maçların skorları, atmosferin gerginliğini ve heyecanını artırabilir. Bu nedenle yalnızca tek bir maçı değil, günün tüm fikstürünü gözden geçirmek derbi deneyimini zenginleştirir.',
  'Hafta içi oynanan kupa ve Avrupa maçları, lig takvimine farklı bir ritim katar. Bazı günler sadece bir iki maç varken, bazı akşamlarda aynı saatte onlarca karşılaşma başlayabilir. Özellikle işten eve dönüş saatinde oynanan erken karşılaşmalar kaçırılmaya oldukça müsaittir. Maç programı sayfasındaki saat bilgileri, günün bu yoğunluğunu net bir şekilde görmenizi sağlar. Böylece trafikte veya günlük koşturmaca içinde hangi maçı kaçırdığınızı, hangisine yetişebileceğinizi önceden bilirsiniz. Zaman yönetimi doğru yapıldığında, kısa bir akşam dilimini bile dolu dolu bir futbol keyfine çevirmek mümkündür.',
  'IPTV gibi internet tabanlı çözümler, maç izleme alışkanlıklarını kökten değiştirdi. Artık tek bir ekrana bağlı kalmak zorunda değilsiniz; farklı cihazlardan, farklı odalardan aynı maçı veya günün farklı karşılaşmalarını takip etmek mümkün. Ancak bu esneklik beraberinde planlama ihtiyacını da artırıyor. Hangi odada hangi maçın açık olacağı, arkadaşlarınızla maçı birlikte mi yoksa çevrim içi sohbetle mi izleyeceğiniz gibi detaylar önem kazanıyor. Maç programı sayfası, bu planlamayı yaparken ilk bakmanız gereken yerdir. Hangi saatte kaç maç olduğunu bildiğinizde, hem cihazlarınızı hem de arkadaş grubunuzu buna göre organize edebilirsiniz.',
  'Evde futbol gecesi düzenlerken, misafirlerinize soracağınız ilk soru genellikle “Hangi maçı izleyelim?” olur. Bazıları lig maçlarını, bazıları Avrupa kupalarını, kimileri ise alt liglerdeki sürpriz sonuçları takip etmeyi sever. Herkesi mutlu eden bir program oluşturmak için, o günün fikstürüne kuşbakışı bakmak gerekir. Maç programı sayfası bu noktada adeta ortak bir referans noktasıdır. Herkes aynı ekrana bakarak hangi maçların daha kritik olduğuna, hangilerinin arka planda açık kalabileceğine birlikte karar verebilir. Böylece hem sosyal bir ortam yakalanır hem de günün hiçbir önemli karşılaşması gözden kaçmaz.',
  'Tek başına maç izlemeyi sevenler için bile, günün geri kalanındaki maçları bilmek heyecanı artırır. Örneğin sabah saatlerinde fikstüre göz atıp akşam oynanacak derbiye odaklanmak, tüm günü maç atmosferiyle geçirmenizi sağlar. İş molalarında skor tahminleri yapmak, sosyal medyada günün karşılaşmaları üzerine yorumları okumak bu ritüelin parçası haline gelir. Maç programı sayfası, bu psikolojik hazırlık sürecini destekleyen bir araçtır. Sadece sonuç odaklı değil, maç öncesi heyecanı da besleyen bir rehber gibi çalışır.',
  'Bazı futbolseverler yalnızca büyük takımları değil, alt sıraları ve düşme hattını da yakından takip eder. Sezon sonuna yaklaşıldığında, küme düşme potasındaki her puanın değeri artar. Aynı gün hem şampiyonluk yarışını hem de alt sıralardaki kritik maçları aynı ekranda görmek, ligin bütün resmini anlamanız açısından önemlidir. Maç programı sayfası bu bütünlüğü sağlar; tabloya sadece bir göz atarak, günün hangi maçlarının kader belirleyici olduğunu fark edebilirsiniz. Bu bakış açısı, futbolu yalnızca skor odaklı değil, taktik ve strateji boyutuyla takip etmeyi de kolaylaştırır.',
  'QruzeTV, maç programı sayfasını yalnızca takvim bilgisi sunan basit bir ekran olarak değil, izleme deneyiminin başlangıç noktası olarak tasarlamayı hedefler. Günün karşılaşmalarını inceledikten sonra, hangi paketlerin sizin için daha uygun olduğuna karar verebilirsiniz. Sürekli lig maçları izleyenler için farklı, Avrupa kupalarını takip edenler için farklı, sadece hafta sonları vakit ayıranlar için ise daha esnek seçenekler düşünülebilir. Böylece izleme alışkanlığınızla uyumlu, gereksiz maliyet oluşturmayan bir abonelik yapısı kurmak mümkün hale gelir.',
  'Tüm bu nedenlerle, maç programı sayfasının en altındaki bu açıklama bölümü yalnızca SEO amaçlı bir metin değil; aynı zamanda futbol izleme kültürünüzü zenginleştirmeyi amaçlayan bir rehberdir. Buradaki önerilerden yola çıkarak kendi rutinlerinizi oluşturabilir, sevdiklerinizle daha keyifli futbol akşamları planlayabilirsiniz. Hangi takımı tutuyor olursanız olun, doğru planlama ve doğru bilgiyle her maç günü daha keyifli geçer. Tarih çubuğunu düzenli kullanmak, gün içindeki karşılaşmaları kontrol etmek ve ihtiyaçlarınıza uygun bir yayın planı oluşturmak, futbolu günlük hayatınızın eğlenceli bir parçasına dönüştürmenin en pratik yoludur.',
];

const HIGHLIGHT_CARDS = [
  {
    icon: Trophy,
    title: 'Büyük ligler tek ekranda',
    text: <>Aynı gün içinde hem <span className="text-primary/90">yerel ligleri</span> hem de <span className="text-amber-200/90">Avrupa maçlarını</span> takip etmek isteyenler için tüm fikstür tek sayfada toplanır. Böylece şampiyonluk yarışını ve kritik alt sıra maçlarını aynı anda görebilirsiniz.</>,
  },
  {
    icon: Trophy,
    title: 'Derbi ve kritik maçlar',
    text: <>Derbi haftalarında programı sadece tek bir maç üzerinden değil, <span className="text-[#e50914]/90">günün tüm karşılaşmaları</span> üzerinden okumak önemlidir. Hangi maçın öncesinde veya sonrasında derbi olduğunu net şekilde görebilirsiniz.</>,
  },
  {
    icon: CalendarDays,
    title: 'Hafta içi & hafta sonu ritmi',
    text: <>Yoğun iş temposunda oynanan <span className="text-white">hafta içi maçları</span> ile hafta sonu maratonlarını ayrı ayrı planlayın. Takvim yapısı, kısa boşluklara bile sığdırılabilecek karşılaşmaları keşfetmenize yardımcı olur.</>,
  },
  {
    icon: MapPinned,
    title: 'Farklı ülkeler, farklı saatler',
    text: <>Farklı liglerin başlama saatleri değiştiği için, aynı akşam <span className="text-amber-200/90">birden fazla maç</span> yakalamak mümkündür. Program sayfası, saatleri tek yerde göstererek size ideal kombinasyonu kurma şansı tanır.</>,
  },
  {
    icon: Users,
    title: 'Arkadaşlarla futbol gecesi',
    text: <>Evde maç akşamı planlarken herkesin zevkine hitap eden bir sıra oluşturmak için önce <span className="text-primary/90">fikstüre bakın</span>. Büyük maçları merkezde tutup, öncesine ve sonrasına sohbet eşliğinde yan maçlar ekleyebilirsiniz.</>,
  },
  {
    icon: Goal,
    title: 'Küme hattını da unutmayın',
    text: <>Sadece zirve yarışına değil, <span className="text-[#e50914]/90">düşme hattındaki mücadelelere</span> de göz atmak ligin hikayesini daha iyi anlamanızı sağlar. Programı bütün olarak görmek, bu resmi daha net çizmenize yardım eder.</>,
  },
];

const MatchScheduleSeoSection = () => (
  <section className="mt-20 pt-14 border-t border-slate-800/70" aria-labelledby="seo-section-title">
    <div className="flex items-center gap-3 mb-4">
      <div className="h-9 w-9 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-primary" />
      </div>
      <h2
        id="seo-section-title"
        className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-[#e50914] via-white/85 to-[#b20710] bg-clip-text text-transparent"
      >
        Maç Programını Akıllı Kullanın, Futbol Gününüzü Planlayın
      </h2>
    </div>

    <p className="text-slate-200 leading-relaxed mb-10 text-sm sm:text-base">
      Aşağıdaki rehber, <span className="text-primary/90 font-semibold">maç programı sayfasını</span> yalnızca hangi saatte hangi maçın oynandığını görmek için değil, tüm gününüzü <span className="text-amber-200/90">futbol odaklı planlamak</span> için nasıl kullanabileceğinizi adım adım anlatır. Fikstürü doğru okuduğunuzda, izleyemediğiniz maç sayısı azalır; izlediklerinizin keyfi ise belirgin şekilde artar.
    </p>

    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 mb-12">
      {HIGHLIGHT_CARDS.map((item, i) => (
        <article
          key={i}
          className="bg-[#0a0a0a]/60 rounded-2xl p-5 border border-slate-800/80 hover:border-primary/60 hover:bg-[#0a0a0a]/90 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
              <item.icon className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-slate-50">{item.title}</h3>
          </div>
          <p className="text-[13px] text-slate-200 leading-relaxed">{item.text}</p>
        </article>
      ))}
    </div>

    <div className="bg-[#0a0a0a]/70 rounded-3xl border border-slate-800/80 px-5 py-6 sm:px-7 sm:py-8 space-y-4">
      {LONG_PARAGRAPHS.map((p, idx) => (
        <p
          key={idx}
          className={
            idx === 0
              ? 'text-slate-100 text-sm sm:text-[15px] leading-relaxed font-medium'
              : 'text-slate-200 text-sm sm:text-[15px] leading-relaxed'
          }
        >
          {highlightText(p, PARAGRAPH_HIGHLIGHTS[idx] || [])}
        </p>
      ))}
    </div>

    <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p className="text-slate-300 text-sm leading-relaxed">
        Maç günlerinizi daha <span className="text-primary/90">planlı ve keyifli</span> geçirmek istiyorsanız, programı açıp günü birkaç dakikada organize etmek harika bir başlangıçtır.
      </p>
      <Link
        to="/paketler/"
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#e50914] hover:to-[#e50914] text-white text-sm font-medium shadow-lg shadow-primary/40"
      >
        <Trophy className="w-4 h-4" />
        Paketleri İncele
      </Link>
    </div>
  </section>
);

export default MatchScheduleSeoSection;
