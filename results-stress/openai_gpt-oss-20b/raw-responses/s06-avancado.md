# Tarefa: Dashboard React com fetching, filtros e componentes reutilizaveis

**ID**: s06-avancado  **Categoria**: frontend
**Latencia**: 14.87s  **Tokens out**: 2612  **tps**: 175.67

---

## 1️⃣ Visão geral

O objetivo é montar um **dashboard** em React + TypeScript que:

| Requisito | Como será atendido |
|-----------|--------------------|
| **Hook genérico** `useFetch<T>(url)` | Retorna `{ data, loading, error }` tipado. |
| **Lista de cards** | Cada card exibe dados da API simulada (ex.: usuários). |
| **Filtros** | Busca por nome e ordenação asc/desc pelo campo *name*. |
| **Componentes reutilizáveis** | `Button`, `Card`, `Input` – todos tipados. |
| **Responsividade** | Flexbox + media queries simples. |

A estrutura do projeto será:

```
src/
 ├─ api/
 │   └─ mock.ts          # dados simulados
 ├─ hooks/
 │   └─ useFetch.ts      # hook genérico
 ├─ components/
 │   ├─ Button.tsx
 │   ├─ Card.tsx
 │   ├─ Input.tsx
 │   └─ Dashboard.tsx
 ├─ types/
 │   └─ index.ts         # tipos globais
 ├─ App.tsx
 └─ index.tsx
```

> **Obs.** Para simplificar, a “API” será apenas um arquivo JSON que o hook lê com `setTimeout` para simular latência.

---

## 2️⃣ Tipos

```ts
// src/types/index.ts
export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string; // url de imagem
}
```

---

## 3️⃣ Dados simulados (mock)

```ts
// src/api/mock.ts
import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Ana Silva',
    email: 'ana.silva@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'Bruno Costa',
    email: 'bruno.costa@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  // ...adicione mais usuários se quiser
];
```

---

## 4️⃣ Hook genérico `useFetch<T>`

```tsx
// src/hooks/useFetch.ts
import { useState, useEffect } from 'react';
import { mockUsers } from '../api/mock';

type FetchResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useFetch<T>(url: string): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // evita setState em componente desmontado

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Simulando requisição com delay
        await new Promise((r) => setTimeout(r, 800));

        // Aqui você pode trocar por `fetch(url)` quando usar uma API real
        const response = mockUsers as unknown as T; // cast para o tipo genérico

        if (isMounted) {
          setData(response);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Erro desconhecido');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}
```

> **Como funciona?**  
> - O hook recebe uma *URL* (aqui não é usada, mas mantém a assinatura).  
> - Usa `useEffect` para disparar a “requisição”.  
> - Simula latência com `setTimeout`.  
> - Retorna o estado atual (`data`, `loading`, `error`) tipado.

---

## 5️⃣ Componentes reutilizáveis

### 5.1 Button

```tsx
// src/components/Button.tsx
import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...rest }) => (
  <button className={`btn ${variant}`} {...rest}>
    {children}
  </button>
);

export default Button;
```

```css
/* src/components/Button.css */
.btn {
  padding: .5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color .2s ease;
}

.btn.primary {
  background: #007bff;
  color: white;
  border: none;
}
.btn.secondary {
  background: #6c757d;
  color: white;
  border: none;
}
```

### 5.2 Input

```tsx
// src/components/Input.tsx
import React from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ ...rest }) => (
  <input className="input" {...rest} />
);

export default Input;
```

```css
/* src/components/Input.css */
.input {
  padding: .5rem;
  border-radius: 4px;
  border: 1px solid #ced4da;
  width: 100%;
}
```

### 5.3 Card

```tsx
// src/components/Card.tsx
import React from 'react';
import './Card.css';

export interface CardProps {
  title: string;
  subtitle?: string;
  avatar?: string;
}

const Card: React.FC<CardProps> = ({ title, subtitle, avatar }) => (
  <div className="card">
    {avatar && <img src={avatar} alt={title} className="avatar" />}
    <h3>{title}</h3>
    {subtitle && <p>{subtitle}</p>}
  </div>
);

export default Card;
```

```css
/* src/components/Card.css */
.card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,.1);
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: .5rem;
}
```

---

## 6️⃣ Dashboard

```tsx
// src/components/Dashboard.tsx
import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { useFetch } from '../hooks/useFetch';
import Button from './Button';
import Input from './Input';
import Card from './Card';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { data, loading, error } = useFetch<User[]>('/api/users');
  const [search, setSearch] = useState('');
  const [orderAsc, setOrderAsc] = useState(true);

  // Filtra e ordena os usuários
  const filteredUsers = useMemo(() => {
    if (!data) return [];
    let users = [...data];

    if (search.trim()) {
      users = users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    users.sort((a, b) =>
      orderAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

    return users;
  }, [data, search, orderAsc]);

  if (loading) return <p className="status">Carregando...</p>;
  if (error) return <p className="status error">{error}</p>;

  return (
    <div className="dashboard">
      <h1>Usuários</h1>

      {/* Filtros */}
      <div className="filters">
        <Input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="secondary" onClick={() => setOrderAsc(!orderAsc)}>
          Ordenar {orderAsc ? '↓' : '↑'}
        </Button>
      </div>

      {/* Lista de cards */}
      <div className="cards">
        {filteredUsers.map((user) => (
          <Card
            key={user.id}
            title={user.name}
            subtitle={user.email}
            avatar={user.avatar}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
```

```css
/* src/components/Dashboard.css */
.dashboard {
  padding: 1rem;
}

.status {
  text-align: center;
  font-size: 1.2rem;
}
.error { color: red; }

.filters {
  display: flex;
  gap: .5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

/* Responsividade */
@media (max-width: 480px) {
  .filters {
    flex-direction: column;
  }
}
```

---

## 7️⃣ App principal

```tsx
// src/App.tsx
import React from 'react';
import Dashboard from './components/Dashboard';

const App: React.FC = () => (
  <div>
    <Dashboard />
  </div>
);

export default App;
```

```tsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // reset + global

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<React.StrictMode><App /></React.StrictMode>);
```

```css
/* src/index.css */
* { box-sizing: border-box; margin:0; padding:0; }
body {
  font-family: Arial, Helvetica, sans-serif;
  background:#f8f9fa;
}
```

---

## 8️⃣ Fluxo de dados explicado

1. **`Dashboard`** chama `useFetch<User[]>('/api/users')`.  
2. O hook inicia com `loading=true`, faz a “requisição” simulada (delay + mock).  
3. Quando os dados chegam, o hook atualiza `data` e define `loading=false`.  
4. `Dashboard` recebe esses valores via destruturação: `{ data, loading, error }`.  
5. Se houver erro → exibe mensagem; se ainda estiver carregando → exibe “Carregando…”.  
6. Quando os dados chegam (`data` não nulo), o componente calcula `filteredUsers`:
   - Filtra por busca (caso exista).
   - Ordena pelo campo *name* de acordo com `orderAsc`.  
7. Renderiza um `<Card>` para cada usuário filtrado.  
8. Os filtros são controlados pelos estados locais (`search`, `orderAsc`). Alterá‑los dispara re‑renderização e o cálculo memoizado atualiza a lista.

---

## 9️⃣ Próximos passos

- **Substituir** o mock por chamadas reais (`fetch(url)`).
- **Adicionar paginação** ou “infinite scroll”.
- **Usar CSS-in-JS** (styled‑components) para escopo de estilos.
- **Testes unitários** com Jest + React Testing Library.

Pronto! Você tem um dashboard funcional, tipado e responsivo que demonstra o fluxo completo de dados em React + TypeScript. 🚀
