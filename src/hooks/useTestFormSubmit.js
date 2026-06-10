import { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';
import { isSupabaseConfigured } from '@/utils/envValidator';

export const useTestFormSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitTestRequest = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      if (!formData.username || formData.username.length < 3) {
        throw new Error('Kullanıcı adı en az 3 karakter olmalıdır.');
      }

      if (!isSupabaseConfigured()) {
        console.warn("[useTestFormSubmit] Supabase not configured. Simulating submit.");
        return { success: true, data: [{ id: 'mock-id' }] };
      }

      console.log("Submitting test request to Supabase...");
      const requestData = {
        username: formData.username,
        device_type: formData.device_type,
        app_name: formData.app_name,
        special_note: formData.special_note || '',
        status: 'new',
        created_at: new Date().toISOString()
      };

      const { data, error: sbError } = await executeSupabaseQuery(
        () => supabase.from('test_requests').insert([requestData]).select(),
        { retries: 3, context: 'submit_test_request' }
      );

      if (sbError) throw sbError;

      return { success: true, data };
    } catch (err) {
      console.error('Error submitting test request:', err);
      const msg =
        'Talep şu an kaydedilemedi. WhatsApp üzerinden bize ulaşarak test veya paket için devam edebilirsiniz.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { submitTestRequest, loading, error };
};