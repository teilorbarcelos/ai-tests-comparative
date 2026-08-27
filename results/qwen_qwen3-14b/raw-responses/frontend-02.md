# Tarefa: Custom hook com useEffect

**ID**: frontend-02  **Categoria**: frontend
**Latencia**: 145.6s  **Tokens out**: 2037  **tps**: 13.99

---

Aqui está a implementação do `useDebounce` e um exemplo de uso em um componente de busca com TypeScript:

```typescript
import { useState, useEffect } from 'react';

// Custom Hook para debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // Efeito que controla o tempo de atraso
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler); // Limpeza ao desmontar ou quando o valor mudar
  }, [value, delay]);

  return debouncedValue;
}

// Componente de busca com uso do hook
const SearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Usando o hook para criar um valor debounceado
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Lista de itens a serem filtrados
  const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
  
  // Filtrando os itens com base no valor debounceado
  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <h3>Busca com Debounce</h3>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Digite para buscar..."
        style={{ padding: '8px', width: '300px' }}
      />
      
      <ul style={{ marginTop: '20px' }}>
        {filteredItems.map((item, index) => (
          <li key={index} style={{ margin: '5px 0' }}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent;
```

### Explicação:

1. **Custom Hook `useDebounce<T>`**:
   - Aceita um valor genérico (`T`) e um atraso em milissegundos.
   - Usa `useState` para armazenar o valor debounceado.
   - O `useEffect` cria um timeout que atualiza o valor após o tempo especificado.
   - A limpeza do timeout é feita no retorno da função do `useEffect`, garantindo que não haja memory leaks.

2. **Componente de Busca**:
   - Mantém o estado do termo de busca com `useState`.
   - Usa o hook `useDebounce` para criar um valor debounceado.
   - Filtra a lista de itens com base no valor debounceado, garantindo que a busca só ocorra após o tempo definido.

### Funcionamento:
- Quando o usuário digita rapidamente no campo de busca, o filtro só é aplicado após 500ms de inatividade (tempo definido no `useDebounce`).
- Isso evita chamadas frequentes a APIs ou operações caras durante a digitação.
