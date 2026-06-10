import { slugify } from './matchSlug.js';

const GUNLER = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const LIG_BAĞLAMI = {
  'Süper Lig': ['Türkiye\'nin en heyecanlı liginde', 'Süper Lig\'in bu haftaki programında', 'Türk futbolunun zirve liginde'],
  'Premier Lig': ['İngiltere\'nin en prestijli liginde', 'Premier Lig\'de bu hafta', 'Dünya futbolunun en çok izlenen liginde'],
  'La Liga': ['İspanya\'nın en üst düzey liginde', 'La Liga\'da bu hafta', 'İspanyol futbolunun kalbi'],
  'Şampiyonlar Ligi': ['Avrupa\'nın en büyük kupasında', 'UEFA Şampiyonlar Ligi\'nde', 'Kıtalararası mücadelede'],
  'Bundesliga': ['Almanya\'nın en üst liginde', 'Bundesliga\'da bu hafta', 'Alman futbolunun zirvesinde'],
  'Serie A': ['İtalya\'nın en üst liginde', 'Serie A\'da bu hafta', 'İtalyan futbolunun kalbi'],
};

const DERBİ_TAKIMLAR = [
  ['galatasaray', 'fenerbahce'], ['galatasaray', 'besiktas'], ['fenerbahce', 'besiktas'],
  ['trabzonspor', 'galatasaray'], ['trabzonspor', 'fenerbahce'],
  ['real madrid', 'barcelona'], ['barcelona', 'real madrid'],
  ['liverpool', 'man utd'], ['man utd', 'man city'],
  ['bayern', 'dortmund'], ['b-dortmund', 'bayern'],
  ['inter', 'ac milan'], ['ac milan', 'inter'],
  ['arsenal', 'chelsea'], ['spurs', 'arsenal'],
];

function isDerbi(home, away) {
  const h = slugify(home).toLowerCase();
  const a = slugify(away).toLowerCase();
  return DERBİ_TAKIMLAR.some(([x, y]) =>
    (h.includes(x) || x.includes(h)) && (a.includes(y) || y.includes(a))
  );
}

function pickIndex(str, max) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % max;
}

/** Uzun paragraf blokları - toplam 1200-1500 kelime hedefi. */
const BLOKLAR = {
  giris: [
    (h, a, lig, gun) => `${lig} karşılaşan ${h} ve ${a}, ${gun} günü sahada buluşuyor. Bu maç, sezonun önemli karşılaşmalarından biri olarak öne çıkıyor. Taraftarlar iki takımın performansını merakla takip ederken, maç öncesi heyecan giderek artıyor. ${h} ev sahibi avantajıyla sahaya çıkarken, ${a} deplasman zorluğunu aşmak için hazırlanıyor. Her iki takım da üç puanı hedefliyor ve bu karşılaşma lig sıralamasında kritik bir rol oynayabilir. Maç saati yaklaştıkça sosyal medyada paylaşımlar artıyor, tahminler yapılıyor.`,
    (h, a, lig, gun) => `${gun} programında ${lig} ${h} - ${a} maçı öne çıkıyor. Bu karşılaşma, iki köklü takımın mücadelesine sahne olacak. Maç öncesi analizler, takımların son performansları ve taktiksel hazırlıkları üzerine yoğunlaşıyor. ${h} taraftarları stadyumda veya ekran başında takımlarını desteklemeye hazır. ${a} taraftarları ise deplasmanda zafer umuduyla maçı takip edecek. Her iki takımın da taraftar kitlesi geniş; maç günü izlenme rekorları kırılabilir.`,
    (h, a, lig, gun) => `${h} ve ${a} ${gun} günü ${lig.toLowerCase()} karşı karşıya gelecek. Bu mücadele, sezonun en çok konuşulan maçlarından biri olmaya aday. Her iki takım da puan tablosunda üst sıralara tırmanmak için bu maçı kazanmak istiyor. Maç saati yaklaştıkça taraftar heyecanı zirve yapıyor. Ev sahibi takımın avantajı, deplasman takımının kararlılığı ile çarpışacak. Tribünlerin dolması ve atmosferin ısınmasıyla birlikte, doksan dakika boyunca tempolu bir oyun bekleniyor.`,
    (h, a, lig, gun) => `Futbolseverlerin takvimi ${gun} için işaretli: ${lig}'de ${h} ile ${a} karşılaşması. İki takımın da bu maça özel hazırlık yaptığı biliniyor. Ev sahibi ${h} seyirci desteğiyle sahaya çıkacak; ${a} ise deplasmanda zorlu bir testten geçecek. Hem puan tablosu hem özgüven açısından bu maçın sonucu büyük önem taşıyor. Stadyum çevresinde maç öncesi hareketlilik erken saatlerde başlıyor.`,
  ],
  ligOnemi: [
    (lig) => `${lig}, Avrupa ve dünya futbolunun en takip edilen liglerinden biridir. Bu ligde oynanan her maç, hem yerel hem uluslararası izleyiciler tarafından büyük ilgi görür. Takımların performansı, puan durumu ve şampiyonluk yarışı her hafta gündemi belirler. Maçlar genellikle hafta sonu veya hafta içi akşam saatlerinde oynanır; böylece iş ve okul temposundan sonra izleme imkânı doğar. Yayın hakları spor kanalları ve dijital platformlarda bulunur. Ligdeki rekabet her sezon artıyor; bu da maçların önemini katlıyor.`,
    (lig) => `Bu sezon ${lig}'de heyecan dorukta. Her hafta kritik karşılaşmalar oynanıyor ve puan tablosu sürekli değişiyor. Taraftarlar takımlarının formunu, sakatlık listesini ve taktiksel tercihleri yakından takip ediyor. Maç günü ekran başına geçen sporseverler, en net görüntü ve en az gecikmeyle canlı yayın izlemek istiyor. Yayıncı kuruluşların maç öncesi programları, analizleri ve röportajları da karşılaşmanın atmosferini güçlendiriyor. Lig maçları genellikle cumartesi ve pazar günleri yoğunlaşır; bu da ailece izleme fırsatı yaratır.`,
  ],
  takimlar: [
    (h, a) => `${h} ve ${a}, bulundukları ligde köklü geçmişe sahip takımlardır. İki takım arasındaki karşılaşmalar her zaman büyük ilgi görür. Ev sahibi takım seyirci desteğiyle moral bulurken, deplasman takımı zorlu atmosferde oynamaya alışkındır. Maçın hangi takım lehine sonuçlanacağı önceden kestirilemez; bu da izleyiciler için ekstra heyecan demektir. Her iki takımın taraftarları da maçı canlı izlemek isteyecek; tarihsel karşılaşmalar bu iki takım arasında genelde çekişmeli geçmiştir.`,
    (h, a) => `Bu karşılaşmada ${h} ev sahibi olarak sahaya çıkacak. ${a} ise deplasmanda puan almak için mücadele edecek. İki takımın da güçlü ve zayıf yönleri var; maç bu dengenin nasıl bozulacağını gösterecek. Taraftarlar maç öncesi tahminlerde bulunurken, teknik direktörler taktiksel hazırlıklarını tamamlıyor. Ev sahibi avantajı ile deplasman baskısı sahada iç içe geçecek; sonucu ise doksan dakikanın hikâyesi belirleyecek.`,
    (h, a) => `${h} kadrosu bu maçta evinde rahat oynamak isteyecek. ${a} ise deplasman baskısına alışkın bir ekip olarak sahaya çıkacak. İki takımın da kendi taraftar kitlesi var; maç günü hem stadyumda hem ekran başında yoğun ilgi görecek. Özellikle maçın ilk bölümlerinde takımların sahaya nasıl yayılacağı ve teması ne kadar kabul edeceği dikkatle izlenecek.`,
  ],
  derbi: [
    (h, a) => `Bu bir derbi karşılaşması. ${h} ve ${a} arasındaki maçlar, tarihsel rekabet ve taraftar tutkusuyla her zaman özel bir anlam taşır. Derbi maçlarında heyecan katlanır; her gol, her müdahale büyük yankı uyandırır. Taraftarlar bu maçları kaçırmaz; stadyumlar dolar, ekran başında izleyenlerin sayısı rekor kırar. En ufak hakem kararı bile uzun süre tartışma konusu olabilir. Derbi atmosferi sadece sahaya değil, tüm şehre yayılır.`,
    (h, a) => `Derbi havası maç günü her yerde hissedilecek. ${h} - ${a} karşılaşması, iki ezeli rakibin mücadelesine sahne olacak. Bu tür maçlarda sonuç tahmin etmek zordur; form, sakatlıklar ve günün ruhu belirleyici olur. Tribünlerdeki koreografiler, marşlar ve tezahüratlar karşılaşmanın havasını farklı bir seviyeye taşır. Derbi maçlarında heyecan dorukta olur; her an sürpriz gelişmelere açıktır.`,
  ],
  gunBaglami: [
    (gun) => `${gun} günü oynanan maçlar, hafta sonu programının vazgeçilmez parçasıdır. Aileler ve arkadaş grupları ekran başında toplanır, maç keyfi yaşar. Özellikle öğleden sonra ve akşam saatlerindeki karşılaşmalar en yüksek izlenme oranlarına ulaşır. Maç öncesi atıştırmalıklar hazırlanır, sohbetler açılır ve taktik tartışmaları yapılır. ${gun} maçları genellikle planlanır; izleyiciler saatler öncesinden hazırlık yapar.`,
    (gun) => `${gun} programı futbolseverler için özel bir anlam taşır. İş ve okul temposundan arta kalan zamanlarda maç izlemek, birçok kişi için vazgeçilmez bir aktivitedir. Bazıları maçları tek başına sakin bir ortamda izlemeyi tercih ederken, bazıları kalabalık ortamlarda birlikte sevinmeyi sever. ${gun} maçları sosyal bir etkinliğe dönüşür; arkadaşlarla birlikte izlemek keyif verir.`,
  ],
  izleme: [
    () => `Canlı maç izleme deneyimi, görüntü kalitesi ve yayın akıcılığıyla doğrudan ilişkilidir. Donan maç, geciken skor veya kesilen yayın izleyiciyi hayal kırıklığına uğratır. Modern yayın teknolojileri sayesinde yüksek çözünürlüklü ve düşük gecikmeli yayınlar artık daha erişilebilir. Maçın her anını net ve akıcı izleyebilmek, özellikle kritik anlarda büyük önem taşır. Gol anlarını kaçırmamak, penaltıları canlı görmek taraftarların en büyük beklentisidir.`,
    () => `Maç izlerken en büyük düşman donma ve gecikmedir. Gol anını geç görmek veya yayının kesilmesi taraftarlar için kabusa dönüşebilir. Bu nedenle izleyiciler, güçlü altyapıya sahip yayın hizmetlerini tercih eder. Sunucu yapılarının yük dengeleme ile çalışması, yoğun saatlerde bile performansın korunmasını sağlar. Maç günü güvenle ekran başında olmak için bağlantı kalitesi kritik bir faktördür.`,
  ],
  kanal: [
    (lig) => `${lig} maçları genellikle spor kanallarında yayınlanır. Hangi maçın hangi kanalda olacağı haftalık programda açıklanır. Dijital platformlar da spor yayınlarına ev sahipliği yapar. Kanal listelerinde arama yaparak maçınızı anında bulabilirsiniz. Yayın hakları sezon başında belirlenir; maç programı haftalık olarak güncellenir.`,
    (lig) => `Spor kanalları maç günü yoğun bir yayın temposuna girer. Özellikle aynı saatte birden fazla maç oynandığında, farklı kanallarda farklı karşılaşmalar yayınlanır. İzleyiciler, program akışını takip ederek istedikleri maçı seçer. Spor kanalları, ulusal kanallar ve uluslararası yayıncılar aynı anda farklı maçlara yer verebilir. Kanal değiştirmek anlık olduğu için önemli anları kaçırmamak izleyicinin elindedir.`,
  ],
  iptv: [
    () => `IPTV, geleneksel uydu ve kablolu yayına alternatif olarak internet üzerinden televizyon izleme imkânı sunar. Tek bir abonelik ile 10.000+ kanala, film ve dizi arşivine erişmek mümkündür. Spor kanalları özellikle yoğun talep görür; maç günü kesintisiz yayın için altyapı kalitesi büyük önem taşır. Farklı cihazlarda kullanılabilen uygulamalar sayesinde izleme deneyimi oldukça esnektir.`,
    () => `IPTV hizmetlerinin avantajları arasında geniş kanal yelpazesi, yüksek görüntü kalitesi ve 7/24 erişim imkânı yer alır. Maç izlerken donma yaşamak istemeyen kullanıcılar, sunucu altyapısı güçlü sağlayıcıları tercih eder. Smart TV, Android, iOS veya bilgisayar üzerinden erişim sağlanabildiği için tek bir abonelikle farklı cihazlardan maç izlemek mümkündür.`,
  ],
  qruzetv: [
    () => `QruzeTV, Türkiye ve Avrupa'dan çok sayıda kullanıcıya IPTV hizmeti sunan bir sağlayıcıdır. Spor kanalları, film ve dizi içerikleri, canlı TV ve isteğe bağlı yayın seçenekleri tek abonelikle kullanılabilir. Amaç, özellikle maç günlerinde izleyicilere kesintisiz ve stabil bir deneyim sunmaktır. Farklı ihtiyaçlara yönelik paketler üzerinden seçim yapılabilir.`,
    () => `Maç izleme keyfini ev ortamına taşıyan QruzeTV, geniş kanal listesi ve teknik destek imkânlarıyla öne çıkmayı hedefler. Futbol karşılaşmalarına ilgi duyan kullanıcılar için spor kanallarının stabil çalışması ön plandadır. Altyapı yatırımları ve sunucu optimizasyonları, donma ve gecikme şikâyetlerini en aza indirmeyi amaçlar.`,
  ],
  macOncesi: [
    (h, a) => `Maç öncesi analizler, ${h} ve ${a} arasındaki bu karşılaşmanın heyecanlı geçeceğini gösteriyor. Her iki takım da üç puanı hedefleyerek sahaya çıkacak. Son haftalardaki form, sakatlık listesi ve taktiksel tercihler maçın gidişatını etkileyecek. Taraftarlar maç saatini beklerken; sosyal medyada tahminler, yorumlar ve paylaşımlar artıyor. Teknik direktörler basın toplantılarında maç stratejilerini açıklamaktan kaçınır; ancak taraftarlar her haberi dikkatle takip eder.`,
    (h, a) => `Bu karşılaşmada ${h} ev sahibi olarak seyirci desteğiyle moral bulacak. ${a} ise deplasmanda zorlu bir atmosferde oynamaya alışkın. Maç öncesi basın toplantılarında teknik direktörler genel hatlarıyla oyuna nasıl başlayacaklarını anlatırken, detaylı taktikler genellikle gizli tutulur. Maç saati yaklaştıkça heyecan tırmanır; puan tablosundaki konumlar da bu maçın önemini artırır.`,
  ],
  tarih: [
    (h, a) => `${h} ve ${a} arasındaki maçlar tarih boyunca çekişmeli geçmiştir. İki takımın taraftarları bu karşılaşmaları büyük önem taşır. Son yıllarda oynanan maçlarda sonuçlar dengeli dağılmış; bu da her yeni karşılaşmada belirsizliği artırır. Taraftarlar maç öncesi tahminlerde bulunurken, gerçek sonucu saha gösterecek. İki takım arasındaki rekabet yıllar içinde derinleşmiş; her karşılaşma ayrı bir hikâye yazar.`,
    (h, a) => `Bu iki takım arasındaki rekabet uzun yıllara dayanıyor. ${h} ve ${a} karşılaşmaları her zaman büyük ilgi görür. Tarihsel sonuçlar bazen ev sahibi lehine, bazen deplasman takımı lehine değişir; bu da maçın önceden kestirilemez olduğunu gösterir. Stadyumlarda doluluk oranları bu maçlarda genellikle zirve yapar; ekran başında izleyenlerin sayısı da kayda değer seviyelere ulaşır.`,
  ],
  yayinDetay: [
    () => `Maç yayınları genellikle Full HD kalitede sunulur; bazı karşılaşmalar 4K çözünürlükte izlenebilir. Yayın hakları sezon başında yayıncı kuruluşlarla anlaşılır; maç programı haftalık güncellenir. Abonelik paketlerinde spor kanallarının dahil olup olmaması izleyici tercihlerini etkileyen önemli bir unsurdur. Yayın öncesi stüdyo programları, maç analizi ve son dakika haberleri de aynı kanallarda sunulur.`,
    () => `Canlı maç yayınlarında gecikme süresi minimumda tutulmaya çalışılır. Özellikle gol anlarında geç kalmak taraftarlar için hayal kırıklığı yaratır. Yayın kalitesi 720p, 1080p ve 4K seçenekleriyle sunulabilir; internet hızına göre kalite ayarlanabilir. Maç öncesi ve sonrası yorum programları, karşılaşmanın taktiksel yönlerini detaylı biçimde ele alır.`,
  ],
  formDurumu: [
    (h, a) => `${h} son haftalarda inişli çıkışlı sonuçlar alırken, ${a} puan tablosunda istikrarlı bir grafik çizmeye çalışıyor. İki takımın da son beş maçlık performansı bu karşılaşmanın dengesini doğrudan etkileyebilir. Özellikle iç sahada alınan sonuçlar, ev sahibi takımın özgüvenini artırırken; deplasmanda elde edilen puanlar misafir takım için ekstra motivasyon kaynağı oluyor.`,
    (h, a) => `${h} sezonun belirli bölümlerinde güçlü performanslar ortaya koysa da zaman zaman savunmada yaşanan hatalar puan kayıplarına neden oldu. ${a} ise özellikle büyük takımlara karşı oynadığı maçlarda gösterdiği dirençle dikkat çekiyor. Bu maçta hangi tarafın istikrar sağlayacağı, sezonun geri kalanı için önemli bir referans olabilir.`,
  ],
  taktik: [
    (h, a) => `${h} genellikle topa sahip olmayı seven ve önde baskı yapan bir oyun anlayışıyla öne çıkıyor. ${a} ise daha kompakt savunma ve hızlı kontra ataklarla sonuca gitmeyi tercih ediyor. Bu farklı futbol kimlikleri, maç içinde taktiksel mücadeleyi ön plana çıkarabilir. Orta sahadaki ikili mücadeleler ve kanat organizasyonları, maçın kaderini belirleyebilecek unsurlar arasında yer alıyor.`,
    (h, a) => `${h} teknik direktörü, hücum hattındaki yaratıcı oyuncularıyla rakip savunmayı açmayı hedefliyor. ${a} cephesinde ise oyun planı daha çok savunma disiplini ve geçiş oyununa dayanıyor. Maç içinde taktiksel hamleler, oyuncu değişiklikleri ve formasyon varyasyonları sıkça görülebilir. İki takımın da duran topları nasıl değerlendireceği, skor tabelasına doğrudan etki edebilir.`,
  ],
  kapanis: [
    () => `Maç saatini kaçırmamak için programınızı şimdiden ayarlayabilirsiniz. Karşılaşmayı ister tek başınıza sakin bir ortamda, ister arkadaşlarınızla birlikte kalabalık bir atmosferde izleyin; önemli olan doksan dakikalık heyecanın tadını çıkarmak. Yayın seçeneklerini ve kanal bilgilerini kontrol ederek maç öncesi hazırlığınızı tamamlayabilirsiniz. İyi seyirler dileriz.`,
    () => `Futbolun en güzel yanı, her maçın yeni bir hikâye yazmasıdır. ${'Takımların'} sahadaki mücadelesi, taraftarların coşkusu ve anlık gelişen pozisyonlar bu oyunu benzersiz kılar. Bu karşılaşmayı izlerken hem taktiksel detaylara hem de oyunun duygusal tarafına odaklanabilirsiniz. Karşılaşmanın sonucu ne olursa olsun, futbol keyfinin ön planda olduğu bir doksan dakika olmasını dileriz.`,
  ],
};

/**
 * Maç için 1200-1500 kelime arası benzersiz içerik üretir.
 */
export function generateMatchContent(match) {
  const { home, away, league, date } = match;
  const leagueName = league?.name || 'Lig';
  const leagueOpts = LIG_BAĞLAMI[leagueName] || [leagueName + ' programında', leagueName + '\'da bu hafta'];
  const leagueCtx = leagueOpts[pickIndex(home + away, leagueOpts.length)];
  const [y, m, d] = (date || '').split('-').map(Number);
  const gun = (y && m && d) ? GUNLER[new Date(y, m - 1, d).getDay()] : 'Bu hafta';
  const derbi = isDerbi(home, away);
  const seed = `${home}-${away}-${date}`;

  const paragraphs = [];

  const pick = (key, list) => list[pickIndex(seed + key, list.length)];

  // Her zaman giriş
  paragraphs.push(pick('g', BLOKLAR.giris)(home, away, leagueCtx, gun));

  // Lig önemi / tarih: ikisinden birini seç
  const useLigOnemi = pickIndex(seed + 'lt', 2) === 0;
  if (useLigOnemi) {
    paragraphs.push(pick('l', BLOKLAR.ligOnemi)(leagueName));
  } else {
    paragraphs.push(pick('r', BLOKLAR.tarih)(home, away));
  }

  // Takımlar bölümü her zaman olsun
  paragraphs.push(pick('t', BLOKLAR.takimlar)(home, away));

  // Derbi ise derbi bloğu
  if (derbi) {
    paragraphs.push(pick('d', BLOKLAR.derbi)(home, away));
  }

  // Form durumu ve taktik analizi
  paragraphs.push(pick('f', BLOKLAR.formDurumu)(home, away));
  paragraphs.push(pick('x', BLOKLAR.taktik)(home, away));

  // Maç öncesi / gün bağlamı: en az bir tanesi olsun, ikisi de olabilir
  const useMacOncesi = pickIndex(seed + 'm', 2) === 0;
  const useGunBaglami = pickIndex(seed + 'b', 2) === 0 || !useMacOncesi;
  if (useMacOncesi) {
    paragraphs.push(pick('m', BLOKLAR.macOncesi)(home, away));
  }
  if (useGunBaglami) {
    paragraphs.push(pick('b', BLOKLAR.gunBaglami)(gun));
  }

  // İzleme / kanal / yayın detay: en az iki farklı perspektif
  paragraphs.push(pick('i', BLOKLAR.izleme)());
  const useKanal = pickIndex(seed + 'k', 3) !== 0;
  const useYayin = pickIndex(seed + 'y', 3) !== 1;
  if (useKanal) {
    paragraphs.push(pick('k', BLOKLAR.kanal)(leagueName));
  }
  if (useYayin) {
    paragraphs.push(pick('y', BLOKLAR.yayinDetay)());
  }

  // IPTV ve marka blokları: her maçta zorunlu değil, aşırı tekrar olmasın
  if (pickIndex(seed + 'p', 4) === 0) {
    paragraphs.push(pick('p', BLOKLAR.iptv)());
  }
  if (pickIndex(seed + 'q', 5) === 0) {
    paragraphs.push(pick('q', BLOKLAR.qruzetv)());
  }

  // Kapanış bloğu her zaman olsun, ama marka vurgusu yumuşak
  paragraphs.push(pick('c', BLOKLAR.kapanis)());

  const fullText = paragraphs.join(' ');
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;

  return { paragraphs, isDerbi: derbi, wordCount };
}
