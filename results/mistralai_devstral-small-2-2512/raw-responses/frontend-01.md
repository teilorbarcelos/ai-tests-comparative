# Tarefa: Componente React com TypeScript

**ID**: frontend-01  **Categoria**: frontend
**Latencia**: 31.88s  **Tokens out**: 1132  **tps**: 35.51

---

# Componente TodoList em React com TypeScript

Aqui está um componente `TodoList` funcional completo que atende aos requisitos:

```tsx
import React, { useState } from 'react';

type Todo = {
  id: number;
  text: string;
  done: boolean;
};

interface TodoListProps {
  initialItems: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ initialItems }) => {
  const [todos, setTodos] = useState<Todo[]>(initialItems);
  const [newTodoText, setNewTodoText] = useState('');
  const [nextId, setNextId] = useState(
    Math.max(...initialItems.map(todo => todo.id), 0) + 1
  );

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;

    const newTodo: Todo = {
      id: nextId,
      text: newTodoText,
      done: false,
    };

    setTodos([...todos, newTodo]);
    setNewTodoText('');
    setNextId(nextId + 1);
  };

  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="todo-list">
      <h2>Lista de Tarefas</h2>

      <div className="add-todo">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Nova tarefa..."
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
        />
        <button onClick={handleAddTodo}>Adicionar</button>
      </div>

      <ul className="todos">
        {todos.map(todo => (
          <li key={todo.id} className={todo.done ? 'done' : ''}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => handleToggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => handleDeleteTodo(todo.id)}>Remover</button>
          </li>
        ))}
      </ul>

      <div className="stats">
        <p>Total: {todos.length}</p>
        <p>Concluídas: {todos.filter(todo => todo.done).length}</p>
      </div>
    </div>
  );
};

export default TodoList;
```

## Explicação do Código

1. **Tipos e Interfaces**:
   - Definimos o tipo `Todo` com as propriedades obrigatórias (`id`, `text`, `done`)
   - Criamos a interface `TodoListProps` para tipar as props do componente

2. **States**:
   - `todos`: Armazena a lista de tarefas (inicializada com `initialItems`)
   - `newTodoText`: Controla o valor do input para novas tarefas
   - `nextId`: Gerencia a geração automática de IDs para novas tarefas

3. **Funções Principais**:
   - `handleAddTodo`: Adiciona uma nova tarefa à lista quando o botão é clicado ou Enter é pressionado
   - `handleToggleTodo`: Alterna o estado `done` de uma tarefa ao clicar no checkbox
   - `handleDeleteTodo`: Remove uma tarefa da lista

4. **Renderização**:
   - Input controlado para adicionar novas tarefas
   - Lista de tarefas com checkboxes e botões de remoção
   - Estatísticas simples mostrando total de tarefas e concluídas

5. **Estilização Básica** (opcional):
   Você pode adicionar CSS para melhorar a aparência, como:
   ```css
   .todo-list {
     max-width: 600px;
     margin: 0 auto;
     padding: 20px;
   }
   .add-todo input {
     padding: 8px;
     margin-right: 10px;
   }
   .todos li {
     display: flex;
     align-items: center;
     padding: 8px;
     margin-bottom: 5px;
   }
   .todos li.done span {
     text-decoration: line-through;
     color: #888;
   }
   ```

## Uso do Componente

Para usar este componente, você precisaria importá-lo e passá-lo uma lista inicial de tarefas:

```tsx
import TodoList from './TodoList';

const App = () => {
  const initialTodos: Todo[] = [
    { id: 1, text: 'Aprender React', done: false },
    { id: 2, text: 'Estudar TypeScript', done: true }
  ];

  return <TodoList initialItems={initialTodos} />;
};
```

Este componente é completamente tipado com TypeScript e implementa todas as funcionalidades solicitadas de forma eficiente usando hooks do React.
