import { remainingCalendarDaysUntilEnd } from '../../src/utils/customerDates.js';

function isActiveCustomer(c) {
  return c && (c.deleted_at == null || c.deleted_at === undefined);
}

export function registerAdminCustomerRoutes(app, requireSupabaseAdmin) {
  app.get('/api/admin/customers', requireSupabaseAdmin, async (req, res) => {
    try {
      const { data, error } = await req.supabaseService
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      res.json({ success: true, customers: data || [] });
    } catch (err) {
      console.error('[GET /api/admin/customers]', err?.message || err);
      res.status(500).json({ success: false, error: err?.message || 'Liste alınamadı' });
    }
  });

  app.get('/api/admin/customers/pending-count', requireSupabaseAdmin, async (req, res) => {
    try {
      const { data, error } = await req.supabaseService
        .from('customers')
        .select('*')
        .eq('status', 'beklemede');
      if (error) throw error;
      const n = (data || []).filter(isActiveCustomer).length;
      res.json({ success: true, count: n });
    } catch (err) {
      console.error('[GET /api/admin/customers/pending-count]', err?.message || err);
      res.status(500).json({ success: false, error: err?.message || 'Sayım başarısız' });
    }
  });

  app.get('/api/admin/customers/expiring-soon', requireSupabaseAdmin, async (req, res) => {
    try {
      const { data, error } = await req.supabaseService
        .from('customers')
        .select('*')
        .eq('status', 'aktif');
      if (error) throw error;
      const soon = (data || []).filter(isActiveCustomer).filter((c) => {
        if (!c.end_date) return false;
        const rem = remainingCalendarDaysUntilEnd(String(c.end_date).slice(0, 10));
        return rem != null && rem >= 0 && rem <= 7;
      });
      res.json({ success: true, customers: soon });
    } catch (err) {
      console.error('[GET /api/admin/customers/expiring-soon]', err?.message || err);
      res.status(500).json({ success: false, error: err?.message || 'Veri alınamadı' });
    }
  });

  app.get('/api/admin/customers/:id', requireSupabaseAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { data, error } = await req.supabaseService
        .from('customers')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      if (!data) return res.status(404).json({ success: false, error: 'Kayıt bulunamadı' });
      res.json({ success: true, customer: data });
    } catch (err) {
      console.error('[GET /api/admin/customers/:id]', err?.message || err);
      res.status(500).json({ success: false, error: err?.message || 'Kayıt alınamadı' });
    }
  });

  app.patch('/api/admin/customers/:id', requireSupabaseAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const body = req.body || {};
      const patch = {};
      if (typeof body.status === 'string') patch.status = body.status;
      if (body.deleted_at === null) patch.deleted_at = null;
      else if (typeof body.deleted_at === 'string') patch.deleted_at = body.deleted_at;
      if (Object.keys(patch).length === 0) {
        return res.status(400).json({ success: false, error: 'Güncellenecek alan yok (status veya deleted_at)' });
      }
      const { error } = await req.supabaseService.from('customers').update(patch).eq('id', id);
      if (error) throw error;
      res.json({ success: true });
    } catch (err) {
      console.error('[PATCH /api/admin/customers/:id]', err?.message || err);
      res.status(500).json({ success: false, error: err?.message || 'Güncellenemedi' });
    }
  });
}
