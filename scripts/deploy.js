#!/usr/bin/env node
/**
 * deploy.js
 *
 * dist/ klasörünü FTP üzerinden Hostinger (veya başka bir sunucuya) yükler.
 *
 * Kullanım:
 *   npm run deploy              → .env'den bilgileri okur, dist/'i yükler
 *   npm run deploy -- --dry     → yalnızca dosya listesini göster, yükleme yapma
 *   npm run deploy -- --build   → önce `npm run build` çalıştır, sonra yükle
 *
 * Gerekli .env değişkenleri:
 *   FTP_HOST         (örn: ftp.cineverse.pro veya 153.x.x.x)
 *   FTP_USER
 *   FTP_PASS
 *   FTP_REMOTE_DIR   (varsayılan: /public_html)
 *   FTP_PORT         (varsayılan: 21)
 *   FTP_SECURE       (opsiyonel: "true" → FTPS explicit TLS; varsayılan false)
 *   FTP_EXCLUDE      (opsiyonel: virgüllü glob listesi, ek hariç tutmalar)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import dotenv from 'dotenv';
import FtpDeploy from 'ftp-deploy';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(REPO_ROOT, 'dist');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry') || args.includes('--dry-run');
const RUN_BUILD = args.includes('--build');

function fail(msg, code = 1) {
  console.error(`\n❌ ${msg}`);
  process.exit(code);
}

function info(msg) {
  console.log(msg);
}

function humanSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function requireEnv() {
  const missing = [];
  const host = (process.env.FTP_HOST || '').trim();
  const user = (process.env.FTP_USER || '').trim();
  const pass = process.env.FTP_PASS || '';
  if (!host) missing.push('FTP_HOST');
  if (!user) missing.push('FTP_USER');
  if (!pass) missing.push('FTP_PASS');

  if (missing.length) {
    fail(
      `Eksik FTP değişken(ler)i: ${missing.join(', ')}\n` +
        `   → .env dosyasına ekleyin. Örnek için .env.example'a bakın.`,
    );
  }

  const remoteDir = (process.env.FTP_REMOTE_DIR || '/public_html').trim();
  const port = Number(process.env.FTP_PORT || 21);
  const secureRaw = (process.env.FTP_SECURE || '').toLowerCase();
  const secure = secureRaw === 'true' || secureRaw === '1';

  return { host, user, password: pass, remoteDir, port, secure };
}

function checkDistExists() {
  if (!fs.existsSync(DIST_DIR)) {
    fail(
      `dist/ klasörü bulunamadı: ${DIST_DIR}\n` +
        `   → Önce \`npm run build\` çalıştırın (veya "npm run deploy -- --build").`,
    );
  }
  // Hızlı sağlık kontrolü: index.html var mı?
  if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    fail('dist/index.html bulunamadı — build eksik/yarım gibi görünüyor.');
  }
}

function runBuild() {
  info('→ `npm run build` çalıştırılıyor...\n');
  const res = spawnSync('npm', ['run', 'build'], {
    cwd: REPO_ROOT,
    stdio: 'inherit',
    shell: true,
  });
  if (res.status !== 0) {
    fail(`Build başarısız (exit code ${res.status}). Deploy iptal edildi.`);
  }
  info('\n→ Build tamamlandı, deploy başlıyor...\n');
}

function walkStats(dir) {
  let count = 0;
  let size = 0;
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    const entries = fs.readdirSync(cur, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(cur, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.isFile()) {
        count++;
        size += fs.statSync(p).size;
      }
    }
  }
  return { count, size };
}

async function main() {
  info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  info('  QruzeTV Deploy → FTP');
  info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (RUN_BUILD) runBuild();
  checkDistExists();

  const cfg = requireEnv();
  const stats = walkStats(DIST_DIR);

  info(`  Kaynak:     ${path.relative(REPO_ROOT, DIST_DIR) || 'dist'}/`);
  info(`  Hedef:      ${cfg.user}@${cfg.host}:${cfg.port}${cfg.remoteDir}`);
  info(`  TLS:        ${cfg.secure ? 'explicit FTPS' : 'plain FTP'}`);
  info(`  Dosya:      ${stats.count}`);
  info(`  Boyut:      ${humanSize(stats.size)}`);
  info('');

  if (DRY_RUN) {
    info('⚠ Dry-run modu: hiçbir şey yüklenmedi. Bağlantı bilgisi sağlamsa gerçek deploy için --dry bayrağını kaldırın.');
    return;
  }

  const extraExclude = (process.env.FTP_EXCLUDE || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const deployConfig = {
    user: cfg.user,
    password: cfg.password,
    host: cfg.host,
    port: cfg.port,
    localRoot: DIST_DIR,
    remoteRoot: cfg.remoteDir,
    include: ['*', '**/*'],
    exclude: [
      '.DS_Store',
      'Thumbs.db',
      '**/.DS_Store',
      '**/Thumbs.db',
      ...extraExclude,
    ],
    deleteRemote: false,
    forcePasv: true,
    sftp: false,
    secure: cfg.secure,
  };

  const ftp = new FtpDeploy();

  let uploaded = 0;
  let total = 0;
  const startedAt = Date.now();
  let lastLoggedPct = -1;

  ftp.on('uploading', (data) => {
    total = data.totalFilesCount;
    uploaded = data.transferredFileCount;
    const pct = total ? Math.floor((uploaded / total) * 100) : 0;
    const shouldLog = pct !== lastLoggedPct && (pct % 5 === 0 || uploaded === total);
    if (shouldLog) {
      lastLoggedPct = pct;
      const bar = '█'.repeat(Math.floor(pct / 2.5)).padEnd(40, '░');
      process.stdout.write(
        `\r  [${bar}] ${String(pct).padStart(3)}%  ${uploaded}/${total}  ${data.filename}`.padEnd(
          120,
        ),
      );
    }
  });

  ftp.on('uploaded', (data) => {
    // noop - özet uploading event'inden geliyor
  });

  ftp.on('upload-error', (data) => {
    console.error(`\n  ✗ ${data.filename} → ${data.err}`);
  });

  ftp.on('log', (data) => {
    // Verbose logları sessize alıyoruz; sorun varsa DEBUG=1 ile açılabilir
    if (process.env.DEBUG) console.log(`    [ftp] ${data}`);
  });

  try {
    info('→ Bağlanılıyor ve yükleniyor...\n');
    const result = await ftp.deploy(deployConfig);
    process.stdout.write('\n');
    const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
    info('');
    info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    info(`✓ Deploy tamamlandı`);
    info(`  Süre:       ${elapsed}s`);
    info(`  Yüklenen:   ${uploaded || (Array.isArray(result) ? result.length : stats.count)} dosya`);
    info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (err) {
    process.stdout.write('\n');
    const msg = (err && err.message) || String(err);
    const code = err && err.code;

    info('');
    info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`❌ Deploy başarısız`);
    console.error(`   Hata: ${msg}`);
    if (code) console.error(`   Kod: ${code}`);

    if (/ECONNREFUSED|ENOTFOUND|ETIMEDOUT/i.test(msg)) {
      console.error(
        `\n   → FTP_HOST / FTP_PORT doğru mu? Sunucu FTP'yi kapatmış olabilir (Hostinger panelden kontrol edin).`,
      );
    } else if (/530|login|authentication|credentials/i.test(msg)) {
      console.error(`\n   → FTP_USER / FTP_PASS hatalı görünüyor.`);
    } else if (/550|permission|no such file/i.test(msg)) {
      console.error(
        `\n   → FTP_REMOTE_DIR (${cfg.remoteDir}) sunucuda yok veya kullanıcıda yazma yetkisi yok.`,
      );
    } else if (/TLS|SSL|secure/i.test(msg)) {
      console.error(
        `\n   → TLS sorunu. FTP_SECURE değerini değiştirin (true ↔ false).`,
      );
    }
    info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
