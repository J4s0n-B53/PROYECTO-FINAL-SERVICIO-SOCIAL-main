import { useState, useCallback } from 'react';

/**
 * Hook genérico para llamadas a la API con manejo de estado
 * @param {Function} fn - Función async que llama a la API
 */
export function useApi(fn) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err?.response?.data?.error || 'Error inesperado');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fn]);

  return { data, loading, error, execute };
}
