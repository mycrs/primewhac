/**
 * Statik sitede Node /api olmadan müşteri kaydı: dahili matematik doğrulaması + service role insert.
 * Client { mathCaptchaId, mathCaptchaAnswer } gönderir; doğrulama captcha_challenges tablosundan
 * service role ile yapılır (math-captcha edge function'ındaki verify mantığının aynısı).
 * Secrets: SUPABASE_SERVICE_ROLE_KEY (Supabase Dashboard → Edge Functions → Secrets)
 * Tablo kurulumu: supabase/math_captcha_setup.sql
 */
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.30.0';

const ALLOWED_ORIGINS = new Set([
  'https://cineverse.pro',
  'https://www.cineverse.pro',
  'https://qruzetv.com',
  'https://www.qruzetv.com',
  'https://satinaliptv.sbs',
  'https://www.satinaliptv.sbs',
  'https://streamtr.eu',
  'https://www.streamtr.eu',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

const MAX_ATTEMPTS = 3;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function corsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get('Origin') ?? '';
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : 'https://satinaliptv.sbs';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Max-Age': '86400',
  };
}

async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

type CaptchaVerifyResult = { ok: true } | { ok: false; error: string; status: number };

/** math-captcha edge function'ındaki verify mantığının aynısı (direkt DB, service role). */
async function verifyMathCaptcha(
  supabase: SupabaseClient,
  id: string,
  answerRaw: string,
): Promise<CaptchaVerifyResult> {
  const { data: row, error } = await supabase
    .from('captcha_challenges')
    .select('id, answer_hash, expires_at, attempts, used')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[public-customer-register] captcha select:', error.message);
    return { ok: false, error: 'Doğrulama sırasında sunucu hatası', status: 500 };
  }
  if (!row) {
    return {
      ok: false,
      error: 'Doğrulama oturumu bulunamadı. Sayfayı yenileyip tekrar deneyin.',
      status: 400,
    };
  }
  if (row.used) {
    return { ok: false, error: 'Bu doğrulama kodu zaten kullanıldı. Yeni soru alın.', status: 400 };
  }
  if (new Date(row.expires_at as string).getTime() <= Date.now()) {
    return { ok: false, error: 'Doğrulama kodunun süresi doldu. Yeni soru alın.', status: 400 };
  }
  const attempts = Number(row.attempts) || 0;
  if (attempts >= MAX_ATTEMPTS) {
    return { ok: false, error: 'Deneme hakkınız doldu. Yeni soru alın.', status: 400 };
  }

  const hash = await sha256Hex(answerRaw.trim().toLowerCase());
  if (hash !== row.answer_hash) {
    const newAttempts = attempts + 1;
    await supabase.from('captcha_challenges').update({ attempts: newAttempts }).eq('id', id);
    const left = MAX_ATTEMPTS - newAttempts;
    if (left <= 0) {
      return {
        ok: false,
        error: 'Doğrulama kodu hatalı, deneme hakkınız doldu. Yeni soru alın.',
        status: 400,
      };
    }
    return { ok: false, error: `Doğrulama kodu hatalı, kalan deneme: ${left}`, status: 400 };
  }

  await supabase.from('captcha_challenges').update({ used: true }).eq('id', id);
  return { ok: true };
}

Deno.serve(async (req: Request) => {
  const headers = { ...corsHeaders(req), 'Content-Type': 'application/json' };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return Response.json({ ok: false, error: 'Method not allowed' }, { status: 405, headers });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: 'Geçersiz JSON gövdesi' }, { status: 400, headers });
  }

  const mathCaptchaId = typeof body.mathCaptchaId === 'string' ? body.mathCaptchaId.trim() : '';
  const mathCaptchaAnswer =
    typeof body.mathCaptchaAnswer === 'string'
      ? body.mathCaptchaAnswer
      : typeof body.mathCaptchaAnswer === 'number' && Number.isFinite(body.mathCaptchaAnswer)
        ? String(body.mathCaptchaAnswer)
        : '';
  if (!UUID_RE.test(mathCaptchaId) || !mathCaptchaAnswer.trim()) {
    return Response.json({ ok: false, error: 'Güvenlik doğrulaması gerekli' }, { status: 400, headers });
  }

  const url = Deno.env.get('SUPABASE_URL')?.trim() ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim() ?? '';
  if (!url || !serviceKey) {
    return Response.json(
      { ok: false, error: 'Sunucu yapılandırması: Supabase service role gerekli (Edge secrets)' },
      { status: 503, headers },
    );
  }

  const client = createClient(url, serviceKey);

  const cv = await verifyMathCaptcha(client, mathCaptchaId, mathCaptchaAnswer);
  if (!cv.ok) {
    return Response.json({ ok: false, error: cv.error }, { status: cv.status, headers });
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
    return Response.json({ ok: false, error: 'Zorunlu alanlar eksik' }, { status: 400, headers });
  }
  if (Number.isNaN(package_days) || package_days < 0) {
    return Response.json({ ok: false, error: 'Geçersiz paket süresi' }, { status: 400, headers });
  }
  if (Number.isNaN(package_price) || package_price < 0) {
    return Response.json({ ok: false, error: 'Geçersiz tutar' }, { status: 400, headers });
  }

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
      return Response.json(
        { ok: false, error: 'Bu kullanıcı adı zaten kayıtlı. Farklı bir kullanıcı adı deneyin.' },
        { status: 400, headers },
      );
    }
    console.error('[public-customer-register]', insErr.message, insErr.code);
    return Response.json({ ok: false, error: insErr.message || 'Kayıt başarısız' }, { status: 400, headers });
  }

  return Response.json({ ok: true }, { headers });
});
