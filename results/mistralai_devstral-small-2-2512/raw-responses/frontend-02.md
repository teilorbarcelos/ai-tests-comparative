# Tarefa: Custom hook com useEffect

**ID**: frontend-02  **Categoria**: frontend
**Latencia**: 30.54s  **Tokens out**: 1092  **tps**: 35.75

---

# Custom Hook `useDebounce` com TypeScript

Vou criar um custom hook `useDebounce` que implementa o padrão debounce (atraso na execução) para valores genéricos. Em seguida, mostrarei como usá-lo em um componente de busca.

## Implementação do Hook

```typescript
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
```

### Explicação do código:

1. **Tipagem genérica**: O hook é genérico (`<T>`) para funcionar com qualquer tipo de valor.
2. **Estado interno**: Usamos `useState` para armazenar o valor debounced.
3. **Efeito colateral**: O `useEffect` é acionado sempre que `value` ou `delay` mudam:
   - Cria um timeout que atualiza o estado após o atraso especificado
   - Retorna uma função de cleanup para cancelar o timeout anterior (evitando execuções desnecessárias)
4. **Retorno**: O hook retorna o valor debounced.

## Exemplo de Uso: Componente de Busca

Agora, vamos criar um componente que usa este hook para implementar uma busca com debounce:

```typescript
import React, { useState } from 'react';
import useDebounce from './useDebounce';

interface Item {
  id: number;
  name: string;
}

const SearchComponent = () => {
  // Lista de itens a serem filtrados (pode vir de uma API ou ser estática)
  const allItems: Item[] = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
    { id: 4, name: 'Date' },
    { id: 5, name: 'Elderberry' },
    { id: 6, name: 'Fig' },
    { id: 7, name: 'Grape' },
    { id: 8, name: 'Honeydew' },
  ];

  // Estado para o valor do input
  const [searchTerm, setSearchTerm] = useState('');

  // Usando o hook de debounce com um atraso de 500ms
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 500);

  // Filtrar itens baseado no termo debounced
  const filteredItems = allItems.filter(item =>
    item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Busca com Debounce</h2>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Digite para buscar..."
        style={{ padding: '8px', marginBottom: '16px' }}
      />

      <div>
        <h3>Resultados ({filteredItems.length}):</h3>
        <ul>
          {filteredItems.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchComponent;
```

### Explicação do exemplo:

1. **Estado local**: Mantemos o termo de busca atual em `searchTerm`.
2. **Hook debounce**: Usamos `useDebounce` para obter um valor debounced com 500ms de atraso.
3. **Filtragem**: A lista é filtrada baseado no valor debounced, não no valor atual do input.
4. **Renderização**: Mostramos os resultados filtrados apenas quando o termo debounced muda.

## Benefícios desta abordagem:

1. **Performance**: Evita execuções desnecessárias da função de filtro enquanto o usuário digita.
2. **Experiência do usuário**: Reduz a quantidade de requisições ou processamentos enquanto o usuário está digitando.
3. **Reutilização**: O hook pode ser usado em qualquer componente que precise de debounce.

## Como funciona o debounce:

1. Quando o usuário digita, `searchTerm` muda immediately.
2. O hook `useDebounce` aguarda 500ms após a última alteração antes de atualizar `debouncedSearchTerm`.
3. A filtragem só ocorre quando `debouncedSearchTerm` muda, não em cada tecla pressionada.

Este padrão é especialmente útil para:
- Buscas em tempo real
- Validações de formulário
- Chamadas a APIs
- Qualquer operação que deve ser executada apenas após o usuário parar de interagir
