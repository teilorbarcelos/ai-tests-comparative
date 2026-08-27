# Tarefa: Componente React com TypeScript

**ID**: frontend-01  **Categoria**: frontend
**Latencia**: 22.97s  **Tokens out**: 2238  **tps**: 97.42

---

```tsx
import React, { useState } from 'react';

// Definição do tipo Todo
interface Todo {
  id: number;
  text: string;
  done: boolean;
}

/**
 * Componente TodoList
 * 
 * Permite gerenciar uma lista de tarefas com as seguintes funcionalidades:
 * - Adicionar novas tarefas via um campo de input
 * - Marcar/desmarcar tarefas como concluídas (checkbox)
 * - Remover tarefas da lista
 * 
 * @param initialItems - Lista inicial de tarefas
 */
const TodoList: React.FC<{ initialItems: Todo[] }> = ({ initialItems }) => {
  // Estado que armazena a lista de tarefas
  const [todos, setTodos] = useState<Todo[]>(initialItems);

  // Estado para armazenar o texto digitado pelo usuário no input
  const [inputValue, setInputValue] = useState<string>('');

  /**
   * Adiciona uma nova tarefa à lista
   * Valida que o campo não esteja vazio antes de adicionar
   */
  const handleAddTodo = () => {
    if (inputValue.trim() === '') return; // Ignora entradas vazias

    const newTodo: Todo = {
      id: Date.now(), // Gera um ID único baseado no timestamp
      text: inputValue.trim(),
      done: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue(''); // Limpa o input após adicionar
  };

  /**
   * Alterna o estado 'done' de uma tarefa específica
   * @param id - ID da tarefa a ser alterada
   */
  const handleToggleDone = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  /**
   * Remove uma tarefa da lista pelo seu ID
   * @param id - ID da tarefa a ser removida
   */
  const handleRemoveTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Função auxiliar para formatar o texto do input com placeholder
  const getInputPlaceholder = () => {
    return todos.length === 0 ? 'Adicionar nova tarefa...' : '';
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 Minha Lista de Tarefas</h2>

      {/* Área de adição de novas tarefas */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          placeholder={getInputPlaceholder()}
          style={styles.input}
        />
        <button onClick={handleAddTodo} style={styles.addButton}>
          + Adicionar
        </button>
      </div>

      {/* Lista de tarefas */}
      {todos.length === 0 ? (
        <p style={styles.emptyMessage}>Nenhuma tarefa na lista. Adicione uma acima! 🎉</p>
      ) : (
        <ul style={styles.list}>
          {todos.map((todo) => (
            <li key={todo.id} style={styles.todoItem}>
              {/* Checkbox para marcar como concluído */}
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => handleToggleDone(todo.id)}
                style={styles.checkbox}
              />

              {/* Texto da tarefa (com riscado se concluída) */}
              <span
                style={{
                  ...styles.todoText,
                  textDecoration: todo.done ? 'line-through' : 'none',
                  color: todo.done ? '#888' : '#333',
                }}
              >
                {todo.text}
              </span>

              {/* Botão de remover */}
              <button onClick={() => handleRemoveTodo(todo.id)} style={styles.removeButton}>
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Resumo estatístico */}
      {todos.length > 0 && (
        <p style={styles.summary}>
          {todos.filter((t) => t.done).length}/{todos.length} tarefas concluídas
        </p>
      )}
    </div>
  );
};

// Estilos CSS-in-JS para manter o componente auto-contido
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '500px',
    margin: '40px auto',
    padding: '24px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#1a1a2e',
    marginBottom: '20px',
    fontSize: '1.5rem',
  },
  inputContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  addButton: {
    padding: '12px 20px',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  todoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    marginBottom: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#4f46e5',
  },
  todoText: {
    flex: 1,
    fontSize: '1rem',
    wordBreak: 'break-word',
  },
  removeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    opacity: '0.6',
    transition: 'opacity 0.2s',
    padding: '4px',
    borderRadius: '50%',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#9ca3af',
    fontStyle: 'italic',
    padding: '20px',
  },
  summary: {
    marginTop: '16px',
    fontSize: '0.875rem',
    color: '#6b7280',
    textAlign: 'center',
  },
};

export default TodoList;
```

## Explicação do Código

| Conceito | Implementação |
|----------|--------------|
| **Tipo `Todo`** | Interface com `id`, `text` e `done` |
| **Estado da lista** | `useState<Todo[]>(initialItems)` — inicializa com as props recebidas |
| **Input de texto** | `useState<string>` controla o valor do campo de entrada |
| **Adicionar tarefa** | Cria um novo objeto `Todo` com ID único (`Date.now()`) e concatena ao array |
| **Marcar como feito** | Usa `.map()` para atualizar apenas o item correspondente (imutabilidade) |
| **Remover tarefa** | Usa `.filter()` para excluir o item pelo ID |
| **Enter no input** | `onKeyPress` com verificação de tecla 'Enter' |

### Pontos importantes:

- ✅ **Imutabilidade**: Sempre criamos novos arrays/objetos em vez de mutar o estado diretamente.
- ✅ **ID único**: Usamos `Date.now()` como ID simples (em produção, consideraria UUID).
- ✅ **Validação**: Ignora entradas vazias ao adicionar.
- ✅ **Feedback visual**: Texto riscado e cor cinza quando a tarefa está concluída.
- ✅ **Resumo**: Mostra quantas tarefas foram concluídas no total.
