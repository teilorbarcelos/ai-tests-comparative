// src/hooks/useFetch.ts
import { useState, useEffect } from 'react';
import { mockUsers } from '../api/mock';

type FetchResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useFetch<T>(url: string): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // evita setState em componente desmontado

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Simulando requisição com delay
        await new Promise((r) => setTimeout(r, 800));

        // Aqui você pode trocar por `fetch(url)` quando usar uma API real
        const response = mockUsers as unknown as T; // cast para o tipo genérico

        if (isMounted) {
          setData(response);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Erro desconhecido');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}