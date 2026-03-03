
export const verifyAdminStatus = (user) => {
  if (!user) {
    console.log('[Admin Verification] No user provided.');
    return false;
  }

  const metadata = user.user_metadata || {};
  const appMetadata = user.app_metadata || {};
  
  // Check user_metadata.is_admin or raw_app_meta_data.is_admin
  const isAdminMeta = metadata.is_admin === true || metadata.is_admin === 'true' || metadata.is_admin === '1';
  const isAdminAppMeta = appMetadata.is_admin === true || appMetadata.is_admin === 'true' || appMetadata.is_admin === '1';
  
  const isAdmin = isAdminMeta || isAdminAppMeta;
  
  console.log('[Admin Verification] Check result:', {
    userId: user.id,
    email: user.email,
    user_metadata: metadata,
    app_metadata: appMetadata,
    isAdmin
  });

  return isAdmin;
};
