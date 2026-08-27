# Tarefa: Servico com injeÃ§Ã£o de dependencia e padrÃµes

**ID**: s03-intermediario  **Categoria**: backend
**Latencia**: 12.42s  **Tokens out**: 2208  **tps**: 177.75

---

## Visão geral

| Camada | Responsabilidade |
|--------|------------------|
| **Domain** | Entidades e interfaces (ex.: `User`, `UserRepository`) |
| **Infrastructure** | Implementações concretas (ex.: `InMemoryUserRepository`) |
| **Application** | Serviços de negócio (`AuthService`) |
| **Presentation** | Middlewares, rotas e tratamento de erros |

O código abaixo está organizado em pastas:

```
src/
 ├─ domain/
 │   └─ models.ts
 │   └─ repositories.ts
 ├─ infrastructure/
 │   └─ inMemoryUserRepository.ts
 ├─ application/
 │   └─ authService.ts
 ├─ presentation/
 │   └─ middleware/
 │       └─ authMiddleware.ts
 │   └─ errors/
 │       └─ customErrors.ts
 │   └─ utils/
 │       └─ hash.ts
 └─ index.ts          // ponto de entrada (exemplo de uso)
```

> **Obs.** O exemplo abaixo não usa um framework HTTP real, apenas demonstra como o middleware seria usado em uma rota fictícia.

---

## 1️⃣ Domain

### `src/domain/models.ts`

```ts
export interface User {
  id: string;
  email: string;
  passwordHash: string; // senha já hasheada
}
```

### `src/domain/repositories.ts`

```ts
import { User } from "./models";

/**
 * Interface que descreve as operações de persistência de usuários.
 */
export interface UserRepository {
  /** Busca um usuário pelo e‑mail. */
  findByEmail(email: string): Promise<User | null>;

  /** Salva um novo usuário. */
  save(user: User): Promise<void>;
}
```

---

## 2️⃣ Infrastructure

### `src/infrastructure/inMemoryUserRepository.ts`

```ts
import { User, UserRepository } from "../domain/repositories";

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, User>(); // key: email

  async findByEmail(email: string): Promise<User | null> {
    return this.users.get(email) ?? null;
  }

  async save(user: User): Promise<void> {
    if (this.users.has(user.email)) {
      throw new Error(`User with email ${user.email} already exists`);
    }
    this.users.set(user.email, user);
  }
}
```

---

## 3️⃣ Application

### `src/application/authService.ts`

```ts
import { UserRepository } from "../domain/repositories";
import { User } from "../domain/models";
import { hashPassword, verifyPassword } from "../presentation/utils/hash";
import { AuthError } from "../presentation/errors/customErrors";

export interface AuthServiceDeps {
  userRepo: UserRepository;
}

export class AuthService {
  constructor(private readonly deps: AuthServiceDeps) {}

  /**
   * Registra um novo usuário.
   */
  async register(email: string, password: string): Promise<void> {
    const existing = await this.deps.userRepo.findByEmail(email);
    if (existing) {
      throw new AuthError("E‑mail já cadastrado");
    }

    const user: User = {
      id: crypto.randomUUID(),
      email,
      passwordHash: hashPassword(password),
    };

    await this.deps.userRepo.save(user);
  }

  /**
   * Faz login e devolve um token (simulado).
   */
  async login(email: string, password: string): Promise<string> {
    const user = await this.deps.userRepo.findByEmail(email);
    if (!user) throw new AuthError("Credenciais inválidas");

    const ok = verifyPassword(password, user.passwordHash);
    if (!ok) throw new AuthError("Credenciais inválidas");

    // Token JWT “simulado” – em produção use jsonwebtoken ou similar
    return `token-${user.id}-${Date.now()}`;
  }
}
```

---

## 4️⃣ Presentation

### 4.1 Utils – hashing (simulação)

#### `src/presentation/utils/hash.ts`

```ts
/**
 * Função de hash “falsa” para fins de demonstração.
 * Em produção use bcrypt, argon2 ou similar.
 */
export function hashPassword(password: string): string {
  // simples reverso + base64 – NÃO USE EM PRODUÇÃO!
  return Buffer.from(password.split("").reverse().join("")).toString(
    "base64"
  );
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
```

### 4.2 Erros customizados

#### `src/presentation/errors/customErrors.ts`

```ts
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
```

### 4.3 Middleware de autorização

#### `src/presentation/middleware/authMiddleware.ts`

```ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"; // apenas para ilustrar; não usado no exemplo completo

/**
 * Middleware que verifica se o header Authorization contém um token válido.
 * Em produção valide JWT real e busque usuário do banco.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token ausente" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Simulação de verificação – em produção use jwt.verify
    const payload = JSON.parse(Buffer.from(token.replace("token-", ""), "base64").toString());
    (req as any).userId = payload.id; // anexar dados ao request
    next();
  } catch (_) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
```

> **Obs.** O middleware acima é apenas ilustrativo. Em um projeto real você usaria `jsonwebtoken` e teria uma estratégia de revogação, scopes, etc.

---

## 5️⃣ Ponto de entrada (exemplo)

#### `src/index.ts`

```ts
import express from "express";
import { InMemoryUserRepository } from "./infrastructure/inMemoryUserRepository";
import { AuthService } from "./application/authService";
import { authMiddleware } from "./presentation/middleware/authMiddleware";

const app = express();
app.use(express.json());

// DI simples
const userRepo = new InMemoryUserRepository();
const authService = new AuthService({ userRepo });

/* ---------- Rotas de autenticação ---------- */

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    await authService.register(email, password);
    res.status(201).json({ message: "Usuário criado" });
  } catch (err: any) {
    if (err.name === "AuthError") return res.status(400).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (err: any) {
    if (err.name === "AuthError") return res.status(401).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

/* ---------- Rotas protegidas ---------- */

app.get("/me", authMiddleware, async (req, res) => {
  // Em produção buscaria o usuário do banco usando req.userId
  res.json({ message: `Usuário ${req.userId} autenticado` });
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
```

---

## 📌 Explicação da arquitetura

1. **Domain**  
   - Contém apenas tipos e contratos (`User`, `UserRepository`).  
   - Não conhece detalhes de persistência nem de infraestrutura.

2. **Infrastructure**  
   - Implementa os contratos do domínio.  
   - O `InMemoryUserRepository` é útil para testes ou protótipos; em produção você teria um repositório que usa banco de dados (PostgreSQL, MongoDB, etc.).

3. **Application**  
   - Serviços de negócio (`AuthService`) recebem dependências via construtor – isso facilita a injeção manual ou com frameworks como InversifyJS.  
   - Encapsula regras: validações, hashing, geração de token.

4. **Presentation**  
   - Middlewares e rotas que expõem a API HTTP.  
   - Tratamento de erros customizados (`AuthError`) permite diferenciar falhas de negócio das internas.  
   - O middleware de autorização garante que apenas requisições com token válido acessem recursos protegidos.

5. **DI (Dependency Injection)**  
   - A camada de aplicação não cria instâncias de repositórios; elas são passadas pelo construtor (`AuthServiceDeps`).  
   - Isso permite trocar a implementação do repositório sem tocar no serviço.

6. **Hashing**  
   - No exemplo usamos uma função “falsa” para ilustrar. Em produção use `bcrypt` ou `argon2`.  
   - O objetivo é nunca armazenar senhas em texto plano.

---

## 🚀 Próximos passos

- Substituir o hash fake por `bcrypt`.
- Implementar JWT real no middleware e na geração de token.
- Adicionar testes unitários (Jest) para cada camada.
- Usar um container DI (Inversify, tsyringe) se o projeto crescer.

Pronto! Você tem um sistema completo de autenticação em TypeScript, organizado por camadas, com injeção de dependências e tratamento de erros customizado. Boa codificação!
