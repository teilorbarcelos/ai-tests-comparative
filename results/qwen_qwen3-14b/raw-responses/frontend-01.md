# Tarefa: Componente React com TypeScript

**ID**: frontend-01  **Categoria**: frontend
**Latencia**: 188.11s  **Tokens out**: 2600  **tps**: 13.82

---

Aqui está o código completo do componente `TodoList` em React com TypeScript:

```tsx
import React, { useState } from 'react';

// Definição da interface para um item de tarefa
interface Todo {
  id: number;
  text: string;
  done: boolean;
}

// Definição das propriedades do componente
interface TodoListProps {
  initialItems: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ initialItems }) => {
  // Estado para armazenar a lista de tarefas
  const [todos, setTodos] = useState<Todo[]>(initialItems);
  
  // Estado para o valor do input de nova tarefa
  const [inputValue, setInputValue] = useState<string>('');

  /**
   * Adiciona uma nova tarefa à lista
   */
  const addTodo = () => {
    if (inputValue.trim() === '') return;

    const newTodo: Todo = {
      id: Date.now(), // Gera um ID único com base no tempo atual
      text: inputValue,
      done: false
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  /**
   * Alterna o estado de conclusão de uma tarefa específica
   */
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  /**
   * Remove uma tarefa específica da lista
   */
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      {/* Formulário para adicionar novas tarefas */}
      <form 
        onSubmit={(e) => { 
          e.preventDefault(); 
          addTodo(); 
        }}
        style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nova tarefa..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          Adicionar
        </button>
      </form>

      {/* Lista de tarefas */}
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {todos.map((todo) => (
          <li 
            key={todo.id} 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px',
              border: '1px solid #ccc',
              marginBottom: '5px'
            }}
          >
            {/* Checkbox para marcar como concluído */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                style={{ marginRight: '10px' }}
              />
              <span 
                style={{
                  textDecoration: todo.done ? 'line-through' : 'none',
                  color: todo.done ? '#888' : '#333'
                }}
              >
                {todo.text}
              </span>
            </div>

            {/* Botão para remover tarefa */}
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                backgroundColor: '#ff4d4d',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px'
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

### Explicação do Código:

1. **Tipagem com TypeScript**:
   - Definimos a interface `Todo` para representar cada item da lista.
   - Usamos `React.FC<TodoListProps>` para tipar o componente, garantindo que ele receba as propriedades corretas.

2. **Gerenciamento de Estado com `useState`**:
   - `todos`: Armazena a lista completa de tarefas.
   - `inputValue`: Controla o valor do campo de entrada para adicionar novas tarefas.

3. **Funcionalidades Principais**:
   - **Adicionar Tarefa**: O formulário captura o texto digitado e adiciona uma nova tarefa com um ID único gerado via `Date.now()`.
   - **Marcar como Concluído**: O checkbox alterna o estado da propriedade `done` de cada item.
   - **Remover Tarefa**: O botão remove a tarefa correspondente do array.

4. **Estilização Básica**:
   - Estilos inline são usados para demonstração, mas você pode substituí-los por CSS ou bibliotecas como styled-components se preferir.

Este componente é reutilizável e segue boas práticas de desenvolvimento com React e TypeScript.
