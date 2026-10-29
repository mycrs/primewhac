/**
 * Gemini API ile maç bazlı AI içerik üretimi.
 * GEMINI_API_KEY .env dosyasında tanımlı olmalı.
 */
import { GoogleGenAI } from '@google/genai';

const PROMPT = `Sen bir futbol maçı analisti ve içerik editörüsün.

Aşağıdaki maç bilgilerine göre, sanki 5-6 farklı spor haber sitesi, istatistik sayfası ve yorum köşesinden bilgileri okuyup
hepsini kendi cümlelerinle birleştiriyormuşsun gibi, detaylı ve özgün bir maç önizleme yaz.

KURALLAR:
- Sadece Türkçe yaz.
- Metni paragraflara böl (her paragraf 3-6 cümle).
- Metnin %80-90'ı futbol içeriği olsun: form durumu, oyun tarzı, taktik, oyuncu rolleri, psikolojik faktörler, fikstür yoğunluğu vb.
- QruzeTV IPTV'den en fazla 1-2 kez, çok doğal ve kısa şekilde bahset (maçın nereden izlenebileceği bağlamında). Reklam metni gibi yazma.
- Takımlar, lig, tarih ve gün bilgilerini mutlaka kullan.
- Derbi ise (Galatasaray-Fenerbahçe, Real-Barcelona vb.) rekabet tarihini ve atmosferi vurgula.
- Güncel veriye doğrudan erişimin olmadığını unutma; "son haftalarda", "bu sezon genel olarak", "kağıt üzerinde" gibi ihtiyatlı ifadeler kullan.
- Konuşma diliyle, ama profesyonel bir spor yazarı gibi yaz; abartılı sloganlar ve büyük harf kullanma.
- Kelime sayısı 1200-1500 arasında olsun.

MAÇ BİLGİLERİ:
- Ev sahibi: {{home}}
- Deplasman: {{away}}
- Lig: {{league}}
- Tarih: {{date}}
- Saat: {{time}}
- Gün: {{dayName}}
- Derbi mi: {{isDerbi}}

Yanıtı SADECE düz metin olarak ver. Başlık, markdown, liste ya da ek açıklama ekleme. Paragraflar arasında birer boş satır bırak.`;

const PROMPT_DE = `Du bist ein Fußball-Analyst und Redakteur.

Schreibe basierend auf den folgenden Spielinformationen einen detaillierten und einzigartigen Spielvorschau-Text, als hättest du 5-6 verschiedene Sportnachrichtenseiten, Statistikseiten und Kommentarspalten gelesen und alles in deinen eigenen Worten zusammengeführt.

REGELN:
- Schreibe ausschließlich auf Deutsch.
- Teile den Text in Absätze (jeweils 3-6 Sätze).
- 80-90% des Textes sollen Fußballinhalt sein: Form, Spielweise, Taktik, Spielerrollen, psychologische Faktoren, Spielplanintensität usw.
- Erwähne QruzeTV IPTV höchstens 1-2 Mal, natürlich und kurz (im Kontext, wo das Spiel gesehen werden kann). Keine Werbetexte.
- Nutze unbedingt Mannschaften, Liga, Datum und Tag.
- Bei einem Derby (Galatasaray-Fenerbahçe, Real-Barcelona usw.) betone die Rivalitätsgeschichte und Atmosphäre.
- Du hast keinen direkten Zugang zu aktuellen Daten; verwende vorsichtige Formulierungen wie "in den letzten Wochen", "in dieser Saison allgemein", "auf dem Papier".
- Schreibe in Umgangssprache, aber wie ein professioneller Sportjournalist; keine übertriebenen Slogans oder Großschreibung.
- Wortanzahl zwischen 1200 und 1500.

SPIELINFORMATIONEN:
- Heimmannschaft: {{home}}
- Auswärtsmannschaft: {{away}}
- Liga: {{league}}
- Datum: {{date}}
- Uhrzeit: {{time}}
- Wochentag: {{dayName}}
- Derby: {{isDerbi}}

Antworte NUR mit Fließtext. Keine Überschriften, kein Markdown, keine Listen oder zusätzlichen Erklärungen. Zwischen Absätzen eine Leerzeile.`;

const GUNLER_DE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

const DERBI_TAKIMLAR = [
  ['galatasaray', 'fenerbahce'], ['galatasaray', 'besiktas'], ['fenerbahce', 'besiktas'],
  ['trabzonspor', 'galatasaray'], ['trabzonspor', 'fenerbahce'],
  ['real madrid', 'barcelona'], ['barcelona', 'real madrid'],
  ['liverpool', 'man utd'], ['man utd', 'man city'],
  ['bayern', 'dortmund'], ['b-dortmund', 'bayern'],
  ['inter', 'ac milan'], ['ac milan', 'inter'],
  ['arsenal', 'chelsea'], ['spurs', 'arsenal'],
];

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, '-');
}

/** Client ile uyumlu slug: takim-a-vs-takim-b-2025-03-15 */
export function makeMatchSlug(home, away, date) {
  const h = slugify(home);
  const a = slugify(away);
  const d = (date || '').replace(/-/g, '-');
  return `${h}-vs-${a}-${d}`;
}

function isDerbi(home, away) {
  const h = slugify(home).replace(/-/g, ' ');
  const a = slugify(away).replace(/-/g, ' ');
  return DERBI_TAKIMLAR.some(([x, y]) =>
    (h.includes(x) || x.includes(h)) && (a.includes(y) || y.includes(a))
  );
}

const GUNLER = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

export async function generateMatchContentWithAI(match) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key') {
    throw new Error('GEMINI_API_KEY tanımlı değil');
  }

  const { home, away, league, date, time } = match;
  const leagueName = league?.name || 'Lig';
  const [y, m, d] = (date || '').split('-').map(Number);
  const dayName = (y && m && d) ? GUNLER[new Date(y, m - 1, d).getDay()] : 'Bu hafta';
  const derbi = isDerbi(home, away);

  const prompt = PROMPT
    .replace(/\{\{home\}\}/g, home || '')
    .replace(/\{\{away\}\}/g, away || '')
    .replace(/\{\{league\}\}/g, leagueName)
    .replace(/\{\{date\}\}/g, date || '')
    .replace(/\{\{time\}\}/g, time || '20:00')
    .replace(/\{\{dayName\}\}/g, dayName)
    .replace(/\{\{isDerbi\}\}/g, derbi ? 'Evet' : 'Hayır');

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      maxOutputTokens: 4096,
      temperature: 0.7,
    },
  });

  const text = response?.text ?? response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  if (!text) {
    throw new Error('Gemini yanıt üretemedi');
  }

  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const fullText = paragraphs.join(' ');
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;

  return { paragraphs, isDerbi: derbi, wordCount };
}

/** Almanca maç içeriği – Gemini ile */
export async function generateMatchContentWithAI_DE(match) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key') {
    throw new Error('GEMINI_API_KEY tanımlı değil');
  }

  const { home, away, league, date, time } = match;
  const leagueName = league?.name || 'Liga';
  const [y, m, d] = (date || '').split('-').map(Number);
  const dayName = (y && m && d) ? GUNLER_DE[new Date(y, m - 1, d).getDay()] : 'Diese Woche';
  const derbi = isDerbi(home, away);

  const prompt = PROMPT_DE
    .replace(/\{\{home\}\}/g, home || '')
    .replace(/\{\{away\}\}/g, away || '')
    .replace(/\{\{league\}\}/g, leagueName)
    .replace(/\{\{date\}\}/g, date || '')
    .replace(/\{\{time\}\}/g, time || '20:00')
    .replace(/\{\{dayName\}\}/g, dayName)
    .replace(/\{\{isDerbi\}\}/g, derbi ? 'Ja' : 'Nein');

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      maxOutputTokens: 4096,
      temperature: 0.7,
    },
  });

  const text = response?.text ?? response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  if (!text) {
    throw new Error('Gemini yanıt üretemedi');
  }

  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const fullText = paragraphs.join(' ');
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;

  return { paragraphs, isDerbi: derbi, wordCount };
}
