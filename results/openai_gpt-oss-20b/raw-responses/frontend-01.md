# Tarefa: Componente React com TypeScript

**ID**: frontend-01  **Categoria**: frontend
**Latencia**: 7.06s  **Tokens out**: 1186  **tps**: 168.04

---

## Explicação rápida

- **Tipo `Todo`** – descreve cada tarefa.
- **Prop `initialItems`** – lista inicial que será usada para criar o estado interno.
- **Estado local (`todos`)** – array de `Todo`.  
  Usamos `useState<Todo[]>`.
- **Adicionar** – um `<input>` controla o texto a ser adicionado.  
  Quando o usuário pressiona *Enter* ou clica no botão, criamos um novo objeto
  com `id` gerado (timestamp + índice) e adicionamos ao array.
- **Marcar como concluído** – cada item tem um checkbox que altera a propriedade
  `done`. Usamos uma função de atualização que mapeia o array e inverte o valor
  do item clicado.
- **Remover** – botão “X” filtra o array, excluindo o item escolhido.

Tudo tipado em TypeScript e sem dependências externas além do React.

---

## Código completo

```tsx
// TodoList.tsx
import React, { useState, ChangeEvent, KeyboardEvent } from 'react';

/**
 * Modelo de uma tarefa.
 */
export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

/**
 * Props do componente.
 */
interface TodoListProps {
  /** Lista inicial de tarefas. */
  initialItems: Todo[];
}

/**
 * Componente funcional que exibe e gerencia uma lista de tarefas.
 */
const TodoList: React.FC<TodoListProps> = ({ initialItems }) => {
  /* Estado da lista de tarefas */
  const [todos, setTodos] = useState<Todo[]>(initialItems);

  /* Estado do campo de texto para adicionar nova tarefa */
  const [newText, setNewText] = useState<string>('');

  /**
   * Adiciona uma nova tarefa à lista.
   */
  const addTodo = () => {
    if (newText.trim() === '') return;

    const newTodo: Todo = {
      id: Date.now(), // simples gerador de ID
      text: newText,
      done: false,
    };

    setTodos(prev => [...prev, newTodo]);
    setNewText('');
  };

  /**
   * Alterna o estado `done` de uma tarefa.
   */
  const toggleDone = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  /**
   * Remove uma tarefa da lista.
   */
  const removeTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  /* Manipulador de mudança no input de texto */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNewText(e.target.value);

  /* Permite adicionar ao pressionar Enter */
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') addTodo();
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      {/* Seção de adição */}
      <div style={{ display: 'flex', marginBottom: 16 }}>
        <input
          type="text"
          value={newText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Nova tarefa..."
          style={{ flexGrow: 1, padding: 8 }}
        />
        <button onClick={addTodo} style={{ marginLeft: 8 }}>
          Adicionar
        </button>
      </div>

      {/* Lista de tarefas */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 8,
              background: '#f9f9f9',
              padding: 8,
              borderRadius: 4,
            }}
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleDone(todo.id)}
              style={{ marginRight: 8 }}
            />
            <span
              style={{
                flexGrow: 1,
                textDecoration: todo.done ? 'line-through' : undefined,
              }}
            >
              {todo.text}
            </span>
            <button
              onClick={() => removeTodo(todo.id)}
              style={{ marginLeft: 8, color: '#c00', border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
```

### Como usar

```tsx
import React from 'react';
import TodoList, { Todo } from './TodoList';

const initialTodos: Todo[] = [
  { id: 1, text: 'Comprar pão', done: false },
  { id: 2, text: 'Estudar TypeScript', done: true },
];

function App() {
  return (
    <div>
      <h1>Minha Lista de Tarefas</h1>
      <TodoList initialItems={initialTodos} />
    </div>
  );
}

export default App;
```

O componente `TodoList` é totalmente tipado, usa apenas hooks do React e pode ser integrado em qualquer aplicação TypeScript + React.
