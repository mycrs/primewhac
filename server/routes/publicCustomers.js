import { createServiceClient } from '../supabaseService.js';
import { verifyTurnstileWithCloudflare } from '../turnstileSecret.js';

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
      const token = typeof body.turnstileToken === 'string' ? body.turnstileToken.trim() : '';
      if (!token || token.length < 8) {
        return res.status(400).json({ ok: false, error: 'Güvenlik doğrulaması gerekli' });
      }

      const tv = await verifyTurnstileWithCloudflare(token);
      if (!tv.ok) {
        return res.status(400).json({ ok: false, error: tv.error || 'Turnstile doğrulaması başarısız' });
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

      const client = createServiceClient();
      if (!client) {
        return res.status(503).json({ ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY gerekli' });
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
