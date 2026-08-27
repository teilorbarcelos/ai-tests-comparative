# Tarefa: Custom hook com useEffect

**ID**: frontend-02  **Categoria**: frontend
**Latencia**: 22.62s  **Tokens out**: 1743  **tps**: 77.04

---

# Custom Hook `useDebounce` em React + TypeScript

Abaixo está um exemplo completo e tipado do custom hook `useDebounce<T>`, seguido de um componente de busca que o utiliza para filtrar uma lista com base no input. O código foi desenvolvido com boas práticas, incluindo comentários explicativos e tratamento de casos especiais (como delay zero).

---

## 1. Custom Hook: `useDebounce`

```typescript
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

/**
 * Custom hook que aplica debounce em um valor.
 * Retorna o valor após um atraso definido pelo delay.
 * 
 * @param value - Valor a ser debounced
 * @param delay - Tempo de espera em milissegundos antes de retornar o valor
 * @returns O valor atualizado após o debounce
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Se delay for zero ou negativo, retorna imediatamente
    if (delay <= 0) {
      setDebouncedValue(value);
      return;
    }

    // Cancela o timer anterior para evitar múltiplos timeouts
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Garante limpeza do timer ao desmontar ou mudar dependências
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

---

## 2. Componente de Busca com `useDebounce`

```typescript
// components/SearchList.tsx
import React, { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';

interface Person {
  id: number;
  name: string;
  email: string;
}

const people: Person[] = [
  { id: 1, name: 'Ana Silva', email: 'ana@example.com' },
  { id: 2, name: 'Bruno Santos', email: 'bruno@example.com' },
  { id: 3, name: 'Carlos Oliveira', email: 'carlos@example.com' },
  { id: 4, name: 'Daniela Costa', email: 'daniela@example.com' },
  { id: 5, name: 'Eduardo Lima', email: 'eduardo@example.com' },
];

export function SearchList() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredPeople = people.filter((person) =>
    person.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    person.email.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>🔍 Lista de Pessoas</h2>
      
      <input
        type="text"
        placeholder="Pesquisar por nome ou email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          marginBottom: '20px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />

      <div style={{ marginTop: '20px' }}>
        <h3>Resultados ({filteredPeople.length})</h3>
        
        {filteredPeople.length === 0 ? (
          <p>Nenhum resultado encontrado.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {filteredPeople.map((person) => (
              <li key={person.id} style={{
                padding: '12px',
                marginBottom: '8px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px'
              }}>
                <strong>{person.name}</strong> - {person.email}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Debug info */}
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Termo original: "{searchTerm}"</p>
        <p>Termo debounced: "{debouncedSearch}"</p>
      </div>
    </div>
  );
}

export default SearchList;
```

---

## 3. Como Usar no App Principal

```typescript
// App.tsx
import React from 'react';
import { SearchList } from './components/SearchList';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <SearchList />
    </div>
  );
}

export default App;
```

---

## 4. Explicação Detalhada

### ✅ Como Funciona o `useDebounce`

1. **useState** armazena o valor atualizado após o debounce (`debouncedValue`).
2. **useEffect** observa mudanças em `value` e `delay`.
3. Um **timer** é criado com `setTimeout` para esperar o delay antes de atualizar o estado.
4. Ao desmontar ou mudar dependências, o timer anterior é cancelado com `clearTimeout`, evitando múltiplos timers ativos.

### ✅ Por que usar Debounce?

- Evita chamadas excessivas a APIs (ex: busca em tempo real).
- Melhora performance ao filtrar listas grandes.
- Melhora experiência do usuário ao evitar atualizações muito frequentes.

### ✅ Exemplo de Uso Prático

```typescript
// Em um input de busca, o debounce evita que cada digitação dispare uma nova requisição
const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query, 500); // espera 500ms após parar de digitar
```

---

## 5. Dicas e Boas Práticas

- Use `delay` entre 300ms e 1s para buscas em tempo real.
- Para performance crítica, considere usar `useCallback` ou `memo`.
- Em cenários com muitos inputs, use um único timer global (ex: `debounceAll`).
- Sempre limpe timers ao desmontar o componente para evitar vazamentos de memória.

---

## 6. Instalação e Execução

```bash
# Crie um projeto React + TypeScript
npx create-react-app meu-projeto --template typescript

# Navegue até a pasta do projeto
cd meu-projeto

# Instale dependências (se necessário)
npm install

# Execute o app
npm start
```

---

Este exemplo é completo, tipado e pronto para uso em projetos reais. O custom hook `useDebounce` pode ser reutilizado em qualquer componente que precise de debounce, como formulários, inputs de busca ou chamadas a APIs.
