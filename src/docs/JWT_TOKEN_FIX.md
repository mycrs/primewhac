
# JWT Token Corruption Fix Guide

## Root Cause
The `React/no-unknown-property` error and subsequent `JWT` segment errors were caused by two compounding issues:
1. **Token Manipulation:** Previous authentication logic attempted to aggressively parse, inspect, and sometimes reconstruct JWT payload data directly from `localStorage`. When string manipulation functions touched base64url encoded tokens improperly, they corrupted the segment structure.
2. **Missing Structure Validation:** The system passed raw string data to the Supabase client without strictly verifying that it maintained the required three-segment format (`header.payload.signature`).

## The Solution
A complete overhaul of the token handling process was implemented focusing on **strict validation without manipulation**:

1. **`utils/tokenValidator.js`**: Introduced a strict utility that checks for exactly 3 segments separated by dots, utilizing a proper base64url regex. Crucially, it does *not* attempt to decode the token into an object for general usage, preventing string reconstruction errors.
2. **`contexts/SupabaseAuthContext.jsx`**: The central auth provider now intercepts all incoming tokens (from `getSession` and `onAuthStateChange`). It validates the format *before* accepting the state update. If an invalid token structure is detected, it instantly rejects the session and clears the corrupted state.
3. **`utils/authFlowReset.js`**: Provides safe, targeted cleanup. It looks specifically for known Supabase storage keys and verifies their JSON contents against the structural validator. If a token lacks 3 segments, the specific key is safely removed without wiping user preferences unnecessarily.
4. **`main.jsx` Pre-Init Validation**: We execute the cleanup step before React even mounts the Auth Provider, ensuring that the Supabase client doesn't choke on bad data the moment it instantiates.

## Verification
To verify the fix is active and working:
1. Open Developer Tools (F12) -> Application -> Local Storage.
2. Observe the `sb-<project-id>-auth-token` key.
3. Use the newly created Debugger in the console:
   