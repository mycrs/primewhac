/**
 * Statik sitede Node /api olmadan müşteri kaydı: Turnstile siteverify + service role insert.
 * Secrets: TURNSTILE_SECRET_KEY, SUPABASE_SERVICE_ROLE_KEY (Supabase Dashboard → Edge Functions → Secrets)
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.30.0';

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const ALLOWED_ORIGINS = new Set([
  'https://qruzetv.com',
  'https://www.qruzetv.com',
  'https://streamtr.eu',
  'https://www.streamtr.eu',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

function corsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get('Origin') ?? '';
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : 'https://qruzetv.com';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Max-Age': '86400',
  };
}

async function verifyTurnstileToken(token: string): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY')?.trim() ?? '';
  if (!secret) {
    return {
      ok: false,
      error: 'Sunucu yapılandırması: TURNSTILE_SECRET_KEY eksik (Supabase Function secrets)',
      status: 503,
    };
  }
  const form = new URLSearchParams();
  form.set('secret', secret);
  form.set('response', token);
  const cf = await fetch(SITEVERIFY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  const data = (await cf.json()) as { success?: boolean; 'error-codes'?: string[] };
  if (data.success === true) return { ok: true };
  const codes = Array.isArray(data['error-codes']) ? data['error-codes'].join(', ') : '';
  return { ok: false, error: codes || 'Turnstile doğrulaması başarısız', status: 400 };
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

  const token = typeof body.turnstileToken === 'string' ? body.turnstileToken.trim() : '';
  if (!token || token.length < 8) {
    return Response.json({ ok: false, error: 'Güvenlik doğrulaması gerekli' }, { status: 400, headers });
  }

  const tv = await verifyTurnstileToken(token);
  if (!tv.ok) {
    return Response.json({ ok: false, error: tv.error }, { status: tv.status, headers });
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

  const url = Deno.env.get('SUPABASE_URL')?.trim() ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim() ?? '';
  if (!url || !serviceKey) {
    return Response.json(
      { ok: false, error: 'Sunucu yapılandırması: Supabase service role gerekli (Edge secrets)' },
      { status: 503, headers },
    );
  }

  const client = createClient(url, serviceKey);
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
