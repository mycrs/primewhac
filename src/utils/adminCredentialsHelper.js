
import { supabase } from '@/lib/customSupabaseClient';

export const logCurrentAdminInfo = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('[Admin Credentials Helper] Error fetching user:', {
        message: error.message,
        status: error.status
      });
      return { success: false, error: error.message };
    }
    
    const user = data?.user;
    
    if (!user) {
      console.log('[Admin Credentials Helper] No user currently logged in.');
      console.log(`
        [Instructions for creating an admin user]
        1. Go to your Supabase project dashboard.
        2. Navigate to Authentication -> Users.
        3. Add a new user with an email and password.
        4. In the SQL editor, run this query to make them an admin:
           UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb WHERE email = 'your-email@example.com';
      `);
      return { success: true, user: null, message: 'No active user session' };
    }

    const isAdmin = user.user_metadata?.is_admin === true || user.app_metadata?.is_admin === true;

    console.log('[Admin Credentials Helper] Current User Info:', {
      id: user.id,
      email: user.email,
      is_admin: isAdmin,
      user_metadata: user.user_metadata || {},
      app_metadata: user.app_metadata || {}
    });

    return { 
      success: true, 
      user: {
        email: user.email,
        isAdmin
      }
    };
  } catch (err) {
    console.error('[Admin Credentials Helper] Unexpected error during verification:', err);
    return { success: false, error: 'Unexpected system error during validation.' };
  }
};
