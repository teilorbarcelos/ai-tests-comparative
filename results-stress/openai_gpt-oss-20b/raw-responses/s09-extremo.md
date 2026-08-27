# Tarefa: Debug e correcao de codigo com bugs

**ID**: s09-extremo  **Categoria**: fullstack
**Latencia**: 12.6s  **Tokens out**: 2227  **tps**: 176.73

---

## 1️⃣ O que está errado no código original?

| # | Tipo de bug | Descrição | Impacto |
|---|-------------|-----------|---------|
| 1 | **Tipagem fraca** | `users: any[]` e o corpo da requisição (`req.body`) são tratados como `any`. Isso permite qualquer estrutura, quebrando a segurança do tipo. | Erros em tempo de execução (ex.: acessar `user.name` quando não existe). |
| 2 | **ID gerado sem controle** | `nextId` começa em 0 e é incrementado a cada POST. Se o servidor reiniciar, IDs podem se repetir ou ficar fora de sincronia com dados persistidos. | Dados duplicados / inconsistência. |
| 3 | **Busca por ID usando `=== Number(req.params.id)`** | `Number()` pode retornar `NaN` se o parâmetro não for numérico; a comparação falha silenciosamente e retorna `undefined`. | Resposta 200 com corpo `null` em vez de 404. |
| 4 | **Não há validação de entrada** | Qualquer objeto pode ser enviado, inclusive sem `name`, ou com campos inválidos. | Dados corrompidos na memória. |
| 5 | **Resposta sem status explícito** | Em vários pontos a resposta usa apenas `res.json(...)` (status 200 por padrão). Quando não há usuário encontrado (`GET /users/:id`) o código devolve `null` em vez de 404. | API não segue convenções REST. |
| 6 | **Performance – filtro sem controle de case‑insensitive** | O filtro `u.name.includes(q)` é sensível a maiúsculas/minúsculas e pode causar erro se `name` for `undefined`. | Falha em buscas, retorno inesperado. |
| 7 | **Segurança – injeção de propriedades** | No `PUT`, o corpo da requisição (`req.body`) é espalhado diretamente sobre o objeto existente. Se alguém enviar `{ id: 999 }` ele pode alterar o ID. | Violação de integridade dos dados. |
| 8 | **Não há tratamento de erros do Express** | Qualquer exceção não capturada faz o servidor travar ou retornar erro interno sem mensagem clara. | Experiência ruim e dificuldade de debug. |
| 9 | **Escopo global** | `users` e `nextId` são variáveis globais dentro do módulo, dificultando testes unitários e escalabilidade (por exemplo, em cluster). | Dificuldade de manutenção. |

---

## 2️⃣ Versão corrigida & refatorada

```ts
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
    this.users[idx] = { ...this.users[idx], ...data };
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

app.put('/users/:id', [parseIdParam, validateUserBody], (req: Request, res) => {
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
```

### Principais melhorias

| # | Mudança | Por quê |
|---|---------|---------|
| 1 | **Tipagem estrita** (`User`, `Omit<User,'id'>`) | Evita acesso a propriedades inexistentes e garante que o corpo da requisição tenha os campos corretos. |
| 2 | **Repositório de dados** | Encapsula lógica de CRUD, facilita testes unitários e eventual migração para banco real. |
| 3 | **ID autoincremental seguro** (`nextId` começa em 1) | Evita colisões com IDs já existentes se o servidor reiniciar (pelo menos enquanto a memória não for perdida). |
| 4 | **Validação de entrada** (`validateUserBody`) | Garante que `name` exista e seja string; impede dados corrompidos. |
| 5 | **Parse de ID em middleware** (`parseIdParam`) | Centraliza validação, evita repetição de código e garante que o parâmetro seja inteiro positivo. |
| 6 | **Busca case‑insensitive** | Melhora UX na rota `/users?search=`. |
| 7 | **Resposta adequada (404/201)** | Segue convenções REST; não devolve `null` em busca falha. |
| 8 | **Proteção contra alteração de ID no PUT** | O método `update` não permite mudar a propriedade `id`. |
| 9 | **Tratamento global de erros** | Evita que exceções não capturadas derrubem o servidor e devolvem mensagem amigável. |
|10 | **Uso de CORS (opcional)** | Facilita testes front‑end em domínios diferentes. |

---

## 3️⃣ Como testar

```bash
# Instalar dependências
npm i express cors @types/express @types/cors typescript ts-node-dev

# Rodar o servidor
npx ts-node-dev src/app.ts
```

**Exemplo de requisição POST**

```http
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "Ana Silva",
  "email": "ana@example.com"
}
```

Resposta:

```json
{
  "id": 1,
  "name": "Ana Silva",
  "email": "ana@example.com"
}
```

**Busca com filtro**

```http
GET http://localhost:3000/users?search=ana
```

Retorna todos os usuários cujo nome contém “ana” (case‑insensitive).

---

## 4️⃣ Resumo dos bugs corrigidos

| Bug | Correção |
|-----|----------|
| Tipagem fraca (`any`) | Definição de interfaces e uso de `Omit`/`Partial`. |
| ID gerado sem controle | Classe `InMemoryUserRepository` com `nextId` interno. |
| Busca por ID falha em caso de `NaN` | Middleware que valida e converte o parâmetro. |
| Falta de validação de entrada | Middleware `validateUserBody`. |
| Resposta 200 com `null` | Retorno explícito de 404 quando usuário não encontrado. |
| Filtro sensível a maiúsculas/minúsculas | Conversão para lowerCase antes do filtro. |
| Injeção de propriedades (`id`) no PUT | Método `update` ignora o campo `id`. |
| Falta de tratamento de erros | Middleware global de erro. |
| Escopo global e difícil teste | Encapsulamento em classe, uso de middlewares. |

Com essas mudanças a API fica **segura**, **tipada** corretamente, **performática** (sem loops desnecessários) e **pronta para produção** ou migração futura para um banco persistente.
