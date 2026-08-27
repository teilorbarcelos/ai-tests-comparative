# Tarefa: API REST completa com validacao, banco e testes

**ID**: s05-avancado  **Categoria**: backend
**Latencia**: 19.49s  **Tokens out**: 3421  **tps**: 175.5

---

## 📦 Estrutura do Projeto

```
ecommerce-api/
├─ src/
│  ├─ app.ts
│  ├─ server.ts
│  ├─ models/
│  │   └─ Product.ts
│  ├─ repositories/
│  │   └─ InMemoryProductRepository.ts
│  ├─ services/
│  │   └─ ProductService.ts
│  ├─ controllers/
│  │   └─ ProductController.ts
│  ├─ routes/
│  │   └─ productRoutes.ts
│  ├─ middleware/
│  │   └─ errorHandler.ts
│  └─ utils/
│      └─ pagination.ts
├─ tests/
│  └─ services/
│       └─ ProductService.test.ts
├─ package.json
├─ tsconfig.json
└─ jest.config.js
```

> **Obs.:** Todos os arquivos abaixo já vêm com tipagem completa e comentários explicativos.

---

## 📦 `package.json`

```json
{
  "name": "ecommerce-api",
  "version": "1.0.0",
  "description": "API REST para CRUD de produtos em um e‑commerce (Node + TS + Express)",
  "main": "dist/server.js",
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "zod": "^3.22.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.12",
    "@types/node": "^20.11.6",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.3.3"
  }
}
```

---

## ⚙️ `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*", "tests/**/*"]
}
```

---

## 🧪 `jest.config.js`

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};
```

---

## 📄 `src/models/Product.ts`

```ts
/**
 * Modelo de Produto – apenas tipagem.
 */
export interface Product {
  id: string;          // UUID ou qualquer identificador único
  name: string;
  description?: string;
  price: number;       // valor em reais (ex.: 19.99)
  quantity: number;    // estoque disponível
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔧 `src/utils/pagination.ts`

```ts
/**
 * Função utilitária para paginar resultados.
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export function paginate<T>(items: T[], { page = 1, limit = 10 }: PaginationParams) {
  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
}
```

---

## 📦 `src/repositories/InMemoryProductRepository.ts`

```ts
import { Product } from '../models/Product';
import { v4 as uuidv4 } from 'uuid';

/**
 * Repositório em memória – simula um banco SQL.
 */
export class InMemoryProductRepository {
  private products: Product[] = [];

  async create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const now = new Date();
    const product: Product = {
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      ...data
    };
    this.products.push(product);
    return product;
  }

  async findAll(): Promise<Product[]> {
    return [...this.products];
  }

  async findById(id: string): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async update(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | null> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    const existing = this.products[index];
    const updated: Product = {
      ...existing,
      ...data,
      updatedAt: new Date()
    };
    this.products[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }
}
```

---

## 📦 `src/services/ProductService.ts`

```ts
import { Product } from '../models/Product';
import { InMemoryProductRepository } from '../repositories/InMemoryProductRepository';
import { z } from 'zod';
import { paginate, PaginationParams } from '../utils/pagination';

/**
 * Schemas de validação com Zod.
 */
const productCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  quantity: z.number().int().nonnegative()
});

const productUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  quantity: z.number().int().nonnegative().optional()
});

/**
 * Serviço de negócio – camada entre controller e repositório.
 */
export class ProductService {
  constructor(private repo = new InMemoryProductRepository()) {}

  async create(data: unknown): Promise<Product> {
    const parsed = productCreateSchema.parse(data);
    return this.repo.create(parsed);
  }

  async list(filters: { name?: string; minPrice?: number; maxPrice?: number } = {}, pagination: PaginationParams = {}): Promise<{ items: Product[]; total: number }> {
    let items = await this.repo.findAll();

    // Filtros simples
    if (filters.name) {
      const term = filters.name.toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(term));
    }
    if (filters.minPrice !== undefined) {
      items = items.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      items = items.filter(p => p.price <= filters.maxPrice!);
    }

    const total = items.length;
    items = paginate(items, pagination);

    return { items, total };
  }

  async getById(id: string): Promise<Product> {
    const product = await this.repo.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  async update(id: string, data: unknown): Promise<Product> {
    const parsed = productUpdateSchema.parse(data);
    const updated = await this.repo.update(id, parsed);
    if (!updated) throw new Error('Product not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const ok = await this.repo.delete(id);
    if (!ok) throw new Error('Product not found');
  }
}
```

---

## 📦 `src/controllers/ProductController.ts`

```ts
import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/ProductService';

/**
 * Controlador – recebe HTTP e delega ao serviço.
 */
export class ProductController {
  constructor(private service = new ProductService()) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.service.create(req.body);
      res.status(201).json(product);
    } catch (err) { next(err); }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        name: req.query.name as string | undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined
      };
      const pagination = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10
      };
      const { items, total } = await this.service.list(filters, pagination);
      res.json({ items, total });
    } catch (err) { next(err); }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.service.getById(req.params.id);
      res.json(product);
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await this.service.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) { next(err); }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.service.delete(req.params.id);
      res.status(204).send();
    } catch (err) { next(err); }
  }
}
```

---

## 📦 `src/routes/productRoutes.ts`

```ts
import express from 'express';
import { ProductController } from '../controllers/ProductController';

const router = express.Router();
const controller = new ProductController();

router.post('/', controller.create.bind(controller));
router.get('/', controller.list.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
```

---

## ⚙️ `src/middleware/errorHandler.ts`

```ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

/**
 * Middleware centralizado de tratamento de erros.
 */
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors
    });
  }

  const status = err instanceof Error && err.message === 'Product not found' ? 404 : 500;
  res.status(status).json({
    status: 'error',
    message: err instanceof Error ? err.message : 'Internal Server Error'
  });
}
```

---

## 🚀 `src/app.ts`

```ts
import express from 'express';
import productRoutes from './routes/productRoutes';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

app.use(express.json());

// Rotas
app.use('/api/products', productRoutes);

// Tratamento de erros
app.use(errorHandler);
```

---

## 🌐 `src/server.ts`

```ts
import { app } from './app';
const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

## 🧪 Testes unitários – `tests/services/ProductService.test.ts`

```ts
import { ProductService } from '../../src/services/ProductService';
import { InMemoryProductRepository } from '../../src/repositories/InMemoryProductRepository';

describe('ProductService', () => {
  let service: ProductService;
  let repo: InMemoryProductRepository;

  beforeEach(() => {
    repo = new InMemoryProductRepository();
    service = new ProductService(repo);
  });

  test('create product', async () => {
    const data = { name: 'Camisa', price: 49.99, quantity: 10 };
    const product = await service.create(data);
    expect(product).toHaveProperty('id');
    expect(product.name).toBe('Camisa');
  });

  test('list products with pagination', async () => {
    // criar 15 produtos
    for (let i = 0; i < 15; i++) {
      await service.create({ name: `Item${i}`, price: 10 + i, quantity: 5 });
    }
    const { items, total } = await service.list({}, { page: 2, limit: 5 });
    expect(items).toHaveLength(5);
    expect(total).toBe(15);
  });

  test('get by id', async () => {
    const created = await service.create({ name: 'Bola', price: 20, quantity: 3 });
    const found = await service.getById(created.id);
    expect(found.name).toBe('Bola');
  });

  test('update product', async () => {
    const created = await service.create({ name: 'Livro', price: 30, quantity: 2 });
    const updated = await service.update(created.id, { price: 35 });
    expect(updated.price).toBe(35);
  });

  test('delete product', async () => {
    const created = await service.create({ name: 'Caneta', price: 5, quantity: 50 });
    await service.delete(created.id);
    await expect(service.getById(created.id)).rejects.toThrow('Product not found');
  });

  test('validation error on create', async () => {
    await expect(
      service.create({ name: '', price: -10, quantity: -5 })
    ).rejects.toThrow();
  });
});
```

---

## 📦 Instalação e Execução

```bash
# 1. Clone o repositório (ou copie os arquivos)
git clone <url-do-repo>
cd ecommerce-api

# 2. Instale as dependências
npm install

# 3. Rodar em modo desenvolvimento
npm run dev

# 4. Executar testes
npm test
```

> **Obs.:** O banco é apenas um array em memória, então os dados são perdidos a cada reinício do servidor.

---

## 📚 Resumo rápido

| Camada | Responsabilidade |
|--------|------------------|
| **Model** (`Product`) | Tipagem dos dados. |
| **Repository** (`InMemoryProductRepository`) | Persistência (simulação). |
| **Service** (`ProductService`) | Lógica de negócio + validação com Zod. |
| **Controller** (`ProductController`) | Manipula requisições HTTP e delega ao serviço. |
| **Routes** (`productRoutes.ts`) | Define endpoints REST. |
| **Middleware** (`errorHandler`) | Tratamento centralizado de erros. |
| **Tests** | Unitários para o `ProductService`. |

Pronto! Você tem uma API REST completa, tipada, com validação, paginação, filtros e testes unitários. Boa codificação! 🚀
