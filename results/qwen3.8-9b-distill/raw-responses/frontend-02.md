# Tarefa: Custom hook com useEffect

**ID**: frontend-02  **Categoria**: frontend
**Latencia**: 21.81s  **Tokens out**: 1946  **tps**: 89.23

---

```tsx
import React, { useState, useEffect } from 'react';

// ============================================
// Custom Hook: useDebounce<T>
// ============================================
/**
 * Hook que retorna um valor após um atraso (debounce).
 * Útil para evitar chamadas excessivas a APIs ou filtros pesados.
 * 
 * @param value - O valor atual que será debounceado
 * @param delay - Tempo em milissegundos antes de retornar o valor
 * @returns O valor após o debounce
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Cancela o timer anterior para evitar múltiplos timers rodando
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor mudar antes do delay acabar
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================
// Componente: Lista de Produtos (Exemplo)
// ============================================
interface Produto {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
}

const PRODUTOS: Produto[] = [
  { id: 1, nome: 'Notebook Dell XPS', preco: 8999.00, categoria: 'Eletrônicos' },
  { id: 2, nome: 'Mouse Logitech MX Master', preco: 459.00, categoria: 'Acessórios' },
  { id: 3, nome: 'Teclado Mecânico Keychron', preco: 679.00, categoria: 'Acessórios' },
  { id: 4, nome: 'Monitor Samsung 27"', preco: 1899.00, categoria: 'Eletrônicos' },
  { id: 5, nome: 'Cadeira Gamer', preco: 1299.00, categoria: 'Móveis' },
  { id: 6, nome: 'Webcam Logitech C920', preco: 349.00, categoria: 'Acessórios' },
  { id: 7, nome: 'SSD Samsung 1TB', preco: 599.00, categoria: 'Armazenamento' },
  { id: 8, nome: 'Headset Sony WH-1000XM4', preco: 1499.00, categoria: 'Áudio' },
];

// ============================================
// Componente de Busca com Debounce
// ============================================
const BuscadorDeProdutos = () => {
  const [busca, setBusca] = useState<string>('');
  
  // Aplica o debounce no valor do input (500ms)
  const termoBuscaDebounced = useDebounce(busca, 500);

  // Filtra os produtos com base no termo buscado
  const resultados = PRODUTOS.filter((produto) =>
    produto.nome.toLowerCase().includes(termoBuscaDebounced.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(termoBuscaDebounced.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1>🔍 Buscador de Produtos</h1>
      
      {/* Input com debounce */}
      <input
        type="text"
        placeholder="Digite para buscar..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={styles.input}
      />

      {/* Indicador de estado do debounce */}
      {termoBuscaDebounced && (
        <p style={styles.status}>
          ⏳ Buscando por: <strong>"{termoBuscaDebounced}"</strong>
        </p>
      )}

      {/* Resultados */}
      <div style={styles.results}>
        {resultados.length === 0 ? (
          <p>Nenhum resultado encontrado.</p>
        ) : (
          resultados.map((produto) => (
            <div key={produto.id} style={styles.card}>
              <h3>{produto.nome}</h3>
              <p>Categoria: {produto.categoria}</p>
              <p>Preço: R$ {produto.preco.toFixed(2)}</p>
            </div>
          ))
        )}
      </div>

      {/* Explicação visual do debounce */}
      <div style={styles.explanation}>
        <h3>📌 Como funciona o debounce:</h3>
        <ul>
          <li>
            Ao digitar, o valor é atualizado imediatamente no input.
          </li>
          <li>
            O hook <code>useDebounce</code> espera 500ms sem novas alterações
            antes de passar o valor para o filtro.
          </li>
          <li>
            Isso evita que a lista seja filtrada a cada tecla pressionada,
            melhorando o desempenho e reduzindo chamadas desnecessárias.
          </li>
        </ul>
      </div>
    </div>
  );
};

// ============================================
// Estilos (CSS-in-JS simples)
// ============================================
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    marginBottom: '16px',
    boxSizing: 'border-box',
  },
  status: {
    color: '#4a90d9',
    fontSize: '14px',
    marginBottom: '12px',
  },
  results: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  card: {
    padding: '16px',
    border: '1px solid #eee',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  explanation: {
    marginTop: '32px',
    padding: '16px',
    backgroundColor: '#eef4ff',
    borderRadius: '8px',
    fontSize: '14px',
  },
};

// ============================================
// Exportação
// ============================================
export { useDebounce };
export default BuscadorDeProdutos;
```

## 📋 Explicação Detalhada

### Como o Hook Funciona

| Passo | Ação |
|-------|------|
| 1️⃣ | `useState` guarda o valor atual e o valor debounceado |
| 2️⃣ | `useEffect` cria um timer com `setTimeout` ao receber novo valor |
| 3️⃣ | Após `delay` ms, o valor é passado para o estado |
| 4️⃣ | O `return () => clearTimeout(handler)` limpa timers anteriores (evita vazamento de memória) |

### Por que usar Debounce?

```
Tecla pressionada → Input atualiza → Timer reinicia → 
Após 500ms sem novas teclas → Filtro é executado
```

**Sem debounce:** O filtro roda a cada tecla (ex: 10x por segundo)  
**Com debounce:** O filtro roda apenas uma vez após o usuário parar de digitar

### Pontos Chave do Código

- **Tipagem genérica `<T>`**: Funciona com strings, números, objetos, arrays
- **`clearTimeout` no cleanup**: Garante que timers antigos sejam cancelados se o valor mudar antes do delay expirar
- **Filtro case-insensitive**: A busca não diferencia maiúsculas de minúsculas
