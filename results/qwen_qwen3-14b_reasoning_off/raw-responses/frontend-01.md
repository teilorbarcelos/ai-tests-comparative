# Tarefa: Componente React com TypeScript

**ID**: frontend-01  **Categoria**: frontend
**Latencia**: 79.09s  **Tokens out**: 1182  **tps**: 14.94

---

Aqui está um exemplo completo de um componente `TodoList` em **React**, escrito em **TypeScript**, que atende aos requisitos solicitados:

---

### ✅ Funcionalidades Implementadas:
- Recebe uma lista inicial de itens (`initialItems`) como prop.
- Permite adicionar novos itens via input.
- Permite marcar itens como concluídos com um checkbox.
- Permite remover itens individualmente.

---

## 📦 Código Completo

```tsx
import React, { useState } from 'react';

// Tipo para representar um item da lista de tarefas
interface Todo {
  id: number;
  text: string;
  done: boolean;
}

// Componente funcional `TodoList`
const TodoList: React.FC<{ initialItems: Todo[] }> = ({ initialItems }) => {
  // Estado para armazenar a lista de tarefas
  const [todos, setTodos] = useState<Todo[]>(initialItems);

  // Estado para o input do novo item
  const [newTodoText, setNewTodoText] = useState<string>('');

  /**
   * Adiciona um novo item à lista.
   */
  const handleAddTodo = () => {
    if (newTodoText.trim() === '') return;

    const newTodo: Todo = {
      id: Date.now(), // Usamos o timestamp como ID único
      text: newTodoText,
      done: false,
    };

    setTodos([...todos, newTodo]);
    setNewTodoText('');
  };

  /**
   * Marca um item como concluído.
   */
  const handleToggleDone = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  /**
   * Remove um item da lista.
   */
  const handleRemoveTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>Lista de Tarefas</h2>
      
      {/* Campo para adicionar nova tarefa */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Nova tarefa..."
        />
        <button onClick={handleAddTodo}>Adicionar</button>
      </div>

      {/* Lista de tarefas */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
              backgroundColor: '#f9f9f9',
              padding: '0.5rem',
              borderRadius: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => handleToggleDone(todo.id)}
              />
              <span style={{ marginLeft: '0.5rem', textDecoration: todo.done ? 'line-through' : 'none' }}>
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => handleRemoveTodo(todo.id)}
              style={{
                backgroundColor: '#ff4d4d',
                color: 'white',
                border: 'none',
                padding: '0.3rem 0.6rem',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
```

---

## 📌 Explicação

- **Tipagem (`Todo`)**:
  - Definimos uma interface `Todo` com as propriedades: `id`, `text` e `done`.

- **useState**:
  - Usamos `useState<Todo[]>` para armazenar a lista de tarefas.
  - Outro estado, `newTodoText`, é usado para capturar o texto digitado no input.

- **Funções**:
  - `handleAddTodo`: Adiciona um novo item à lista se o texto não estiver vazio.
  - `handleToggleDone`: Alterna o status de concluído (`done`) do item selecionado.
  - `handleRemoveTodo`: Remove o item com base no ID.

- **Estilização**:
  - Usamos CSS inline para dar um estilo básico ao componente, mas você pode substituir por classes CSS ou estilos externos conforme necessário.

---

## 📌 Como Usar

```tsx
import React from 'react';
import TodoList from './TodoList';

const App: React.FC = () => {
  const initialTodos: Todo[] = [
    { id: 1, text: 'Fazer compras', done: false },
    { id: 2, text: 'Estudar TypeScript', done: true },
  ];

  return <TodoList initialItems={initialTodos} />;
};

export default App;
```

---

Se quiser, posso também adicionar funcionalidades como **editar tarefas**, **salvar no localStorage** ou **filtragem por status (pendente/concluído)**. Deseja isso?
