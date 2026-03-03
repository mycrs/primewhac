
# Testing Notifications and RLS Policies

This document outlines the steps to verify that the notifications system and Row Level Security (RLS) policies are functioning correctly.

## 1. Verify Admin User
- Ensure you are logged in as an administrator (e.g., `mensisiptv@gmail.com`).
- The system checks the `admin_users` table to confirm `is_admin = true` for your `auth.uid()`.

## 2. Testing Insert (Admin)
- Navigate to the **Admin Dashboard > Bildirimler (Banner)** tab.
- Click **"Yeni Ekle"**.
- Fill in the required fields (Başlık, Mesaj) and click **"Kaydet"**.
- **Expected Result:** A success toast should appear, and the notification should be added to the list. This confirms the `notifications_insert` RLS policy is working.

## 3. Testing Update (Admin)
- In the notifications list, toggle the **"Aktif"** switch for a notification or click the edit icon to change details.
- **Expected Result:** A success toast should appear, and the status/details should update. This confirms the `notifications_update` RLS policy is working.

## 4. Testing Delete (Admin)
- Click the trash icon next to a notification and confirm the deletion.
- **Expected Result:** The notification is removed from the list. This confirms the `notifications_delete` RLS policy is working.

## 5. Testing Frontend Display (Public)
- Go to the main public pages of the website (e.g., Homepage).
- **Expected Result:** The active notifications you created should be displayed in the banner at the top of the page. This confirms the public `notifications_select` policy (where `active = true`) is working.

## 6. Testing Unauthorized Access (Non-Admin)
- Log out and log in with a regular user account (or remove `is_admin = true` from your account in the database).
- Attempt to create, edit, or delete a notification via the UI (if accessible) or via API directly.
- **Expected Result:** The application should display an "Unauthorized" or "RLS Policy" error, and the operation should be blocked by Supabase. The UI should disable editing controls.
