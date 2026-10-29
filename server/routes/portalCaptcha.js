import { createHash } from 'node:crypto';
import { createServiceClient } from '../supabaseService.js';

const MAX_CAPTCHA_ATTEMPTS = 3;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Matematik captcha doğrulaması — supabase/functions/math-captcha ile aynı kurallar:
 * tek kullanımlık, 10 dk, en fazla 3 deneme; cevap trim+lowercase normalize edilip
 * SHA-256 hash ile karşılaştırılır.
 * @returns {Promise<{ ok: boolean, status?: number, error?: string }>}
 */
async function verifyMathCaptchaChallenge(client, id, answerRaw) {
  const { data: row, error } = await client
    .from('captcha_challenges')
    .select('id, answer_hash, expires_at, attempts, used')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[math-captcha] verify select:', error.message);
    return { ok: false, status: 500, error: 'Doğrulama sırasında sunucu hatası' };
  }
  if (!row) {
    return {
      ok: false,
      status: 400,
      error: 'Doğrulama oturumu bulunamadı. Sayfayı yenileyip tekrar deneyin.',
    };
  }
  if (row.used) {
    return { ok: false, status: 400, error: 'Bu doğrulama kodu zaten kullanıldı. Yeni soru alın.' };
  }
  if (new Date(row.expires_at).getTime() <= Date.now()) {
    return { ok: false, status: 400, error: 'Doğrulama kodunun süresi doldu. Yeni soru alın.' };
  }
  const attempts = Number(row.attempts) || 0;
  if (attempts >= MAX_CAPTCHA_ATTEMPTS) {
    return { ok: false, status: 400, error: 'Deneme hakkınız doldu. Yeni soru alın.' };
  }

  const hash = createHash('sha256')
    .update(String(answerRaw).trim().toLowerCase(), 'utf8')
    .digest('hex');
  if (hash !== row.answer_hash) {
    const newAttempts = attempts + 1;
    await client.from('captcha_challenges').update({ attempts: newAttempts }).eq('id', id);
    const left = MAX_CAPTCHA_ATTEMPTS - newAttempts;
    if (left <= 0) {
      return {
        ok: false,
        status: 400,
        error: 'Doğrulama kodu hatalı, deneme hakkınız doldu. Yeni soru alın.',
      };
    }
    return { ok: false, status: 400, error: `Doğrulama kodu hatalı, kalan deneme: ${left}` };
  }

  await client.from('captcha_challenges').update({ used: true }).eq('id', id);
  return { ok: true };
}

/**
 * Math-captcha doğrulama endpoint'i — yalnızca yerel/dev uyumluluğu.
 * Prod akışı Supabase Edge Function (math-captcha) kullanır.
 * Gövde: { id, answer } veya { mathCaptchaId, mathCaptchaAnswer }
 */
export function registerPortalCaptchaRoutes(app) {
  const handler = async (req, res) => {
    try {
      const body = req.body || {};
      const id =
        (typeof body.id === 'string' && body.id.trim()) ||
        (typeof body.mathCaptchaId === 'string' && body.mathCaptchaId.trim()) ||
        '';
      const answerRaw =
        body.answer != null ? String(body.answer) : body.mathCaptchaAnswer != null ? String(body.mathCaptchaAnswer) : '';
      if (!UUID_RE.test(id)) {
        return res.status(400).json({ ok: false, error: 'Geçersiz doğrulama oturumu' });
      }
      if (!answerRaw.trim()) {
        return res.status(400).json({ ok: false, error: 'Cevap boş olamaz' });
      }
      const client = createServiceClient();
      if (!client) {
        return res.status(503).json({ ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY gerekli' });
      }
      const result = await verifyMathCaptchaChallenge(client, id, answerRaw);
      if (!result.ok) {
        return res.status(result.status || 400).json({ ok: false, error: result.error });
      }
      return res.json({ ok: true });
    } catch (err) {
      console.error('[POST /api/math-captcha/verify]', err?.message || err);
      res.status(500).json({ ok: false, error: err?.message || 'Doğrulama hatası' });
    }
  };

  app.post('/api/math-captcha/verify', handler);
  // Geriye dönük uyumluluk: eski yerel/dev captcha verify path'i
  app.post('/api/portal/verify-captcha', handler);
}
