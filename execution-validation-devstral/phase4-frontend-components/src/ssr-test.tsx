import { renderToStaticMarkup } from 'react-dom/server';
import TodoList from './TodoList';
import SearchComponent from './SearchComponent';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';

const results: string[] = [];

const todoHtml = renderToStaticMarkup(
  <TodoList initialItems={[{ id: 1, text: 'Aprender React', done: false }]} />
);
results.push(`TodoList tem "Lista de Tarefas": ${todoHtml.includes('Lista de Tarefas')}`);
results.push(`TodoList tem item "Aprender React": ${todoHtml.includes('Aprender React')}`);

const searchHtml = renderToStaticMarkup(<SearchComponent />);
results.push(`SearchComponent tem "Busca com Debounce": ${searchHtml.includes('Busca com Debounce')}`);
results.push(`SearchComponent filtra (não renderiza Apple em vazio): ${searchHtml.includes('Apple')}`);

const loginHtml = renderToStaticMarkup(<LoginForm onLogin={() => {}} />);
results.push(`LoginForm tem campo email: ${loginHtml.includes('Email')}`);
results.push(`LoginForm tem botão Login: ${loginHtml.includes('Login')}`);

const dashHtml = renderToStaticMarkup(
  <Dashboard stats={[{ label: 'Vendas', value: 150 }, { label: 'Produtos', value: 8 }]} />
);
results.push(`Dashboard lista stats: ${dashHtml.includes('Vendas') && dashHtml.includes('Produtos')}`);
results.push(`Dashboard destaca >100 (class highlight): ${dashHtml.includes('highlight')}`);

const emptyDashHtml = renderToStaticMarkup(<Dashboard stats={[]} />);
results.push(`Dashboard vazio mostra "Sem dados disponíveis": ${emptyDashHtml.includes('Sem dados disponíveis')}`);

console.log(results.join('\n'));