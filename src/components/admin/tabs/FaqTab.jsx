import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, HelpCircle, Save, Loader2, AlertCircle, CheckCircle2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Input, Textarea } from '@/components/admin/AdminFormControls';
import AdminTabWrapper from '@/components/admin/AdminTabWrapper';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export const defaultFaqData = {
    title: 'SSS - Sık Sorulan Sorular | Kaliteli IPTV Hakkında Her Şey',
    description: 'Kaliteli iptv hizmetimiz, donmayan iptv teknolojimiz ve iptv kurulumu süreçlerimiz hakkında merak ettiğiniz tüm detayları bu sayfada bulabilirsiniz. En iyi iptv servisi deneyimini yaşamak için iptv satın almadan önce aklınıza takılan soruların kapsamlı yanıtlarını inceleyin. Amacımız sizlere kesintisiz, yüksek çözünürlüklü ve %100 müşteri memnuniyeti odaklı bir yayın akışı sunmaktır.',
    sections: [
        {
            title: 'IPTV Hakkında Genel Sorular',
            items: [
                {
                    question: 'IPTV Nedir ve Sistem Nasıl Çalışır?',
                    answer: 'IPTV (İnternet Protokolü Televizyonu), televizyon yayınlarının geleneksel uydu veya kablo antenleri yerine internet bağlantısı üzerinden iletilmesini sağlayan modern bir dijital yayın teknolojisidir. Kaliteli iptv sistemimiz, dünya genelindeki binlerce kanalı ve zengin VOD (İsteğe Bağlı Video) içeriklerini yüksek hızlı sunucularımız aracılığıyla cihazınıza aktarır. Kullanıcılarımıza sağladığımız özel M3U bağlantısı veya Xtream Codes API bilgileri sayesinde, internete bağlı herhangi bir akıllı cihazdan en iyi iptv servisi deneyimine anında ulaşabilirsiniz. Sistem, verileri küçük paketler halinde anlık olarak indirip oynattığı için geniş bant internet bağlantısı gerektirir ve bu sayede donmayan iptv keyfi yaşatır.'
                },
                {
                    question: 'Hizmetleriniz Yasal Olarak Güvenilir mi?',
                    answer: 'IPTV teknolojisinin kendisi, tıpkı popüler dijital yayın platformları gibi tamamen yasal bir protokoldür. Biz, internet üzerinde serbestçe erişilebilen ve paylaşıma açık yayınları, kendi güçlü altyapımızla organize ederek size kaliteli iptv formatında sunuyoruz. Kullanıcılarımızın kişisel verileri üst düzey şifreleme yöntemleriyle korunmakta olup, üçüncü şahıslarla kesinlikle paylaşılmamaktadır. İptv satın al işlemi sonrasında tarafınıza sağlanan bireysel kullanım lisansı ile evinizin konforunda, tamamen güvenli bir altyapı üzerinden dünyanın en iyi iptv servisi standartlarında televizyon izleme ayrıcalığına sahip olursunuz.'
                },
                {
                    question: 'Aynı Anda Kaç Farklı Cihazdan İzleyebilirim?',
                    answer: 'Standart paketlerimiz güvenlik ve bant genişliği optimizasyonu nedeniyle tek eşzamanlı bağlantı (1 connection) ile sınırlandırılmıştır. Bu, iptv kurulumu işlemini evinizdeki Smart TV, cep telefonu, tablet ve bilgisayar gibi dilediğiniz kadar cihaza yapabileceğiniz, ancak aynı saniye içinde yalnızca tek bir cihazdan aktif yayın izleyebileceğiniz anlamına gelir. Aile boyu kullanım veya farklı odalarda aynı anda donmayan iptv izlemek isterseniz, ek bağlantı hakkı sunan çoklu cihaz paketlerimizi inceleyebilir ve ihtiyacınıza en uygun olan iptv satın al seçeneğini değerlendirebilirsiniz. Kaliteli iptv deneyiminin bölünmemesi için kurallara uyulması önemlidir.'
                },
                {
                    question: 'İzlemek İçin Smart TV Şart mı?',
                    answer: 'Hayır, en iyi iptv servisi esnekliği sayesinde izlemek için mutlaka bir Smart TV sahibi olmanız gerekmez. Kaliteli iptv altyapımız Android telefonlar ve tabletler, iOS (iPhone/iPad) cihazlar, Windows ve Mac bilgisayarlar, Apple TV, Android TV Box (Mi Box, Nvidia Shield vb.) ve Firestick gibi internete bağlanabilen hemen hemen her akıllı cihazla tam uyumludur. İptv kurulumu rehberlerimiz sayesinde cihazınız ne olursa olsun dakikalar içinde yayına bağlanabilir, nerede olursanız olun donmayan iptv kalitesiyle favori içeriklerinizi kesintisiz olarak takip edebilirsiniz.'
                }
            ]
        },
        {
            title: 'IPTV Satın Alma ve Fiyatlandırma',
            items: [
                {
                    question: 'Hangi Ödeme Yöntemlerini Kabul Ediyorsunuz?',
                    answer: 'Kullanıcılarımızın iptv satın al işlemlerini en güvenli ve hızlı şekilde gerçekleştirebilmesi için çeşitli ödeme alternatifleri sunuyoruz. Güncel ödeme yöntemlerimiz arasında 3D Secure korumalı Kredi/Banka Kartı ödemeleri, Havale/EFT işlemleri ve uluslararası kullanıcılarımız için Kripto Para transferleri bulunmaktadır. Tüm finansal işlemleriniz uçtan uca şifrelenir ve sistemlerimizde hiçbir kart bilginiz saklanmaz. Kaliteli iptv hizmetine adım atarken ödeme güvenliğiniz bizim için en iyi iptv servisi olmanın getirdiği birincil sorumluluktur. Ödemeniz onaylandığı anda sistem otomatik olarak aboneliğinizi başlatır.'
                },
                {
                    question: 'Paket Fiyatları Neye Göre Değişiklik Gösteriyor?',
                    answer: 'İptv satın al sayfamızdaki fiyatlandırmalar temel olarak abonelik süresine (1, 3, 6 veya 12 aylık) ve içerik kapsamına göre belirlenmektedir. Uzun süreli paketlerimizde (örneğin 12 aylık), aylık bazda çok daha ekonomik fiyatlar sunularak müşteri avantajı sağlanır. Tüm paketlerimizde standart olarak donmayan iptv garantisi, 4K/UHD kanal seçenekleri ve geniş film/dizi arşivi dahildir. En iyi iptv servisi kalitesinden ödün vermeden, her bütçeye uygun kaliteli iptv çözümleri üretiyoruz. Ayrıca zaman zaman düzenlediğimiz kampanyalarla fiyat avantajlarını daha da cazip hale getiriyoruz.'
                },
                {
                    question: 'Satın Alım Sonrası Bilgilerim Ne Zaman İletilir?',
                    answer: 'Hızlı ve kesintisiz hizmet politikamız gereği, iptv satın al işleminiz ve ödemeniz onaylandıktan hemen sonra abonelik bilgileriniz dakikalar içinde oluşturulur. İlgili iptv kurulumu yönergeleri, size özel M3U linkiniz ve Xtream Codes giriş bilgileriniz, kayıt sırasında belirttiğiniz e-posta adresinize veya WhatsApp hattınıza otomatik olarak gönderilir. Kurulumu tamamlayıp anında kaliteli iptv izlemeye başlayabilirsiniz. Olası gecikmelerde 7/24 aktif olan destek hattımız anında müdahale ederek en iyi iptv servisi deneyiminizi başlatmanızı sağlar.'
                },
                {
                    question: 'Memnun Kalmazsam İade Hakkım Var mı?',
                    answer: 'Kendi donmayan iptv altyapımıza ve kaliteli iptv içeriklerimize olan güvenimiz tamdır. Ancak herhangi bir teknik uyumsuzluk veya beklentilerinizin karşılanmaması durumunda, iptv satın al işleminizin ardından ilk 7 gün içinde koşulsuz iade garantisi sunuyoruz. İade talepleriniz için müşteri hizmetlerimizle iletişime geçmeniz yeterlidir. Amacımız sadece satış yapmak değil, sektördeki en iyi iptv servisi olarak uzun vadeli müşteri memnuniyeti sağlamaktır. Bu nedenle satın almadan önce altyapımızı test edebilmeniz için ücretsiz deneme (test) yayınları da sağlamaktayız.'
                }
            ]
        },
        {
            title: 'IPTV Kurulumu ve Teknik Sorular',
            items: [
                {
                    question: 'Farklı Cihazlar İçin IPTV Kurulumu Nasıl Yapılır?',
                    answer: 'Her cihazın işletim sistemi farklı olduğundan iptv kurulumu adımları küçük farklılıklar gösterir. Smart TV\'ler için mağazadan IPTV Smarters Pro, IBO Player veya Set IPTV gibi uygulamaları indirmeniz; Android cihazlar için Google Play\'den, iOS cihazlar için App Store\'dan uyumlu oynatıcıları kurmanız gerekmektedir. Web sitemizdeki detaylı iptv kurulumu rehberlerimiz, cihaz bazlı olarak adım adım görsellerle anlatılmıştır. İşlemler oldukça basit olup, ortalama 3-5 dakika içinde tamamlanır. Kurulum esnasında takıldığınız herhangi bir noktada, kaliteli iptv izlemeye bir an önce başlamanız için teknik destek ekibimiz canlı olarak yardımcı olmaktadır.'
                },
                {
                    question: 'Hangi IPTV Uygulamasını (Player) Kullanmalıyım?',
                    answer: 'Kusursuz bir kaliteli iptv deneyimi için doğru uygulama seçimi kritiktir. Android ve iOS cihazlar ile Smart TV\'lerde en stabil çalışan, arayüzü kullanıcı dostu olan ve donmayan iptv performansını en iyi yansıtan uygulama IPTV Smarters Pro\'dur. Alternatif olarak XCIPTV, Tivimate (özellikle Android Box için) ve DuplexPlay uygulamaları da yüksek performans sunar. En iyi iptv servisi kalitesini hissetmek için cihazınıza ve kullanım alışkanlıklarınıza en uygun uygulamayı seçmeniz önemlidir. İptv kurulumu aşamasında ekibimiz cihaz modelinize göre size en uygun premium uygulamayı tavsiye edecektir.'
                },
                {
                    question: 'Kanal Listesi (M3U) Nasıl Güncellenir?',
                    answer: 'İçerik arşivimiz ve kanal listelerimiz teknik ekibimiz tarafından arka planda sürekli olarak güncellenmektedir. Xtream Codes API kullanan modern uygulamalarda iptv kurulumu yaptıysanız, programı her açtığınızda listeler otomatik olarak güncellenir. Eğer manuel bir M3U dosyası kullanıyorsanız, uygulamanızın menüsünden "Reload Playlist" (Listeyi Yenile) veya "Update" butonuna basmanız yeterlidir. VOD (film/dizi) arşivimize her hafta eklenen yeni içerikleri anında görebilmek ve kaliteli iptv arşivinin tadını çıkarmak için uygulamanızın güncellemeleri otomatik alacak şekilde ayarlandığından emin olunuz.'
                },
                {
                    question: 'İzlemek İçin İnternet Hızım Minimum Ne Olmalı?',
                    answer: 'Görüntü kalitesi ve veri akışının kesintiye uğramaması için internet hızı en önemli faktördür. Standart Çözünürlük (SD) ve Yüksek Çözünürlük (HD) kanallar için kesintisiz minimum 16 Mbps indirme (download) hızı gereklidir. Ancak gerçek donmayan iptv keyfini Full HD ve 4K Ultra HD yayınlarda yaşamak istiyorsanız, stabil olarak 35-50 Mbps ve üzeri bir fiber veya VDSL bağlantıya sahip olmanızı öneriyoruz. İptv satın al kararınızı vermeden önce hız testi (Speedtest) yaparak altyapınızı kontrol etmeniz, en iyi iptv servisi deneyimini eksiksiz yaşamanız açısından faydalı olacaktır.'
                }
            ]
        },
        {
            title: 'IPTV Kalitesi ve Performans',
            items: [
                {
                    question: 'Yayınlarda Donma veya Takılma Yaşar mıyım?',
                    answer: 'Sektördeki en iyi iptv servisi olma vizyonumuz doğrultusunda, Avrupa merkezli devasa sunucu ağları ve yük dengeleme (load balancer) teknolojileri kullanıyoruz. Bu sayede sunucu kaynaklı hiçbir takılma yaşatmadan %99.9 Uptime garantisi ile donmayan iptv hizmeti sunuyoruz. Ancak yayın akışı tamamen internet üzerinden gerçekleştiği için, kullanıcı tarafındaki internet dalgalanmaları, anlık hız düşüşleri veya Wi-Fi sinyal zayıflıkları donmalara sebep olabilir. Kaliteli iptv performansı almak için cihazınızı modeme olabildiğince yakın tutmanız veya ethernet kablosu ile bağlamanız tavsiye edilir.'
                },
                {
                    question: '4K ve Ultra HD Yayınlar Mevcut mu?',
                    answer: 'Evet, arşivimizde teknolojinin ulaştığı en yüksek görüntü standartları mevcuttur. Başta belgesel, sinema ve seçkin spor kanalları olmak üzere yüzlerce kanal ve binlerce VOD içeriği 4K ve UHD çözünürlükte sunulmaktadır. Geleneksel yayınların ötesinde bir kaliteli iptv deneyimi yaşamak isteyen kullanıcılarımız için sürekli genişleyen bir yüksek çözünürlük arşivi oluşturuyoruz. 4K yayınlarda donmayan iptv akışını sağlayabilmek için televizyonunuzun veya cihazınızın bu çözünürlüğü desteklediğinden ve internet hızınızın yeterince yüksek olduğundan emin olmalısınız.'
                },
                {
                    question: 'Maç Günlerinde Sunucularda Yoğunluk Oluyor mu?',
                    answer: 'Özellikle derbi maçları veya büyük spor organizasyonları sırasında sektör genelinde aşırı trafik oluşur. Ancak bizim altyapımız, anlık kullanıcı artışlarını kaldırabilecek devasa bant genişliklerine (Bandwidth) ve yedekli sunucu (Backup Server) sistemlerine sahiptir. Bu teknolojik yatırımımız sayesinde en yoğun maç günlerinde bile donmayan iptv kalitemizden asla taviz vermeyiz. Önemli müsabakaları stres yaşamadan, saniyesi saniyesine izleyebileceğiniz en iyi iptv servisi güvencesiyle sizlere sunuyoruz. Sorunsuz bir spor keyfi için iptv satın alırken altyapı gücüne dikkat etmek çok önemlidir.'
                }
            ]
        },
        {
            title: 'IPTV Kanal ve İçerik Soruları',
            items: [
                {
                    question: 'Paketlerde Hangi Ülkelerin Kanalları Bulunuyor?',
                    answer: 'Geniş kapsamlı iptv satın al paketlerimiz, gerçek bir küresel televizyon deneyimi sunar. Başta Türkiye ulusal, yerel, spor ve sinema kanalları olmak üzere; Almanya, İngiltere, Fransa, Hollanda, ABD, Arap ülkeleri, Rusya ve İskandinav ülkeleri gibi dünyanın dört bir yanından 15.000\'i aşkın canlı kanal bulunmaktadır. Yurtdışında yaşayan gurbetçilerimiz için memleket hasretini dindiren kaliteli iptv yayınlarının yanı sıra, yabancı dilini geliştirmek isteyenler için de eşsiz bir kaynaktır. Menünüzden dilediğiniz ülkenin kategorisine kolayca erişebilirsiniz.'
                },
                {
                    question: 'Film ve Dizi Arşivi (VOD) Ne Sıklıkla Güncellenir?',
                    answer: 'En iyi iptv servisi olmanın gerekliliklerinden biri de içeriği daima taze tutmaktır. VOD (Video on Demand) kütüphanemiz, vizyondan yeni çıkan sinema filmleri, popüler dijital platformların (Netflix, BluTV, Exxen, Disney+ vb.) en güncel dizileri ve belgesellerle her hafta düzenli olarak güncellenir. On binlerce içerikten oluşan bu dev arşivde, tüm içerikler Türkçe dublaj veya altyazı seçenekleriyle, yüksek görüntü kalitesinde sunulmaktadır. Donmayan iptv sunucularımız üzerinden dilediğiniz filmi istediğiniz an durdurup, ileri geri sararak izleme özgürlüğüne sahipsiniz.'
                },
                {
                    question: 'Yetişkin (Adult) Kanalları Şifreleyebilir miyim?',
                    answer: 'Evet, aile dostu bir kaliteli iptv kullanımını destekliyoruz. İptv kurulumu için kullandığınız IPTV Smarters Pro, Tivimate veya benzeri uygulamaların neredeyse tamamında "Ebeveyn Kontrolü" (Parental Control) veya "Kanal Kilitleme" özelliği bulunmaktadır. Uygulama ayarlarından belirleyeceğiniz 4 haneli bir PIN kodu ile yetişkin içerikli kategorileri veya çocuklarınızın izlemesini istemediğiniz diğer buketleri kolayca şifreleyebilir veya tamamen gizleyebilirsiniz. Böylece evinizdeki en iyi iptv servisi, her yaş grubuna uygun güvenli bir eğlence merkezine dönüşür.'
                }
            ]
        },
        {
            title: 'IPTV Destek ve Sorun Giderme',
            items: [
                {
                    question: 'Ses Var Fakat Görüntü Yok, Ne Yapmalıyım?',
                    answer: 'Bu durum genellikle cihazınızın oynatıcısındaki video çözücü (codec) ayarlarıyla ilgili bir uyumsuzluktan kaynaklanır. Eğer kaliteli iptv yayınınızda siyah ekran görüyor ancak sesi duyuyorsanız, kullandığınız iptv kurulumu uygulamasının ayarlarına (Settings) girin. "Player Selection" (Oynatıcı Seçimi) veya "Decoder" bölümünden ayarı VLC Player, ExoPlayer veya HW (Hardware Decoder) / SW (Software Decoder) olarak değiştirerek test edin. Donmayan iptv izleme ayarlarını cihazınıza en uygun hale getirdiğinizde sorun anında çözülecektir. Çözülmemesi durumunda destek ekibimiz uzaktan yardımcı olacaktır.'
                },
                {
                    question: 'Satış Sonrası Teknik Destek Hizmetiniz Var mı?',
                    answer: 'Kesinlikle! Bizi sektördeki en iyi iptv servisi yapan özelliklerimizin başında, satış sonrasında sunduğumuz premium teknik destek gelir. İptv satın al işleminizin üzerinden aylar geçse bile; iptv kurulumu, kanal güncellemeleri, donma problemleri veya cihaz değişiklikleri gibi her türlü teknik konuda uzman ekibimiz 7/24 hizmetinizdedir. Web sitemizdeki canlı destek paneli veya WhatsApp hattımız üzerinden bize anında ulaşabilir, sorunlarınıza dakikalar içinde profesyonel çözümler bulabilirsiniz. Amacımız, kaliteli iptv keyfinizin yılın 365 günü kesintisiz sürmesini sağlamaktır.'
                }
            ]
        }
    ]
};

export const FaqTab = () => {
    const { toast } = useToast();
    
    // State management
    const [formData, setFormData] = useState(defaultFaqData);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [expandedSections, setExpandedSections] = useState({ 0: true }); // First section open by default

    // Fetch data on mount
    useEffect(() => {
        fetchFaqData();
    }, []);

    const fetchFaqData = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('site_content')
                .select('value')
                .eq('key', 'faqData')
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    console.log("No FAQ data found, using new structured defaults.");
                    setFormData(defaultFaqData);
                    return;
                }
                throw error;
            }

            if (data?.value) {
                // Check if old flat structure or new sectioned structure
                if (data.value.sections) {
                    setFormData(data.value);
                } else {
                    // Fallback to default if old structure detected, to force upgrade to new sections
                    console.log("Old flat FAQ structure detected. Upgrading to new sectioned default.");
                    setFormData(defaultFaqData);
                }
            }
        } catch (error) {
            console.error("Error fetching FAQ:", error);
            toast({
                variant: "destructive",
                title: "Veri Yükleme Hatası",
                description: "Mevcut SSS verileri yüklenemedi. Varsayılanlar kullanılıyor."
            });
            setFormData(defaultFaqData);
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        setValidationError(null);
        
        if (!formData.title?.trim()) {
            setValidationError("Sayfa başlığı boş olamaz.");
            return false;
        }

        if (!formData.sections || formData.sections.length === 0) {
            setValidationError("En az bir kategori eklemelisiniz.");
            return false;
        }

        for (let s = 0; s < formData.sections.length; s++) {
            const section = formData.sections[s];
            if (!section.title?.trim()) {
                 setValidationError(`${s + 1}. bölüm başlığı boş bırakılamaz.`);
                 return false;
            }
            if (!section.items || section.items.length === 0) {
                 setValidationError(`"${section.title}" bölümünde en az bir soru olmalıdır.`);
                 return false;
            }
            for (let i = 0; i < section.items.length; i++) {
                const item = section.items[i];
                if (!item.question?.trim()) {
                    setValidationError(`"${section.title}" bölümündeki ${i + 1}. soru boş bırakılamaz.`);
                    return false;
                }
                if (!item.answer?.trim()) {
                    setValidationError(`"${section.title}" bölümündeki ${i + 1}. cevap boş bırakılamaz.`);
                    return false;
                }
            }
        }

        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) {
             toast({
                variant: "destructive",
                title: "Doğrulama Hatası",
                description: validationError || "Lütfen tüm alanları kontrol edin.",
            });
            return;
        }

        setIsSaving(true);
        try {
            const payload = { 
                key: 'faqData',
                value: formData,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('site_content')
                .upsert(payload, { onConflict: 'key' });

            if (error) throw error;

            toast({
                title: "Başarılı",
                description: (
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600"/> 
                        <span>SSS başarıyla kaydedildi.</span>
                    </div>
                ),
                className: "bg-green-50 border-green-200 text-green-900"
            });

        } catch (error) {
            console.error("FAQ Save Error:", error);
            toast({
                variant: "destructive",
                title: "Kaydetme Başarısız",
                description: error.message || "Veritabanına bağlanırken bir sorun oluştu.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleBasicChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (validationError) setValidationError(null);
    };

    const handleSectionChange = (sIndex, field, value) => {
        setFormData(prev => {
            const newSections = [...prev.sections];
            newSections[sIndex] = { ...newSections[sIndex], [field]: value };
            return { ...prev, sections: newSections };
        });
        if (validationError) setValidationError(null);
    };

    const handleItemChange = (sIndex, iIndex, field, value) => {
        setFormData(prev => {
            const newSections = [...prev.sections];
            const newItems = [...newSections[sIndex].items];
            newItems[iIndex] = { ...newItems[iIndex], [field]: value };
            newSections[sIndex].items = newItems;
            return { ...prev, sections: newSections };
        });
        if (validationError) setValidationError(null);
    };

    const addSection = () => {
        setFormData(prev => ({ 
            ...prev, 
            sections: [...prev.sections, { title: 'Yeni Kategori', items: [] }] 
        }));
        setExpandedSections(prev => ({ ...prev, [formData.sections.length]: true }));
        setValidationError(null);
    };

    const removeSection = (sIndex) => {
        setFormData(prev => ({ 
            ...prev, 
            sections: prev.sections.filter((_, i) => i !== sIndex) 
        }));
    };

    const addItem = (sIndex) => {
        setFormData(prev => {
            const newSections = [...prev.sections];
            newSections[sIndex].items.push({ question: '', answer: '' });
            return { ...prev, sections: newSections };
        });
        setValidationError(null);
    };
    
    const removeItem = (sIndex, iIndex) => {
        setFormData(prev => {
            const newSections = [...prev.sections];
            newSections[sIndex].items = newSections[sIndex].items.filter((_, i) => i !== iIndex);
            return { ...prev, sections: newSections };
        });
    };

    const toggleSection = (index) => {
        setExpandedSections(prev => ({ ...prev, [index]: !prev[index] }));
    };

    if (isLoading) {
        return (
            <AdminTabWrapper title="Sıkça Sorulan Sorular" icon={HelpCircle}>
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    <p className="text-slate-500">Veriler yükleniyor...</p>
                </div>
            </AdminTabWrapper>
        );
    }

    return (
        <AdminTabWrapper 
            title="Sıkça Sorulan Sorular (SSS)" 
            description="Kullanıcıların merak ettiklerini kategoriler halinde yanıtlayın." 
            icon={HelpCircle}
            actions={
                <div className="flex gap-2">
                    <Button onClick={() => fetchFaqData()} variant="ghost" size="icon" title="Yenile">
                        <RefreshCw className="w-4 h-4 text-slate-500" />
                    </Button>
                    <Button onClick={addSection} variant="outline" className="border-dashed border-slate-600 text-slate-400 hover:text-white hover:bg-slate-800">
                        <Plus className="w-4 h-4 mr-2" /> Kategori Ekle
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving} 
                        className={`bg-green-600 hover:bg-green-700 transition-all ${isSaving ? 'opacity-80 cursor-not-allowed' : ''}`}
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            }
        >
            {validationError && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-3 text-red-200 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-sm font-medium">{validationError}</p>
                </div>
            )}

            <div className="admin-card mb-8 space-y-6">
                <Input 
                    label="Sayfa Ana Başlığı (H1)" 
                    value={formData.title} 
                    onChange={e => handleBasicChange('title', e.target.value)} 
                    className="border-slate-700 focus:border-purple-500 text-lg font-bold"
                />
                <Textarea
                    label="SEO Açıklaması (Giriş Paragrafı)"
                    value={formData.description}
                    onChange={e => handleBasicChange('description', e.target.value)}
                    rows={4}
                    className="border-slate-700 focus:border-purple-500 text-slate-300"
                    placeholder="Sık sorulan sorular sayfası için SEO uyumlu giriş metni..."
                />
            </div>

            <div className="space-y-6">
                {formData.sections.map((section, sIndex) => (
                    <div key={sIndex} className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                        {/* Section Header */}
                        <div 
                            className="bg-slate-800/80 p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors"
                            onClick={() => toggleSection(sIndex)}
                        >
                            <div className="flex-1 flex items-center gap-4 mr-4" onClick={e => e.stopPropagation()}>
                                <span className="bg-purple-600/20 text-purple-400 font-bold px-3 py-1 rounded-md text-sm border border-purple-500/30">
                                    Bölüm {sIndex + 1}
                                </span>
                                <Input 
                                    value={section.title}
                                    onChange={e => handleSectionChange(sIndex, 'title', e.target.value)}
                                    className="h-9 border-slate-600 bg-slate-900/50 max-w-md font-semibold"
                                    placeholder="Kategori Başlığı"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Button 
                                    onClick={(e) => { e.stopPropagation(); removeItem(sIndex); }} 
                                    variant="ghost" 
                                    className="text-slate-400 hover:text-red-400 hover:bg-red-900/20 h-8 px-2"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Kategoriyi Sil
                                </Button>
                                {expandedSections[sIndex] ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                            </div>
                        </div>

                        {/* Section Content (Items) */}
                        {expandedSections[sIndex] && (
                            <div className="p-6 space-y-6 bg-slate-900/20">
                                {section.items.map((item, iIndex) => (
                                    <div key={iIndex} className="relative group pl-6 border-l-2 border-slate-800 hover:border-purple-500 transition-colors">
                                        <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:bg-purple-600 group-hover:border-purple-500 group-hover:text-white transition-colors">
                                            {iIndex + 1}
                                        </div>
                                        <div className="flex justify-between items-start mb-3">
                                            <label className="text-sm text-slate-400 font-semibold mb-1 block">Soru {iIndex + 1}</label>
                                            <Button 
                                                onClick={() => removeItem(sIndex, iIndex)} 
                                                variant="ghost" 
                                                className="text-slate-500 hover:text-red-400 hover:bg-red-900/10 h-6 w-6 p-0"
                                                title="Soruyu Sil"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                        <div className="space-y-4">
                                            <Input 
                                                placeholder="Örn: Kurulum ücretli mi?"
                                                value={item.question}
                                                onChange={e => handleItemChange(sIndex, iIndex, 'question', e.target.value)}
                                                className={`font-medium border-slate-700 bg-slate-950/50 ${!item.question && validationError ? 'border-red-500/50' : ''}`}
                                            />
                                            <Textarea
                                                placeholder="Detaylı cevap metni..."
                                                value={item.answer}
                                                onChange={e => handleItemChange(sIndex, iIndex, 'answer', e.target.value)}
                                                rows={4}
                                                className={`text-slate-300 border-slate-700 bg-slate-950/50 ${!item.answer && validationError ? 'border-red-500/50' : ''}`}
                                            />
                                        </div>
                                    </div>
                                ))}

                                <Button 
                                    onClick={() => addItem(sIndex)} 
                                    variant="outline" 
                                    className="w-full mt-4 border-dashed border-slate-700 text-slate-400 hover:text-purple-300 hover:border-purple-500 hover:bg-purple-500/10"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Bu Kategoriye Yeni Soru Ekle
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </AdminTabWrapper>
    );
};

export default FaqTab;