/**
 * Service role ile customers sayısı (RLS bypass) — teşhis.
 * Çalıştır: node scripts/diagnose-customers-supabase.mjs
 */
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('SUPABASE_URL (veya VITE_SUPABASE_URL) ve SUPABASE_SERVICE_ROLE_KEY .env içinde gerekli.');
  process.exit(1);
}

const admin = createClient(url, key, { auth: { persistSession: false } });

const { count, error } = await admin.from('customers').select('*', { count: 'exact', head: true });
if (error) {
  console.error('Hata:', error.message, error.code || '', error.details || '');
  process.exit(1);
}
console.log('customers tablosu (service role, RLS yok): toplam satır =', count ?? 'bilinmiyor');

const { data: sample, error: e2 } = await admin.from('customers').select('id,username,status').limit(3);
if (e2) console.error('Örnek çekme:', e2.message);
else console.log('Örnek (ilk 3):', sample);
