# Tarefa: API REST com Express + TypeScript

**ID**: backend-01  **Categoria**: backend
**Latencia**: 37.23s  **Tokens out**: 3505  **tps**: 94.16

---

Este é um projeto completo e bem estruturado que segue as melhores práticas de desenvolvimento com TypeScript e Express.

A estrutura será dividida em camadas: **Tipos** (definição do modelo), **Serviço** (lógica de negócio/persistência) e **Rotas** (interface HTTP).

## 📁 Estrutura de Pastas Recomendada

```
todo-api/
├── node_modules/
├── src/
│   ├── types.ts             # Definição dos tipos da aplicação
│   ├── tasks.service.ts     # Lógica de negócio e persistência (array em memória)
│   ├── routes/
│   │   └── task.routes.ts   # Configuração dos endpoints REST
│   └── server.ts            # Inicialização do servidor Express
├── package.json             # Dependências e scripts
├── tsconfig.json            # Configurações do TypeScript
```

## 🛠️ Configuração do Projeto (Setup)

Primeiro, crie a pasta `todo-api` e inicialize o projeto Node.js:

```bash
mkdir todo-api
cd todo-api
npm init -y
```

### Instalação de Dependências

Precisamos do Express, TypeScript, e alguns tipos para eles.

```bash
# Dependências de produção
npm install express

# Dependências de desenvolvimento (para compilar TS)
npm install -D typescript @types/node @types/express ts-node nodemon
```

### Configuração do TypeScript (`tsconfig.json`)

Crie o arquivo `tsconfig.json` na raiz do projeto:

**`tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

### Scripts no `package.json`

Atualize seu `package.json` para incluir scripts de desenvolvimento:

**`package.json` (Trecho)**
```json
"scripts": {
  "start": "ts-node src/server.ts",
  "dev": "nodemon --exec ts-node src/server.ts"
},
```

---

## 💻 Código Fonte (`src/`)

### 1. Definição de Tipos (`src/types.ts`)

Define a estrutura da nossa tarefa e os tipos para as respostas HTTP.

**`src/types.ts`**
```typescript
/**
 * Interface que define a estrutura de uma Tarefa (Task).
 */
export interface Task {
    id: number;
    title: string;
    completed: boolean;
}

/**
 * Tipo para o corpo da requisição ao criar uma tarefa.
 */
export type CreateTaskBody = {
    title: string;
};

/**
 * Interface de resposta padrão para sucesso (200/201).
 */
export interface ApiResponse<T> {
    success: boolean;
    data: T;
}
```

### 2. Serviço de Tarefas (`src/tasks.service.ts`)

Esta camada contém a lógica de negócio e simula o banco de dados usando um array em memória.

**`src/tasks.service.ts`**
```typescript
import { Task, CreateTaskBody } from './types';

// Simulação do nosso "banco de dados" em memória
let tasks: Task[] = [
    { id: 1, title: 'Estudar TypeScript', completed: false },
    { id: 2, title: 'Implementar API REST', completed: true },
];

let nextId = 3; // Contador para garantir IDs únicos

/**
 * Retorna todas as tarefas.
 * @returns Um array de Tasks.
 */
export const getAllTasks = (): Task[] => {
    return tasks;
};

/**
 * Cria uma nova tarefa.
 * @param body O corpo da requisição contendo o título.
 * @returns A nova Tarefa criada.
 */
export const createTask = (body: CreateTaskBody): Task => {
    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
        throw new Error("O título da tarefa é obrigatório.");
    }

    const newTask: Task = {
        id: nextId++,
        title: body.title,
        completed: false,
    };
    tasks.push(newTask);
    return newTask;
};

/**
 * Marca uma tarefa como concluída ou pendente.
 * @param id O ID da tarefa a ser atualizada.
 * @returns A Tarefa atualizada.
 */
export const completeTask = (id: number): Task | null => {
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return null; // Tarefa não encontrada
    }

    // Inverte o status de conclusão
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    return tasks[taskIndex];
};

/**
 * Exclui uma tarefa pelo ID.
 * @param id O ID da tarefa a ser excluída.
 * @returns Um booleano indicando se a exclusão foi bem-sucedida.
 */
export const deleteTask = (id: number): boolean => {
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== id);
    return tasks.length < initialLength; // Retorna true se o tamanho diminuiu
};
```

### 3. Rotas da Tarefa (`src/routes/task.routes.ts`)

Define os *handlers* e mapeia as URLs para a lógica do serviço.

**`src/routes/task.routes.ts`**
```typescript
import { Router, Request, Response } from 'express';
import { getAllTasks, createTask, completeTask, deleteTask } from '../tasks.service';
import { ApiResponse, CreateTaskBody } from '../types';

const router = Router();

// 1. LISTAR TODAS AS TAREFAS (GET /tasks)
router.get('/', (req: Request, res: Response<ApiResponse<any>>) => {
    try {
        const tasks = getAllTasks();
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        console.error("Erro ao listar tarefas:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
});

// 2. CRIAR UMA TAREFA (POST /tasks)
router.post('/', (req: Request<{}, {}, CreateTaskBody>, res: Response<ApiResponse<any>>) => {
    try {
        const { title } = req.body;
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ success: false, message: "O título da tarefa é obrigatório." });
        }

        const newTask = createTask({ title });
        res.status(201).json({ success: true, data: newTask }); // 201 Created
    } catch (error) {
        // Captura erros de validação do serviço
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Requisição inválida." });
    }
});

// 3. MARCAR COMO CONCLUÍDA (PATCH /tasks/:id/complete)
router.patch('/:id/complete', (req: Request<{ id: string }>, res: Response<ApiResponse<any>>) => {
    const taskId = parseInt(req.params.id);

    if (isNaN(taskId)) {
        return res.status(400).json({ success: false, message: "ID de tarefa inválido." });
    }

    const updatedTask = completeTask(taskId);

    if (!updatedTask) {
        return res.status(404).json({ success: false, message: `Tarefa com ID ${taskId} não encontrada.` });
    }

    res.status(200).json({ success: true, data: updatedTask });
});


// 4. EXCLUIR TAREFA (DELETE /tasks/:id)
router.delete('/:id', (req: Request<{ id: string }>, res: Response<ApiResponse<any>>) => {
    const taskId = parseInt(req.params.id);

    if (isNaN(taskId)) {
        return res.status(400).json({ success: false, message: "ID de tarefa inválido." });
    }

    const wasDeleted = deleteTask(taskId);

    if (!wasDeleted) {
        return res.status(404).json({ success: false, message: `Tarefa com ID ${taskId} não encontrada.` });
    }

    // 204 No Content é o padrão para exclusão bem-sucedida sem retorno de corpo
    res.status(204).send(); 
});


export default router;
```

### 4. Servidor Principal (`src/server.ts`)

Configura e inicializa a aplicação Express, montando as rotas.

**`src/server.ts`**
```typescript
import express, { Application } from 'express';
import taskRoutes from './routes/task.routes';

const app: Application = express();
const PORT = 3000;

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Monta as rotas de tarefas em /tasks
app.use('/tasks', taskRoutes);

// Handler de erro global (para capturar erros não tratados)
app.use((err: Error, req: any, res: any, next: any) => {
    console.error("Erro fatal:", err.stack);
    res.status(500).json({ 
        success: false, 
        message: "Ocorreu um erro inesperado no servidor." 
    });
});

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log('Endpoints disponíveis: /tasks');
});
```

## ▶️ Como Rodar o Projeto

1.  **Certifique-se de que você está na pasta raiz (`todo-api/`).**
2.  **Execute o comando de desenvolvimento:**

    ```bash
    npm run dev
    ```

Você verá a mensagem: `🚀 Servidor rodando em http://localhost:3000`.

## 🧪 Testes dos Endpoints (Exemplos com cURL)

| Ação | Método | URL | Corpo (Body) | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| **Listar** | `GET` | `http://localhost:3000/tasks` | Nenhum | Retorna todas as tarefas. |
| **Criar** | `POST` | `http://localhost:3000/tasks` | `{"title": "Comprar leite"}` | Cria uma nova tarefa (Status 201). |
| **Validar Falha** | `POST` | `http://localhost:3000/tasks` | `{}` | Retorna erro 400 se o título estiver faltando. |
| **Concluir** | `PATCH` | `http://localhost:3000/tasks/1/complete` | Nenhum | Marca a tarefa ID 1 como concluída (Status 200). |
| **Excluir** | `DELETE` | `http://localhost:3000/tasks/3` | Nenhum | Exclui a tarefa ID 3 (Status 204). |
