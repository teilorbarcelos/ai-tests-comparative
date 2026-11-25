# Tarefa: RefatoraÃ§Ã£o e boas prÃ¡ticas

**ID**: backend-04  **Categoria**: backend
**Latencia**: 438.71s  **Tokens out**: 7249  **tps**: 16.52

---

Segue uma refatoração em módulos com TypeScript, validação, erros tipados e injeção de dependência para testes.

## Estrutura sugerida

```txt
src/
  types/user.ts
  errors/errors.ts
  validation/userValidation.ts
  repositories/userRepository.ts
  services/userService.ts
tests/
  userService.test.ts
```

## `src/types/user.ts`

```ts
export interface User {
  id: string;
  name: string;
  email: string; // sempre normalizado em lowercase e trimado
  createdAt: Date;
}

export type CreateUserInput = {
  name: string;
  email: string;
};
```

## `src/errors/errors.ts`

```ts
export class ValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(issues.join('; '));
    this.name = 'ValidationError';
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}
```

## `src/validation/userValidation.ts`

Funções puras, fáceis de testar isoladamente.

```ts
import { ValidationError } from '../errors/errors';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(value: unknown): string {
  if (typeof value !== 'string') {
    throw new ValidationError(['name must be a string']);
  }

  const name = value.trim().replace(/\s+/g, ' ');

  if (name.length < 2 || name.length > 100) {
    throw new ValidationError(['name must have between 2 and 100 characters']);
  }

  return name;
}

export function normalizeEmail(value: unknown): string {
  if (typeof value !== 'string') {
    throw new ValidationError(['email must be a string']);
  }

  const email = value.trim().toLowerCase();

  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    throw new ValidationError(['email is invalid']);
  }

  return email;
}
```

> Para produção, considere uma biblioteca de validação como `zod` ou `validator` para regras mais robustas de e-mail/nome.

## `src/repositories/userRepository.ts`

Interface assíncrona: permite trocar a implementação em memória por PostgreSQL, MongoDB etc. sem mudar o service.

```ts
import { ConflictError } from '../errors/errors';
import type { User } from '../types/user';
import { normalizeEmail } from '../validation/userValidation';

export interface UserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  count(): Promise<number>;
}

export class InMemoryUserRepository implements UserRepository {
  private readonly byId = new Map<string, User>();
  private readonly idByEmail = new Map<string, string>();

  constructor(initialUsers: readonly User[] = []) {
    for (const user of initialUsers) {
      this.insert(user);
    }
  }

  async save(user: User): Promise<User> {
    const stored: User = { ...user, email: normalizeEmail(user.email) };
    this.insert(stored);
    return { ...stored };
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalized = normalizeEmail(email);
    const id = this.idByEmail.get(normalized);

    if (!id) return null;

    const user = this.byId.get(id);
    return user ? { ...user } : null;
  }

  async count(): Promise<number> {
    return this.byId.size;
  }

  private insert(user: User): void {
    if (this.byId.has(user.id)) {
      throw new ConflictError(`User with id ${user.id} already exists`);
    }

    const email = normalizeEmail(user.email);

    if (this.idByEmail.has(email)) {
      throw new ConflictError(`User with email ${email} already exists`);
    }

    this.byId.set(user.id, { ...user, email });
    this.idByEmail.set(email, user.id);
  }
}
```

## `src/services/userService.ts`

O service concentra regras de negócio: validação, normalização e checagem de duplicidade antes de persistir.

```ts
import { randomUUID } from 'node:crypto';
import { ConflictError } from '../errors/errors';
import type { UserRepository } from '../repositories/userRepository';
import type { CreateUserInput, User } from '../types/user';
import { normalizeEmail, validateName } from '../validation/userValidation';

export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly generateId: () => string = randomUUID,
  ) {}

  async createUser(input: CreateUserInput): Promise<User> {
    const raw = (input ?? {}) as Record<string, unknown>;

    const name = validateName(raw.name);
    const email = normalizeEmail(raw.email);

    const existing = await this.repository.findByEmail(email);
    if (existing) {
      throw new ConflictError(`User with email ${email} already exists`);
    }

    const user: User = {
      id: this.generateId(),
      name,
      email,
      createdAt: new Date(),
    };

    return this.repository.save(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const normalized = normalizeEmail(email);
    return this.repository.findByEmail(normalized);
  }
}
```

## Exemplo de teste com Vitest

```ts
import { describe, expect, it } from 'vitest';
import { ConflictError, ValidationError } from '../src/errors/errors';
import { InMemoryUserRepository } from '../src/repositories/userRepository';
import { UserService } from '../src/services/userService';

function createService() {
  let counter = 0;
  const repository = new InMemoryUserRepository();
  const service = new UserService(repository, () => `id-${++counter}`);

  return { service, repository };
}

describe('UserService', () => {
  it('creates a user and normalizes email/name', async () => {
    const { service } = createService();

    const user = await service.createUser({
      name: '  Ana   Souza  ',
      email: '  ANA@Example.com ',
    });

    expect(user.id).toBe('id-1');
    expect(user.name).toBe('Ana Souza');
    expect(user.email).toBe('ana@example.com');
  });

  it('rejects invalid name', async () => {
    const { service } = createService();

    await expect(
      service.createUser({ name: 'A', email: 'valid@example.com' }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects invalid email', async () => {
    const { service } = createService();

    await expect(
      service.createUser({ name: 'Ana Souza', email: 'not-an-email' }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects duplicate email even with different casing', async () => {
    const { service } = createService();

    await service.createUser({ name: 'Ana Souza', email: 'ana@example.com' });

    await expect(
      service.createUser({ name: 'Outra Ana', email: 'ANA@EXAMPLE.COM' }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it('finds user by normalized email', async () => {
    const { service } = createService();

    await service.createUser({ name: 'Ana Souza', email: 'ana@example.com' });

    const found = await service.findUserByEmail('  ANA@EXAMPLE.COM ');

    expect(found?.email).toBe('ana@example.com');
  });

  it('returns null when user does not exist', async () => {
    const { service } = createService();

    await expect(service.findUserByEmail('missing@example.com')).resolves.toBeNull();
  });

  it('throws ValidationError for malformed query email', async () => {
    const { service } = createService();

    await expect(service.findUserByEmail('invalid-email')).rejects.toBeInstanceOf(ValidationError);
  });
});
```

## Principais mudanças e por que elas ajudam

1. **Separação em módulos**
   - Tipos, erros, validação, repository e service ficam separados.
   - Isso reduz acoplamento e facilita manutenção.

2. **Tipagem forte**
   - `User` define a entidade.
   - `CreateUserInput` descreve o payload de entrada.
   - A interface `UserRepository` padroniza persistência.

3. **Sem estado global mutável direto**
   - O array `users` antigo era compartilhado e inacessível para testes controlados.
   - Agora a coleção fica encapsulando dentro de `InMemoryUserRepository`, com possibilidade de troca por banco real.

4. **Validação explícita**
   - Nome e e-mail são validados antes da persistência.
   - E-mail é normalizado para evitar duplicidade por diferença de caixa/espaços.

5. **Tratamento de erros tipado**
   - `ValidationError`: entrada inválida → geralmente HTTP 400 em APIs.
   - `ConflictError`: regra de unicidade violada → geralmente HTTP 409.
   - Erros de infraestrutura podem ser adicionados depois, por exemplo para falha de banco.

6. **Testabilidade**
   - O service recebe o repository via construtor.
   - A geração de ID é injetável, permitindo IDs determinísticos nos testes.
   - Funções de validação são puras e fáceis de testar isoladamente.

7. **Repository assíncrono**
   - Mesmo com implementação em memória, as operações retornam `Promise`.
   - Isso evita reescrever o service quando a persistência real for PostgreSQL/MongoDB/etc.

8. **Retorno mais útil**
   - O código original retornava apenas `users.length`.
   - Agora `createUser` retorna o usuário criado, que é mais útil e testável.
   - Se precisar manter compatibilidade com a API antiga, crie um adapter ou mantenha `count()` no repository.

9. **Cópias defensivas**
   - O repository retorna objetos copiados (`{ ...user }`) para evitar que chamadores alterem o estado interno diretamente.

## Observação sobre breaking changes

Essa versão muda a assinatura original:

- Antes: `saveUser(name, email)` retornava um número de usuários.
- Depois: `createUser(input)` retorna o usuário criado e pode lançar erros tipados.

Isso é intencional para melhorar segurança e testabilidade. Se precisar manter compatibilidade com código antigo, crie uma camada adaptadora em volta do novo service.
