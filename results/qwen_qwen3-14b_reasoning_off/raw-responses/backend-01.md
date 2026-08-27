# Tarefa: API REST com Express + TypeScript

**ID**: backend-01  **Categoria**: backend
**Latencia**: 136.86s  **Tokens out**: 1871  **tps**: 13.67

---

Abaixo está uma implementação completa de uma **API REST minimalista** em **Node.js**, usando **TypeScript** e **Express**, que gerencia uma lista de tarefas (todos). A API inclui os seguintes endpoints:

- `GET /tasks` – Listar todas as tarefas
- `POST /tasks` – Criar uma nova tarefa com validação do título
- `PATCH /tasks/:id` – Marcar uma tarefa como concluída
- `DELETE /tasks/:id` – Excluir uma tarefa

---

## 📁 Estrutura de Pastas Recomendada

```
todo-api/
├── src/
│   ├── interfaces/
│   │   └── Task.ts
│   ├── controllers/
│   │   └── taskController.ts
│   ├── routes/
│   │   └── taskRoutes.ts
│   ├── services/
│   │   └── taskService.ts
│   ├── utils/
│   │   └── errorHandler.ts
│   ├── app.ts
│   └── server.ts
├── tsconfig.json
├── package.json
└── .env (opcional)
```

---

## 📄 Arquivos do Projeto

### 1. `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "ESNext",
    "strict": true,
    "jsx": "react",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

---

### 2. `package.json`
```json
{
  "name": "todo-api",
  "version": "1.0.0",
  "description": "API REST para gerenciar tarefas (todos) com Node.js, Express e TypeScript.",
  "main": "dist/app.js",
  "scripts": {
    "start": "node dist/server.js",
    "dev": "ts-node-dev --respawn --transpileOnly src/server.ts"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.13",
    "typescript": "^5.3.3",
    "ts-node-dev": "^2.0.0"
  }
}
```

---

### 3. `src/interfaces/Task.ts`
```typescript
export interface Task {
  id: string;
  title: string;
  completed: boolean;
}
```

---

### 4. `src/services/taskService.ts`
```typescript
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../interfaces/Task';

let tasks: Task[] = [];

export const getAllTasks = (): Task[] => {
  return [...tasks];
};

export const createTask = (title: string): Task => {
  if (!title.trim()) {
    throw new Error('Título é obrigatório.');
  }

  const task: Task = {
    id: uuidv4(),
    title,
    completed: false
  };

  tasks.push(task);
  return task;
};

export const updateTaskStatus = (id: string): Task | null => {
  const index = tasks.findIndex(task => task.id === id);

  if (index === -1) return null;

  tasks[index].completed = !tasks[index].completed;
  return tasks[index];
};

export const deleteTask = (id: string): boolean => {
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) return false;

  tasks.splice(index, 1);
  return true;
};
```

---

### 5. `src/controllers/taskController.ts`
```typescript
import { Request, Response } from 'express';
import {
  getAllTasks,
  createTask,
  updateTaskStatus,
  deleteTask
} from '../services/taskService';

export const getTasks = (req: Request, res: Response) => {
  try {
    const tasks = getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tarefas.' });
  }
};

export const createTaskController = (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const newTask = createTask(title);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateTaskController = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedTask = updateTaskStatus(id);

    if (!updatedTask) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
  }
};

export const deleteTaskController = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = deleteTask(id);

    if (!success) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir tarefa.' });
  }
};
```

---

### 6. `src/routes/taskRoutes.ts`
```typescript
import express from 'express';
import {
  getTasks,
  createTaskController,
  updateTaskController,
  deleteTaskController
} from '../controllers/taskController';

const router = express.Router();

router.get('/tasks', getTasks);
router.post('/tasks', createTaskController);
router.patch('/tasks/:id', updateTaskController);
router.delete('/tasks/:id', deleteTaskController);

export default router;
```

---

### 7. `src/app.ts`
```typescript
import express from 'express';
import taskRoutes from './routes/taskRoutes';

const app = express();

app.use(express.json());
app.use('/api', taskRoutes);

export default app;
```

---

### 8. `src/server.ts`
```typescript
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

---

## 🚀 Como Rodar o Projeto

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor (modo desenvolvimento):**
   ```bash
   npm run dev
   ```

3. **Para produção, compile e execute:**
   ```bash
   npx tsc
   node dist/server.js
   ```

---

## 📌 Exemplos de Requisições

### 1. Criar uma Tarefa (POST)
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Comprar leite"
}
```

**Resposta:**
```json
{
  "id": "abc123",
  "title": "Comprar leite",
  "completed": false
}
```

---

### 2. Listar Tarefas (GET)
```http
GET /api/tasks
```

**Resposta:**
```json
[
  {
    "id": "abc123",
    "title": "Comprar leite",
    "completed": false
  },
  ...
]
```

---

### 3. Marcar como concluída (PATCH)
```http
PATCH /api/tasks/abc123
```

**Resposta:**
```json
{
  "id": "abc123",
  "title": "Comprar leite",
  "completed": true
}
```

---

### 4. Excluir Tarefa (DELETE)
```http
DELETE /api/tasks/abc123
```

**Resposta:**
```http
HTTP/1.1 204 No Content
```

---

## ✅ Conclusão

Você tem agora uma API REST completa, tipada com **TypeScript**, que gerencia tarefas em memória. A estrutura é modular e fácil de expandir para incluir autenticação, persistência em banco de dados ou outros recursos.

Se quiser, posso também adicionar testes unitários com Jest ou integrar com um banco de dados como MongoDB ou PostgreSQL.
