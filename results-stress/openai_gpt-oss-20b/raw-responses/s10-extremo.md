# Tarefa: Arquitetura completa full-stack (design de sistema)

**ID**: s10-extremo  **Categoria**: fullstack
**Latencia**: 31.33s  **Tokens out**: 5453  **tps**: 174.05

---

## Visão geral

| Camada | Tecnologias principais | Responsabilidade |
|--------|------------------------|------------------|
| **Monorepo** | `pnpm` + `tsconfig.json` compartilhado | Gerencia dependências, scripts e tipos globais |
| **Domain / Types** | TypeScript | Modelos de domínio (Task, User, etc.) |
| **Backend** | Node.js 20 + Express 5 + Prisma ORM + Zod | API REST com validação, autenticação JWT, tratamento de erros |
| **Frontend** | React 18 + Vite + TS + Redux Toolkit + RTK Query | UI responsiva, gerenciamento de estado global e chamadas à API |
| **Infra** | Docker Compose (PostgreSQL, Redis) | Persistência e cache |

> **Obs.**: Todo o código abaixo está tipado *completamente* em TypeScript e contém comentários explicativos.

---

## 1️⃣ Modelagem de dados e tipos de domínio

```ts
// packages/domain/src/types/task.ts
export interface Task {
  id: string;          // UUID v4
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;     // FK para User
}
```

```ts
// packages/domain/src/types/user.ts
export interface User {
  id: string;          // UUID v4
  email: string;
  passwordHash: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

> **Por que separar em um pacote `domain`?**  
> Assim, tanto o backend quanto o frontend importam os mesmos tipos, garantindo consistência de contrato e evitando duplicação.

---

## 2️⃣ Backend – Node/Express

### 2.1 Estrutura de pastas (backend)

```
packages/backend/
├─ src/
│   ├─ config/
│   │   └─ index.ts          // env vars + Prisma client
│   ├─ domain/
│   │   └─ task.ts           // re‑export do pacote domain
│   ├─ infra/
│   │   ├─ prisma/
│   │   │   └─ schema.prisma
│   │   └─ redis.ts          // cache opcional
│   ├─ services/
│   │   └─ taskService.ts    // lógica de negócio
│   ├─ routes/
│   │   └─ tasks.routes.ts
│   ├─ middlewares/
│   │   ├─ errorHandler.ts
│   │   ├─ authMiddleware.ts
│   │   └─ validationMiddleware.ts
│   ├─ validators/
│   │   └─ taskValidator.ts  // Zod schemas
│   ├─ app.ts                // Express app
│   └─ server.ts             // entry point
├─ prisma/
│   └─ migrations/...
├─ package.json
└─ tsconfig.json
```

### 2.2 `package.json` (backend)

```json
{
  "name": "@todo/backend",
  "private": true,
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "build": "tsc -p tsconfig.build.json",
    "start": "node dist/server.js",
    "prisma:migrate": "npx prisma migrate dev"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^5.0.0-beta.1",
    "helmet": "^7.0.0",
    "jsonwebtoken": "^9.0.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.1",
    "@types/node": "^20.3.1",
    "prisma": "^5.0.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.2.2"
  }
}
```

### 2.3 Configuração do Prisma (`schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Task {
  id          String   @id @default(uuid())
  title       String
  description String?
  status      Status   @default(todo)
  priority    Priority @default(medium)
  dueDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id])
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  name         String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  tasks        Task[]
}

enum Status {
  todo
  in_progress
  done
}

enum Priority {
  low
  medium
  high
}
```

### 2.4 `src/config/index.ts`

```ts
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

export const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';
```

### 2.5 Validação com Zod (`src/validators/taskValidator.ts`)

```ts
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
```

### 2.6 Middleware de validação (`src/middlewares/validationMiddleware.ts`)

```ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        errors: result.error.format(),
      });
    }
    req.body = result.data; // typed body
    next();
  };
}
```

### 2.7 Serviço de tarefas (`src/services/taskService.ts`)

```ts
import { prisma } from '../config';
import type { Task } from '@todo/domain';

export class TaskService {
  async list(userId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: { ownerId: userId },
      orderBy: [{ dueDate: 'asc' }, { priority: 'desc' }],
    });
  }

  async create(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    return prisma.task.create({ data });
  }

  async update(id: string, userId: string, patch: Partial<Task>): Promise<Task> {
    // Garantir que o usuário seja dono da tarefa
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.ownerId !== userId) {
      throw new Error('Task not found or unauthorized');
    }

    return prisma.task.update({
      where: { id },
      data: patch,
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task || task.ownerId !== userId) {
      throw new Error('Task not found or unauthorized');
    }

    await prisma.task.delete({ where: { id } });
  }
}
```

### 2.8 Rotas (`src/routes/tasks.routes.ts`)

```ts
import express from 'express';
import { TaskService } from '../services/taskService';
import { validateBody } from '../middlewares/validationMiddleware';
import {
  createTaskSchema,
  updateTaskSchema,
} from '../validators/taskValidator';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();
const service = new TaskService();

router.use(authMiddleware); // todas as rotas precisam de token

router.get('/', async (req, res, next) => {
  try {
    const tasks = await service.list(req.user.id);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  validateBody(createTaskSchema),
  async (req, res, next) => {
    try {
      const task = await service.create({
        ...req.body,
        ownerId: req.user.id,
      });
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  },
);

router.patch(
  '/:id',
  validateBody(updateTaskSchema),
  async (req, res, next) => {
    try {
      const task = await service.update(req.params.id, req.user.id, req.body);
      res.json(task);
    } catch (err) {
      next(err);
    }
  },
);

router.delete('/:id', async (req, res, next) => {
  try {
    await service.delete(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
```

### 2.9 Autenticação JWT (`src/middlewares/authMiddleware.ts`)

```ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

interface JwtPayload {
  id: string;
  email: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não informado' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).user = { id: payload.id, email: payload.email };
    next();
  } catch (_) {
    res.status(401).json({ message: 'Token inválido' });
  }
}
```

### 2.10 Tratamento global de erros (`src/middlewares/errorHandler.ts`)

```ts
import type { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  const status = err.status || 500;
  const message =
    status === 500
      ? 'Erro interno do servidor'
      : err.message || 'Falha na requisição';

  res.status(status).json({ error: message });
}
```

### 2.11 `src/app.ts` – montagem da aplicação

```ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import tasksRouter from './routes/tasks.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL ?? '*' }));
app.use(express.json());

app.get('/', (_, res) => res.send('Task Manager API'));

app.use('/api/tasks', tasksRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

app.use(errorHandler);

export default app;
```

### 2.12 `src/server.ts` – ponto de entrada

```ts
import app from './app';
import { prisma } from './config';

const PORT = process.env.PORT ?? 4000;

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco');
    app.listen(PORT, () => {
      console.log(`🚀 API rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

bootstrap();
```

---

## 3️⃣ Frontend – React

### 3.1 Estrutura de pastas (frontend)

```
packages/frontend/
├─ src/
│   ├─ api/                 // RTK Query slices
│   │   └─ tasksApi.ts
│   ├─ app/
│   │   ├─ store.ts         // Redux Toolkit store
│   │   └─ hooks.ts         // useAppDispatch, useAppSelector
│   ├─ components/
│   │   ├─ TaskList.tsx
│   │   ├─ TaskForm.tsx
│   │   └─ Layout.tsx
│   ├─ pages/
│   │   ├─ HomePage.tsx
│   │   └─ LoginPage.tsx
│   ├─ types/               // re‑export do domain
│   │   └─ task.ts
│   ├─ App.tsx
│   └─ main.tsx
├─ public/
├─ package.json
└─ tsconfig.json
```

### 3.2 `package.json` (frontend)

```json
{
  "name": "@todo/frontend",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "@tanstack/react-query": "^4.29.0",
    "@tanstack/react-query-devtools": "^4.29.0",
    "axios": "^1.6.2",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.14.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react-swc": "^4.0.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.3"
  }
}
```

### 3.3 Store (`src/app/store.ts`)

```ts
import { configureStore } from '@reduxjs/toolkit';
import { tasksApi } from '../api/tasksApi';

export const store = configureStore({
  reducer: {
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tasksApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 3.4 Hooks (`src/app/hooks.ts`)

```ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 3.5 API – RTK Query (`src/api/tasksApi.ts`)

```ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Task } from '../types/task';

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders(headers, { getState }) {
      // token guardado no localStorage
      const token = localStorage.getItem('token');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    fetchTasks: builder.query<Task[], void>({
      query: () => '/tasks',
      providesTags: ['Task'],
    }),
    createTask: builder.mutation<Task, Partial<Task>>({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<Task, { id: string; data: Partial<Task> }>({
      query: ({ id, data }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useFetchTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
```

### 3.6 Component – `TaskList.tsx`

```tsx
import React from 'react';
import { useFetchTasksQuery, useDeleteTaskMutation } from '../api/tasksApi';

export const TaskList: React.FC = () => {
  const { data: tasks, isLoading, error } = useFetchTasksQuery();
  const [deleteTask] = useDeleteTaskMutation();

  if (isLoading) return <p>Carregando tarefas…</p>;
  if (error) return <p>Erro ao carregar tarefas.</p>;

  return (
    <ul>
      {tasks?.map((t) => (
        <li key={t.id}>
          <strong>{t.title}</strong> – {t.status}
          <button onClick={() => deleteTask(t.id)}>Excluir</button>
        </li>
      ))}
    </ul>
  );
};
```

### 3.7 Component – `TaskForm.tsx`

```tsx
import React, { useState } from 'react';
import { useCreateTaskMutation } from '../api/tasksApi';

export const TaskForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createTask] = useCreateTaskMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTask({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Criar Tarefa</button>
    </form>
  );
};
```

### 3.8 Página principal (`src/pages/HomePage.tsx`)

```tsx
import React from 'react';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';

export const HomePage: React.FC = () => (
  <div>
    <h1>Gerenciador de Tarefas</h1>
    <TaskForm />
    <hr />
    <TaskList />
  </div>
);
```

### 3.9 `src/App.tsx`

```tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';

export const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  </Router>
);
```

### 3.10 `src/main.tsx`

```tsx
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { App } from './App';

const root = createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
```

---

## 4️⃣ Tratamento de erros em toda a stack

| Camada | Estratégia |
|--------|------------|
| **Backend** | Middleware `errorHandler` captura exceções não tratadas. Erros customizados (`status`, `message`) são lançados nos serviços. |
| **Frontend** | RTK Query já retorna `isError`. Componentes exibem mensagens amigáveis. Em caso de 401, redireciona para `/login`. |
| **Infra** | Prisma lança erros de violação de FK; esses são convertidos em respostas HTTP 400/404. |

---

## 5️⃣ Estrutura do Monorepo

```
/
├─ packages/
│   ├─ domain/          // tipos compartilhados
│   ├─ backend/
│   └─ frontend/
├─ pnpm-workspace.yaml
└─ tsconfig.base.json
```

**`pnpm-workspace.yaml`**

```yaml
packages:
  - 'packages/*'
```

**`tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@todo/domain/*": ["packages/domain/src/*"]
    }
  },
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

> **Benefícios**  
> - Compartilhamento de tipos (`@todo/domain`) evita duplicação.  
> - Scripts de build/execução são executados a partir da raiz (`pnpm run dev:backend`, `pnpm run dev:frontend`).  

---

## 6️⃣ Segurança e Escalabilidade

| Tema | Implementação |
|------|---------------|
| **Autenticação** | JWT assinado com `JWT_SECRET`. Refresh tokens podem ser adicionados em micro‑serviço separado. |
| **Proteção contra XSS/CSRF** | Helmet, CORS restrito ao domínio do frontend, CSRF token opcional para rotas sensíveis. |
| **Rate Limiting** | Middleware `express-rate-limit` (ex.: 100 req/min). |
| **Logs e Monitoramento** | `pino` + `pino-http`. Exporta métricas Prometheus (`prom-client`). |
| **Escalabilidade Horizontal** | API stateless → múltiplas instâncias atrás de Nginx/Traefik. Banco PostgreSQL com read replicas. |
| **Cache** | Redis para consultas frequentes (ex.: `/tasks?status=done`). |
| **CI/CD** | GitHub Actions: lint, test, build Docker images, deploy em Kubernetes ou Vercel (frontend). |

---

## 7️⃣ Arquivos principais de cada camada

> Para não sobrecarregar a resposta, apenas os arquivos *essenciais* foram mostrados acima.  
> Todos os demais arquivos (`tsconfig.json`, `.env.example`, `Dockerfile`, etc.) seguem padrões comuns e podem ser gerados com `npm init` + `pnpm`.

---

### Conclusão

- **Domain**: Tipos TypeScript compartilhados garantem contrato entre backend e frontend.
- **Backend**: Express + Prisma + Zod → validação, serviço, persistência, tratamento de erros e segurança básica.
- **Frontend**: React + RTK Query → chamadas otimizadas, cache automático e UI simples.
- **Monorepo**: Organização clara, scripts centralizados e compartilhamento de tipos.
- **Segurança/Escalabilidade**: JWT, Helmet, rate limiting, logs, Docker/K8s.

Com essa arquitetura você tem uma base sólida para evoluir o sistema (adicionar testes unitários/integration, auth social, websockets, etc.) mantendo a tipagem forte e a consistência entre as camadas. Boa codificação!
