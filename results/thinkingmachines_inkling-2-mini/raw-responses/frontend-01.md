# Tarefa: Componente React com TypeScript

**ID**: frontend-01  **Categoria**: frontend
**Latencia**: 132.7s  **Tokens out**: 2178  **tps**: 16.41

---

Segue um componente completo, tipado e funcional:

```tsx
import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

interface TodoListProps {
  initialItems: Todo[];
}

export function TodoList({ initialItems }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialItems);
  const [text, setText] = useState('');

  // Evita colisão de IDs sem depender do estado diretamente no handler.
  const nextIdRef = useRef<number>(
    initialItems.reduce((max, todo) => Math.max(max, todo.id), 0) + 1
  );

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText) return;

    const newTodo: Todo = {
      id: nextIdRef.current++,
      text: trimmedText,
      done: false,
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setText('');
  };

  const handleToggle = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const handleRemove = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
    <section aria-label="Lista de tarefas">
      <h2>Tarefas</h2>

      <form onSubmit={handleAdd}>
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Digite uma nova tarefa..."
          aria-label="Nova tarefa"
        />
        <button type="submit" disabled={!text.trim()}>
          Adicionar
        </button>
      </form>

      {todos.length === 0 ? (
        <p>Nenhuma tarefa cadastrada.</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <label>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => handleToggle(todo.id)}
                  aria-label={`Marcar "${todo.text}" como concluída`}
                />
                <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
                  {todo.text}
                </span>
              </label>

              <button type="button" onClick={() => handleRemove(todo.id)} aria-label={`Remover "${todo.text}"`}>
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

Explicação breve:

- `initialItems` é usado apenas como valor inicial do estado com `useState<Todo[]>(initialItems)`. Se o pai precisar atualizar a lista externamente, use uma chave (`key={...}`) ou sincronize explicitamente via efeito — mas isso pode sobrescrever edições locais.
- O input é controlado por `text`; ao enviar o formulário, valida se há texto após `trim()` e cria um novo `Todo` com `done: false`.
- Os IDs são gerados a partir de uma referência (`useRef`) para evitar colisões sem depender do estado diretamente no handler.
- Marcar como concluído usa `setTodos(prev => ...)`, atualizando apenas o item correspondente e preservando os demais objetos.
- Remover filtra o array com `filter`, mantendo imutabilidade do estado anterior.
- O botão de adicionar fica desabilitado quando o input está vazio ou só contém espaços.

Observação: se a prop `initialItems` mudar depois da montagem e você quiser que o componente reaja automaticamente, isso precisa ser tratado com cuidado; normalmente é melhor controlar os dados no pai (estado elevado) do que sincronizar via `useEffect`.
