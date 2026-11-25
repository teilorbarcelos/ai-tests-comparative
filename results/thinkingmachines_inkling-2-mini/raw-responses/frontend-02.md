# Tarefa: Custom hook com useEffect

**ID**: frontend-02  **Categoria**: frontend
**Latencia**: 118.27s  **Tokens out**: 1861  **tps**: 15.73

---

# Hook `useDebounce`

## Implementação

```ts
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Agenda a atualização do valor após o atraso
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpeza: cancela o timer pendente se value/delay mudarem ou o componente desmontar
    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}
```

## Como funciona

1. **`useState<T>(value)`** — inicializa com o valor atual, então a primeira renderização já usa o valor correto (sem "piscar" vazio).
2. **`setTimeout`** — só aplica o novo valor após `delay` milissegundos sem mudanças.
3. **Função de cleanup** — toda vez que `value` ou `delay` mudam, o timer anterior é cancelado antes do próximo ser agendado. Isso garante que apenas a última digitação seja processada (o "debounce").

## Exemplo: componente de busca com filtro

```tsx
import { useMemo, useState } from 'react';
import { useDebounce } from './useDebounce';

interface Produto {
  id: number;
  nome: string;
  categoria: string;
}

const produtos: Produto[] = [
  { id: 1, nome: 'Notebook Gamer', categoria: 'Eletrônicos' },
  { id: 2, nome: 'Mouse Sem Fio', categoria: 'Periféricos' },
  { id: 3, nome: 'Teclado Mecânico', categoria: 'Periféricos' },
  { id: 4, nome: 'Monitor 27"', categoria: 'Eletrônicos' },
  { id: 5, nome: 'Cadeira Ergonômica', categoria: 'Móveis' },
];

export function SearchComponent() {
  const [query, setQuery] = useState('');           // valor "bruto" do input
  const debouncedQuery = useDebounce(query, 300);    // valor com atraso de 300ms

  // Filtra apenas quando o valor DEBOUNCED muda — não a cada tecla digitada
  const filteredProdutos = useMemo(() => {
    const termo = debouncedQuery.trim().toLowerCase();
    if (!termo) return produtos;

    return produtos.filter(
      (p) =>
        p.nome.toLowerCase().includes(termo) ||
        p.categoria.toLowerCase().includes(termo),
    );
  }, [debouncedQuery]);

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto' }}>
      <input
        type="text"
        value={query}                               // input sempre responsivo
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar produtos..."
        style={{ width: '100%', padding: 8, fontSize: 16 }}
      />

      <p>{filteredProdutos.length} resultado(s)</p>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredProdutos.map((p) => (
          <li key={p.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <strong>{p.nome}</strong> — {p.categoria}
          </li>
        ))}
        {filteredProdutos.length === 0 && (
          <li style={{ color: '#888', padding: '8px 0' }}>Nenhum produto encontrado.</li>
        )}
      </ul>
    </div>
  );
}
```

## Por que usar o debounce aqui?

- **Input responsivo**: `query` atualiza a cada tecla, então o usuário vê o texto digitado instantaneamente.
- **Filtro eficiente**: `filteredProdutos` só é recalculado quando `debouncedQuery` muda — ou seja, 300ms após o usuário parar de digitar. Isso evita recálculos desnecessários a cada keystroke (e seria ainda mais importante se você fizesse uma chamada à API em vez de filtrar localmente).
- **Cleanup correto**: se o componente for desmontado com um timer pendente, `clearTimeout` evita atualizar estado num componente morto.

## Observações

- O hook é genérico (`<T>`), então funciona para strings, números ou qualquer tipo — por exemplo, debounce de uma coordenada `{ x: number; y: number }` também funciona.
- Se o filtro envolver **chamadas assíncronas** (ex.: API), combine com um efeito que cancela a requisição anterior usando `AbortController` ou um flag de "stale" — o debounce sozinho não resolve isso.
- Para valores primitivos como string, `useMemo` é suficiente; para objetos/arrays recriados a cada render no componente pai, considere memoizar a referência do valor passado ao hook (ou usar `JSON.stringify` como chave) para evitar timers desnecessários.
