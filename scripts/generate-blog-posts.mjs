/**
 * Blog otomasyonu — Gemini ile TR/DE blog yazısı üretir ve Supabase'e kaydeder.
 *
 * Kullanım:
 *   node scripts/generate-blog-posts.mjs                 # config'deki POSTS_PER_RUN kadar üret
 *   node scripts/generate-blog-posts.mjs --count 2     # 2 yazı üret
 *   node scripts/generate-blog-posts.mjs --category "Spor Gündemi"        # sadece spor konuları
 *   node scripts/generate-blog-posts.mjs --category "Teknoloji Gündemi"   # sadece teknoloji konuları
 *   node scripts/generate-blog-posts.mjs --topic iptv-nedir-nasil-calisir # tek konu
 *   node scripts/generate-blog-posts.mjs --draft       # published_at olmadan taslak kaydet
 *   node scripts/generate-blog-posts.mjs --no-de         # Almanca çeviri üretme
 *   node scripts/generate-blog-posts.mjs --list        # konu kuyruğunu listele
 *
 * Gereksinim: .env dosyasında GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOPICS, POSTS_PER_RUN, BLOG_AUTHOR } from './blog-topics.config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COVER_SCRIPT = path.join(__dirname, 'generate-blog-cover.js');
const DE_TRANSLATIONS_FILE = path.resolve(__dirname, '..', 'src', 'data', 'staticBlogTranslationsDE.js');

const SITE_NAME = 'QruzeTV';
const SITE_URL = process.env.VITE_SITE_URL || 'https://cineverse.pro';
const BLOG_PATH = '/blog';
const INDEXNOW_KEY = '2e414b37f51bf23d4a0c9fd875085ece';
const INDEXNOW_HOST = 'cineverse.pro';

// ---------- argümanlar ----------
function parseArgs() {
  const args = process.argv.slice(2);
  const get = (name, dflt) => {
    const i = args.indexOf(name);
    return i !== -1 && args[i + 1] ? args[i + 1] : dflt;
  };
  return {
    count: Number(get('--count', POSTS_PER_RUN)) || POSTS_PER_RUN,
    topic: get('--topic', null),
    category: get('--category', null),
    translate: get('--translate', null),
    draft: args.includes('--draft'),
    noDe: args.includes('--no-de'),
    list: args.includes('--list'),
  };
}

// ---------- Gemini ----------
function buildTrPrompt(topic) {
  let categoryGuidance = '';
  if (topic.category === 'Spor Gündemi') {
    categoryGuidance = `
- KATEGORİ ÖZEL TALİMATI (SPOR GÜNDEMİ): Yazı spor müsabakaları, canlı maçlar, derbiler ve stadyum atmosferi üzerine pratik bir rehber olmalıdır. Canlı yayınlarda gecikmeyi (latency) düşürme, yüksek hareket akıcılığı (MEMC) için ekran ayarları, maç saatinde internet bant genişliği optimizasyonu ve evde stadyum ses deneyimi gibi faydalı rehber bilgiler sun. KESİNLİKLE hiçbir resmi lig, kulüp, oyuncu, spiker, yayıncı kuruluş (beIN, Exxen, S Sport vb.) veya TV kanalı adı geçirme. Tüm anlatımlar "derbi heyecanı", "haftanın büyük karşılaşması", "kritik kupa maçı", "evde stadyum atmosferi" gibi jenerik olsun. Asla korsan yayın linki veya illegal çağrışım yapma.`;
  } else if (topic.category === 'Teknoloji Gündemi' || topic.category === 'Teknoloji') {
    categoryGuidance = `
- KATEGORİ ÖZEL TALİMATI (TEKNOLOJİ GÜNDEMİ): Yazı akıllı televizyonlar, TV box donanımları, görüntü kodekleri (HEVC, AV1), ev interneti (Wi-Fi 6, 5GHz, fiber altyapı, ping) ve ekran teknolojileri üzerine uzman, güncel ve teknik bir inceleme olmalıdır. Okuyucuya karmaşık terimleri anlaşılır şekilde açıkla, pratik donanım ve ayar tavsiyeleri ver.`;
  }

  return `Sen ${SITE_NAME} adlı IPTV hizmetinin deneyimli bir SEO içerik yazarısın. Türkiye'de ve Almanya'da yaşayan Türkçe konuşan kitleye yazıyorsun.

GÖREV: "${topic.keyword}" anahtar kelimesini hedefleyen, Google'da üst sıralara oynamak üzere optimize edilmiş bir blog yazısı üret. Site: ${SITE_URL}

YAZI PLANI:
- Başlık (title): ${topic.titleHint ? `İpucu: ${topic.titleHint}` : 'Konuya uygun, tıklama oranı yüksek bir başlık öner'} (en fazla 65 karakter)
- Özet (excerpt): 150-200 karakter, meta açıklama gibi davetkar
- SEO başlığı (seo_title): 55-60 karakter
- SEO açıklaması (seo_description): 150-160 karakter, anahtar kelimeyi içersin
- İçerik (content_html): 1200-1800 kelime, aşağıdaki kurallarla
${categoryGuidance}

İÇERİK (content_html) KURALLARI:
- SADECE geçerli HTML üret: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <a> etiketleri kullanılabilir. Markdown kullanma.
- <h1> KULLANMA; makale doğrudan giriş paragrafıyla başlasın, ardından <h2> bölümleri gelsin. (Sayfa başlığı zaten tek H1 olarak basılıyor.)
- <img> veya başka hiçbir görsel etiketi/URL'si EKLEME; görselleri kapsayan tamamen özgün bir şabondan ayrıca üretiyoruz.
- TELİF GÜVENLİĞİ (KESİN KURAL): Film, dizi, belgesel, program, maç, lig, kulüp, oyuncu, spiker, TV kanalı veya yayın platformu adı ASLA geçirme. Tüm örnekler jenerik olsun ("popüler bir dizi keyfi", "bir derbi atmosferi", "belgesel sevenler"). Gerçek uygulama/ekran görüntüsü/platform logosundan bahsetme.
- Yazı tamamen özgün olmalı; hiçbir kaynaktan kopya, çeviri parçası veya alıntı içermemeli.
- En az 4 <h2> bölümü, gerektiğinde <h3> alt bölümleri olsun. Bölümler arasında <p> paragrafları akıcı olsun.
- Makalenin sonunda "Sıkça Sorulan Sorular" adlı bir <h2> bölümü olsun; içinde 4 soru-cevap (<h3> soru + <p> cevap) bulunsun.
- ${SITE_NAME} markasından makale boyunca en fazla 2 kez, doğal şekilde bahset; şu bağlantıyı kullan: <a href="/paketler">. Reklam dili kullanma, önce bilgi ver.
- Gerçek dışı garantiler verme ("%100 donmaz" gibi). Şeffaf ve uzman bir üslup kullan.
- Anahtar kelime ve yakın varyasyonları başlıkta, ilk paragrafta ve en az bir <h2>'de geçsin.

YANIT FORMATI:
Yalnızca aşağıdaki JSON şemasında, kod bloğu olmadan, tek bir JSON nesnesi döndür:
{
  "title": "...",
  "excerpt": "...",
  "seo_title": "...",
  "seo_description": "...",
  "content_html": "<p>...</p><h2>...</h2>..."
}`;
}

function buildDePrompt(topic, tr) {
  return `Du bist ein SEO-Redakteur für ${SITE_NAME}, einen IPTV-Anbieter mit türkischem und deutschem Publikum.

GÖREV: Übersetze und lokalisiere den folgenden türkischen Blog-Artikel vollständig ins Deutsche. Es handelt sich um das Ziel-Keyword "${topic.keyword}".

REGELN:
- Schreibe AUSSCHLIESSLICH auf Deutsch. Mische kein Türkisch und keine anderen Sprachen ein — auch keine einzelnen türkischen Sätze oder Phrasen. Prüfe jede Zeile.
- Vollständige, natürliche und idiomatische deutsche Übersetzung (nicht wörtlich, nicht Maschinendeutsch). Fachbegriffe (IPTV, Smart TV, 4K/UHD, M3U) bleiben wie im Deutschen üblich.
- Behalte die gesamte HTML-Struktur exakt bei: dieselben <h2>/<h3>-Abschnitte, dieselbe Anzahl von <p>, <ul>, <li> und <a href="/paketler">-Elementen. Keine <img>- oder anderen Bild-Tags hinzufügen.
- URHEBERRECHT (STRENGE REGEL): Verwende KEINE Namen von Filmen, Serien, Sendungen, Spielen, Ligen, Vereinen, Spielern, TV-Kanälen oder Streaming-Plattformen. Alle Beispiele bleiben generisch. Keine App-Namen, Screenshots oder Plattform-Logos.
- Der Text muss vollständig eigenständig sein: keine Kopien, Übersetzungsteile oder Zitate aus anderen Quellen.
- Lokalisierung: Wenn der Text auf türkische Adressaten zugeschnitten ist, formuliere für deutschsprachige Nutzer (v. a. in Deutschland, Österreich, Schweiz, Niederlande).
- Markenname ${SITE_NAME} bleibt unverändert.
- Übersetze außerdem Titel, Exzerpt, SEO-Titel und SEO-Beschreibung (deutsche Zeichenlimits einhalten).

TÜRKISCHER ARTIKEL:
Başlık: ${tr.title}
Özet: ${tr.excerpt}
SEO: ${tr.seo_title} / ${tr.seo_description}
İçerik: ${tr.content_html}

YANIT FORMATI:
Nur ein JSON-Objekt, ohne Code-Block:
{
  "title_de": "...",
  "excerpt_de": "...",
  "seo_title_de": "...",
  "seo_description_de": "...",
  "content_de": "<p>...</p><h2>...</h2>..."
}`;
}

function extractJson(text) {
  if (!text) throw new Error('Boş yanıt');
  if (typeof text === 'object') return text; // SDK bazen doğrudan nesne döndürür
  const cleaned = text.replace(/```(?:json)?/gi, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`JSON eksik/kesilmiş (yanıt ${cleaned.length} karakter): "...${cleaned.slice(-160)}"`);
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

const TR_ARTICLE_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    excerpt: { type: 'string' },
    seo_title: { type: 'string' },
    seo_description: { type: 'string' },
    content_html: { type: 'string' },
  },
  required: ['title', 'excerpt', 'seo_title', 'seo_description', 'content_html'],
};

const DE_ARTICLE_SCHEMA = {
  type: 'object',
  properties: {
    title_de: { type: 'string' },
    excerpt_de: { type: 'string' },
    seo_title_de: { type: 'string' },
    seo_description_de: { type: 'string' },
    content_de: { type: 'string' },
  },
  required: ['title_de', 'excerpt_de', 'seo_title_de', 'seo_description_de', 'content_de'],
};

async function callGemini(ai, prompt, schema, maxTokens = 16384, temperature = 0.7) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      maxOutputTokens: maxTokens,
      temperature,
      responseMimeType: 'application/json',
      responseJsonSchema: schema,
    },
  });
  const text = response?.text ?? response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  if (!text) throw new Error('Gemini yanıt üretemedi');
  return text;
}

async function generateWithRetry(ai, prompt, schema, label, keys) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const raw = await callGemini(ai, prompt, schema);
      const data = extractJson(raw);
      validateArticle(data, label, keys);
      return data;
    } catch (err) {
      lastErr = err;
      const wait = attempt * 5000;
      console.warn(`  ⚠️  ${label} denemesi ${attempt}/3 başarısız: ${err.message} — ${wait / 1000}s bekleniyor`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

function validateArticle(a, label, keys = ['title', 'excerpt', 'seo_title', 'seo_description', 'content_html']) {
  const contentK = keys[keys.length - 1];
  for (const k of keys) {
    if (!a[k] || typeof a[k] !== 'string' || !a[k].trim()) throw new Error(`${label}: eksik alan "${k}"`);
  }
  if (!/<h2/.test(a[contentK])) throw new Error(`${label}: içerikte <h2> yok`);
  if (/<h1/.test(a[contentK])) throw new Error(`${label}: içerikte <h1> olmamalı`);
  if (/<img|image\.tmdb\.org|flagcdn\.com/i.test(a[contentK])) throw new Error(`${label}: içerikte görsel/img etiketi olmamalı (telif riski)`);
  if (keys[0] === 'title_de') {
    const leak = a[contentK].match(/\biçin\b|\bolarak\b|\bbirçok\b|\bkullanıcı\b|\bsayesinde\b|\bve bunun\b/i);
    if (leak) throw new Error(`${label}: Türkçe sızıntısı tespit edildi ("${leak[0]}")`);
  }
  const words = a[contentK].replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  if (words < 600) throw new Error(`${label}: içerik çok kısa (${words} kelime)`);
}

// ---------- DE çeviri dosyası (staticBlogTranslationsDE.js) ----------
function deEntryToJs(slug, de) {
  const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const escTpl = (s) => String(s).replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  return [
    `  '${esc(slug)}': {`,
    `    title_de: '${esc(de.title_de.trim())}',`,
    `    seo_title_de: '${esc((de.seo_title_de || '').trim())}',`,
    `    seo_description_de: '${esc((de.seo_description_de || '').trim())}',`,
    `    excerpt_de: '${esc((de.excerpt_de || '').trim())}',`,
    `    content_de: \`<article class="prose prose-invert max-w-none">${escTpl(de.content_de.trim())}</article>\`,`,
    `  },`,
  ].join('\n');
}

function appendDeTranslation(slug, de) {
  let src = readFileSync(DE_TRANSLATIONS_FILE, 'utf8');
  if (src.includes(`'${slug}'`)) throw new Error(`${slug} için DE çevirisi dosyada zaten mevcut`);
  const marker = '\n};';
  const idx = src.lastIndexOf(marker);
  if (idx === -1) throw new Error('staticBlogTranslationsDE.js dosya sonu (};) bulunamadı');
  // Sondaki girişin virgülü yoksa ekle (son girişte virgül olmak zorunda değildi)
  let before = src.slice(0, idx);
  if (!before.trimEnd().endsWith(',')) before = before.trimEnd() + ',';
  src = before + '\n' + deEntryToJs(slug, de) + '\n' + src.slice(idx);
  writeFileSync(DE_TRANSLATIONS_FILE, src, 'utf8');
}

// ---------- kapak görseli ----------
function runCoverGenerator(slug, title, category) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [COVER_SCRIPT, slug, title, category || ''], { cwd: path.resolve(__dirname, '..') });
    let stderr = '';
    child.stderr.on('data', (d) => { stderr += d.toString(); });
    child.on('error', (err) => reject(new Error(`kapak betiği başlatılamadı: ${err.message}`)));
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr.trim() || `kapak betiği çıkış kodu ${code}`));
    });
  });
}

// ---------- IndexNow ----------
async function pingIndexNow(paths) {
  const urlList = paths.map((p) => `https://${INDEXNOW_HOST}${p}`);
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: INDEXNOW_HOST, key: INDEXNOW_KEY, keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`, urlList }),
    });
    console.log(`  📡 IndexNow: ${res.status} (${urlList.join(', ')})`);
  } catch (err) {
    console.warn(`  ⚠️  IndexNow ping başarısız (yoksayıldı): ${err.message}`);
  }
}

// ---------- ana akış ----------
async function main() {
  const opts = parseArgs();

  console.log(`\n📝 ${SITE_NAME} blog otomasyonu`);

  if (opts.list) {
    console.log('\nKonu kuyruğu:');
    TOPICS.forEach((t, i) => console.log(`  ${i + 1}. [${t.category}] ${t.slug} — ${t.keyword}${t.translateDe ? ' (+DE)' : ''}`));
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key') {
    console.error('\n❌ GEMINI_API_KEY .env dosyasında tanımlı değil.');
    console.error('   https://aistudio.google.com/apikey adresinden ücretsiz anahtar alıp .env dosyasına ekleyin.');
    process.exit(1);
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error('\n❌ SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY .env dosyasında tanımlı değil.');
    process.exit(1);
  }
  const supabase = createClient(supabaseUrl, serviceKey);

  // Mevcut slug'ları çek
  const { data: existing, error: slugErr } = await supabase.from('blog_posts').select('slug');
  if (slugErr) {
    console.error(`\n❌ blog_posts sluğları okunamadı: ${slugErr.message}`);
    process.exit(1);
  }
  const existingSlugs = new Set((existing || []).map((r) => r.slug));

  // Yalnızca DE çevirisi eksik olan yazıyı çevir (örn. aylık koşuda DE başarısız olursa)
  if (opts.translate) {
    const { data: row, error: rowErr } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, seo_title, seo_description, content')
      .eq('slug', opts.translate)
      .maybeSingle();
    if (rowErr || !row) {
      console.error(`\n❌ Yazı bulunamadı: ${opts.translate}${rowErr ? ` (${rowErr.message})` : ''}`);
      process.exit(1);
    }
    const ai0 = new GoogleGenAI({ apiKey });
    console.log(`\n▶ ${row.slug} için DE çevirisi üretiliyor...`);
    const de = await generateWithRetry(
      ai0,
      buildDePrompt({ keyword: row.title }, { title: row.title, excerpt: row.excerpt, seo_title: row.seo_title, seo_description: row.seo_description, content_html: row.content }),
      DE_ARTICLE_SCHEMA,
      'DE çeviri',
      ['title_de', 'excerpt_de', 'seo_title_de', 'seo_description_de', 'content_de'],
    );
    try {
      appendDeTranslation(row.slug, de);
    } catch (err) {
      console.error(`\n❌ DE çevirisi dosyaya yazılamadı: ${err.message}`);
      process.exit(1);
    }
    console.log(`  ✅ DE çevirisi eklendi: ${row.slug}`);
    console.log('  ⚠️  DE çevirisi build + deploy sonrası yayına alınır (staticBlogTranslationsDE.js).');
    return;
  }

  // Yazılacak konuları seç
  let queue = TOPICS.filter((t) => !existingSlugs.has(t.slug));
  if (opts.topic) {
    queue = queue.filter((t) => t.slug === opts.topic);
    if (!queue.length) {
      console.error(`\n❌ Konu bulunamadı veya zaten yayınlanmış: ${opts.topic}`);
      process.exit(1);
    }
  }
  if (opts.category) {
    queue = queue.filter((t) => t.category && t.category.toLowerCase().includes(opts.category.toLowerCase()));
    if (!queue.length) {
      console.error(`\n❌ Bu kategoride bekleyen konu bulunamadı: ${opts.category}`);
      process.exit(1);
    }
  }
  queue = queue.slice(0, Math.max(1, opts.count));

  if (!queue.length) {
    console.log('\n✅ Kuyrukta yazılacak yeni konu kalmadı. scripts/blog-topics.config.mjs dosyasına yeni konu ekleyin.');
    return;
  }

  console.log(`\nBu çalıştırmada ${queue.length} yazı üretilecek:${opts.draft ? ' (TASLAK modu)' : ''}${opts.noDe ? '' : ' (TR + DE)'}\n`);
  queue.forEach((t) => console.log(`  • ${t.slug} — ${t.keyword}`));

  const ai = new GoogleGenAI({ apiKey });
  const publishedPaths = [];

  for (const topic of queue) {
    console.log(`\n▶ ${topic.slug} üretiliyor...`);
    const tr = await generateWithRetry(ai, buildTrPrompt(topic), TR_ARTICLE_SCHEMA, 'TR içerik');

    let de = null;
    if (topic.translateDe && !opts.noDe) {
      try {
        de = await generateWithRetry(ai, buildDePrompt(topic, tr), DE_ARTICLE_SCHEMA, 'DE çeviri', ['title_de', 'excerpt_de', 'seo_title_de', 'seo_description_de', 'content_de']);
      } catch (err) {
        console.warn(`  ⚠️  DE çeviri başarısız, TR ile devam ediliyor: ${err.message}`);
      }
    }

    const payload = {
      title: tr.title.trim(),
      slug: topic.slug,
      excerpt: tr.excerpt.trim(),
      content: tr.content_html.trim(),
      cover_image_url: '',
      category: topic.category,
      tags: topic.tags,
      author: BLOG_AUTHOR.author,
      author_bio: BLOG_AUTHOR.author_bio,
      author_image: '',
      seo_title: tr.seo_title.trim(),
      seo_description: tr.seo_description.trim(),
      // published_at null: tablo varsayılanı now() olabilir, taslak modunda açıkça boşalt
      ...(opts.draft ? { published_at: null } : { published_at: new Date().toISOString() }),
    };

    const { error: insertErr } = await supabase.from('blog_posts').insert([payload]);

    if (insertErr) {
      console.error(`  ❌ Kayıt hatası (${topic.slug}): ${insertErr.message}`);
      continue;
    }

    // Almanca çeviri: veritabanında DE sütunu yok; DE içerik staticBlogTranslationsDE.js
    // dosyasından besleniyor. Çeviriyi dosyaya ekle (build + deploy ile yayına girer).
    if (de) {
      try {
        appendDeTranslation(topic.slug, de);
        console.log(`  🇩🇪 DE çevirisi dosyaya eklendi (deploy ile yayına alınır)`);
      } catch (err) {
        console.warn(`  ⚠️  DE çevirisi dosyaya yazılamadı (TR yayında): ${err.message}`);
        console.warn(`      Sonradan: node scripts/generate-blog-posts.mjs --translate ${topic.slug}`);
      }
    }

    // Telif güvenli markalı kapak üret (özgün şablon + logo, hiçbir hazır görsel yok)
    let coverUrl = `https://${INDEXNOW_HOST}/blog-covers/${topic.slug}.jpg`;
    try {
      await runCoverGenerator(topic.slug, tr.title, topic.category);
      // Supabase Storage'a yükle (anında canlıda ve CDN'de görünmesi için)
      try {
        const coverLocalPath = path.resolve(__dirname, '..', 'public', 'blog-covers', `${topic.slug}.jpg`);
        const fileBuffer = readFileSync(coverLocalPath);
        const { error: upErr } = await supabase.storage.from('welcome-images').upload(`blog-covers/${topic.slug}.jpg`, fileBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });
        if (!upErr) {
          const { data: pubData } = supabase.storage.from('welcome-images').getPublicUrl(`blog-covers/${topic.slug}.jpg`);
          if (pubData?.publicUrl) {
            coverUrl = pubData.publicUrl;
          }
        }
      } catch (stErr) {
        console.warn(`  ⚠️  Supabase Storage yükleme atlandı: ${stErr.message}`);
      }

      const { error: coverErr } = await supabase.from('blog_posts').update({ cover_image_url: coverUrl }).eq('slug', topic.slug);
      if (coverErr) console.warn(`  ⚠️  Kapak URL kaydedilemedi: ${coverErr.message}`);
      else console.log(`  🖼️  Kapak: ${coverUrl}`);
    } catch (err) {
      console.warn(`  ⚠️  Kapak üretilemedi (yazı yine de kayıtlı): ${err.message}`);
    }

    console.log(`  ✅ Kaydedildi: ${topic.slug}${opts.draft ? ' (taslak)' : ' (yayında)'}${de ? ' +DE' : ''}`);
    publishedPaths.push(`${BLOG_PATH}/${topic.slug}`);
  }

  if (!opts.draft && publishedPaths.length) {
    await pingIndexNow(publishedPaths);
  }

  console.log(`\nBitti. ${publishedPaths.length} yazı işlendi. Kalan konu sayısı: ${TOPICS.filter((t) => !existingSlugs.has(t.slug) && !queue.includes(t)).length}`);
}

main().catch((err) => {
  console.error(`\n❌ Beklenmeyen hata: ${err.message}`);
  process.exit(1);
});
