
import { useState, useEffect, useCallback } from 'react';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';

export const useSupabaseQuery = (queryFn, options = {}) => {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  const execute = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    setIsFallback(false);

    try {
      const result = await executeSupabaseQuery(() => queryFn(params), {
        retries: options.retries || 3,
        backoffMs: options.backoffMs || 1000,
        context: options.context || 'useSupabaseQuery',
        fallback: options.fallback || null,
        timeoutMs: options.timeoutMs || 10000
      });

      setData(result.data);
      if (result.error) {
        setError(result.error);
      }
      setIsFallback(result.isFallback);
      return result;
    } catch (err) {
      setError(err);
      return { data: options.fallback, error: err, isFallback: true };
    } finally {
      setLoading(false);
    }
  }, [queryFn, options.retries, options.backoffMs, options.context, options.fallback, options.timeoutMs]);

  useEffect(() => {
    if (!options.manual) {
      execute();
    }
  }, []); // Run once if not manual

  return {
    data,
    loading,
    error,
    isFallback,
    refetch: execute
  };
};
