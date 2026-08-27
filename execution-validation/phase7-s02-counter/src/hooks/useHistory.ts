/* src/hooks/useHistory.ts */
import { useRef, useEffect } from 'react';

/**
 * Hook que mantém um histórico dos valores já atribuídos.
 *
 * @template T Tipo do valor a ser rastreado
 * @param value Valor atual (deve ser passado sempre)
 * @returns Array contendo todos os valores anteriores + o atual
 */
export function useHistory<T>(value: T): T[] {
  const historyRef = useRef<T[]>([value]);

  // Atualiza apenas quando `value` mudar
  useEffect(() => {
    if (historyRef.current[historyRef.current.length - 1] !== value) {
      historyRef.current.push(value);
    }
  }, [value]);

  return historyRef.current;
}