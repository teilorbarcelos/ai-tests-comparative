// src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());          // opcional: permite requisições de outros domínios
app.use(express.json());

// ---------- Tipos ----------
interface User {
  id: number;
  name: string;
  email?: string;   // exemplo de campo opcional
}

// ---------- Repositório em memória ----------
class InMemoryUserRepository {
  private users: User[] = [];
  private nextId = 1;

  findAll(): User[] {
    return [...this.users];
  }

  searchByName(term: string): User[] {
    const lower = term.toLowerCase();
    return this.users.filter(u => u.name.toLowerCase().includes(lower));
  }

  create(data: Omit<User, 'id'>): User {
    const user: User = { id: this.nextId++, ...data };
    this.users.push(user);
    return user;
  }

  findById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  update(id: number, data: Partial<Omit<User, 'id'>>): User | null {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    // não permite alteração de ID
    const allowed = (['name', 'email'] as const).reduce((acc, k) => {
      if (data[k] !== undefined) acc[k] = data[k];
      return acc;
    }, {} as Partial<Omit<User, 'id'>>);
    this.users[idx] = { ...this.users[idx], ...allowed };
    return this.users[idx];
  }
}

const repo = new InMemoryUserRepository();

// ---------- Middlewares ----------
function validateUserBody(req: Request, res: Response, next: NextFunction) {
  const { name, email } = req.body;
  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Nome é obrigatório e deve ser string.' });
  }
  // opcional: validar e‑mail
  if (email && typeof email !== 'string') {
    return res.status(400).json({ error: 'E‑mail inválido.' });
  }
  next();
}

function parseIdParam(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido.' });
  }
  // salva no objeto req para evitar re‑parse
  (req as any)._id = id;
  next();
}

// ---------- Rotas ----------
app.get('/users', (req, res) => {
  const q = typeof req.query.search === 'string' ? req.query.search : undefined;
  if (q) {
    return res.json(repo.searchByName(q));
  }
  return res.json(repo.findAll());
});

app.post('/users', validateUserBody, (req: Request, res) => {
  const user = repo.create(req.body);
  return res.status(201).json(user); // 201 Created
});

app.get('/users/:id', parseIdParam, (req, res) => {
  const id = (req as any)._id;
  const user = repo.findById(id);
  if (!user) return res.sendStatus(404);
  return res.json(user);
});

app.put('/users/:id', [parseIdParam, validateUserBody], (req: Request, res: Response) => {
  const id = (req as any)._id;
  const updated = repo.update(id, req.body);
  if (!updated) return res.sendStatus(404);
  return res.json(updated);
});

// ---------- Tratamento de erros ----------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err); // log para dev
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));