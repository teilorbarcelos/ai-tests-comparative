# Tarefa: API REST com Express + TypeScript

**ID**: backend-01  **Categoria**: backend
**Latencia**: 64.78s  **Tokens out**: 1645  **tps**: 25.39

---

## 📦 Estrutura recomendada

```
todos-api/
├─ src/
│  ├─ controllers/
│  │   └─ todoController.ts
│  ├─ models/
│  │   └─ Todo.ts
│  ├─ routes/
│  │   └─ todoRoutes.ts
│  ├─ services/
│  │   └─ todoService.ts
│  ├─ app.ts          # Express + middlewares
│  └─ server.ts       # Porta e start do servidor
├─ tsconfig.json
└─ package.json
```

> **Obs.** O projeto não usa banco de dados; os *todos* ficam em um array na memória.

---

## 📄 Código completo

### 1️⃣ `package.json`

```json
{
  "name": "todos-api",
  "version": "1.0.0",
  "description": "API REST minimalista para gerenciar tarefas (todos)",
  "main": "dist/server.js",
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.11.5",
    "@types/uuid": "^9.0.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.3.3"
  }
}
```

### 2️⃣ `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 3️⃣ `src/models/Todo.ts`

```ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

### 4️⃣ `src/services/todoService.ts`

```ts
import { v4 as uuidv4 } from 'uuid';
import { Todo } from '../models/Todo';

const todos: Todo[] = [];

/**
 * Retorna todas as tarefas.
 */
export function getAllTodos(): Todo[] {
  return [...todos];
}

/**
 * Cria uma nova tarefa. O título é obrigatório.
 */
export function createTodo(title: string): Todo {
  if (!title.trim()) {
    throw new Error('O campo "title" é obrigatório.');
  }

  const todo: Todo = { id: uuidv4(), title, completed: false };
  todos.push(todo);
  return todo;
}

/**
 * Marca a tarefa com o ID informado como concluída.
 */
export function completeTodo(id: string): Todo {
  const todo = todos.find(t => t.id === id);
  if (!todo) throw new Error('Tarefa não encontrada.');

  todo.completed = true;
  return todo;
}

/**
 * Remove a tarefa com o ID informado.
 */
export function deleteTodo(id: string): void {
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) throw new Error('Tarefa não encontrada.');
  todos.splice(index, 1);
}
```

### 5️⃣ `src/controllers/todoController.ts`

```ts
import { Request, Response } from 'express';
import {
  getAllTodos,
  createTodo,
  completeTodo,
  deleteTodo,
} from '../services/todoService';

export const listTodos = (req: Request, res: Response) => {
  res.json(getAllTodos());
};

export const addTodo = (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const todo = createTodo(title);
    res.status(201).json(todo);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const finishTodo = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const todo = completeTodo(id);
    res.json(todo);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const removeTodo = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    deleteTodo(id);
    res.sendStatus(204); // No Content
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};
```

### 6️⃣ `src/routes/todoRoutes.ts`

```ts
import { Router } from 'express';
import {
  listTodos,
  addTodo,
  finishTodo,
  removeTodo,
} from '../controllers/todoController';

const router = Router();

router.get('/', listTodos);
router.post('/', addTodo);
router.patch('/:id/complete', finishTodo);
router.delete('/:id', removeTodo);

export default router;
```

### 7️⃣ `src/app.ts`

```ts
import express, { Application } from 'express';
import todoRoutes from './routes/todoRoutes';

const app: Application = express();

app.use(express.json()); // body-parser

// Rotas principais
app.use('/todos', todoRoutes);

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado.' });
});

export default app;
```

### 8️⃣ `src/server.ts`

```ts
import app from './app';

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});
```

---

## 🚀 Como rodar o projeto

1. **Clone** ou copie a estrutura acima para sua máquina.

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Para desenvolvimento (hot‑reload):

   ```bash
   npm run dev
   ```

4. Para build e execução em produção:

   ```bash
   npm run build
   npm start
   ```

5. A API ficará disponível em `http://localhost:3000`.

---

## 📚 Endpoints

| Método | Rota                     | Descrição                                 |
|--------|--------------------------|-------------------------------------------|
| GET    | `/todos`                 | Lista todas as tarefas                    |
| POST   | `/todos`                 | Cria uma tarefa (`{ title: string }`)     |
| PATCH  | `/todos/:id/complete`    | Marca a tarefa como concluída             |
| DELETE | `/todos/:id`             | Exclui a tarefa                           |

> **Obs.** O corpo da requisição POST deve conter apenas o campo `title`. Se ele estiver vazio, a API retorna *400 Bad Request*.

---

## 📌 Observações finais

- Como usamos um array em memória, os dados são perdidos quando o servidor reinicia.
- Para produção, substitua essa camada por um banco de dados (PostgreSQL, MongoDB, etc.).
- O código está totalmente tipado com TypeScript e segue boas práticas de separação de responsabilidades: **model → service → controller → routes**.

Bom desenvolvimento! 🚀
