/** Paket seçim yardımcısı — admin: packagesPageContent.packageQuiz */

export const PACKAGE_QUIZ_OPTION_SCORES = {
  region: {
    tr: { tr: 2 },
    eu: { eu: 2 },
    both: { tr: 1, eu: 1 },
  },
  content: {
    vod: { standard: 2 },
    europe: { standard: 2, eu: 1 },
    national: { premium: 1, tr: 1 },
    sports: { premium: 3, tr: 1 },
  },
  priority: {
    value: { standard: 2 },
    balanced: { standard: 1, premium: 1 },
    quality: { premium: 3 },
  },
};

export const DEFAULT_PACKAGE_QUIZ = {
  enabled: true,
  buttonLabel: 'Hangi paketi almalıyım?',
  buttonLabelDe: 'Welches Paket passt zu mir?',
  dialogTitle: 'Paket Seçim Yardımcısı',
  dialogTitleDe: 'Paket-Berater',
  resultIntro:
    'Cevaplarınıza göre öneri — istediğiniz zaman Standart/Premium veya bölgeyi değiştirebilirsiniz.',
  resultIntroDe:
    'Basierend auf Ihren Antworten — Sie können die Auswahl jederzeit ändern.',
  applyButtonLabel: 'Bu paketleri göster',
  applyButtonLabelDe: 'Pakete anzeigen',
  steps: [
    {
      id: 'region',
      question: 'IPTV’yi ağırlıklı olarak nerede kullanacaksınız?',
      questionDe: 'Wo nutzen Sie IPTV hauptsächlich?',
      hint: 'Bölge, kanal listesi ve fiyatlandırmayı etkiler.',
      hintDe: 'Die Region beeinflusst Kanalpaket und Preis.',
      options: [
        { id: 'tr', label: 'Türkiye içi', labelDe: 'In der Türkei' },
        { id: 'eu', label: 'Avrupa’da (Almanya, Hollanda, İsviçre vb.)', labelDe: 'In Europa (DE, AT, CH, NL …)' },
        { id: 'both', label: 'Her ikisi / sık seyahat', labelDe: 'Beides / oft unterwegs' },
      ],
    },
    {
      id: 'content',
      question: 'İçerik olarak sizin için en önemli olan hangisi?',
      questionDe: 'Was ist Ihnen beim Inhalt am wichtigsten?',
      hint: 'Film/dizi & Avrupa içerik → Standart · Maç & ulusal yayın → Premium',
      hintDe: 'VOD & Europa-Inhalte → Standard · Sport & nationale Sender → Premium',
      options: [
        { id: 'vod', label: 'Film, dizi ve geniş VOD arşivi', labelDe: 'Filme, Serien & großes VOD-Archiv' },
        {
          id: 'europe',
          label: 'Avrupa kanalları ve uluslararası içerik',
          labelDe: 'Europäische Sender & internationale Inhalte',
        },
        { id: 'national', label: 'Ulusal kanallar, haber ve günlük yayın', labelDe: 'Nationale Sender, News & Alltag' },
        { id: 'sports', label: 'Canlı maç, spor ve stabil HD yayın', labelDe: 'Live-Sport & stabile HD-Übertragung' },
      ],
    },
    {
      id: 'priority',
      question: 'Sizin için öncelik hangisi?',
      questionDe: 'Was ist Ihre oberste Priorität?',
      hint: 'Standart mı Premium mu — son kararı netleştirir.',
      hintDe: 'Hilft bei der Wahl zwischen Standard und Premium.',
      options: [
        { id: 'value', label: 'Uygun fiyat, günlük kullanım yeterli', labelDe: 'Gutes Preis-Leistungs-Verhältnis, tägliche Nutzung' },
        { id: 'balanced', label: 'Dengeli: hem içerik hem kalite', labelDe: 'Ausgewogen: Inhalt + Qualität' },
        { id: 'quality', label: 'En stabil yayın, HD/4K ve öncelikli destek', labelDe: 'Maximale Stabilität, HD/4K & Prioritäts-Support' },
      ],
    },
  ],
  reasons: {
    standardTr: [
      'Film, dizi ve VOD odaklı kullanım profilinize uyuyor.',
      'Standart paketler günlük kullanım için uygun fiyatlı seçenekler sunar.',
    ],
    premiumTr: [
      'Ulusal yayın, canlı maç veya yüksek stabilite sizin için öncelikli.',
      'Premium paketler HD kalite ve öncelikli destek içindir.',
    ],
    regionTrTr: 'Kullanım bölgeniz Türkiye paketleriyle daha uyumlu.',
    regionEuTr: 'Kullanım bölgeniz Avrupa paketleriyle daha uyumlu.',
    standardDe: [
      'Film-, Serien- und VOD-Inhalte stehen bei Ihnen im Vordergrund.',
      'Standard-Pakete bieten ein gutes Preis-Leistungs-Verhältnis.',
    ],
    premiumDe: [
      'Live-Sport, nationale Sender oder maximale Stabilität sind wichtig.',
      'Premium-Pakete sind für HD/4K und priorisierten Support ausgelegt.',
    ],
    regionTrDe: 'Ihre Nutzung passt eher zu Türkei-Paketen.',
    regionEuDe: 'Ihre Nutzung passt eher zu Europa-Paketen.',
  },
};
