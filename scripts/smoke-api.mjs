/**
 * Express API smoke test — önce: npm run dev:api veya dev:all
 * Kullanım: npm run smoke:api
 */
const base = process.env.API_BASE || 'http://localhost:3001';

async function get(path) {
  const r = await fetch(`${base}${path}`);
  let body = null;
  try {
    body = await r.json();
  } catch {
    body = null;
  }
  return { ok: r.ok, status: r.status, body };
}

let failed = false;

const health = await get('/api/health');
if (!health.ok || !health.body?.ok) {
  console.error('✗ GET /api/health', health.status, health.body);
  failed = true;
} else {
  console.log('✓ GET /api/health', health.body);
}

const noAuth = await get('/api/admin/notifications');
if (noAuth.status !== 401) {
  console.error('✗ GET /api/admin/notifications (auth yok) beklenen 401, alınan:', noAuth.status);
  failed = true;
} else {
  console.log('✓ Admin notifications auth koruması (401)');
}

const pkgOpts = await get('/api/public/customer-package-options');
if (pkgOpts.ok && pkgOpts.body?.ok && Array.isArray(pkgOpts.body.packageTypes)) {
  console.log('✓ GET /api/public/customer-package-options', `${pkgOpts.body.packageTypes.length} paket türü`);
} else if (pkgOpts.status === 503) {
  console.log('⚠ GET /api/public/customer-package-options — SUPABASE_SERVICE_ROLE_KEY yok (503)');
} else {
  console.error('✗ GET /api/public/customer-package-options', pkgOpts.status, pkgOpts.body);
  failed = true;
}

if (failed) {
  console.error('\nSmoke test başarısız. npm run dev:api çalışıyor mu?');
  process.exit(1);
}
console.log('\nSmoke test tamam.');
