/**
 * Express API sunucusu - Gemini ile maç içeriği üretimi.
 * Geliştirme: Vite proxy ile /api/generate-match-content buraya yönlendirilir.
 * Çalıştırma: npm run dev:api (port 3001)
 * Tam geliştirme: npm run dev:all (API + Vite birlikte)
 */
import 'dotenv/config';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { generateMatchContentWithAI } from './api/generateMatchContent.js';
import { getCachedContent, saveContentToCache } from './api/matchContentCache.js';

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.json());

/** Gemini API bağlantı testi - admin panel Sistem Durumu için */
app.get('/api/health/gemini', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key') {
      return res.json({ ok: false, error: 'GEMINI_API_KEY tanımlı değil' });
    }
    const ai = new GoogleGenAI({ apiKey });
    await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Merhaba',
    });
    res.json({ ok: true });
  } catch (err) {
    res.json({ ok: false, error: err?.message || 'Bağlantı hatası' });
  }
});

/** Maç içeriği: önce cache (12 saat), yoksa AI üret ve kaydet */
app.post('/api/generate-match-content', async (req, res) => {
  try {
    const match = req.body;
    if (!match?.home || !match?.away) {
      return res.status(400).json({ error: 'home ve away alanları gerekli' });
    }

    const cached = await getCachedContent(match);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const result = await generateMatchContentWithAI(match);
    await saveContentToCache(match, result);
    res.json({ ...result, cached: false });
  } catch (err) {
    console.error('generate-match-content error:', err?.message || err);
    if (err?.stack) console.error(err.stack);
    res.status(500).json({
      error: err?.message || 'İçerik üretilemedi',
      fallback: true,
    });
  }
});

app.listen(PORT, () => {
  console.log(`API sunucusu http://localhost:${PORT} çalışıyor`);
});
