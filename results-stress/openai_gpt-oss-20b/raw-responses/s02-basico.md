# Tarefa: Componente com hooks avancados

**ID**: s02-basico  **Categoria**: frontend
**Latencia**: 9.55s  **Tokens out**: 1690  **tps**: 176.98

---

## Visão geral

- **`useLocalStorage<T>`** – Hook genérico que salva/recupera um valor no `localStorage`.  
  Ele aceita uma *chave* (`key`) e um *valor inicial* (`initialValue`).  
  O hook retorna o valor atual e uma função para atualizar esse valor.  
- **`useHistory<T>`** – Hook que mantém um histórico (array) dos valores já atribuídos ao estado.  
  Sempre que o valor mudar, ele é adicionado ao fim do array.
- **`Counter`** – Componente funcional que usa `useReducer` para gerenciar o contador.  
  O reducer possui três ações: `increment`, `decrement` e `reset`.  
  O estado inicial vem de `useLocalStorage` (persistindo no navegador).  
  Cada mudança dispara a atualização do histórico via `useHistory`.

> Todos os tipos são explicitamente declarados, garantindo que o TypeScript possa inferir corretamente.

---

## Código completo

```tsx
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
```

```tsx
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
```

```tsx
/* src/components/Counter.tsx */
import React, { useReducer } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useHistory } from '../hooks/useHistory';

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset'; payload?: number };

interface State {
  count: number;
}

/**
 * Reducer que lida com as três ações do contador.
 */
function counterReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: typeof action.payload === 'number' ? action.payload : 0 };
    default:
      return state;
  }
}

/**
 * Componente Counter
 */
export const Counter: React.FC = () => {
  /* Persistir o estado no localStorage */
  const [storedCount, setStoredCount] = useLocalStorage<number>('counter', 0);

  /* Reducer que recebe o valor inicial do localStorage */
  const [state, dispatch] = useReducer(counterReducer, { count: storedCount });

  /* Atualiza o localStorage sempre que o contador mudar */
  React.useEffect(() => {
    setStoredCount(state.count);
  }, [state.count, setStoredCount]);

  /* Histórico de valores */
  const history = useHistory(state.count);

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>Contador</h2>
      <p style={{ fontSize: '2rem' }}>{state.count}</p>

      <button onClick={() => dispatch({ type: 'decrement' })} disabled={state.count === 0}>
        -
      </button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'reset', payload: 0 })}>Reset</button>

      <h3>Histórico</h3>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {history.map((value, idx) => (
          <li key={idx}>{value}</li>
        ))}
      </ul>
    </div>
  );
};
```

```tsx
/* src/App.tsx */
import React from 'react';
import { Counter } from './components/Counter';

const App: React.FC = () => {
  return (
    <div className="App">
      <Counter />
    </div>
  );
};

export default App;
```

---

## Como funciona

1. **Persistência**  
   - `useLocalStorage` lê o valor da chave `"counter"` no `localStorage`.  
   - Se não existir, usa `0`.  
   - Quando o contador muda (`state.count`), o efeito dentro do componente atualiza o localStorage.

2. **Gerenciamento de estado**  
   - O reducer recebe ações simples e retorna um novo objeto `{ count }`.  
   - Usamos `useReducer` para que a lógica seja centralizada e previsível.

3. **Histórico**  
   - `useHistory` mantém uma referência mutável (`useRef`) ao array de valores.  
   - Em cada render, se o valor atual for diferente do último registrado, ele é adicionado.  
   - O componente exibe esse histórico em uma lista.

4. **Tipagem**  
   - Todos os tipos são explícitos: `Action`, `State`, `useLocalStorage<T>`, `useHistory<T>`.  
   - Isso garante que o TypeScript detecte erros de tipo antes da compilação.

---

## Como testar

1. Instale as dependências:

```bash
npm install react react-dom @types/react @types/react-dom typescript
```

2. Compile e rode a aplicação (ex.: `create-react-app` ou Vite).  
3. Abra o navegador, interaja com os botões e observe:
   - O valor persiste mesmo após recarregar a página.
   - O histórico mostra todas as mudanças realizadas.

Pronto! Você tem um contador funcional, tipado, persistente e com histórico de valores usando React + TypeScript.
