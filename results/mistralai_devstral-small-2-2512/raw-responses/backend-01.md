# Tarefa: API REST com Express + TypeScript

**ID**: backend-01  **Categoria**: backend
**Latencia**: 56.39s  **Tokens out**: 1863  **tps**: 33.04

---

# API REST Minimalista para Gerenciamento de Tarefas (Todos)

Vou criar uma API REST completa em Node.js com TypeScript e Express que atende aos seus requisitos. Aqui está a implementação:

## Estrutura de Pastas Recomendada

```
src/
├── controllers/
│   └── todoController.ts
├── models/
│   ├── todoModel.ts
│   └── types.ts
├── routes/
│   └── todoRoutes.ts
├── app.ts
└── server.ts
```

## Código Completo

### 1. Definição de Tipos (`src/models/types.ts`)

```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type CreateTodoInput = Omit<Todo, 'id' | 'completed'>;
```

### 2. Modelo de Dados (`src/models/todoModel.ts`)

```typescript
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
```

### 3. Controlador (`src/controllers/todoController.ts`)

```typescript
import { Request, Response } from 'express';
import * as todoModel from '../models/todoModel';

export const getAllTodos = (req: Request, res: Response) => {
  try {
    const todos = todoModel.getAllTodos();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar tarefas' });
  }
};

export const createTodo = (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ message: 'Título é obrigatório e deve ser uma string' });
    }

    const newTodo = todoModel.createTodo(title);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar tarefa' });
  }
};

export const toggleTodo = (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'ID da tarefa é obrigatório' });
    }

    const updatedTodo = todoModel.toggleTodo(id);

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar tarefa' });
  }
};

export const deleteTodo = (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'ID da tarefa é obrigatório' });
    }

    const isDeleted = todoModel.deleteTodo(id);

    if (!isDeleted) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir tarefa' });
  }
};
```

### 4. Rotas (`src/routes/todoRoutes.ts`)

```typescript
import { Router } from 'express';
import * as todoController from '../controllers/todoController';

const router = Router();

router.get('/', todoController.getAllTodos);
router.post('/', todoController.createTodo);
router.patch('/:id', todoController.toggleTodo);
router.delete('/:id', todoController.deleteTodo);

export default router;
```

### 5. Configuração do Servidor (`src/app.ts`)

```typescript
import express, { Express } from 'express';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes';

const app: Express = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/todos', todoRoutes);

// Rota de saudação
app.get('/', (req, res) => {
  res.send('API de Gerenciamento de Tarefas');
});

export default app;
```

### 6. Servidor (`src/server.ts`)

```typescript
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

## Configuração do Projeto

### 1. Instale as dependências necessárias:

```bash
npm install express cors
npm install --save-dev typescript @types/express @types/node ts-node nodemon
```

### 2. Configure o `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### 3. Configure o `package.json`:

```json
{
  "name": "todo-api",
  "version": "1.0.0",
  "main": "dist/server.js",
  "scripts": {
    "start": "node dist/server.js",
    "dev": "nodemon src/server.ts",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.6.3",
    "typescript": "^5.2.2",
    "ts-node": "^10.9.1",
    "nodemon": "^3.0.2"
  }
}
```

## Como Rodar o Projeto

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Para desenvolvimento (com recarregamento automático):
   ```bash
   npm run dev
   ```

3. Para produção (após build):
   ```bash
   npm run build
   npm start
   ```

## Endpoints Disponíveis

- `GET /todos` - Lista todas as tarefas
- `POST /todos` - Cria uma nova tarefa (envie `{ title: "Título da tarefa" }`)
- `PATCH /todos/:id` - Marca uma tarefa como concluída/pendente
- `DELETE /todos/:id` - Exclui uma tarefa

## Exemplos de Requisições

1. Criar tarefa:
   ```bash
   curl -X POST http://localhost:3000/todos \
     -H "Content-Type: application/json" \
     -d '{"title": "Estudar TypeScript"}'
   ```

2. Listar tarefas:
   ```bash
   curl http://localhost:3000/todos
   ```

3. Marcar tarefa como concluída:
   ```bash
   curl -X PATCH http://localhost:3000/todos/:id
   ```

4. Excluir tarefa:
   ```bash
   curl -X DELETE http://localhost:3000/todos/:id
   ```

Esta implementação segue boas práticas de desenvolvimento, com separação de responsabilidades (rotas, controladores e modelo), tipagem forte com TypeScript e validações básicas. O array em memória é simples para fins de demonstração - em um ambiente real você usaria um banco de dados.
