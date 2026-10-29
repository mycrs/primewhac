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

export function registerPublicCustomerRoutes(app) {
  app.get('/api/public/customer-package-options', async (req, res) => {
    try {
      const client = createServiceClient();
      if (!client) {
        return res.status(503).json({ ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY gerekli' });
      }
      const [tRes, dRes] = await Promise.all([
        client
          .from('package_types')
          .select('id,name,is_active,sort_order')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
        client
          .from('customer_packages')
          .select('id,name,days,price,is_active,sort_order,group_id,group_name')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
      ]);
      if (tRes.error) throw tRes.error;
      if (dRes.error) throw dRes.error;
      res.json({
        ok: true,
        packageTypes: tRes.data || [],
        durations: dRes.data || [],
      });
    } catch (err) {
      console.error('[GET /api/public/customer-package-options]', err?.message || err);
      res.status(500).json({ ok: false, error: err?.message || 'Paket seçenekleri alınamadı' });
    }
  });

  app.post('/api/public/customer-register', async (req, res) => {
    try {
      const body = req.body || {};
      const mathCaptchaId =
        typeof body.mathCaptchaId === 'string' ? body.mathCaptchaId.trim() : '';
      const mathCaptchaAnswer =
        body.mathCaptchaAnswer != null ? String(body.mathCaptchaAnswer) : '';
      if (!UUID_RE.test(mathCaptchaId) || !mathCaptchaAnswer.trim()) {
        return res.status(400).json({ ok: false, error: 'Güvenlik doğrulaması gerekli' });
      }

      const captchaClient = createServiceClient();
      if (!captchaClient) {
        return res.status(503).json({ ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY gerekli' });
      }
      const cv = await verifyMathCaptchaChallenge(captchaClient, mathCaptchaId, mathCaptchaAnswer);
      if (!cv.ok) {
        return res.status(cv.status || 400).json({ ok: false, error: cv.error });
      }

      const full_name = typeof body.full_name === 'string' ? body.full_name.trim() : '';
      const username = typeof body.username === 'string' ? body.username.trim() : '';
      const whatsapp = body.whatsapp != null ? String(body.whatsapp).replace(/\D/g, '') : '';
      const country_code = typeof body.country_code === 'string' ? body.country_code.trim() : '';
      const package_id = body.package_id != null ? String(body.package_id).trim() : '';
      const package_type_id = body.package_type_id != null ? String(body.package_type_id).trim() : '';
      const package_type_name = typeof body.package_type_name === 'string' ? body.package_type_name.trim() : '';
      const package_name = typeof body.package_name === 'string' ? body.package_name.trim() : '';
      const package_days = Number(body.package_days);
      const package_price = Number(body.package_price);
      const currency = typeof body.currency === 'string' ? body.currency.trim().slice(0, 8) : 'TRY';

      if (!username || !whatsapp || !package_id || !package_type_id) {
        return res.status(400).json({ ok: false, error: 'Zorunlu alanlar eksik' });
      }
      if (Number.isNaN(package_days) || package_days < 0) {
        return res.status(400).json({ ok: false, error: 'Geçersiz paket süresi' });
      }
      if (Number.isNaN(package_price) || package_price < 0) {
        return res.status(400).json({ ok: false, error: 'Geçersiz tutar' });
      }

      const client = captchaClient;

      const row = {
        status: 'beklemede',
        full_name: full_name || username || '—',
        whatsapp,
        country_code: country_code || null,
        username,
        package_id,
        package_type_id,
        package_type_name: package_type_name || null,
        package_name: package_name || null,
        package_days,
        package_price,
        currency: currency || 'TRY',
        start_date: body.start_date ?? null,
        end_date: body.end_date ?? null,
        remaining_days:
          body.remaining_days != null && !Number.isNaN(Number(body.remaining_days))
            ? Number(body.remaining_days)
            : null,
        notes: body.notes != null && String(body.notes).trim() ? String(body.notes).trim() : null,
      };

      const { error: insErr } = await client.from('customers').insert(row);
      if (insErr) {
        if (insErr.code === '23505') {
          return res.status(400).json({
            ok: false,
            error: 'Bu kullanıcı adı zaten kayıtlı. Farklı bir kullanıcı adı deneyin.',
          });
        }
        throw insErr;
      }
      res.json({ ok: true });
    } catch (err) {
      console.error('[POST /api/public/customer-register]', err?.message || err);
      res.status(500).json({ ok: false, error: err?.message || 'Kayıt başarısız' });
    }
  });
}
