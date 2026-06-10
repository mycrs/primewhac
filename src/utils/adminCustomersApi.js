/**
 * Admin müşteri işlemleri: önce /api/admin/* (service role, RLS bypass),
 * yanıt yoksa veya hata olursa doğrudan Supabase (eski kurulum).
 */

export async function fetchAdminCustomer(accessToken, id) {
  const base = { customer: null, source: null, apiResponse: null, httpStatus: null };
  if (!accessToken || !id) {
    return base;
  }
  try {
    const r = await fetch(`/api/admin/customers/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    base.httpStatus = r.status;
    const j = await r.json().catch(() => null);
    base.apiResponse = j;
    if (r.ok && j?.success && j.customer && typeof j.customer === 'object') {
      return { ...base, customer: j.customer, source: 'api' };
    }
    if (import.meta.env.DEV && !r.ok) {
      console.warn(`[fetchAdminCustomer] HTTP ${r.status}`, j?.error || '');
    }
    return base;
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[fetchAdminCustomer] fetch hatası (API kapalı veya proxy yok):', e?.message || e);
    }
    return { ...base, apiResponse: { _fetchError: e?.message || String(e) } };
  }
}

export async function fetchAdminCustomers(accessToken) {
  const base = { customers: null, source: null, apiResponse: null, httpStatus: null };
  if (accessToken) {
    try {
      const r = await fetch('/api/admin/customers', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      base.httpStatus = r.status;
      const j = await r.json().catch(() => null);
      base.apiResponse = j;
      if (r.ok && j?.success && Array.isArray(j.customers)) {
        return { ...base, customers: j.customers, source: 'api' };
      }
      if (import.meta.env.DEV) {
        if (r.ok) {
          console.warn('[fetchAdminCustomers] 200 ama beklenmeyen JSON:', j);
        } else {
          let body = '';
          try {
            body = typeof j === 'object' && j ? JSON.stringify(j) : String(j);
          } catch {
            body = '(parse edilemedi)';
          }
          console.warn(`[fetchAdminCustomers] HTTP ${r.status}`, body?.slice(0, 300));
        }
      }
      return base;
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn('[fetchAdminCustomers] fetch hatası (API kapalı veya proxy yok):', e?.message || e);
      }
      return { ...base, apiResponse: { _fetchError: e?.message || String(e) } };
    }
  }
  if (import.meta.env.DEV) {
    console.info('[fetchAdminCustomers] access_token yok — sadece Supabase istemcisi kullanılacak.');
  }
  return base;
}

export async function patchAdminCustomer(accessToken, id, body) {
  if (accessToken) {
    try {
      const r = await fetch(`/api/admin/customers/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (r.ok) {
        const j = await r.json();
        if (j.success) return { ok: true, source: 'api', error: null };
      }
      const errJ = await r.json().catch(() => ({}));
      return { ok: false, source: 'api', error: errJ.error || r.statusText };
    } catch (e) {
      return { ok: false, source: 'api', error: e?.message || 'Ağ hatası' };
    }
  }
  return { ok: false, source: null, error: 'Oturum yok' };
}

export async function fetchAdminPendingCustomersCount(accessToken) {
  if (accessToken) {
    try {
      const r = await fetch('/api/admin/customers/pending-count', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (r.ok) {
        const j = await r.json();
        if (j.success && typeof j.count === 'number') return { count: j.count, source: 'api' };
      }
    } catch {
      /* fallback */
    }
  }
  return { count: null, source: null };
}

export async function fetchAdminExpiringCustomers(accessToken) {
  if (accessToken) {
    try {
      const r = await fetch('/api/admin/customers/expiring-soon', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (r.ok) {
        const j = await r.json();
        if (j.success && Array.isArray(j.customers)) return { customers: j.customers, source: 'api' };
      }
    } catch {
      /* fallback */
    }
  }
  return { customers: null, source: null };
}
