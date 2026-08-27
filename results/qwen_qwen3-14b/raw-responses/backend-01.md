# Tarefa: API REST com Express + TypeScript

**ID**: backend-01  **Categoria**: backend
**Latencia**: 122.48s  **Tokens out**: 1862  **tps**: 15.2

---

Aqui está uma implementação completa de uma API REST minimalista para gerenciar tarefas (todos) usando Node.js, TypeScript e Express:

```
todo-api/
├── src/
│   ├── types/
│   │   └── todo.d.ts
│   ├── routes/
│   │   └── todos.routes.ts
│   ├── server.ts
│   └── data.ts
├── tsconfig.json
├── package.json
└── .env
```

### 1. Configuração do projeto

**package.json**
```json
{
  "name": "todo-api",
  "version": "1.0.0",
  "description": "API REST para gerenciar tarefas (todos)",
  "main": "dist/server.js",
  "scripts": {
    "start": "node dist/server.js",
    "dev": "ts-node src/server.ts",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^4.18.2",
    "body-parser": "^1.20.3",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.16",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.1",
    "nodemon": "^3.0.2"
  }
}
```

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "ESNext",
    "strict": true,
    "jsx": "react",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

### 2. Definição de tipos

**src/types/todo.d.ts**
```typescript
interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

### 3. Persistência em memória

**src/data.ts**
```typescript
import { Todo } from '../types/todo';

const todos: Todo[] = [
  {
    id: '1',
    title: 'Primeira tarefa',
    completed: false
  }
];

export default todos;
```

### 4. Roteamento e lógica da API

**src/routes/todos.routes.ts**
```typescript
import express, { Request, Response } from 'express';
import { Todo } from '../types/todo';
import todos from '../data';

const router = express.Router();

// Listar todas as tarefas
router.get('/todos', (req: Request, res: Response) => {
  return res.json(todos);
});

// Criar uma nova tarefa
router.post('/todos', (req: Request<{}, {}, { title: string }>, res: Response) => {
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Título é obrigatório' });
  }

  const newTodo: Todo = {
    id: Date.now().toString(),
    title,
    completed: false
  };

  todos.push(newTodo);
  return res.status(201).json(newTodo);
});

// Marcar tarefa como concluída
router.put('/todos/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }

  todo.completed = !todo.completed;
  return res.json(todo);
});

// Excluir uma tarefa
router.delete('/todos/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }

  todos.splice(index, 1);
  return res.status(204).send();
});

export default router;
```

### 5. Configuração do servidor

**src/server.ts**
```typescript
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import todosRouter from './routes/todos.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/api', todosRouter);

// Rota de fallback
app.get('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

### Como rodar o projeto

1. **Instale as dependências**
```bash
npm install
```

2. **Inicie o servidor em modo de desenvolvimento**
```bash
npm run dev
```

3. **Teste os endpoints com curl ou Postman:**

**Listar todas as tarefas**
```bash
curl http://localhost:3000/api/todos
```

**Criar uma nova tarefa**
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Nova tarefa"}'
```

**Marcar como concluída**
```bash
curl -X PUT http://localhost:3000/api/todos/1
```

**Excluir uma tarefa**
```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

### Explicação do código

- **Tipagem:** Usamos TypeScript para definir interfaces (`Todo`) e validar os parâmetros das requisições.
- **Persistência em memória:** A lista de tarefas é armazenada em um array simples, ideal para demonstrações ou ambientes de desenvolvimento.
- **Validação:** O endpoint POST verifica se o título foi fornecido antes de criar uma nova tarefa.
- **Rotas RESTful:** Implementamos os métodos HTTP padrão (GET, POST, PUT, DELETE) para gerenciar a lista de tarefas.
- **Middlewares:** Usamos `body-parser` para processar requisições JSON e `cors` para permitir requisições cross-origin.

Este é um exemplo básico que pode ser expandido com autenticação, validação mais robusta, persistência em banco de dados (como MongoDB ou PostgreSQL) e outros recursos conforme necessário.
