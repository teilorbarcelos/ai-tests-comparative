# Tarefa: Componente React com TypeScript

**ID**: frontend-01  **Categoria**: frontend
**Latencia**: 31.39s  **Tokens out**: 3141  **tps**: 100.06

---

Este é um excelente caso de uso para demonstrar o poder do TypeScript em componentes React, garantindo que os dados e as interações sejam sempre previsíveis e tipados corretamente.

Abaixo está o código completo, incluindo a definição dos tipos, o componente `TodoList` e um exemplo de como utilizá-lo.

### 💻 Código Completo (TypeScript/React)

```tsx
import React, { useState, useCallback } from 'react';

// ==================================================
// 1. DEFINIÇÃO DE TIPOS (TYPESCRIPT)
// ==================================================

/**
 * Define a estrutura de um item da lista de tarefas.
 */
export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

/**
 * Define as propriedades que o componente TodoList irá receber.
 */
interface TodoListProps {
  initialItems: Todo[];
}


// ==================================================
// 2. COMPONENTE PRINCIPAL (TodoList)
// ==================================================

const TodoList: React.FC<TodoListProps> = ({ initialItems }) => {
  // Estado para armazenar a lista de tarefas, inicializada com as props.
  const [todos, setTodos] = useState<Todo[]>(initialItems);
  
  // Estado para controlar o valor do input de novo item.
  const [inputValue, setInputValue] = useState<string>('');

  /**
   * Lida com a adição de um novo item à lista.
   */
  const handleAddItem = useCallback(() => {
    if (inputValue.trim() === '') return; // Evita adicionar itens vazios

    const newTodo: Todo = {
      id: Date.now(), // ID simples baseado no timestamp para unicidade
      text: inputValue.trim(),
      done: false,
    };

    // Adiciona o novo item ao estado existente
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    
    // Limpa o campo de input após adicionar
    setInputValue('');
  }, [inputValue]);


  /**
   * Alterna o status 'done' (concluído/não concluído) de um item específico.
   * @param id O ID do todo a ser alterado.
   */
  const handleToggleDone = useCallback((id: number) => {
    setTodos((prevTodos) => 
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  }, []);


  /**
   * Remove um item da lista com base no seu ID.
   * @param id O ID do todo a ser removido.
   */
  const handleRemoveItem = useCallback((id: number) => {
    // Filtra o array, mantendo apenas os itens cujo ID NÃO corresponde ao que queremos remover.
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);


  return (
    <div style={styles.container}>
      <h1>Minha Lista de Tarefas</h1>

      {/* Área de Adição de Novo Item */}
      <div style={styles.inputGroup}>
        <input
          type="text"
          placeholder="Adicionar nova tarefa..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={styles.input}
        />
        <button 
          onClick={handleAddItem} 
          style={styles.addButton}
        >
          Adicionar
        </button>
      </div>

      {/* Lista de Tarefas */}
      <ul style={styles.list}>
        {todos.length === 0 ? (
            <p style={{textAlign: 'center', color: '#888'}}>Nenhuma tarefa pendente! 🎉</p>
        ) : (
            todos.map((todo) => (
                <li key={todo.id} style={styles.listItem}>
                    {/* Checkbox para marcar como concluído */}
                    <input 
                        type="checkbox" 
                        checked={todo.done} 
                        onChange={() => handleToggleDone(todo.id)} 
                        style={styles.checkbox}
                    />
                    
                    {/* Texto da Tarefa */}
                    <span 
                        style={{ 
                            ...styles.text, 
                            textDecoration: todo.done ? 'line-through' : 'none',
                            color: todo.done ? '#888' : '#333'
                        }}
                    >
                        {todo.text}
                    </span>

                    {/* Botão de Remoção */}
                    <button 
                        onClick={() => handleRemoveItem(todo.id)} 
                        style={styles.removeButton}
                    >
                        Remover
                    </button>
                </li>
            ))
        )}
      </ul>
    </div>
  );
};

// ==================================================
// 3. EXEMPLO DE USO (App Component)
// ==================================================

const App: React.FC = () => {
    // Dados iniciais tipados
    const initialTasks: Todo[] = [
        { id: 1, text: "Estudar TypeScript", done: true },
        { id: 2, text: "Implementar componente TodoList", done: false },
        { id: 3, text: "Fazer café", done: false },
    ];

    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
            <TodoList initialItems={initialTasks} />
        </div>
    );
};


// ==================================================
// 4. ESTILIZAÇÃO BÁSICA (Para visualização)
// ==================================================

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  inputGroup: {
    display: 'flex',
    marginBottom: '20px',
  },
  input: {
    flexGrow: 1,
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px 0 0 4px',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#5cb85c',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '0 4px 4px 0',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #eee',
  },
  checkbox: {
      marginRight: '15px',
      transform: 'scale(1.3)', // Deixa o checkbox mais visível
  },
  text: {
    flexGrow: 1,
    fontSize: '18px',
  },
  removeButton: {
    padding: '6px 12px',
    backgroundColor: '#d9534f',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '10px',
  }
};

export default App; // Exportamos o componente principal de demonstração
```

### 💡 Explicação Detalhada do Código

#### 1. Tipagem (TypeScript)
*   **`interface Todo`**: Define a "planta" dos nossos dados. Isso garante que, em qualquer lugar do código, um `Todo` sempre terá `id: number`, `text: string` e `done: boolean`.
*   **`interface TodoListProps`**: Tipa as propriedades que o componente recebe (`initialItems`). Usar interfaces torna a API do seu componente clara para quem for utilizá-lo.
*   **`React.FC<TodoListProps>`**: Define o componente funcional, informando ao TypeScript quais props ele espera receber.

#### 2. Gerenciamento de Estado (Hooks)
*   **`useState<Todo[]>(initialItems)`**: O estado `todos` armazena a lista atual. Ao tipar como `<Todo[]>`, garantimos que este array só conterá objetos do tipo `Todo`. Ele é inicializado com as tarefas passadas via prop.
*   **`useState<string>('')`**: O estado `inputValue` controla o texto digitado no campo de input, seguindo o padrão *controlled component*.

#### 3. Lógica e Performance (`useCallback`)
As funções manipuladoras (`handleAddItem`, `handleToggleDone`, `handleRemoveItem`) foram envolvidas em `useCallback`. Isso é uma boa prática em React para evitar que essas funções sejam recriadas a cada renderização, o que pode otimizar a performance se este componente fosse passado como prop para outros componentes filhos.

*   **`handleAddItem`**: Cria um novo objeto `Todo` com um ID único (`Date.now()`) e adiciona-o ao estado usando a função de atualização do React (`setTodos((prevTodos) => [...prevTodos, newTodo])`).
*   **`handleToggleDone`**: Usa o método `map()` para iterar sobre os itens. Quando encontra o item pelo ID, ele retorna uma *cópia* desse item com o status `done` invertido (`!todo.done`), garantindo a imutabilidade do estado.
*   **`handleRemoveItem`**: Usa o método `filter()`, que cria um novo array contendo apenas os itens cujo ID não corresponde ao ID fornecido, mantendo a imutabilidade.

#### 4. Renderização (JSX)
O componente mapeia (`todos.map(...)`) sobre o estado `todos`. Para cada item:
*   Renderiza um `<input type="checkbox">` que está ligado à função `handleToggleDone`.
*   Aplica estilos dinâmicos ao texto (`textDecoration: todo.done ? 'line-through' : 'none'`) para indicar visualmente se a tarefa foi concluída.
*   Inclui o botão de remoção, acionando `handleRemoveItem(todo.id)`.
