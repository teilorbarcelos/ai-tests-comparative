# Tarefa: API REST com Express + TypeScript

**ID**: backend-01  **Categoria**: backend
**Latencia**: 185.46s  **Tokens out**: 2924  **tps**: 15.77

---

# API REST de Tarefas (Todos) — Node.js + TypeScript + Express

Abaixo está uma solução completa e minimalista, com persistência em memória (array). A estrutura foi pensada para crescer facilmente depois (ex.: trocar o array por um banco real).

## Estrutura de pastas recomendada

```
todos-api/
├── src/
│   ├── types.ts          # Tipos e interfaces
│   ├── store.ts          # Persistência em memória (array)
│   ├── routes/
│   │   └── tasks.ts      # Rotas de tarefas
│   ├── app.ts            # Configuração do Express
│   └── server.ts         # Entry point (sobe o servidor)
├── package.json
├── tsconfig.json
└── README.md
```

## `package.json`

```json
{
  "name": "todos-api",
  "version": "1.0.0",
  "description": "API REST minimalista de tarefas com Node.js, TypeScript e Express",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "express": "^4.19.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.14.0",
    "tsx": "^4.16.0",
    "typescript": "^5.5.0"
  }
}
```

## `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "node",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*.ts"]
}
```

## `src/types.ts`

```typescript
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // ISO 8601
}

export interface CreateTaskInput {
  title?: unknown; // aceita qualquer coisa para validar depois
}

export interface ApiError {
  error: string;
}
```

## `src/store.ts` — persistência em memória

```typescript
import { randomUUID } from "crypto";
import type { Task, CreateTaskInput } from "./types";

// Array em memória (persistência temporária)
let tasks: Task[] = [];

export const taskStore = {
  list(): Task[] {
    return [...tasks]; // retorna cópia para evitar mutação externa
  },

  findById(id: string): Task | undefined {
    return tasks.find((t) => t.id === id);
  },

  create(input: CreateTaskInput): Task {
    const task: Task = {
      id: randomUUID(),
      title: (input.title as string).trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    return task;
  },

  markCompleted(id: string): Task | undefined {
    const task = this.findById(id);
    if (!task) return undefined;
    task.completed = true;
    return task;
  },

  delete(id: string): boolean {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  },

  // Útil para testes
  clear(): void {
    tasks = [];
  },
};
```

## `src/routes/tasks.ts` — rotas e validação

```typescript
import { Router, Request, Response } from "express";
import type { ApiError } from "../types";
import { taskStore } from "../store";

export const tasksRouter = Router();

// GET /tasks — lista todas as tarefas
tasksRouter.get("/", (_req: Request, res: Response) => {
  res.json(taskStore.list());
});

// POST /tasks — cria uma tarefa (título obrigatório)
tasksRouter.post("/", (req: Request, res: Response<ApiError | unknown>) => {
  const title = req.body?.title;

  // Validação de título obrigatório
  if (typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ error: "O campo 'title' é obrigatório e deve ser uma string não vazia." });
  }

  const task = taskStore.create({ title });
  return res.status(201).json(task);
});

// PATCH /tasks/:id/complete — marca como concluída
tasksRouter.patch("/:id/complete", (req: Request, res: Response<ApiError | unknown>) => {
  const task = taskStore.markCompleted(req.params.id);

  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }

  return res.json(task);
});

// DELETE /tasks/:id — exclui uma tarefa
tasksRouter.delete("/:id", (req: Request, res: Response<ApiError | unknown>) => {
  const deleted = taskStore.delete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }

  return res.status(204).send(); // sem corpo de resposta
});
```

## `src/app.ts` — configuração do Express

```typescript
import express from "express";
import { tasksRouter } from "./routes/tasks";

export function createApp() {
  const app = express();

  // Parser de JSON com limite de tamanho (proteção básica)
  app.use(express.json({ limit: "10kb" }));

  // Rota raiz — health check simples
  app.get("/", (_req, res) => {
    res.json({ name: "Todos API", version: "1.0.0", status: "ok" });
  });

  // Rotas de tarefas sob /tasks
  app.use("/tasks", tasksRouter);

  // 404 para rotas não encontradas
  app.use((_req, res) => {
    res.status(404).json({ error: "Rota não encontrada." });
  });

  // Tratamento centralizado de erros (ex.: JSON inválido no body)
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Erro não tratado:", err.message);
    res.status(400).json({ error: "Requisição inválida. Verifique o corpo da requisição (JSON válido)." });
  });

  return app;
}
```

## `src/server.ts` — entry point

```typescript
import { createApp } from "./app";

const PORT = process.env.PORT ?? 3000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 Todos API rodando em http://localhost:${PORT}`);
});
```

## Como rodar o projeto

### Pré-requisitos
- Node.js 18+ (para `crypto.randomUUID()` e suporte a ES2022)
- npm ou yarn

### Passos

```bash
# 1. Instale as dependências
npm install

# 2. Rode em modo desenvolvimento (com hot reload via tsx)
npm run dev

# Ou, para rodar em produção:
npm run build   # compila TypeScript -> dist/
npm start       # executa o JS compilado
```

O servidor sobe em `http://localhost:3000`.

### Exemplos de uso (curl)

```bash
# Listar todas as tarefas
curl http://localhost:3000/tasks

# Criar uma tarefa
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Comprar leite"}'

# Tentar criar sem título (deve retornar 400)
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{}'

# Marcar como concluída
curl -X PATCH http://localhost:3000/tasks/<id>/complete

# Excluir uma tarefa (204 = sucesso, sem corpo)
curl -X DELETE http://localhost:3000/tasks/<id>
```

## Observações importantes

1. **Persistência em memória**: os dados são perdidos ao reiniciar o servidor — é intencional para manter a API minimalista. Para persistir de verdade, troque `store.ts` por um repositório com banco (ex.: SQLite via `better-sqlite3` ou PostgreSQL) mantendo as mesmas assinaturas.
2. **Validação**: o título é validado no handler da rota (obrigatório e não vazio após trim). Para projetos maiores, considere uma biblioteca como `zod` para schemas de validação mais robustos.
3. **Erros**: a API retorna códigos HTTP semânticos — `201` na criação, `400` em validação, `404` quando a tarefa não existe e `204` na exclusão.
4. **Extensões possíveis**: paginação (`?page=&limit=`), filtros por status, autenticação com JWT, testes automatizados com Jest/Vitest + Supertest.

Se quiser, posso adaptar isso para usar um banco de dados real ou adicionar testes automatizados — é só pedir!
