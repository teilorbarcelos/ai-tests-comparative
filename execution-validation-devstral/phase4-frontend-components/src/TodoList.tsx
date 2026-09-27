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