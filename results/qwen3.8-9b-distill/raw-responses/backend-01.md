# Tarefa: API REST com Express + TypeScript

**ID**: backend-01  **Categoria**: backend
**Latencia**: 43.51s  **Tokens out**: 4034  **tps**: 92.71

---

# API REST de Tarefas (To-Do List) com Node.js + TypeScript + Express

## 📁 Estrutura de Pastas Recomendada

```
todo-api/
├── src/
│   ├── controllers/
│   │   └── todoController.ts
│   ├── routes/
│   │   └── todosRoutes.ts
│   ├── types/
│   │   └── index.ts
│   ├── middleware/
│   │   └── validation.ts
│   └── server.ts
├── package.json
├── tsconfig.json
└── .env (opcional)
```

---

## 📄 1. `package.json`

```json
{
  "name": "todo-api",
  "version": "1.0.0",
  "description": "API REST de Tarefas com Node.js, TypeScript e Express",
  "main": "dist/server.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "ts-node-dev --respawn src/server.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.6",
    "typescript": "^5.3.3",
    "ts-node-dev": "^2.0.0"
  }
}
```

---

## 📄 2. `tsconfig.json`

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
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 📄 3. `src/types/index.ts` — Definição de Tipos

```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTodoInput = {
  title: string;
};

export type UpdateTodoInput = {
  title?: string;
  completed?: boolean;
};

export interface TodoResponse extends Todo {
  message?: string;
}
```

---

## 📄 4. `src/middleware/validation.ts` — Validação de Entrada

```typescript
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod'; // ou validação manual com regex

// Validação simples sem dependência externa (regex)
export function validateTitle(req: Request, res: Response, next: NextFunction): void {
  const title = req.body.title;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Título é obrigatório e deve ser uma string.',
    });
  }

  if (title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'O título não pode estar vazio.',
    });
  }

  if (title.length > 256) {
    return res.status(400).json({
      success: false,
      message: 'O título deve ter no máximo 256 caracteres.',
    });
  }

  next();
}

export function validateId(req: Request, res: Response, next: NextFunction): void {
  const id = req.params.id;

  if (!id || !/^[a-f0-9]{24}$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID inválido. Use um UUID v4 (ex: a1b2c3d4-e5f6-7890-abcd-ef1234567890).',
    });
  }

  next();
}
```

---

## 📄 5. `src/controllers/todoController.ts` — Lógica de Negócio

```typescript
import { Request, Response } from 'express';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../types/index.js';

// Persistência em memória (array)
const todos: Todo[] = [];
let nextId = 1;

/**
 * Gera um ID único simples (UUID v4 simulado)
 */
function generateId(): string {
  const hexChars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      result += '-';
    } else if (i === 14) {
      result += '4'; // versão UUID v4
    } else if (i === 19) {
      result += hexChars[Math.floor(Math.random() * 4)]; // variante
    } else {
      result += hexChars[Math.floor(Math.random() * hexChars.length)];
    }
  }
  return result;
}

/**
 * Lista todas as tarefas
 */
export function listTodos(req: Request, res: Response): void {
  const todosList = todos.map((todo) => ({
    ...todo,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  }));

  res.status(200).json({
    success: true,
    data: todosList,
    count: todosList.length,
  });
}

/**
 * Cria uma nova tarefa
 */
export function createTodo(req: Request, res: Response): void {
  const input = req.body as CreateTodoInput;

  if (!input.title || typeof input.title !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Título é obrigatório.',
    });
  }

  const newTodo: Todo = {
    id: generateId(),
    title: input.title.trim(),
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  todos.push(newTodo);

  res.status(201).json({
    success: true,
    data: {
      ...newTodo,
      createdAt: newTodo.createdAt.toISOString(),
      updatedAt: newTodo.updatedAt.toISOString(),
    },
    message: 'Tarefa criada com sucesso.',
  });
}

/**
 * Marca uma tarefa como concluída ou não
 */
export function toggleTodo(req: Request, res: Response): void {
  const id = req.params.id;
  const completed = req.body.completed !== undefined ? req.body.completed : !req.todo.completed;

  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Tarefa não encontrada.',
    });
  }

  todos[todoIndex].completed = completed;
  todos[todoIndex].updatedAt = new Date();

  const updatedTodo = {
    ...todos[todoIndex],
    updatedAt: todos[todoIndex].updatedAt.toISOString(),
  };

  res.status(200).json({
    success: true,
    data: updatedTodo,
    message: 'Tarefa atualizada com sucesso.',
  });
}

/**
 * Exclui uma tarefa
 */
export function deleteTodo(req: Request, res: Response): void {
  const id = req.params.id;

  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Tarefa não encontrada.',
    });
  }

  const deletedTodo = todos.splice(todoIndex, 1)[0];

  res.status(200).json({
    success: true,
    data: {
      ...deletedTodo,
      createdAt: deletedTodo.createdAt.toISOString(),
      updatedAt: deletedTodo.updatedAt.toISOString(),
    },
    message: 'Tarefa excluída com sucesso.',
  });
}

/**
 * Busca uma tarefa por ID (GET /todos/:id)
 */
export function getTodoById(req: Request, res: Response): void {
  const id = req.params.id;

  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Tarefa não encontrada.',
    });
  }

  const todo = {
    ...todos[todoIndex],
    createdAt: todos[todoIndex].createdAt.toISOString(),
    updatedAt: todos[todoIndex].updatedAt.toISOString(),
  };

  res.status(200).json({
    success: true,
    data: todo,
  });
}
```

---

## 📄 6. `src/routes/todosRoutes.ts` — Rotas da API

```typescript
import { Router } from 'express';
import {
  listTodos,
  createTodo,
  toggleTodo,
  deleteTodo,
  getTodoById,
} from '../controllers/todoController.js';
import { validateTitle, validateId } from '../middleware/validation.js';

const router = Router();

// GET /todos - Lista todas as tarefas
router.get('/', listTodos);

// GET /todos/:id - Busca uma tarefa por ID
router.get('/:id', validateId, getTodoById);

// POST /todos - Cria uma nova tarefa
router.post(
  '/',
  validateTitle,
  (req, res, next) => {
    // Adiciona o objeto validado ao body para uso no controller
    req.body = { ...req.body };
    next();
  },
  createTodo
);

// PUT /todos/:id - Atualiza ou marca como concluída
router.put(
  '/:id',
  validateId,
  (req, res, next) => {
    // Adiciona o objeto validado ao body para uso no controller
    req.body = { ...req.body };
    next();
  },
  toggleTodo
);

// DELETE /todos/:id - Exclui uma tarefa
router.delete('/:id', validateId, deleteTodo);

export default router;
```

---

## 📄 7. `src/server.ts` — Configuração do Servidor

```typescript
import express from 'express';
import cors from 'cors';
import todosRoutes from './routes/todosRoutes.js';
import { listTodos } from './controllers/todoController.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas da API de Tarefas
app.use('/todos', todosRoutes);

// Rota raiz (health check)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de Tarefas REST — Bem-vindo!',
    version: '1.0.0',
  });
});

// Rota de status da API
app.get('/status', (req, res) => {
  const totalTodos = todosRoutes.length; // Simulação
  res.status(200).json({
    success: true,
    message: 'API está rodando.',
    timestamp: new Date().toISOString(),
  });
});

// Middleware de erro global
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', err.message);
  res.status(500).json({
    success: false,
    message: 'Ocorreu um erro interno no servidor.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 Endpoints:`);
  console.log(`   GET    /todos           - Listar todas as tarefas`);
  console.log(`   POST   /todos           - Criar uma nova tarefa`);
  console.log(`   GET    /todos/:id       - Buscar tarefa por ID`);
  console.log(`   PUT    /todos/:id       - Atualizar ou marcar como concluída`);
  console.log(`   DELETE /todos/:id       - Excluir uma tarefa`);
});

export default app;
```

---

## 📄 8. `src/controllers/todoController.ts` — Versão Corrigida (com array em memória)

> **Nota:** O arquivo acima já contém a lógica completa com persistência em memória. Aqui está o resumo:

- `todos: Todo[]` — Array global que armazena todas as tarefas
- `nextId: number` — Contador para geração de IDs
- Funções CRUD completas com validação e tratamento de erros

---

## 🚀 Como Rodar o Projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Compilar TypeScript (opcional, se não usar ts-node-dev)

```bash
npm run build
```

### 3. Iniciar em modo de desenvolvimento (com hot reload)

```bash
npm run dev
```

Ou iniciar diretamente:

```bash
npx ts-node src/server.ts
```

### 4. Iniciar em produção

```bash
npm start
```

---

## 🧪 Testando os Endpoints com cURL ou Postman

```bash
# Criar uma tarefa
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Estudar TypeScript"}'

# Listar todas as tarefas
curl http://localhost:3000/todos

# Buscar uma tarefa por ID (substitua pelo ID retornado)
curl http://localhost:3000/todos/a1b2c3d4-e5f6-7890-abcd-ef1234567890

# Marcar como concluída
curl -X PUT http://localhost:3000/todos/a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Excluir uma tarefa
curl -X DELETE http://localhost:3000/todos/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

---

## 📋 Resumo dos Endpoints

| Método | Endpoint           | Descrição                          | Status Code |
|--------|--------------------|------------------------------------|-------------|
| GET    | `/todos`           | Listar todas as tarefas            | 200         |
| POST   | `/todos`           | Criar nova tarefa                  | 201         |
| GET    | `/todos/:id`       | Buscar tarefa por ID               | 200 / 404   |
| PUT    | `/todos/:id`       | Atualizar ou marcar como concluída | 200 / 404   |
| DELETE | `/todos/:id`       | Excluir tarefa                     | 200 / 404   |

---

## ⚠️ Considerações Importantes

- **Persistência:** O array `todos` é em memória — os dados são perdidos ao reiniciar o servidor. Para persistência real, substitua por um banco de dados (MongoDB, PostgreSQL, etc.).
- **Validação:** Use bibliotecas como [Zod](https://zod.dev/) ou [Joi](https://joi.dev/) para validações mais robustas em produção.
- **Segurança:** Adicione autenticação (JWT), rate limiting e sanitização de inputs em cenários reais.
- **Tipos:** Os tipos estão definidos no `src/types/index.ts` e reutilizados em todo o projeto, garantindo consistência.

Este código é um ponto de partida sólido para uma API REST moderna com TypeScript! 🎉
