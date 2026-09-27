import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TodoList from './TodoList'
import SearchComponent from './SearchComponent'
import LoginForm from './LoginForm'
import Dashboard from './Dashboard'

const initialTodos = [
  { id: 1, text: 'Aprender React', done: false },
  { id: 2, text: 'Estudar TypeScript', done: true }
];

const statsData = [
  { label: 'Usuários', value: 42 },
  { label: 'Vendas', value: 150 },
  { label: 'Produtos', value: 8 },
];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TodoList initialItems={initialTodos} />
    <SearchComponent />
    <LoginForm onLogin={(email) => console.log('logado:', email)} />
    <Dashboard stats={statsData} />
    <Dashboard stats={[]} />
  </StrictMode>,
)