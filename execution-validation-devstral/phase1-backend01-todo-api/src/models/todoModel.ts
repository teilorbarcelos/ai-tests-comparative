import { Todo } from './types';

let todos: Todo[] = [];

export const getAllTodos = (): Todo[] => {
  return [...todos];
};

export const createTodo = (title: string): Todo => {
  const newTodo: Todo = {
    id: Math.random().toString(36).substring(2, 9),
    title,
    completed: false
  };

  todos.push(newTodo);
  return newTodo;
};

export const toggleTodo = (id: string): Todo | null => {
  const todoIndex = todos.findIndex(todo => todo.id === id);

  if (todoIndex === -1) return null;

  todos[todoIndex].completed = !todos[todoIndex].completed;
  return todos[todoIndex];
};

export const deleteTodo = (id: string): boolean => {
  const initialLength = todos.length;
  todos = todos.filter(todo => todo.id !== id);
  return todos.length !== initialLength;
};