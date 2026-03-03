import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pkppewdtnuchwjtmulev.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrcHBld2R0bnVjaHdqdG11bGV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MDIzMzIsImV4cCI6MjA2NjQ3ODMzMn0.P2KIzJHmDCPOHrWQymZJEjhg4opXKn8DBD6NDCsWshI';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
