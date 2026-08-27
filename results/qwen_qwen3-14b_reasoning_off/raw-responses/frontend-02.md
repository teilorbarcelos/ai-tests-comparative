# Tarefa: Custom hook com useEffect

**ID**: frontend-02  **Categoria**: frontend
**Latencia**: 71.29s  **Tokens out**: 1022  **tps**: 14.33

---

Claro! Vamos criar um **custom hook** chamado `useDebounce<T>` no TypeScript que implementa o padrão *debounce*, e depois usaremos ele em um componente React para filtrar uma lista com base na entrada do usuário.

---

## ✅ 1. Criando o Custom Hook: `useDebounce<T>`

```tsx
import { useState, useEffect } from 'react';

// Custom hook debounce genérico
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura o timer de debounce
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer ao desmontar ou quando o valor mudar
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### 🔍 Explicação:

- `useState<T>(value)` armazena o valor "atrasado".
- O `useEffect` é acionado sempre que `value` ou `delay` mudam.
- Usamos `setTimeout` para atrasar a atualização do `debouncedValue`.
- Retornamos o valor debounced, que será atualizado apenas após o tempo de atraso (`delay`) ter passado sem novas alterações no `value`.

---

## ✅ 2. Exemplo de Uso: Componente de Busca com Filtro

Agora vamos criar um componente React simples para buscar em uma lista usando nosso hook.

```tsx
import React, { useState } from 'react';

// Hook debounce criado acima
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Componente de busca com debounce
const SearchComponent: React.FC = () => {
  // Dados de exemplo
  const items = [
    'Apple',
    'Banana',
    'Cherry',
    'Date',
    'Elderberry',
    'Fig',
    'Grape',
    'Honeydew'
  ];

  // Estado do input
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Usando o hook debounce com delay de 500ms
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Filtrar os itens com base no termo debounced
  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>Busca com Debounce</h2>
      <input
        type="text"
        placeholder="Digite para buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '10px', fontSize: '16px' }}
      />
      <ul style={{ marginTop: '20px' }}>
        {filteredItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent;
```

---

## 📌 Como Funciona:

- O usuário digita no input.
- `searchTerm` é atualizado imediatamente.
- `useDebounce` atrasa a atualização de `debouncedSearchTerm`.
- A lista é filtrada com base em `debouncedSearchTerm`, evitando chamadas frequentes.

---

## 🧪 Exemplo de Uso no App

Se você estiver usando o React com TypeScript, basta importar e usar o componente:

```tsx
import React from 'react';
import SearchComponent from './SearchComponent';

const App: React.FC = () => {
  return (
    <div>
      <h1>Aplicação de Busca</h1>
      <SearchComponent />
    </div>
  );
};

export default App;
```

---

## ✅ Conclusão

- O hook `useDebounce<T>` é genérico e pode ser usado com qualquer tipo.
- Ele evita chamadas excessivas a APIs ou operações caras, como filtragem de listas.
- A implementação é simples, limpa e reutilizável.

Se quiser, posso também mostrar uma versão do hook usando `useRef` para otimizar ainda mais. 😊
