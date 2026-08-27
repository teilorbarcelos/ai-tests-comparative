# Tarefa: Componente React com TypeScript

**ID**: frontend-01  **Categoria**: frontend
**Latencia**: 24.67s  **Tokens out**: 1923  **tps**: 77.95

---

# Componente React `TodoList` em TypeScript

Abaixo está o código completo, tipado e com comentários explicativos para um componente funcional chamado `TodoList`. Ele permite adicionar tarefas, marcar como concluídas e remover itens da lista.

```tsx
import React, { useState } from 'react';

// Definição da interface Todo
interface Todo {
  id: number;
  text: string;
  done: boolean;
}

// Componente funcional TodoList
const TodoList: React.FC = () => {
  // Estado inicial vazio para a lista de tarefas
  const [todos, setTodos] = useState<Todo[]>([]);
  // Estado para o valor do input de nova tarefa
  const [inputValue, setInputValue] = useState<string>('');

  // Função para adicionar uma nova tarefa
  const handleAddTodo = () => {
    if (inputValue.trim() === '') return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue.trim(),
      done: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue(''); // Limpa o input após adicionar
  };

  // Função para marcar uma tarefa como concluída ou não
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  // Função para remover uma tarefa da lista
  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Função auxiliar para adicionar com Enter pressionado
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📝 Lista de Tarefas</h1>

      {/* Área de entrada de nova tarefa */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Adicionar nova tarefa..."
          style={styles.input}
        />
        <button onClick={handleAddTodo} style={styles.addButton}>
          Adicionar
        </button>
      </div>

      {/* Lista de tarefas */}
      <ul style={styles.list}>
        {todos.length === 0 ? (
          <li style={styles.emptyMessage}>Nenhuma tarefa adicionada.</li>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} style={styles.todoItem}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                style={styles.checkbox}
              />
              <span
                style={{
                  ...styles.todoText,
                  textDecoration: todo.done ? 'line-through' : 'none',
                  color: todo.done ? '#888' : '#333',
                }}
              >
                {todo.text}
              </span>
              <button
                onClick={() => removeTodo(todo.id)}
                style={styles.deleteButton}
                title="Remover tarefa"
              >
                🗑️
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Resumo do progresso */}
      {todos.length > 0 && (
        <p style={styles.summary}>
          {todos.filter((t) => t.done).length} de {todos.length} tarefas concluídas
        </p>
      )}
    </div>
  );
};

// Estilos simples em JavaScript para facilitar a visualização
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '500px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  todoItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#fff',
  },
  checkbox: {
    marginRight: '10px',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  todoText: {
    flex: 1,
    fontSize: '16px',
  },
  deleteButton: {
    backgroundColor: '#ff4d4f',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
  },
  summary: {
    marginTop: '20px',
    textAlign: 'center',
    color: '#555',
    fontSize: '14px',
  },
};

export default TodoList;
```

## Explicação do Código

### 📌 Estrutura e Tipagem
- A interface `Todo` define o formato dos objetos da lista.
- O componente é funcional e usa hooks como `useState`.
- Todos os tipos são explicitamente declarados para garantir segurança de tipo.

### 🔧 Funcionalidades Implementadas
1. **Adicionar Tarefa**: Usa um input com validação simples e botão ou tecla Enter.
2. **Marcar como Concluído**: Checkbox alterna o estado `done` da tarefa.
3. **Remover Tarefa**: Botão de lixeira remove a tarefa pelo ID.
4. **Resumo de Progresso**: Mostra quantas tarefas foram concluídas.

### 🎨 Estilização
- CSS em JavaScript para manter tudo em um único arquivo.
- Layout responsivo e limpo, com feedback visual claro.

### ✅ Uso do Componente
Para usar o componente em seu projeto React:

```tsx
import TodoList from './TodoList';

function App() {
  return <TodoList />;
}
```

Este componente é modular, escalável e segue boas práticas de desenvolvimento com React e TypeScript.
