# Tarefa: RefatoraÃ§Ã£o e boas prÃ¡ticas

**ID**: backend-04  **Categoria**: backend
**Latencia**: 8.7s  **Tokens out**: 1457  **tps**: 167.52

---

## Refatoração completa em **TypeScript**

Abaixo segue uma versão totalmente tipada e modularizada do trecho original.  
O objetivo foi:

1. **Separar responsabilidades** – cada arquivo tem apenas um propósito.
2. **Adicionar tipos explícitos** – garante segurança de tipo em tempo de compilação.
3. **Tratar erros de forma consistente** – usando exceções customizadas.
4. **Facilitar testes unitários** – exportando funções e classes que podem ser mockadas.

---

### 1️⃣ Estrutura do projeto

```
src/
 ├─ domain/
 │    └─ User.ts
 ├─ repository/
 │    ├─ IUserRepository.ts
 │    └─ InMemoryUserRepository.ts
 ├─ service/
 │    ├─ UserService.ts
 │    └─ errors/
 │          └─ UserNotFoundError.ts
 └─ index.ts
```

> **Obs.**: `index.ts` é apenas um ponto de entrada para demonstração; em uma aplicação real você teria rotas, banco de dados etc.

---

### 2️⃣ Código

#### 2.1 `src/domain/User.ts`

```ts
/**
 * Entidade User – representa o domínio da aplicação.
 */
export interface IUser {
  name: string;
  email: string;
}
```

#### 2.2 `src/repository/IUserRepository.ts`

```ts
import { IUser } from '../domain/User';

/**
 * Interface que define os métodos de persistência de usuários.
 * Assim, podemos trocar a implementação (in‑memory, DB, API) sem tocar no serviço.
 */
export interface IUserRepository {
  /**
   * Salva um usuário e retorna o total de usuários cadastrados.
   */
  save(user: IUser): Promise<number>;

  /**
   * Busca um usuário pelo email. Retorna `null` se não existir.
   */
  findByEmail(email: string): Promise<IUser | null>;
}
```

#### 2.3 `src/repository/InMemoryUserRepository.ts`

```ts
import { IUser } from '../domain/User';
import { IUserRepository } from './IUserRepository';

/**
 * Implementação em memória – útil para testes e protótipos.
 */
export class InMemoryUserRepository implements IUserRepository {
  private readonly users: IUser[] = [];

  async save(user: IUser): Promise<number> {
    this.users.push({ ...user }); // clone para evitar mutações externas
    return this.users.length;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const found = this.users.find(u => u.email === email);
    return found ?? null; // `??` garante que não retornamos undefined
  }
}
```

#### 2.4 `src/service/errors/UserNotFoundError.ts`

```ts
/**
 * Exceção customizada para quando um usuário não é encontrado.
 */
export class UserNotFoundError extends Error {
  constructor(email: string) {
    super(`Usuário com email "${email}" não encontrado.`);
    this.name = 'UserNotFoundError';
  }
}
```

#### 2.5 `src/service/UserService.ts`

```ts
import { IUser } from '../domain/User';
import { IUserRepository } from '../repository/IUserRepository';
import { UserNotFoundError } from './errors/UserNotFoundError';

/**
 * Serviço de domínio que encapsula a lógica de negócio.
 */
export class UserService {
  constructor(private readonly repo: IUserRepository) {}

  /**
   * Salva um usuário e retorna o total de usuários cadastrados.
   *
   * @throws {Error} Se algum campo obrigatório estiver faltando.
   */
  async addUser(name: string, email: string): Promise<number> {
    if (!name || !email) {
      throw new Error('Nome e email são obrigatórios.');
    }

    const user: IUser = { name, email };
    return this.repo.save(user);
  }

  /**
   * Busca um usuário pelo email.
   *
   * @throws {UserNotFoundError} Se o usuário não existir.
   */
  async getUserByEmail(email: string): Promise<IUser> {
    const user = await this.repo.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError(email);
    }

    return user;
  }
}
```

#### 2.6 `src/index.ts` (exemplo de uso)

```ts
import { InMemoryUserRepository } from './repository/InMemoryUserRepository';
import { UserService } from './service/UserService';

(async () => {
  const repo = new InMemoryUserRepository();
  const service = new UserService(repo);

  try {
    await service.addUser('Ana', 'ana@example.com');
    console.log(await service.getUserByEmail('ana@example.com'));
  } catch (err) {
    console.error(err);
  }
})();
```

---

### 3️⃣ Como os testes ficam mais fáceis

Com a separação em **repositorio** e **serviço**, podemos mockar o repositório:

```ts
// __tests__/UserService.test.ts
import { UserService } from '../src/service/UserService';
import { IUserRepository } from '../src/repository/IUserRepository';

const mockRepo: IUserRepository = {
  save: jest.fn().mockResolvedValue(1),
  findByEmail: jest.fn().mockResolvedValue({ name: 'Ana', email: 'ana@example.com' }),
};

describe('UserService', () => {
  const service = new UserService(mockRepo);

  it('deve salvar usuário', async () => {
    await expect(service.addUser('Ana', 'ana@example.com')).resolves.toBe(1);
    expect(mockRepo.save).toHaveBeenCalledWith({ name: 'Ana', email: 'ana@example.com' });
  });

  // ... outros testes
});
```

---

### 4️⃣ Resumo das mudanças

| Área | Antes | Depois |
|------|-------|--------|
| **Tipagem** | `any` implícita | Interfaces (`IUser`, `IUserRepository`) e tipos explícitos |
| **Separação de responsabilidades** | Funções globais | Módulos: domínio, repositório, serviço, erros |
| **Tratamento de erro** | Retorno `null` | Exceções customizadas (`UserNotFoundError`) + validação de entrada |
| **Testabilidade** | Código monolítico | Dependências injetáveis (repo) que podem ser mockadas |
| **Boa prática TS** | Variável global `users` | Estado encapsulado dentro da classe `InMemoryUserRepository` |

Com essa refatoração, o código fica mais seguro, modular e pronto para evoluir – seja adicionando um banco de dados real ou integrando a uma API REST.
