# Tarefa: Componente React com TypeScript

**ID**: frontend-01  **Categoria**: frontend
**Latencia**: 29.23s  **Tokens out**: 2444  **tps**: 83.61

---


Aqui está o código completo do componente TodoList com TypeScript:

```tsx
import { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

const TodoList = ({ initialItems }: { initialItems: Todo[] }) => {
  // Estado para armazenar as tarefas (inicialmente com os itens iniciais)
  const [items, setItems] = useState<Todo[]>(initialItems);
  
  // Texto do novo item a ser adicionado
  const [newItemText, setNewItemText] = useState('');

  // Função para adicionar nova tarefa
  const handleAdd = () => {
    if (newItemText.trim() === '') return;
    
    const newItem: Todo = {
      id: Date.now(), // ID único baseado no timestamp
      text: newItemText,
      done: false
    };

    setItems(prevItems => [...prevItems, newItem]);
    setNewItemText('');
  };

  // Função para alternar status de concluído/inconcluído
  const handleToggle = (id: number) => {
    setItems(prevItems =>
      prevItems.map(item => 
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  // Função para remover tarefa
  const handleRemove = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <div className="todo-list">
      {/* Cabeçalho com título */}
      <h2>Lista de Tarefas</h2>
      
      {/* Formulário para adicionar tarefa */}
      <form onSubmit={(e) => { e.preventDefault(); handleAdd() }}>
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Adicione uma nova tarefa..."
          className="todo-input"
        />
        <button type="submit" className="add-button">Adicionar</button>
      </form>

      {/* Lista de tarefas */}
      <ul className="todo-items">
        {items.map((item) => (
          <li key={item.id} className={`todo-item ${item.done ? 'completed' : ''}`}>
            <label htmlFor={`checkbox-${item.id}`} className="flex items-center">
              {/* Checkbox para alternar status */}
              <input
                type="checkbox"
                id={`checkbox-${item.id}`}
                checked={item.done}
                onChange={() => handleToggle(item.id)}
                className="mr-2 cursor-pointer"
              />
              <span>{item.text}</span>
            </label>

            {/* Botão para remover tarefa */}
            <button
              type="button"
              onClick={() => handleRemove(item.id)}
              className="ml-auto remove-button"
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

**Explicação:**

1. **Interface Todo:** Define a estrutura de cada item da lista com `id`, `text` e `done`.

2. **Estado inicial (useState):**
   - `items`: Armazena todas as tarefas, iniciando com os itens passados via propriedade
   - `newItemText`: Controla o valor do input para adicionar novas tarefas

3. **Funções de manipulação:**
   - `handleAdd()`: Adiciona nova tarefa ao estado usando timestamp como ID único
   - `handleToggle(id)`: Alterna o status "done" da tarefa pelo seu ID
   - `handleRemove(id)`: Filtra e remove a tarefa pelo seu ID

4. **Características importantes:**
   - IDs únicos gerados automaticamente usando timestamp (Date.now())
   - Validação básica para evitar adicionar itens vazios
   - Estilização básica com classes CSS inline
   - Suporte para interação via teclado (Enter no input)
   - Status visual das tarefas concluídas

**Para usar este componente:**

```tsx
import TodoList from './TodoList';

// Exemplo de uso:
<TodoList 
  initialItems={[
    { id: 1, text: 'Comprar leite', done: false },
    { id: 2, text: 'Fazer exercícios', done: true }
  ]}
/>
```

**Funcionalidades implementadas:**
- Adição de novas tarefas através de um formulário
- Marcação/desmarcação de conclusão com checkbox
- Remoção individual de cada item
- Estado inicial configurável via props
- Tipagem completa usando TypeScript

Este componente é totalmente funcional e mantém o estado das tarefas independentemente do contexto em que é usado, graças à utilização de `useState` para gerenciar as listas.
