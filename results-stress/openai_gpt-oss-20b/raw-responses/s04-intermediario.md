# Tarefa: App React com roteamento e estado global

**ID**: s04-intermediario  **Categoria**: frontend
**Latencia**: 12.1s  **Tokens out**: 2168  **tps**: 179.19

---

## 1️⃣ Visão geral

A aplicação será um SPA (Single‑Page Application) construída com:

| Tecnologia | Por quê? |
|------------|----------|
| **React** + **TypeScript** | Componentes declarativos e tipagem estática que evita bugs em tempo de compilação. |
| **React Router v6** | Navegação declarativa, suporte a *nested routes* e `useNavigate`. |
| **Context API** | Compartilhamento global do estado de autenticação sem “prop drilling”. |

A estrutura será:

```
src/
├─ api/                # (opcional) chamadas HTTP
├─ components/
│  ├─ ProtectedRoute.tsx
│  └─ ...
├─ contexts/
│  └─ AuthContext.tsx
├─ pages/
│  ├─ LoginPage.tsx
│  ├─ DashboardPage.tsx
│  └─ NotFoundPage.tsx
├─ routes/
│  └─ AppRoutes.tsx
├─ types/
│  └─ index.d.ts
└─ main.tsx
```

---

## 2️⃣ Tipos de dados

```ts
// src/types/index.d.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

export type AuthContextType = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};
```

---

## 3️⃣ Contexto de Autenticação

```tsx
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  // Persistência simples (localStorage)
  useEffect(() => {
    const stored = localStorage.getItem('auth_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (email: string, password: string) => {
    /* Simulação de API */
    await new Promise((r) => setTimeout(r, 500));

    // Em produção, substitua por chamada real
    const fakeUser: User = { id: '1', name: 'Fulano', email };
    localStorage.setItem('auth_user', JSON.stringify(fakeUser));
    setUser(fakeUser);
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ state: { user, isAuthenticated }, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
```

### Por que usar `createContext` + `useContext`?

- **Escopo global**: qualquer componente pode acessar o estado de autenticação sem precisar passar props.
- **Tipagem forte**: TypeScript garante que os consumidores recebam exatamente as funções e dados esperados.

---

## 4️⃣ Rota Protegida

```tsx
// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { state } = useAuth();

  return state.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
```

- `Outlet` permite *nested routes* dentro de uma rota protegida.
- Se não autenticado, redireciona para `/login`.

---

## 5️⃣ Páginas

### Login

```tsx
// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate('/dashboard', { replace: true });
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};
```

### Dashboard

```tsx
// src/pages/DashboardPage.tsx
import { useAuth } from '../contexts/AuthContext';

export const DashboardPage: React.FC = () => {
  const { state, logout } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Bem-vindo, {state.user?.name}!</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
};
```

### NotFound

```tsx
// src/pages/NotFoundPage.tsx
export const NotFoundPage: React.FC = () => (
  <h2>404 - Página não encontrada</h2>
);
```

---

## 6️⃣ Rotas da aplicação

```tsx
// src/routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {/* Rota pública */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rotas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);
```

---

## 7️⃣ Ponto de entrada

```tsx
// src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes/AppRoutes';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>
);
```

---

## 8️⃣ Fluxo de redirecionamento

1. **Usuário acessa `/dashboard`**  
   - `ProtectedRoute` verifica `state.isAuthenticated`.  
   - Se falso → `<Navigate to="/login" replace />`.

2. **Usuário faz login**  
   - `LoginPage` chama `auth.login()`.  
   - Após sucesso, salva usuário no contexto e em `localStorage`.  
   - Redireciona para `/dashboard`.

3. **Usuário navega dentro da aplicação**  
   - Como o estado de autenticação está no Context, qualquer componente pode ler `state.user` ou chamar `logout()`.

4. **Usuário clica “Sair”**  
   - `auth.logout()` limpa `localStorage` e seta `user = null`.  
   - Se ele estiver em `/dashboard`, a próxima renderização do `ProtectedRoute` o enviará de volta para `/login`.

---

## 9️⃣ Arquitetura de Estado

| Camada | Responsabilidade |
|--------|------------------|
| **Context (`AuthProvider`)** | Mantém *state* global: usuário, flag de autenticação. Fornece funções `login`, `logout`. |
| **Componentes** | Consomem o contexto via `useAuth()`. Não precisam saber detalhes da implementação (ex.: localStorage). |
| **Persistência** | `localStorage` guarda o token/usuário para recarregamentos de página. O provider lê no `useEffect` inicial. |
| **Router** | Usa `<ProtectedRoute>` para proteger rotas. Ele apenas consulta o contexto, não gerencia estado. |

Essa separação garante:

- **Reutilização**: qualquer componente pode acessar a autenticação sem duplicar lógica.
- **Testabilidade**: funções de login/logout podem ser mockadas em testes unitários.
- **Escalabilidade**: se futuramente mudar para JWT + cookies, basta alterar o provider.

---

## 10️⃣ Próximos passos (opcionais)

1. **Validação real** – integrar com API backend (`axios` ou `fetch`).  
2. **Refresh Token** – manter sessão ativa sem recarregar a página.  
3. **Rotas aninhadas** – ex.: `/dashboard/settings`.  
4. **Lazy loading** – usar `React.lazy` + `Suspense` para otimizar bundle.  

Com essa base, você tem um app React + TS totalmente tipado, com autenticação centralizada e rotas protegidas de forma simples e robusta. 🚀
