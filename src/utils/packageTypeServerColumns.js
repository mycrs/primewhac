/**
 * package_types sunucu alanları — SQL öncesi/sonrası admin kayıt uyumu.
 */

export const PACKAGE_TYPES_SERVER_MIGRATION_DOC = 'docs/supabase-package-types-migration.sql';

const OPTIONAL_SERVER_COLUMNS = ['server_url', 'server_port', 'customer_panel_url'];

function isMissingColumnError(error) {
  const msg = error?.message || '';
  return msg.includes('column') || msg.includes('schema cache') || msg.includes('does not exist');
}

export function packageTypesNeedServerColumnsMigration(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return false;
  return rows.every((r) => !Object.prototype.hasOwnProperty.call(r, 'server_url'));
}

export function packageTypesServerMigrationHint() {
  return `M3U/Xtream sunucu alanları veritabanında yok. ${PACKAGE_TYPES_SERVER_MIGRATION_DOC} veya docs/package-types-server-columns.sql çalıştırın.`;
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {{ id?: string, payload: Record<string, unknown> }} opts
 */
export async function savePackageTypeToSupabase(supabase, { id, payload }) {
  const run = (data) =>
    id && id !== 'new'
      ? supabase.from('package_types').update(data).eq('id', id)
      : supabase.from('package_types').insert([data]).select();

  let { data, error } = await run(payload);
  if (!error) return { data, error: null, stripped: [] };

  if (!isMissingColumnError(error)) return { data, error, stripped: [] };

  const safe = { ...payload };
  const stripped = [];
  for (const col of OPTIONAL_SERVER_COLUMNS) {
    if (col in safe) {
      delete safe[col];
      stripped.push(col);
    }
  }

  const retry = await run(safe);
  return { data: retry.data, error: retry.error, stripped };
}
