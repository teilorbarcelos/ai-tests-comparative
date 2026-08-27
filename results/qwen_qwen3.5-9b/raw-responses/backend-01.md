# Tarefa: API REST com Express + TypeScript

**ID**: backend-01  **Categoria**: backend
**Latencia**: 30.44s  **Tokens out**: 2176  **tps**: 71.48

---

# API REST Minimalista para Gerenciamento de Tarefas

Abaixo está um projeto completo, tipado e organizado para uma API REST que gerencia tarefas (todos), utilizando Node.js, Express e TypeScript. A persistência é feita em memória, com validação simples e estrutura recomendada para projetos escaláveis.

---

## 📁 Estrutura de Pastas Recomendada

```
todo-api/
├── src/
│   ├── controllers/
│   │   └── todoController.ts
│   ├── routes/
│   │   └── todosRoutes.ts
│   ├── types/
│   │   └── todo.types.ts
│   ├── middleware/
│   │   └── validation.ts
│   └── server.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 📦 Instalação Inicial

```bash
mkdir todo-api && cd todo-api
npm init -y
npm install express cors dotenv
npm install --save-dev typescript @types/express @types/node ts-node nodemon
npx tsc --init
```

---

## 🔧 Configuração do TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 📄 Tipos (`src/types/todo.types.ts`)

```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface CreateTodoInput {
  title: string;
}

export interface UpdateTodoInput {
  completed?: boolean;
}

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';
```

---

## 🛠️ Middleware de Validação (`src/middleware/validation.ts`)

```typescript
import { Request, Response } from 'express';
import { ZodError, z } from 'zod';

export const validateCreateTodo = (req: Request, res: Response, next: any) => {
  const schema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
  });

  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    next(error);
  }
};
```

> ⚠️ Recomenda-se instalar o `zod` para validação de entrada. Caso não queira usar, substitua por validações manuais com `req.body.title`.

---

## 🧠 Controlador (`src/controllers/todoController.ts`)

```typescript
import { Request, Response } from 'express';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo.types';

class TodoController {
  private todos: Map<string, Todo> = new Map();
  private nextId = 1;

  getAll(req: Request, res: Response): void {
    const list = Array.from(this.todos.values());
    res.json(list);
  }

  create(req: Request, res: Response): void {
    const input: CreateTodoInput = req.body;
    if (!input.title) {
      return res.status(400).json({ error: 'Título é obrigatório' });
    }

    const todo: Todo = {
      id: String(this.nextId++),
      title: input.title,
      completed: false,
      createdAt: new Date(),
    };

    this.todos.set(todo.id, todo);
    res.status(201).json(todo);
  }

  toggle(req: Request, res: Response): void {
    const id = req.params.id;
    const todo = this.todos.get(id);

    if (!todo) return res.status(404).json({ error: 'Tarefa não encontrada' });

    todo.completed = !todo.completed;
    res.json(todo);
  }

  delete(req: Request, res: Response): void {
    const id = req.params.id;
    if (!this.todos.has(id)) return res.status(404).json({ error: 'Tarefa não encontrada' });

    this.todos.delete(id);
    res.status(204).send();
  }
}

export default new TodoController();
```

---

## 🛣️ Rotas (`src/routes/todosRoutes.ts`)

```typescript
import { Router, Request, Response } from 'express';
import todoController from '../controllers/todoController';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  todoController.getAll(req, res);
});

router.post('/', (req: Request, res: Response) => {
  todoController.create(req, res);
});

router.patch('/:id', (req: Request, res: Response) => {
  todoController.toggle(req, res);
});

router.delete('/:id', (req: Request, res: Response) => {
  todoController.delete(req, res);
});

export default router;
```

---

## 🚀 Servidor (`src/server.ts`)

```typescript
import express from 'express';
import cors from 'cors';
import todosRoutes from './routes/todosRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/todos', todosRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
```

---

## 📦 `package.json` (Configuração de Scripts)

```json
{
  "name": "todo-api",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.17",
    "@types/node": "^18.15.0",
    "nodemon": "^2.0.22",
    "ts-node": "^10.9.1",
    "typescript": "^5.0.4"
  }
}
```

---

## 🧪 Como Rodar o Projeto

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor em modo de desenvolvimento:

```bash
npm run dev
```

3. Teste os endpoints com `curl` ou Postman:

```bash
# Criar tarefa
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Estudar TypeScript"}'

# Listar tarefas
curl http://localhost:3000/todos

# Marcar como concluída
curl -X PATCH http://localhost:3000/todos/1

# Excluir tarefa
curl -X DELETE http://localhost:3000/todos/1
```

---

## ✅ Resumo dos Endpoints

| Método | Endpoint         | Descrição                        |
|--------|------------------|----------------------------------|
| GET    | `/todos`         | Listar todas as tarefas          |
| POST   | `/todos`         | Criar nova tarefa (título obrigatório) |
| PATCH  | `/todos/:id`     | Alternar estado concluída        |
| DELETE | `/todos/:id`     | Excluir tarefa                   |

---

## 📝 Observações Finais

- A persistência é feita em memória. Para produção, considere usar um banco de dados como MongoDB ou PostgreSQL.
- O middleware de validação pode ser substituído por `zod` para maior robustez.
- Este projeto segue boas práticas de TypeScript e estrutura modular, ideal para aprendizado e base de projetos maiores.

Se precisar adicionar autenticação, versionamento de API ou testes automatizados, posso ajudar com isso também!
