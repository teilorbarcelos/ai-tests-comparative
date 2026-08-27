# Tarefa: Custom hook com useEffect

**ID**: frontend-02  **Categoria**: frontend
**Latencia**: 7.49s  **Tokens out**: 1269  **tps**: 169.49

---

## 1️⃣ Hook `useDebounce`

```tsx
import { useState, useEffect } from 'react';

/**
 * Retorna o valor passado após um atraso (debounce).
 *
 * @template T - Tipo do valor que será debounced.
 * @param value   Valor atual que pode mudar a qualquer momento.
 * @param delay   Tempo em milissegundos que deve passar antes de atualizar
 *                o estado interno. Se `delay` for 0, o hook devolve imediatamente
 *                o valor recebido.
 *
 * @returns O mesmo valor de `value`, mas só atualizado depois do atraso.
 */
export function useDebounce<T>(value: T, delay: number): T {
  // Estado que armazenará o valor “debounced”.
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Se o delay for zero, atualizamos imediatamente.
    if (delay === 0) {
      setDebouncedValue(value);
      return;
    }

    // Cria um timer que atualizará `debouncedValue` depois do atraso.
    const handler = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer caso o componente seja desmontado ou
    // se `value`/`delay` mudarem antes de terminar o timeout.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Dependências

  return debouncedValue;
}
```

### Como funciona?

1. **Estado inicial** – O hook começa com o valor atual (`value`) para que a primeira renderização já mostre algo.
2. **`useEffect`** – Sempre que `value` ou `delay` mudarem, criamos um *timeout*.
3. **Limpeza** – Se o componente for desmontado ou se houver outra mudança antes do timeout terminar, cancelamos o timer para evitar vazamentos de memória e chamadas assíncronas indesejadas.
4. **Retorno** – O valor debounced é retornado; ele só muda depois que o atraso expirar.

---

## 2️⃣ Exemplo prático: Busca com debounce

Vamos criar um componente simples que:

- Possui uma lista fixa de itens (ex.: nomes).
- Um `<input>` onde o usuário digita a busca.
- Filtra a lista usando o valor debounced, evitando chamadas de filtro em cada tecla.

```tsx
import React, { useState } from 'react';
import { useDebounce } from './useDebounce'; // ajuste o caminho conforme sua estrutura

// Lista de exemplo (poderia vir de uma API)
const NAMES = [
  'Ana',
  'Bruno',
  'Carla',
  'Daniel',
  'Eduardo',
  'Fernanda',
  'Guilherme',
  'Helena',
  'Igor',
  'Juliana',
];

export const SearchWithDebounce: React.FC = () => {
  // Valor digitado pelo usuário
  const [query, setQuery] = useState<string>('');

  // Valor debounced (atualiza apenas depois de `delay` ms)
  const debouncedQuery = useDebounce(query, 500); // 500ms

  // Filtra a lista quando o valor debounced mudar
  const filteredNames = NAMES.filter((name) =>
    name.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 400, margin: '2rem auto' }}>
      <h2>Busca com Debounce</h2>

      {/* Input de busca */}
      <input
        type="text"
        placeholder="Digite um nome..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '0.5rem',
          fontSize: '1rem',
          marginBottom: '1rem',
        }}
      />

      {/* Exibe o valor que está sendo debounced */}
      <p>
        <strong>Valor atual (debounced):</strong>{' '}
        {debouncedQuery || '(vazio)'}
      </p>

      {/* Lista filtrada */}
      <ul>
        {filteredNames.length > 0 ? (
          filteredNames.map((name) => <li key={name}>{name}</li>)
        ) : (
          <li>Sem resultados</li>
        )}
      </ul>
    </div>
  );
};
```

### O que acontece?

1. **Entrada** – Cada vez que o usuário digita, `query` muda imediatamente.
2. **Debounce** – `useDebounce` só atualiza `debouncedQuery` após 500 ms de inatividade.
3. **Filtro** – Quando `debouncedQuery` mudar, a lista é filtrada novamente.
4. **Resultado** – O usuário vê os resultados apenas depois que ele parar de digitar por meio do atraso configurado.

---

## 3️⃣ Dicas e boas práticas

| Tema | Recomendações |
|------|---------------|
| **Limpeza** | Sempre limpe timers em `useEffect` para evitar *memory leaks*. |
| **Delay zero** | Se precisar que o valor seja instantâneo, basta passar `0`. O hook lida com isso. |
| **Tipagem genérica** | Usar `<T>` permite que o hook funcione com strings, números, objetos, etc. |
| **Reutilização** | Esse hook pode ser usado em qualquer situação onde você precise “atrasar” uma ação (ex.: chamadas de API, animações). |

Pronto! Agora você tem um `useDebounce` tipado e um exemplo completo de como usá‑lo para criar buscas mais eficientes. 🚀
