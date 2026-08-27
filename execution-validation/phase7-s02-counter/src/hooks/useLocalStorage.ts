/* src/hooks/useLocalStorage.ts */
import { useState, useEffect } from 'react';

/**
 * Hook genérico para persistir um valor no localStorage.
 *
 * @template T Tipo do dado armazenado (string | number | boolean | object | array)
 * @param key Chave usada no localStorage
 * @param initialValue Valor inicial caso a chave não exista
 * @returns [valor, setValor]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const readValue = (): T => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        // Se o valor for JSON (objeto/array), parse
        return JSON.parse(storedValue) as T;
      }
    } catch (_) {
      /* eslint-disable-next-line no-console */
      console.warn(`useLocalStorage: erro ao ler a chave ${key}`);
    }

    return initialValue;
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Persistir sempre que mudar
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (_) {
      /* eslint-disable-next-line no-console */
      console.warn(`useLocalStorage: erro ao salvar a chave ${key}`);
    }
  }, [key, storedValue]);

  const setValue = (value: T) => {
    setStoredValue(value);
  };

  return [storedValue, setValue];
}