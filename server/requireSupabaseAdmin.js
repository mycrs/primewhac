import { createClient } from '@supabase/supabase-js';

/**
 * Bearer JWT doğrula + admin_users.is_admin (service role ile RLS bypass).
 */
export async function requireSupabaseAdmin(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Authorization: Bearer token gerekli' });
    }
    const jwt = auth.slice(7).trim();
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !anonKey) {
      return res.status(503).json({ success: false, error: 'Sunucu .env: SUPABASE_URL ve anon key gerekli' });
    }
    if (!serviceKey) {
      return res.status(503).json({ success: false, error: 'Sunucu .env: SUPABASE_SERVICE_ROLE_KEY gerekli' });
    }

    const anonClient = createClient(url, anonKey);
    const { data: { user }, error: authErr } = await anonClient.auth.getUser(jwt);
    if (authErr || !user?.email) {
      return res.status(401).json({ success: false, error: 'Oturum geçersiz veya süresi dolmuş' });
    }

    const serviceClient = createClient(url, serviceKey);
    const { data: adminRow, error: adminErr } = await serviceClient
      .from('admin_users')
      .select('is_admin')
      .ilike('email', user.email)
      .maybeSingle();

    if (adminErr || !adminRow?.is_admin) {
      return res.status(403).json({ success: false, error: 'Bu işlem için admin yetkisi gerekli' });
    }

    req.supabaseService = serviceClient;
    req.adminUser = user;
    next();
  } catch (err) {
    console.error('[requireSupabaseAdmin]', err?.message || err);
    return res.status(500).json({ success: false, error: 'Admin doğrulama hatası' });
  }
}
