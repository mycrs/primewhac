import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import HeaderDE from '@/components/HeaderDE';
import Footer from '@/components/Footer';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Star, Loader2, Send, MessageSquare, Package, Clock, HelpCircle, ArrowRight } from 'lucide-react';
import { buildCustomerReviewsJsonLd, buildReviewsFaqJsonLd } from '@/utils/customerReviewsSchema';
import { isSupabaseConfigured } from '@/utils/envValidator';
import { showPublicMaintenanceToastOnce } from '@/utils/supabaseMaintenanceToast';
import FeaturedReviewsCarousel from '@/components/FeaturedReviewsCarousel';
import { getReviewAccent, reviewerInitials } from '@/constants/reviewAccents';
import { readSessionCache, writeSessionCache, removeSessionCacheKey } from '@/utils/supabaseSessionCache';
import { SITE_URL } from '@/constants/siteUrl';

const MIN_BODY = 20;
const MAX_BODY = 2000;
const MIN_SUB_M = 1;
const MAX_SUB_M = 60;
const MIN_USE_M = 1;
const MAX_USE_M = 120;
const SIMPLE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeOptionalEmail(raw) {
  const t = (raw || '').trim();
  if (!t) return { ok: true, value: null };
  if (t.length > 254 || !SIMPLE_EMAIL.test(t)) return { ok: false, value: null };
  return { ok: true, value: t };
}

/** customer_reviews.reviewer_email yoksa veya şema önbelleği güncel değilse PostgREST bu hatayı verir */
function isReviewerEmailColumnSchemaError(err) {
  if (!err) return false;
  const msg = String(err.message || err.details || '').toLowerCase();
  return (
    err.code === 'PGRST204' ||
    msg.includes('reviewer_email') ||
    msg.includes('reviewer email') ||
    (msg.includes('schema cache') && msg.includes('reviewer')) ||
    (msg.includes('could not find') && msg.includes('column') && msg.includes('reviewer'))
  );
}

function StarPicker({ value, onChange, disabled, labels }) {
  const v = value ?? 0;
  return (
    <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label={labels.rating}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          role="radio"
          aria-checked={value === n}
          onClick={() => onChange(n)}
          className={`p-1 rounded-lg transition-colors ${v >= n ? 'text-amber-400' : 'text-slate-600'} hover:text-amber-300 disabled:opacity-50`}
        >
          <Star className={`w-9 h-9 ${v >= n ? 'fill-current' : ''}`} />
        </button>
      ))}
      <span className="text-sm text-slate-500 ml-2">{value ? `${value}/5` : labels.pick}</span>
    </div>
  );
}

const ReviewsPage = ({ siteData }) => {
  const location = useLocation();
  const isDe = location.pathname.startsWith('/de');
  const locale = isDe ? 'de' : 'tr';
  const { toast } = useToast();

  const copy = useMemo(() => {
    if (isDe) {
      return {
        title: 'Kundenbewertungen QruzeTV IPTV | Echte Erfahrungen & Paketlaufzeit',
        description:
          'Lesen Sie geprüfte QruzeTV IPTV Kundenbewertungen mit Angabe zur Paketlaufzeit und Nutzungsdauer. Bewertung einreichen — Veröffentlichung nach manueller Prüfung.',
        h1: 'Kundenbewertungen QruzeTV IPTV',
        intro:
          'Hier finden Sie ausschließlich von Kundinnen und Kunden eingereichte, von uns manuell geprüfte Bewertungen. Es gibt keine automatische Freigabe — so bleiben Meinungen nachvollziehbar und authentisch.',
        formH2: 'Bewertung einreichen',
        pkgH3: 'Paket- und Nutzungsdauer',
        subLabel: 'Laufzeit Ihres gekauften Pakets (Monate)',
        subHelp: 'Wie viele Monate umfasste Ihr gekauftes Abonnement? (1–60)',
        useLabel: 'Seit wie vielen Monaten nutzen Sie den Dienst?',
        useHelp: 'Ungefähre Dauer Ihrer Nutzung bis heute (1–120 Monate)',
        ratingH3: 'Sterne und Bewertungstext',
        name: 'Anzeigename',
        namePh: 'z. B. Max M.',
        emailLabel: 'E-Mail (optional)',
        emailHelp:
          'Nur für die interne Prüfung durch unser Team. Wird nicht auf der Website angezeigt und nicht in Suchmaschinen-Snippets verwendet.',
        emailPh: 'name@beispiel.de',
        errEmail: 'Bitte eine gültige E-Mail-Adresse eingeben oder das Feld leer lassen.',
        rating: 'Gesamtbewertung',
        pick: 'Bitte wählen',
        body: 'Ihre Bewertung',
        bodyPh: 'Mindestens 20 Zeichen. Beschreiben Sie Ihre echte Erfahrung mit Bildqualität, Stabilität und Support.',
        consentBefore: 'Ich bestätige, dass diese Bewertung meine eigene ehrliche Meinung widerspiegelt. Ich habe die ',
        consentLink: 'Datenschutzerklärung',
        consentAfter:
          ' gelesen und stimme der Verarbeitung meiner Angaben für die Anzeige der Bewertung zu. Eine optional angegebene E-Mail wird nur zur Moderation verarbeitet, nicht veröffentlicht.',
        submit: 'Absenden',
        submitting: 'Wird gesendet…',
        thanks:
          'Vielen Dank. Ihre Bewertung wurde eingereicht und wird nach Prüfung veröffentlicht — sofern sie unseren Richtlinien entspricht.',
        errFill: 'Bitte füllen Sie alle Pflichtfelder aus und akzeptieren Sie die Einwilligung.',
        errLen: `Der Text muss zwischen ${MIN_BODY} und ${MAX_BODY} Zeichen haben.`,
        errMonths: 'Bitte gültige Monatsangaben (Paket 1–60, Nutzung 1–120) eintragen.',
        listH2: 'Veröffentlichte Kundenbewertungen',
        empty: 'Noch keine veröffentlichten Bewertungen in dieser Sprache.',
        pkgMeta: (s, u) => `Paket: ${s} Mon. · Nutzung: ${u} Mon.`,
        privacyPath: '/de/privacy',
        breadcrumbHere: 'Bewertungen',
        infoH2: 'Über unsere Kundenbewertungen',
        infoLead:
          'Diese Seite dient der Transparenz: Leserinnen und Leser sehen, wie lange Kunden das Produkt gebucht haben und seit wann sie es nutzen — zusammen mit dem freien Bewertungstext.',
        infoH3Moderation: 'Moderation und Echtheit',
        infoPM:
          'Jede sichtbare Bewertung wurde von einem Administrator geprüft. Wir veröffentlichen keine automatisch generierten oder anonymisierten Masseninhalte. Bewertungen müssen unseren Richtlinien entsprechen.',
        infoH3Google: 'Hinweis zu Sternen und Auszügen',
        infoG:
          'Die Sternebewertung und der Text entsprechen der veröffentlichten Meinung der jeweiligen Person. Durchschnittswerte werden nur aus den auf dieser Seite sichtbaren, freigegebenen Bewertungen berechnet.',
        infoH4NoIncentive: 'Keine Vergütung für Bewertungen',
        infoNI:
          'Es werden keine Zahlungen, Rabatte oder andere Anreize für positive Bewertungen geboten. Bitte bewerten Sie fair und wahrheitsgemäß.',
        faqH2: 'Häufige Fragen zu Bewertungen',
        faq: [
          {
            q: 'Sind die Bewertungen auf dieser Seite echte Kundenmeinungen?',
            a: 'Ja. Alle angezeigten Bewertungen stammen von eingereichten Formularen und werden manuell von QruzeTV geprüft, bevor sie veröffentlicht werden. Es gibt keine automatische Veröffentlichung.',
          },
          {
            q: 'Warum erscheint meine Bewertung nicht sofort?',
            a: 'Zur Qualitätssicherung und Einhaltung der Richtlinien werden Bewertungen vor der Veröffentlichung moderiert. Nach Prüfung erscheinen freigegebene Bewertungen auf dieser Seite.',
          },
          {
            q: 'Welche Angaben muss ich bei der Bewertung machen?',
            a: 'Neben Anzeigename und Sternebewertung geben Sie die Laufzeit Ihres gekauften Pakets (Monate) und an, seit wie vielen Monaten Sie den Dienst nutzen. Der Text soll Ihre eigene Erfahrung ehrlich beschreiben.',
          },
          {
            q: 'Gibt es Anreize oder Zahlungen für positive Bewertungen?',
            a: 'Nein. QruzeTV bietet keine Vergütung oder Gegenleistung für Bewertungen. Bewertungen sollen freiwillig und authentisch sein.',
          },
        ],
        ctaH2: 'IPTV-Angebot ansehen oder testen',
        ctaLead: 'Überzeugen Sie sich von Paketen, Kanälen und kostenloser Testmöglichkeit.',
        ctaPackages: 'Zu den Paketen',
        ctaTest: 'Kostenlosen Test anfragen',
        ctaChannels: 'Kanalliste',
        ctaH4More: 'Weitere hilfreiche Seiten',
        ctaSetup: 'Installationsanleitung',
        ctaFaq: 'FAQ',
        packagesPath: '/de/pakete',
        testPath: '/de/test',
        channelsPath: '/de/kanale',
        setupPath: '/de/einrichtung',
        faqPath: '/de/sss',
        verifiedBadge: 'Verifizierter Kunde',
      };
    }
    return {
      title: 'Müşteri Yorumları QruzeTV IPTV | Gerçek Deneyimler & Paket Süresi',
      description:
        'QruzeTV IPTV için onaylı müşteri yorumları: paket süresi ve kaç aydır kullanıldığı bilgisiyle birlikte. Yorum bırakın — yayın öncesi manuel kontrol.',
      h1: 'Müşteri Yorumları QruzeTV IPTV',
      intro:
        'Bu sayfada yalnızca müşterilerimizin gönderdiği, ekibimiz tarafından tek tek onaylanan yorumlar yer alır. Otomatik yayın yoktur; böylece içerikler gerçek ve denetlenebilir kalır.',
      formH2: 'Yorumunuzu paylaşın',
      pkgH3: 'Paket ve kullanım süreniz',
      subLabel: 'Satın aldığınız paket kaç aylıktı?',
      subHelp: 'Örneğin 1, 3, 6 veya 12 aylık paket (1–60 ay arası).',
      useLabel: 'Hizmeti yaklaşık kaç aydır kullanıyorsunuz?',
      useHelp: 'Bugüne kadar geçen tahmini süre (1–120 ay).',
      ratingH3: 'Puanınız ve yorum metni',
      name: 'Görünen adınız',
      namePh: 'Örn. Ahmet Y.',
      emailLabel: 'E-posta (isteğe bağlı)',
      emailHelp:
        'Yalnızca ekibimizin moderasyon için kullanır; sitede gösterilmez ve arama sonuçlarında yer almaz.',
      emailPh: 'ornek@email.com',
      errEmail: 'Geçerli bir e-posta girin veya alanı boş bırakın.',
      rating: 'Genel puanınız',
      pick: 'Seçin',
      body: 'Yorumunuz',
      bodyPh: `En az ${MIN_BODY} karakter. Yayın kalitesi, kesinti, destek gibi kendi deneyiminizi yazın.`,
      consentBefore: 'Bu yorumun kendi gerçek deneyimime dayandığını onaylıyorum. ',
      consentLink: 'Gizlilik Politikası',
      consentAfter:
        ' metnini okudum; yorumun yayınlanması için kişisel verilerimin işlenmesini kabul ediyorum. İsteğe bağlı bıraktığım e-posta yalnızca moderasyon amacıyla işlenir, yayında gösterilmez.',
      submit: 'Gönder',
      submitting: 'Gönderiliyor…',
      thanks:
        'Teşekkürler. Yorumunuz alındı; uygun görüldüğünde onaylandıktan sonra yayınlanacaktır.',
      errFill: 'Lütfen tüm zorunlu alanları doldurun ve onayı işaretleyin.',
      errLen: `Metin ${MIN_BODY}–${MAX_BODY} karakter arasında olmalıdır.`,
      errMonths: 'Paket süresi 1–60 ay, kullanım süresi 1–120 ay olmalıdır.',
      listH2: 'Onaylı müşteri yorumları',
      empty: 'Bu dilde henüz yayınlanmış yorum yok.',
      pkgMeta: (s, u) => `${s} aylık paket · ${u} aydır kullanıyor`,
      privacyPath: '/gizlilik',
      breadcrumbHere: 'Müşteri Yorumları',
      infoH2: 'Yorumlar hakkında bilgilendirme',
      infoLead:
        'Ziyaretçiler, her yorumda paket süresi ve müşterinin hizmeti ne kadar süredir kullandığı bilgisini de görür; böylece değerlendirmeler daha anlamlı bir bağlam kazanır.',
      infoH3Moderation: 'Moderasyon ve gerçeklik',
      infoPM:
        'Gördüğünüz her yorum bir yönetici tarafından incelenmiştir. Otomatik veya toplu üretilmiş içerik yayınlanmaz. Hakaret, spam veya yanıltıcı içerikler onaylanmaz.',
      infoH3Google: 'Yıldızlar ve özet puan',
      infoG:
        'Yıldız puanı ve metin, ilgili müşterinin beyanıdır. Sayfadaki ortalama puan yalnızca burada listelenen onaylı yorumlardan hesaplanır.',
      infoH4NoIncentive: 'Yorum karşılığı ödül yok',
      infoNI:
        'Olumlu yorum karşılığı ücret, indirim veya hediye sunulmaz. Lütfen dürüst ve tarafsız yazın.',
      faqH2: 'Sıkça sorulan sorular',
      faq: [
        {
          q: 'Bu sayfadaki yorumlar gerçek müşteri görüşü mü?',
          a: 'Evet. Listelenen tüm yorumlar müşterilerimizin form ile gönderdiği metinlerden oluşur; QruzeTV tarafından yayından önce manuel olarak kontrol edilir ve onaylanır. Otomatik yayın yoktur.',
        },
        {
          q: 'Yorumum neden hemen görünmüyor?',
          a: 'Kalite ve kurallara uyum için yorumlar moderasyondan geçer. Uygun bulunan yorumlar onaylandıktan sonra bu sayfada yayınlanır.',
        },
        {
          q: 'Yorum bırakırken hangi bilgileri vermeliyim?',
          a: 'Görünen adınız, yıldız puanınız, satın aldığınız paketin kaç aylık olduğu ve hizmeti yaklaşık kaç aydır kullandığınız; ayrıca deneyiminizi anlatan metin. Bu alanlar diğer kullanıcılar için bağlam sağlar.',
        },
        {
          q: 'Olumlu yorum karşılığı ödül veya ücret veriliyor mu?',
          a: 'Hayır. QruzeTV, yorum karşılığı ücret, indirim veya başka bir menfaat sunmaz. Yorumlar gönüllü ve gerçek deneyime dayanmalıdır.',
        },
      ],
      ctaH2: 'IPTV paketlerine göz atın veya test isteyin',
      ctaLead: 'Paketler, kanallar ve ücretsiz test seçenekleri için aşağıdaki bağlantıları kullanın.',
      ctaPackages: 'Paketleri incele',
      ctaTest: 'Ücretsiz test',
      ctaChannels: 'Kanal listesi',
      ctaH4More: 'Yararlı diğer sayfalar',
      ctaSetup: 'Kurulum rehberi',
      ctaFaq: 'Sıkça sorulan sorular',
      packagesPath: '/paketler',
      testPath: '/test',
      channelsPath: '/channels',
      setupPath: '/kurulum',
      faqPath: '/sss',
      verifiedBadge: 'Doğrulanmış Müşteri',
    };
  }, [isDe]);

  const canonicalUrl = isDe ? `${SITE_URL}/de/bewertungen` : `${SITE_URL}/yorumlar`;

  const [reviews, setReviews] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(null);
  const [body, setBody] = useState('');
  const [subscriptionMonths, setSubscriptionMonths] = useState('');
  const [customerSinceMonths, setCustomerSinceMonths] = useState('');
  const [optionalEmail, setOptionalEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchApproved = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setReviews([]);
      setLoadingList(false);
      return;
    }
    const cacheKey = `sb_pub_reviews_${locale}_v1`;
    const cached = readSessionCache(cacheKey);
    if (Array.isArray(cached)) {
      setReviews(cached);
      setLoadingList(false);
      return;
    }
    setLoadingList(true);
    const { data, error } = await supabase
      .from('customer_reviews')
      .select(
        'id, author_display_name, rating, body, subscription_months, customer_since_months, created_at, moderated_at'
      )
      .eq('status', 'approved')
      .eq('locale', locale)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('[ReviewsPage]', error);
      setReviews([]);
    } else {
      const rows = data || [];
      setReviews(rows);
      writeSessionCache(cacheKey, rows);
    }
    setLoadingList(false);
  }, [locale]);

  useEffect(() => {
    fetchApproved();
  }, [fetchApproved]);

  /** Hero CTA: yorumlar sayfasında öne çıkan bölüme ortala */
  useEffect(() => {
    const isReviews = location.pathname === '/yorumlar' || location.pathname === '/de/bewertungen';
    if (!isReviews) return;

    if (location.hash === '#musteriler-ne-dusunuyor') {
      const scrollFeatured = () => {
        const el = document.getElementById('musteriler-ne-dusunuyor');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };
      const ids = [0, 200, 550].map((ms) => window.setTimeout(scrollFeatured, ms));
      return () => ids.forEach((id) => window.clearTimeout(id));
    }

    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  const jsonLd = useMemo(() => {
    const customer = buildCustomerReviewsJsonLd({ reviews, pageUrl: canonicalUrl, lang: locale });
    const blocks = Array.isArray(customer) ? customer : [customer];
    return [...blocks, buildReviewsFaqJsonLd({ pageUrl: canonicalUrl, lang: locale })];
  }, [reviews, canonicalUrl, locale]);

  const parseMonths = (raw, min, max) => {
    const n = parseInt(String(raw).trim(), 10);
    if (Number.isNaN(n) || n < min || n > max) return null;
    return n;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) return;
    const trimmedName = authorName.trim();
    const trimmedBody = body.trim();
    const subM = parseMonths(subscriptionMonths, MIN_SUB_M, MAX_SUB_M);
    const useM = parseMonths(customerSinceMonths, MIN_USE_M, MAX_USE_M);
    if (!trimmedName || rating == null || !consent) {
      toast({ variant: 'destructive', title: copy.errFill });
      return;
    }
    if (subM == null || useM == null) {
      toast({ variant: 'destructive', title: copy.errMonths });
      return;
    }
    if (trimmedBody.length < MIN_BODY || trimmedBody.length > MAX_BODY) {
      toast({ variant: 'destructive', title: copy.errLen });
      return;
    }
    const emailCheck = normalizeOptionalEmail(optionalEmail);
    if (!emailCheck.ok) {
      toast({ variant: 'destructive', title: copy.errEmail });
      return;
    }
    if (!isSupabaseConfigured()) {
      showPublicMaintenanceToastOnce(toast);
      return;
    }
    setSubmitting(true);
    try {
      const baseRow = {
        author_display_name: trimmedName,
        rating,
        body: trimmedBody,
        locale,
        status: 'pending',
        consent_accepted: true,
        subscription_months: subM,
        customer_since_months: useM,
      };
      const rowWithEmail =
        emailCheck.value != null ? { ...baseRow, reviewer_email: emailCheck.value } : baseRow;
      let { error } = await supabase.from('customer_reviews').insert([rowWithEmail]);
      if (error && isReviewerEmailColumnSchemaError(error) && 'reviewer_email' in rowWithEmail) {
        ({ error } = await supabase.from('customer_reviews').insert([baseRow]));
      }
      if (error) throw error;
      removeSessionCacheKey(`sb_pub_reviews_${locale}_v1`);
      removeSessionCacheKey(`sb_pub_featured_reviews_${locale}_v1`);
      toast({ title: copy.thanks, className: 'bg-[#e50914] text-white border-none' });
      setAuthorName('');
      setRating(null);
      setBody('');
      setSubscriptionMonths('');
      setCustomerSinceMonths('');
      setOptionalEmail('');
      setConsent(false);
    } catch (err) {
      console.error(err);
      showPublicMaintenanceToastOnce(toast);
    } finally {
      setSubmitting(false);
    }
  };

  const HeaderC = isDe ? HeaderDE : Header;
  const FooterC = isDe ? FooterDE : Footer;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <SEOHead
        title={copy.title}
        description={copy.description}
        keywords={
          isDe
            ? ['IPTV Bewertung', 'QruzeTV Erfahrung', 'IPTV Kundenmeinung', 'IPTV Paket Monate']
            : ['IPTV yorum', 'QruzeTV müşteri yorumu', 'IPTV paket süresi', 'IPTV deneyim']
        }
        canonicalUrl={canonicalUrl}
        jsonLd={jsonLd}
      />
      <HeaderC contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />

      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 w-full max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto w-full">
          <BreadcrumbNavigation
            customCrumbs={
              isDe
                ? [
                    { name: 'Startseite', path: '/de' },
                    { name: 'Kundenbewertungen', path: null },
                  ]
                : [
                    { name: 'Ana Sayfa', path: '/' },
                    { name: 'Müşteri Yorumları', path: null },
                  ]
            }
          />
        </div>

        <header className="mb-10 max-w-4xl mx-auto w-full">
          <p className="flex items-center gap-2 text-primary text-sm font-medium uppercase tracking-wide mb-3">
            <MessageSquare className="w-5 h-5" aria-hidden />
            {copy.breadcrumbHere}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{copy.h1}</h1>
          <p className="text-slate-400 leading-relaxed text-base md:text-lg">{copy.intro}</p>
        </header>

        <div
          id="musteriler-ne-dusunuyor"
          className="mb-10 w-full scroll-mt-28 md:scroll-mt-32"
        >
          <FeaturedReviewsCarousel locale={locale} />
        </div>

        <section className="mb-16 rounded-2xl border border-slate-800 bg-[#0a0a0a]/50 p-6 md:p-10 max-w-4xl mx-auto w-full" aria-labelledby="review-form-h2">
          <h2 id="review-form-h2" className="text-2xl font-bold text-white mb-8">
            {copy.formH2}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="absolute -left-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
              <label htmlFor="reviews-hp">Website</label>
              <input
                id="reviews-hp"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" aria-hidden />
                {copy.pkgH3}
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="rev-sub" className="text-slate-400">
                    {copy.subLabel} *
                  </Label>
                  <Input
                    id="rev-sub"
                    type="number"
                    inputMode="numeric"
                    min={MIN_SUB_M}
                    max={MAX_SUB_M}
                    value={subscriptionMonths}
                    onChange={(e) => setSubscriptionMonths(e.target.value)}
                    required
                    className="mt-2 bg-[#0a0a0a] border-slate-700 text-white"
                    placeholder="12"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">{copy.subHelp}</p>
                </div>
                <div>
                  <Label htmlFor="rev-use" className="text-slate-400">
                    {copy.useLabel} *
                  </Label>
                  <Input
                    id="rev-use"
                    type="number"
                    inputMode="numeric"
                    min={MIN_USE_M}
                    max={MAX_USE_M}
                    value={customerSinceMonths}
                    onChange={(e) => setCustomerSinceMonths(e.target.value)}
                    required
                    className="mt-2 bg-[#0a0a0a] border-slate-700 text-white"
                    placeholder="6"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">{copy.useHelp}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" aria-hidden />
                {copy.ratingH3}
              </h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="rev-name" className="text-slate-400">
                    {copy.name} *
                  </Label>
                  <Input
                    id="rev-name"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder={copy.namePh}
                    maxLength={80}
                    required
                    className="mt-2 bg-[#0a0a0a] border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="rev-email" className="text-slate-400">
                    {copy.emailLabel}
                  </Label>
                  <Input
                    id="rev-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={optionalEmail}
                    onChange={(e) => setOptionalEmail(e.target.value)}
                    placeholder={copy.emailPh}
                    maxLength={254}
                    className="mt-2 bg-[#0a0a0a] border-slate-700 text-white"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">{copy.emailHelp}</p>
                </div>
                <div>
                  <span className="block text-sm text-slate-400 mb-2">{copy.rating} *</span>
                  <StarPicker value={rating} onChange={setRating} disabled={submitting} labels={copy} />
                </div>
                <div>
                  <Label htmlFor="rev-body" className="text-slate-400">
                    {copy.body} * ({trimmedBodyLen(body)}/{MAX_BODY})
                  </Label>
                  <Textarea
                    id="rev-body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder={copy.bodyPh}
                    maxLength={MAX_BODY}
                    rows={6}
                    required
                    className="mt-2 bg-[#0a0a0a] border-slate-700 text-white resize-y min-h-[140px]"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer text-sm text-slate-300">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 rounded border-slate-600"
              />
              <span>
                {copy.consentBefore}
                <Link to={copy.privacyPath} className="text-primary hover:underline">
                  {copy.consentLink}
                </Link>
                {copy.consentAfter}
              </span>
            </label>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto bg-primary hover:bg-primary text-white"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {copy.submitting}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {copy.submit}
                </>
              )}
            </Button>
          </form>
        </section>

        <section className="mb-16 w-full" aria-labelledby="reviews-list-h2">
          <h2 id="reviews-list-h2" className="text-2xl font-bold text-white mb-6 max-w-4xl mx-auto md:mx-0">
            {copy.listH2}
          </h2>
          {loadingList ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-slate-500 py-8 text-center border border-dashed border-slate-800 rounded-xl max-w-4xl mx-auto">{copy.empty}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {reviews.map((r, index) => {
                const accent = getReviewAccent(index);
                return (
                  <motion.article
                    key={r.id}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-48px' }}
                    transition={{ duration: 0.45, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex flex-col h-full rounded-2xl border border-white/10 overflow-hidden transition-[box-shadow] duration-300 hover:shadow-[var(--accent-glow)]"
                    style={{
                      borderLeft: `3px solid ${accent.solid}`,
                      background: `linear-gradient(118deg, rgba(${accent.rgb}, 0.05) 0%, transparent 52%), #09090b`,
                      ['--accent-glow']: `0 14px 40px rgba(${accent.rgb}, 0.35)`,
                    }}
                  >
                    <span
                      className="absolute top-2 left-2 leading-none pointer-events-none select-none font-serif font-bold"
                      style={{ fontSize: '4rem', color: accent.solid, opacity: 0.3 }}
                      aria-hidden
                    >
                      &ldquo;
                    </span>
                    <div className="relative z-10 p-6 flex flex-col flex-1 min-h-0">
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold bg-[#0a0a0a]/90 text-slate-100 shrink-0"
                          style={{ boxShadow: `0 0 0 2px ${accent.solid}, 0 0 16px rgba(${accent.rgb}, 0.35)` }}
                        >
                          {reviewerInitials(r.author_display_name)}
                        </div>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <h3 className="text-lg font-semibold mb-1" style={{ color: accent.solid }} id={`review-author-${r.id}`}>
                            {r.author_display_name}
                          </h3>
                          <span
                            className="inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full mb-2"
                            style={{
                              color: accent.solid,
                              backgroundColor: `rgba(${accent.rgb}, 0.14)`,
                              border: `1px solid rgba(${accent.rgb}, 0.35)`,
                            }}
                          >
                            {copy.verifiedBadge}
                          </span>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <time dateTime={(r.moderated_at || r.created_at || '').split('T')[0]}>
                              {(r.moderated_at || r.created_at || '').split('T')[0]}
                            </time>
                            {r.subscription_months != null && r.customer_since_months != null && (
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3 h-3 shrink-0" aria-hidden />
                                {copy.pkgMeta(r.subscription_months, r.customer_since_months)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 mb-4" aria-label={`${r.rating} / 5`}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < r.rating ? 'fill-current' : 'text-slate-600'}`}
                            style={
                              i < r.rating
                                ? {
                                    color: accent.solid,
                                    filter: `drop-shadow(0 0 6px rgba(${accent.rgb}, 0.85))`,
                                  }
                                : undefined
                            }
                          />
                        ))}
                      </div>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm flex-1">{r.body}</p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </section>

        <div className="max-w-4xl mx-auto w-full">
        <section className="mb-16 border-t border-slate-800 pt-12" aria-labelledby="info-h2">
          <h2 id="info-h2" className="text-2xl font-bold text-white mb-4">
            {copy.infoH2}
          </h2>
          <p className="text-slate-400 leading-relaxed mb-8">{copy.infoLead}</p>
          <h3 className="text-xl font-semibold text-white mb-2">{copy.infoH3Moderation}</h3>
          <p className="text-slate-400 leading-relaxed mb-6">{copy.infoPM}</p>
          <h3 className="text-xl font-semibold text-white mb-2">{copy.infoH3Google}</h3>
          <p className="text-slate-400 leading-relaxed mb-6">{copy.infoG}</p>
          <h4 className="text-base font-semibold text-white mb-2">{copy.infoH4NoIncentive}</h4>
          <p className="text-slate-400 leading-relaxed">{copy.infoNI}</p>
        </section>

        <section className="mb-16 border-t border-slate-800 pt-12" aria-labelledby="faq-h2">
          <h2 id="faq-h2" className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-primary" aria-hidden />
            {copy.faqH2}
          </h2>
          <div className="space-y-8">
            {copy.faq.map((item, idx) => (
              <div key={idx}>
                <h3 className="text-lg font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="rounded-2xl border border-primary/30 bg-gradient-to-br from-[#e50914]/40 to-[#141414]/80 p-8 md:p-10"
          aria-labelledby="cta-h2"
        >
          <h2 id="cta-h2" className="text-2xl font-bold text-white mb-3">
            {copy.ctaH2}
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl">{copy.ctaLead}</p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-10">
            <Button asChild className="bg-primary hover:bg-primary text-white">
              <Link to={copy.packagesPath}>
                {copy.ctaPackages} <ArrowRight className="w-4 h-4 ml-2 inline" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-600 text-white hover:bg-[#0a0a0a]">
              <Link to={copy.testPath}>{copy.ctaTest}</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-600 text-white hover:bg-[#0a0a0a]">
              <Link to={copy.channelsPath}>{copy.ctaChannels}</Link>
            </Button>
          </div>
          <h4 className="text-base font-semibold text-white mb-3">{copy.ctaH4More}</h4>
          <ul className="flex flex-wrap gap-4 text-sm">
            <li>
              <Link to={copy.setupPath} className="text-primary hover:text-white underline underline-offset-2">
                {copy.ctaSetup}
              </Link>
            </li>
            <li>
              <Link to={copy.faqPath} className="text-primary hover:text-white underline underline-offset-2">
                {copy.ctaFaq}
              </Link>
            </li>
          </ul>
        </section>
        </div>
      </main>

      <FooterC contactData={siteData?.contactData} siteData={siteData} />
    </div>
  );
};

function trimmedBodyLen(s) {
  return (s || '').trim().length;
}

export default ReviewsPage;
