
import { supabase } from '@/lib/customSupabaseClient';

/**
 * Utility to verify admin user setup and provide instructions for developers.
 */
export const checkAdminSetup = async () => {
  try {
    console.log('[Admin Setup] Checking current admin configuration...');
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.warn('[Admin Setup] No active user or error fetching user:', error.message);
    }

    if (user) {
      const isAdmin = 
        user.user_metadata?.is_admin === true || 
        user.user_metadata?.is_admin === 'true' ||
        user.app_metadata?.is_admin === true ||
        user.app_metadata?.is_admin === 'true';

      console.log('[Admin Setup] Current User Data:', {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
        app_metadata: user.app_metadata,
        isAdmin
      });

      if (!isAdmin) {
        console.warn('[Admin Setup] Current user is logged in but DOES NOT have admin privileges.');
      } else {
        console.log('[Admin Setup] Admin user verified successfully.');
        return true;
      }
    }

    console.info(`
============================================================
🛠️ ADMIN USER SETUP INSTRUCTIONS 🛠️
============================================================

If you cannot log in to the admin panel, you need to create
an admin user or grant admin privileges to an existing user.

TEST ADMIN CREDENTIALS:
- Email: admin@example.com
- Password: admin123 (or any secure password)

STEPS TO SETUP:
1. Go to your Supabase Project Dashboard.
2. Navigate to Authentication -> Users.
3. Click "Add User" -> "Create new user".
4. Enter 'admin@example.com' and a secure password.
5. Disable "Auto Confirm Email" if you don't have SMTP setup,
   or just manually confirm the user in the UI.
6. Open the SQL Editor in Supabase.
7. Run the following query to set the is_admin flag:

   UPDATE auth.users 
   SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb 
   WHERE email = 'admin@example.com';

Once done, return to the login page and try again.
============================================================
    `);
    
    return false;
  } catch (err) {
    console.error('[Admin Setup] Unexpected error checking admin setup:', err);
    return false;
  }
};
