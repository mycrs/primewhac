/**
 * Qruzebayi TSV → customers bulk INSERT
 * Kullanım: node scripts/parse-qruzebayi-tsv.mjs data/qruzebayi.tsv [çıktı.sql]
 * (Çıktı dosyası verilirse UTF-8 yazılır; yoksa stdout.)
 */
import fs from 'fs';
import crypto from 'crypto';

const inputPath = process.argv[2];
const outputPath = process.argv[3];
if (!inputPath || !fs.existsSync(inputPath)) {
  console.error('Kullanım: node scripts/parse-qruzebayi-tsv.mjs <tsv-dosyası> [çıktı.sql]');
  process.exit(1);
}

const text = fs.readFileSync(inputPath, 'utf8');

function parseRecords(raw) {
  const lines = raw.split(/\r?\n/);
  const records = [];
  let buf = [];
  for (const line of lines) {
    if (/^\d+\t/.test(line)) {
      if (buf.length) records.push(buf.join('\n'));
      buf = [line];
    } else if (buf.length) {
      buf.push(line);
    }
  }
  if (buf.length) records.push(buf.join('\n'));
  return records;
}

const EXP_RE = /^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/;

function parseExpiration(s) {
  const t = (s || '').trim();
  if (!t || t === '-') return null;
  const m = t.match(EXP_RE);
  if (!m) return null;
  const d = m[1].padStart(2, '0');
  const mo = m[2].padStart(2, '0');
  const y = m[3];
  return `${y}-${mo}-${d}`;
}

function parsePackageDays(s) {
  const t = (s || '').trim();
  if (!t || t === '-') return null;
  const m = t.match(/^(\d+)\s*Day/i);
  return m ? parseInt(m[1], 10) : null;
}

function sqlStr(s) {
  if (s == null) return 'NULL';
  return `'${String(s).replace(/'/g, "''")}'`;
}

function sqlNum(n) {
  if (n == null || Number.isNaN(n)) return 'NULL';
  return String(n);
}

function startDateFromEnd(endYmd, days) {
  if (!endYmd || days == null || days < 1) return null;
  const [Y, M, D] = endYmd.split('-').map(Number);
  const dt = new Date(Date.UTC(Y, M - 1, D));
  dt.setUTCDate(dt.getUTCDate() - days);
  return dt.toISOString().slice(0, 10);
}

const usedCodes = new Set();

function uniquePortalCode() {
  for (let i = 0; i < 50000; i++) {
    const n = crypto.randomInt(0, 10000);
    const code = `QRZ-${String(n).padStart(4, '0')}`;
    if (!usedCodes.has(code)) {
      usedCodes.add(code);
      return code;
    }
  }
  throw new Error('Kod üretilemedi');
}

const records = parseRecords(text);
const rows = [];

for (const block of records) {
  const firstLine = block.split('\n')[0];
  const parts = firstLine.split('\t');
  if (parts.length < 10) continue;

  const username = (parts[1] || '').trim();
  const password = (parts[2] || '').trim();
  if (!username) continue;

  const expCell = (parts[7] || '').trim();
  const daysCell = (parts[8] || '').trim();

  let endYmd = parseExpiration(expCell);
  let packageDays = parsePackageDays(daysCell);

  if (!endYmd) {
    packageDays = null;
  }

  const status = endYmd ? 'aktif' : 'bitti';
  const startYmd = endYmd ? startDateFromEnd(endYmd, packageDays) : null;

  const fullName = username;
  const whatsapp = '';
  const packageName = 'Qruzebayi TR';
  const packagePrice = 0;
  const portalCode = uniquePortalCode();

  rows.push({
    fullName,
    username,
    whatsapp,
    password,
    packageName,
    packageDays,
    packagePrice,
    startYmd,
    endYmd,
    status,
    portalCode,
  });
}

let out = `-- Otomatik üretim: scripts/parse-qruzebayi-tsv.mjs
-- Satır sayısı: ${rows.length}
-- Not: Kod sütunu bu projede portal_code (Supabase). Tabloda customer_code varsa
--   INSERT satırındaki sütun adını customer_code olarak değiştirin.
-- iptv_password kolonu yoksa:
--   ALTER TABLE customers ADD COLUMN IF NOT EXISTS iptv_password text;

INSERT INTO customers (
  full_name, username, whatsapp, iptv_password,
  package_name, package_days, package_price,
  start_date, end_date, status, portal_code
) VALUES
`;

const valueLines = rows.map(
  (r) =>
    `(${sqlStr(r.fullName)}, ${sqlStr(r.username)}, ${sqlStr(r.whatsapp)}, ${sqlStr(r.password)}, ` +
    `${sqlStr(r.packageName)}, ${sqlNum(r.packageDays)}, ${sqlNum(r.packagePrice)}, ` +
    `${r.startYmd ? sqlStr(r.startYmd) : 'NULL'}, ${r.endYmd ? sqlStr(r.endYmd) : 'NULL'}, ${sqlStr(r.status)}, ${sqlStr(r.portalCode)})`,
);

out += valueLines.join(',\n') + ';\n';

if (outputPath) {
  fs.writeFileSync(outputPath, out, 'utf8');
  console.error(`Yazıldı: ${outputPath} (${rows.length} satır)`);
} else {
  process.stdout.write(out);
}
