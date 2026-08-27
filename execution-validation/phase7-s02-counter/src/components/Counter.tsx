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