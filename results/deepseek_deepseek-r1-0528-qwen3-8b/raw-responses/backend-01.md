# Tarefa: API REST com Express + TypeScript

**ID**: backend-01  **Categoria**: backend
**Latencia**: 41.59s  **Tokens out**: 3260  **tps**: 78.39

---


Aqui está a implementação completa da API REST para gerenciamento de tarefas:

```typescript
// src/models/todo.model.ts

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

let todos: Todo[] = [];
let currentId = 1;

export const getTodos = (): Todo[] => todos;

export const addTodo = (title: string): Todo => {
  if (!title) throw new Error("Title is required");
  
  const todo: Todo = {
    id: currentId++,
    title,
    completed: false
  };
  todos.push(todo);
  return todo;
};

export const updateTodo = (id: number, updatedFields: Partial<Todo>): void => {
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) throw new Error("Todo not found");
  
  todos[index] = { ...todos[index], ...updatedFields };
};

export const deleteTodo = (id: number): void => {
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) throw new Error("Todo not found");
  
  todos.splice(index, 1);
};
```

```typescript
// src/controllers/todos.ts

import { Request, Response } from 'express';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../models/todo.model';

export const listTodos = (req: Request, res: Response) => {
  try {
    const todosList = getTodos();
    res.json(todosList);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTodo = (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const newTodo = addTodo(title);
    res.status(201).json(newTodo);
  } catch (error) {
    if (error instanceof Error && 'message' in error && error.message === "Title is required") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const toggleTodo = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idNum = parseInt(id);
    if (isNaN(idNum)) return res.status(400).json({ error: "Invalid ID format" });

    updateTodo(idNum, { completed: !getTodos().find(todo => todo.id === idNum)?.completed });
    res.json(getTodos());
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTodoHandler = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idNum = parseInt(id);
    if (isNaN(idNum)) return res.status(400).json({ error: "Invalid ID format" });

    deleteTodo(idNum);
    res.json(getTodos());
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

```typescript
// src/routes/todos.ts

import { Router } from 'express';
import { listTodos, createTodo, toggleTodo, deleteTodoHandler } from '../controllers/todos';

const router = Router();

router.get('/todos', listTodos);
router.post('/todos', createTodo);
router.patch('/todos/:id', toggleTodo); // Usando PATCH para atualizar o status
router.delete('/todos/:id', deleteTodoHandler);

export default router;
```

```typescript
// src/index.ts

import express from 'express';
import cors from 'cors';
import todosRouter from './routes/todos';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', todosRouter);

// Porta do servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

**Estrutura de pastas recomendada:**
```
src/
├── controllers/   # Lógica de negócio e manipulação dos dados
│   └── todos.ts
├── models/         # Definição dos tipos e estrutura de dados
│   └── todo.model.ts
├── routes/        # Configuração das rotas da API
│   └── todos.ts
└── index.ts       # Ponto de entrada do servidor
```

**Para rodar o projeto:**

1. Crie um novo diretório para o projeto e inicialize-o com npm:
```bash
npm init -y
```

2. Instale as dependências necessárias:
```bash
npm install express cors @types/express @types/node typescript ts-node-dev --save-dev
```

3. Crie um arquivo `tsconfig.json` na raiz do projeto com o seguinte conteúdo:
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

4. Execute o servidor com:
```bash
npx ts-node-dev src/index.ts
```

**Endpoints disponíveis:**

- **GET /api/todos**: Lista todas as tarefas
- **POST /api/todos**: Cria uma nova tarefa (body deve conter `title`)
- **PATCH /api/todos/:id**: Altera o status de conclusão da tarefa
- **DELETE /api/todos/:id**: Exclui a tarefa

**Validação:**
A API valida que o título é obrigatório na criação de tarefas. Se tentar criar uma tarefa sem título, retorna erro 400.

Esta implementação usa um array em memória para armazenamento, então os dados serão perdidos ao reiniciar o servidor. Para persistência real, seria necessário integrar com banco de dados ou armazenamento local.
