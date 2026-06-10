/**
 * Cloudflare Turnstile siteverify — static siteden Node API olmadan kullanım için.
 * Supabase Dashboard → Edge Functions → Secrets: TURNSTILE_SECRET_KEY
 */
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

Deno.serve(async (req: Request) => {
  const headers = { ...corsHeaders(req), 'Content-Type': 'application/json' };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return Response.json({ success: false, error: 'Method not allowed' }, { status: 405, headers });
  }

  const secret = Deno.env.get('TURNSTILE_SECRET_KEY')?.trim() ?? '';
  if (!secret) {
    return Response.json(
      { success: false, error: 'Sunucu yapılandırması: TURNSTILE_SECRET_KEY eksik (Supabase Function secrets)' },
      { status: 503, headers },
    );
  }

  let token: string | undefined;
  try {
    const body = (await req.json()) as { token?: string };
    token = typeof body?.token === 'string' ? body.token : undefined;
  } catch {
    return Response.json({ success: false, error: 'Geçersiz JSON gövdesi' }, { status: 400, headers });
  }

  if (!token || token.length < 8) {
    return Response.json({ success: false, error: 'Geçersiz token' }, { status: 400, headers });
  }

  try {
    const form = new URLSearchParams();
    form.set('secret', secret);
    form.set('response', token);

    const cf = await fetch(SITEVERIFY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });

    const data = (await cf.json()) as { success?: boolean; 'error-codes'?: string[] };

    if (data.success === true) {
      return Response.json({ success: true }, { headers });
    }

    const codes = Array.isArray(data['error-codes']) ? data['error-codes'].join(', ') : '';
    return Response.json(
      { success: false, error: codes || 'Turnstile doğrulaması başarısız' },
      { status: 400, headers },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[verify-turnstile]', msg);
    return Response.json({ success: false, error: 'Doğrulama sırasında sunucu hatası' }, { status: 500, headers });
  }
});
