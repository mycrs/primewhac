/**
 * Müşteri kaydı — statik hosting için Supabase Edge Function.
 * Yerelde Vite proxy ile /api çalışıyorsa önce Express denenir.
 */
function supabaseFunctionsBase() {
  const u = import.meta.env.VITE_SUPABASE_URL;
  if (!u || typeof u !== 'string') return '';
  return u.replace(/\/$/, '');
}

function anonHeaders() {
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!anon) return {};
  return { Authorization: `Bearer ${anon}`, apikey: anon };
}

export async function registerCustomerPublic(payload) {
  const preferLocalApi =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (preferLocalApi) {
    try {
      const r = await fetch('/api/public/customer-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const ct = r.headers.get('content-type') || '';
      const j = await r.json().catch(() => ({}));
      if (ct.includes('application/json') && (r.ok || j?.error)) {
        return {
          ok: r.ok && j?.ok === true,
          status: r.status,
          error: j?.error || (r.ok ? '' : 'Kayıt sırasında bir hata oluştu.'),
        };
      }
    } catch {
      /* Edge’e düş */
    }
  }

  const base = supabaseFunctionsBase();
  const url = base ? `${base}/functions/v1/public-customer-register` : '';
  if (!url) {
    return { ok: false, status: 0, error: 'VITE_SUPABASE_URL tanımsız.' };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...anonHeaders(),
      },
      body: JSON.stringify(payload),
    });
    const j = await res.json().catch(() => ({}));
    return {
      ok: res.ok && j?.ok === true,
      status: res.status,
      error: j?.error || 'Kayıt sırasında bir hata oluştu.',
    };
  } catch {
    return {
      ok: false,
      status: 0,
      error:
        'Kayıt sunucusuna ulaşılamadı. Edge Function (public-customer-register) deploy edildi mi ve ağ bağlantısı var mı kontrol edin.',
    };
  }
}
