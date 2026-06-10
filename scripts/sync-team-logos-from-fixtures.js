#!/usr/bin/env node
/**
 * CLI: npm run sync-team-logos
 * Ortak mantık: server/api/syncTeamLogos.js
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { runSyncTeamLogos, mergeTeamLogoEntries, ALL_SYNC_LEAGUES, collectTeamsFromLeague, fetchExistingTeamLogos } from '../server/api/syncTeamLogos.js';

function parseArgs() {
  const argv = process.argv.slice(2);
  return {
    dryRun: argv.includes('--dry-run'),
    noSupabase: argv.includes('--no-supabase'),
  };
}

async function main() {
  const { dryRun, noSupabase } = parseArgs();
  console.log('[sync-team-logos] Fixturedownload liglerinden takımlar çekiliyor...\n');

  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    'https://pkppewdtnuchwjtmulev.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  const logToConsole = (s) => console.log(s);

  if (dryRun) {
    const scraped = new Set();
    for (const league of ALL_SYNC_LEAGUES) {
      console.log(`→ ${league.name} (${league.slug})`);
      const { names } = await collectTeamsFromLeague(league, logToConsole);
      names.forEach((n) => scraped.add(n));
      await new Promise((r) => setTimeout(r, 400));
    }
    let existing = [];
    if (serviceKey) {
      const sb = createClient(supabaseUrl, serviceKey);
      const r = await fetchExistingTeamLogos(sb);
      existing = r.entries;
      console.log(`\nMevcut kayıt: ${existing.length}`);
    }
    const entries = mergeTeamLogoEntries(existing, scraped);
    const payload = { entries };
    const outDir = path.join(process.cwd(), 'data');
    const previewPath = path.join(outDir, 'team-logos-sync-preview.json');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(previewPath, JSON.stringify(payload, null, 2), 'utf8');
    console.log(`\nÖnizleme: ${previewPath} (${entries.length} satır)`);
    console.log('\n[--dry-run] Supabase güncellenmedi.');
    return;
  }

  if (noSupabase || !serviceKey) {
    console.error('Supabase yazımı için SUPABASE_SERVICE_ROLE_KEY gerekli (veya --dry-run / --no-supabase).');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const result = await runSyncTeamLogos(supabase, { log: logToConsole, upsert: true });

  const outDir = path.join(process.cwd(), 'data');
  const previewPath = path.join(outDir, 'team-logos-sync-preview.json');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  if (result.payload) {
    fs.writeFileSync(previewPath, JSON.stringify(result.payload, null, 2), 'utf8');
    console.log(`\nÖnizleme: ${previewPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
