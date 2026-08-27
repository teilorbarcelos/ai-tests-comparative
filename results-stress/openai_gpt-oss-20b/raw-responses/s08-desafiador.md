# Tarefa: Feature full-stack integrada (backend + frontend)

**ID**: s08-desafiador  **Categoria**: fullstack
**Latencia**: 17.41s  **Tokens out**: 3081  **tps**: 176.98

---

## Visão geral

```
frontend ──►  API (backend)
   │                     │
   └─────>  carrinho de compras
```

* **Backend** – Node.js + Express + TypeScript  
  * Endpoints: `GET /cart`, `POST /cart/add`, `POST /cart/remove`  
  * Validação com `zod`.  
  * Persistência em memória (para demo).  

* **Frontend** – React + TypeScript  
  * Hook customizado (`useCart`) que chama a API.  
  * Componente `<Cart />` que mostra itens, total e permite remover.  

* **Tipos compartilhados** – pasta `shared-types/` exporta os tipos de domínio (produto, item do carrinho).  
  Ambos os lados importam esses arquivos para garantir tipagem consistente.

---

## 1️⃣ Backend

### 1.1 Estrutura de pastas

```
backend/
├─ src/
│   ├─ api/
│   │   └─ cart.ts
│   ├─ domain/
│   │   └─ types.ts          ← tipos compartilhados (exportados para o frontend)
│   ├─ infra/
│   │   └─ memoryCartStore.ts
│   ├─ app.ts
├─ package.json
└─ tsconfig.json
```

### 1.2 `package.json`

```json
{
  "name": "cart-backend",
  "version": "1.0.0",
  "main": "dist/app.js",
  "scripts": {
    "dev": "ts-node-dev --respawn src/app.ts",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^4.18.2",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.1.6"
  }
}
```

### 1.3 `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 1.4 Tipos de domínio (compartilhados)

```ts
// backend/src/domain/types.ts

export interface Product {
  id: string;
  name: string;
  price: number; // em reais, ex.: 19.99
}

export interface CartItem extends Product {
  quantity: number;
}
```

> **Obs:** O mesmo arquivo pode ser copiado para o frontend (ou publicado como pacote npm) para garantir que ambos usem a mesma estrutura.

### 1.5 Store de memória

```ts
// backend/src/infra/memoryCartStore.ts
import { CartItem } from '../domain/types';

export class MemoryCartStore {
  private items: Map<string, CartItem> = new Map();

  getAll(): CartItem[] {
    return Array.from(this.items.values());
  }

  add(item: CartItem): void {
    const existing = this.items.get(item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.items.set(item.id, { ...item });
    }
  }

  remove(id: string): boolean {
    return this.items.delete(id);
  }
}
```

### 1.6 API de carrinho

```ts
// backend/src/api/cart.ts
import express from 'express';
import { z } from 'zod';
import { MemoryCartStore } from '../infra/memoryCartStore';
import { CartItem, Product } from '../domain/types';

const router = express.Router();
const store = new MemoryCartStore();

const addSchema = z.object({
  product: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().positive()
  }),
  quantity: z.number().int().positive()
});

router.get('/cart', (_req, res) => {
  res.json(store.getAll());
});

router.post('/cart/add', (req, res) => {
  const result = addSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error.format());

  const { product, quantity } = result.data;
  store.add({ ...product, quantity });
  res.status(201).json(store.getAll());
});

router.post('/cart/remove', (req, res) => {
  const schema = z.object({
    id: z.string()
  });
  const result = schema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error.format());

  const removed = store.remove(result.data.id);
  if (!removed) return res.status(404).json({ message: 'Item não encontrado' });

  res.json(store.getAll());
});

export default router;
```

### 1.7 Inicialização do servidor

```ts
// backend/src/app.ts
import express from 'express';
import cartRouter from './api/cart';

const app = express();
app.use(express.json());

app.use('/api', cartRouter);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => console.log(`🚀 Cart API rodando na porta ${PORT}`));
```

---

## 2️⃣ Frontend

### 2.1 Estrutura de pastas

```
frontend/
├─ src/
│   ├─ api/
│   │   └─ cartApi.ts
│   ├─ components/
│   │   └─ Cart.tsx
│   ├─ hooks/
│   │   └─ useCart.ts
│   ├─ domain/
│   │   └─ types.ts          ← copia de backend/src/domain/types.ts
│   ├─ App.tsx
├─ package.json
└─ tsconfig.json
```

### 2.2 `package.json`

```json
{
  "name": "cart-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@types/react": "^18.2.14",
    "@types/react-dom": "^18.2.6",
    "axios": "^1.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.1.6",
    "@vitejs/plugin-react": "^3.1.0",
    "vite": "^4.3.9"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

> **Obs:** Usamos Vite + React.

### 2.3 Tipos de domínio (frontend)

```ts
// frontend/src/domain/types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface CartItem extends Product {
  quantity: number;
}
```

### 2.4 API wrapper

```ts
// frontend/src/api/cartApi.ts
import axios from 'axios';
import { CartItem, Product } from '../domain/types';

const api = axios.create({
  baseURL: 'http://localhost:4000/api'
});

export const getCart = async (): Promise<CartItem[]> => {
  const res = await api.get('/cart');
  return res.data;
};

export const addToCart = async (product: Product, quantity: number): Promise<CartItem[]> => {
  const res = await api.post('/cart/add', { product, quantity });
  return res.data;
};

export const removeFromCart = async (id: string): Promise<CartItem[]> => {
  const res = await api.post('/cart/remove', { id });
  return res.data;
};
```

### 2.5 Hook customizado

```ts
// frontend/src/hooks/useCart.ts
import { useEffect, useState } from 'react';
import { CartItem, Product } from '../domain/types';
import * as cartApi from '../api/cartApi';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await cartApi.getCart();
      setItems(data);
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar carrinho');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => load(), []);

  const add = async (product: Product, quantity: number) => {
    try {
      const data = await cartApi.addToCart(product, quantity);
      setItems(data);
    } catch (e: any) {
      setError(e.message || 'Erro ao adicionar');
    }
  };

  const remove = async (id: string) => {
    try {
      const data = await cartApi.removeFromCart(id);
      setItems(data);
    } catch (e: any) {
      setError(e.message || 'Erro ao remover');
    }
  };

  return { items, loading, error, add, remove };
};
```

### 2.6 Componente `<Cart />`

```tsx
// frontend/src/components/Cart.tsx
import React from 'react';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../domain/types';

export const Cart: React.FC = () => {
  const { items, loading, error, remove } = useCart();

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (loading) return <p>Carregando carrinho...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Carrinho</h2>
      {items.length === 0 ? (
        <p>O carrinho está vazio.</p>
      ) : (
        <ul>
          {items.map((i: CartItem) => (
            <li key={i.id} style={{ marginBottom: '1rem' }}>
              <strong>{i.name}</strong> - R$ {i.price.toFixed(2)} x {i.quantity}
              <button
                onClick={() => remove(i.id)}
                style={{
                  marginLeft: '0.5rem',
                  backgroundColor: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 8px',
                  cursor: 'pointer'
                }}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
      <h3>Total: R$ {total.toFixed(2)}</h3>
    </div>
  );
};
```

### 2.7 `App.tsx` (exemplo de uso)

```tsx
// frontend/src/App.tsx
import React from 'react';
import { Cart } from './components/Cart';

const App: React.FC = () => (
  <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
    <h1>Loja Demo</h1>
    {/* Em um cenário real você teria uma lista de produtos com botão "Adicionar ao carrinho" */}
    <Cart />
  </div>
);

export default App;
```

---

## 3️⃣ Fluxo de comunicação

| Etapa | Frontend | Backend |
|-------|----------|---------|
| **1.** Usuário clica “Adicionar” (não implementado aqui, mas chamaria `useCart.add`) | Chama `cartApi.addToCart(product, qty)` → POST `/api/cart/add` | Recebe corpo, valida com Zod, atualiza store e devolve lista |
| **2.** Frontend recebe resposta (lista atualizada) | Atualiza estado interno (`items`) | - |
| **3.** Usuário clica “Remover” | Chama `cartApi.removeFromCart(id)` → POST `/api/cart/remove` | Remove item do store, devolve lista |
| **4.** Frontend recalcula total e renderiza | - | - |

---

## 4️⃣ Como integrar

1. **Rodar o backend**

   ```bash
   cd backend
   npm install
   npm run dev   # ou npm run build && node dist/app.js
   ```

2. **Rodar o frontend**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **CORS**  
   Se precisar, adicione `cors` no backend:

   ```ts
   import cors from 'cors';
   app.use(cors());
   ```

4. **Tipagem compartilhada**  
   Para evitar duplicação, você pode publicar o diretório `domain/` como um pacote npm privado ou usar `npm link`.  
   Exemplo de uso em ambos os projetos:

   ```bash
   # no backend
   npm link ../frontend/src/domain

   # no frontend
   npm link domain
   ```

5. **Deploy**  
   - Backend: qualquer serviço que suporte Node (Heroku, Render, Vercel Serverless).  
   - Frontend: Vercel, Netlify ou mesmo `npm run build` + servidor estático.

---

## 5️⃣ Próximos passos

| Item | Descrição |
|------|-----------|
| Persistência real | Substituir `MemoryCartStore` por banco (PostgreSQL, MongoDB). |
| Autenticação | Associar carrinho ao usuário. |
| UI completa | Lista de produtos, botão “Adicionar”, modal de checkout. |
| Testes | Jest + Supertest para backend; React Testing Library para frontend. |

Pronto! Você tem uma feature de carrinho de compras totalmente tipada e funcional, com comunicação clara entre front e back. Boa codificação!
