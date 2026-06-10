/**
 * packages tablosu tier sütunları — SQL öncesi/sonrası admin geri bildirimi.
 */

export const PACKAGES_TIER_MIGRATION_DOC = 'docs/supabase-packages-tier-migration.sql';

/** Supabase satırında tier sütunu yoksa migration henüz çalışmamış olabilir */
export function packagesNeedTierMigration(packages) {
  if (!Array.isArray(packages) || packages.length === 0) return false;
  return packages.every((p) => !Object.prototype.hasOwnProperty.call(p, 'tier'));
}

export function packagesTierMigrationHint() {
  return `Tier/sıralama alanları veritabanında yok. ${PACKAGES_TIER_MIGRATION_DOC} dosyasını Supabase SQL Editor'da çalıştırın. Paketler yine kaydedilir; tier adından çıkarım kullanılır.`;
}
