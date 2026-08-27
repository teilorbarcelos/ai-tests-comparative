# Tarefa: Custom hook com useEffect

**ID**: frontend-02  **Categoria**: frontend
**Latencia**: 16.58s  **Tokens out**: 1401  **tps**: 84.48

---


Aqui está um custom hook `useDebounce` implementado em TypeScript junto com um exemplo de uso:

```tsx
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura o timeout para atualizar o valor após o debounce
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Retorna uma função de cleanup para cancelar o timeout quando necessário
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Exemplo de uso em componente de busca:
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  
  // Lista original (poderia vir de uma API ou contexto)
  const items: Item[] = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    // ... outros itens
  ];

  // Usando o hook para debounced search term (atualizado após pausa no typing)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setFilteredItems([]);
      return;
    }

    // Simulando busca na API com debounce
    const fetchResults = async () => {
      try {
        // Em uma implementação real, você faria a chamada à API aqui
        console.log(`Buscando por: ${debouncedSearchTerm}`);
        
        // Exemplo de filtro local (para demonstração)
        const results = items.filter(item => 
          item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
        
        setFilteredItems(results);
      } catch (error) {
        console.error('Erro na busca:', error);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Digite para buscar..."
      />
      
      {filteredItems.length > 0 && (
        <ul>
          {filteredItems.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Definição do tipo Item (ajuste conforme sua estrutura de dados)
interface Item {
  id: number;
  name: string;
}
```

Explicação detalhada:

1. **Hook `useDebounce`**:
   - Recebe um valor genérico e um tempo de delay como parâmetros
   - Usa `useState` para armazenar o valor original (`value`) e o valor debounced (atrasado)
   - Configura um `setTimeout` no useEffect que atualiza o estado após o delay especificado
   - Retorna uma função cleanup para cancelar o timeout quando o componente desmonta ou os dependências mudam

2. **Funcionamento do debounce**:
   - Quando o usuário digita, o valor original é atualizado imediatamente
   - O hook mantém um setTimeout que só executa a atualização após 500ms sem atividades no exemplo
   - Isso evita múltiplas chamadas enquanto o usuário está digitando

3. **Exemplo de busca**:
   - Usa debounce para evitar buscas constantes durante digitação
   - Atualiza os resultados apenas quando o usuário pausa por 500ms
   - Demonstra como usar com uma lista local (para simplificar)

Principais benefícios dessa implementação:
- Evita chamadas desnecessárias a APIs ou operações pesadas durante digitação rápida
- Melhora o desempenho do aplicativo ao reduzir o número de re-renderizações e requisições
- Mantém um código limpo separando lógica de debounce da lógica principal

Para usar com chamadas assíncronas (como APIs), você pode substituir a parte local:
```tsx
// No useEffect do SearchComponent, substitua o filtro por uma chamada real à API
const fetchResults = async () => {
  try {
    const response = await apiService.search(debouncedSearchTerm);
    setFilteredItems(response.data);
  } catch (error) {
    // Tratamento de erro...
  }
};
```

Lembre-se que:
- O delay padrão no exemplo é 500ms, mas pode ser ajustado conforme necessidade
- Para buscas muito curtas, considere usar um mínimo de caracteres antes de disparar a busca
- Em aplicações reais, você deve lidar com estados carregando/erro para melhor UX
