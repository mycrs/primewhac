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
import { requireSupabaseAdmin } from './requireSupabaseAdmin.js';
import { registerAdminCustomerRoutes } from './routes/adminCustomers.js';
import { registerPublicCustomerRoutes } from './routes/publicCustomers.js';
import { registerPortalCaptchaRoutes } from './routes/portalCaptcha.js';
import { registerSyncTeamLogosRoute } from './routes/syncTeamLogosRoute.js';
import {
  pickNotificationPayload,
  insertNotificationWithFallback,
  updateNotificationWithFallback,
} from './notificationPayload.js';

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.json());

/** API ayakta mı — dev:all smoke test */
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'qruzetv-api',
    supabaseUrl: Boolean(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
    serviceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  });
});

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

registerAdminCustomerRoutes(app, requireSupabaseAdmin);
registerPublicCustomerRoutes(app);
registerPortalCaptchaRoutes(app);
registerSyncTeamLogosRoute(app, requireSupabaseAdmin);

/** Admin duyurular — RLS bypass (npm run dev:all). Ziyaretçi okuması Supabase'te kalır. */
app.get('/api/admin/notifications', requireSupabaseAdmin, async (req, res) => {
  try {
    const { data, error } = await req.supabaseService
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, notifications: data || [] });
  } catch (err) {
    console.error('[GET /api/admin/notifications]', err?.message || err);
    res.status(500).json({ success: false, error: err?.message || 'Liste alınamadı' });
  }
});

app.post('/api/admin/notifications', requireSupabaseAdmin, async (req, res) => {
  try {
    const payload = pickNotificationPayload(req.body);
    if (!payload.title || !payload.message) {
      return res.status(400).json({ success: false, error: 'title ve message zorunludur' });
    }
    const { data, error } = await insertNotificationWithFallback(req.supabaseService, payload);
    if (error) throw error;
    res.json({ success: true, notification: data });
  } catch (err) {
    console.error('[POST /api/admin/notifications]', err?.message || err);
    res.status(500).json({ success: false, error: err?.message || 'Duyuru eklenemedi' });
  }
});

app.patch('/api/admin/notifications/:id', requireSupabaseAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const payload = pickNotificationPayload(req.body);
    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ success: false, error: 'Güncellenecek alan yok' });
    }
    const { data, error } = await updateNotificationWithFallback(req.supabaseService, id, payload);
    if (error) throw error;
    res.json({ success: true, notification: data });
  } catch (err) {
    console.error('[PATCH /api/admin/notifications/:id]', err?.message || err);
    res.status(500).json({ success: false, error: err?.message || 'Güncellenemedi' });
  }
});

app.delete('/api/admin/notifications/:id', requireSupabaseAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await req.supabaseService.from('notifications').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/admin/notifications/:id]', err?.message || err);
    res.status(500).json({ success: false, error: err?.message || 'Silinemedi' });
  }
});

app.listen(PORT, () => {
  console.log(`API sunucusu http://localhost:${PORT} çalışıyor`);
});
