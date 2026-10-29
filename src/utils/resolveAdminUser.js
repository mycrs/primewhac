import { verifyAdminStatus as hasMetadataAdminFlag } from '@/utils/adminUserVerification';

/**
 * admin_users satırı — e-posta büyük/küçük harf duyarsız
 */
export async function fetchAdminUsersRow(supabase, email) {
  const trimmed = String(email || '').trim();
  if (!trimmed) return { isAdmin: false, error: null };

  let { data, error } = await supabase
    .from('admin_users')
    .select('is_admin')
    .ilike('email', trimmed)
    .maybeSingle();

  if (!data && !error) {
    const retry = await supabase
      .from('admin_users')
      .select('is_admin')
      .eq('email', trimmed)
      .maybeSingle();
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    return { isAdmin: false, error: error.message };
  }

  return { isAdmin: !!data?.is_admin, error: null };
}

/**
 * JWT metadata + admin_users tablosu birleşik admin kontrolü
 */
export async function resolveAdminAccess(supabase, user) {
  if (!user) return false;
  if (hasMetadataAdminFlag(user)) return true;

  const { isAdmin, error } = await fetchAdminUsersRow(supabase, user.email);
  if (error) {
    console.warn('[resolveAdminAccess] admin_users sorgusu başarısız:', error);
    throw new Error(error);
  }
  return isAdmin;
}
