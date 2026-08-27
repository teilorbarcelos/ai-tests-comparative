# Tarefa: RefatoraÃ§Ã£o e boas prÃ¡ticas

**ID**: backend-04  **Categoria**: backend
**Latencia**: 35.33s  **Tokens out**: 3221  **tps**: 91.18

---

# Refatoração para TypeScript com Boas Práticas

## Estrutura do Projeto

```
src/
├── types.ts          # Definições de tipos
├── errors.ts         # Custom errors
├── repository.ts     # Camada de acesso a dados (testável)
├── userService.ts    # Lógica de negócio
└── index.ts          # Ponto de entrada
```

---

## 1. types.ts — Definições de Tipos

```typescript
/**
 * Interface que define o formato de um usuário no sistema.
 */
export interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * Opção para buscar usuários por e-mail (caso haja múltiplos).
 */
export type FindUserResult = User | null;
```

---

## 2. errors.ts — Custom Errors

```typescript
/**
 * Erro personalizado quando um usuário não é encontrado.
 */
export class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

/**
 * Erro personalizado quando o e-mail já está em uso.
 */
export class EmailAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmailAlreadyExistsError';
  }
}

/**
 * Erro genérico para falhas de persistência.
 */
export class PersistenceError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'PersistenceError';
    if (this.originalError) {
      this.stack += `\nCaused by: ${this.originalError.stack}`;
    }
  }
}

/**
 * Erro para dados inválidos.
 */
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

---

## 3. repository.ts — Camada de Acesso a Dados (Testável)

```typescript
import { User, FindUserResult } from './types.js';

/**
 * Repositório abstrato para usuários.
 * Permite inverter dependências e testar com mocks.
 */
export interface UserRepository {
  save(user: Omit<User, 'id'>): Promise<number>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<FindUserResult>;
}

/**
 * Implementação in-memory do repositório de usuários.
 */
export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();
  private nextId: number = 1;

  /**
   * Salva um usuário no repositório.
   * @param user - Dados do usuário sem o ID (gerado automaticamente).
   * @returns O ID gerado para o novo usuário.
   */
  async save(user: Omit<User, 'id'>): Promise<number> {
    const email = user.email.toLowerCase().trim();

    // Validação básica no repositório
    if (!email || !user.name) {
      throw new Error('Email e name são obrigatórios');
    }

    if (this.users.has(email)) {
      throw new Error(`E-mail "${email}" já está em uso`);
    }

    const newUser: User = {
      id: this.nextId++,
      ...user,
      email: email.toLowerCase().trim(),
    };

    this.users.set(email, newUser);
    return newUser.id;
  }

  /**
   * Busca um usuário pelo ID.
   */
  async findById(id: number): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.id === id) {
        return user;
      }
    }
    return null;
  }

  /**
   * Busca um usuário pelo e-mail.
   */
  async findByEmail(email: string): Promise<FindUserResult> {
    const normalizedEmail = email.toLowerCase().trim();
    return this.users.get(normalizedEmail) || null;
  }

  /**
   * Limpa todos os usuários (útil para testes).
   */
  clear(): void {
    this.users.clear();
    this.nextId = 1;
  }
}
```

---

## 4. userService.ts — Lógica de Negócio

```typescript
import { User, FindUserResult } from './types.js';
import { UserRepository, InMemoryUserRepository } from './repository.js';
import {
  UserNotFoundError,
  EmailAlreadyExistsError,
  ValidationError,
} from './errors.js';

/**
 * Serviço de gerenciamento de usuários.
 * Encapsula a lógica de negócio e depende do repositório via injeção.
 */
export class UserService {
  private repository: UserRepository;

  /**
   * Construtor com dependência injetável.
   * @param repository - Implementação do UserRepository.
   */
  constructor(repository?: UserRepository) {
    this.repository = repository || new InMemoryUserRepository();
  }

  /**
   * Salva um novo usuário no sistema.
   * Valida e persiste o usuário através do repositório.
   * @param name - Nome do usuário (obrigatório).
   * @param email - E-mail do usuário (obrigatório, único).
   * @returns O ID gerado para o novo usuário.
   */
  async saveUser(name: string, email: string): Promise<number> {
    // Validação de entrada
    this.validateInput(name, email);

    try {
      const id = await this.repository.save({ name, email });
      return id;
    } catch (error) {
      if (error instanceof Error) {
        throw new EmailAlreadyExistsError(
          `O e-mail "${email}" já está cadastrado.`
        );
      }
      throw error;
    }
  }

  /**
   * Busca um usuário pelo e-mail.
   * @param email - E-mail do usuário a ser buscado.
   * @returns O objeto User ou null se não encontrado.
   */
  async findUser(email: string): Promise<FindUserResult> {
    this.validateInput('', email);

    try {
      return await this.repository.findByEmail(email);
    } catch (error) {
      if (error instanceof Error && error.message.includes('não foi encontrado')) {
        throw new UserNotFoundError(
          `Usuário com e-mail "${email}" não encontrado.`
        );
      }
      throw error;
    }
  }

  /**
   * Valida os dados de entrada.
   */
  private validateInput(name: string, email: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('Nome é obrigatório', 'name');
    }

    if (name.length > 100) {
      throw new ValidationError(
        'O nome deve ter no máximo 100 caracteres.',
        'name'
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new ValidationError('E-mail inválido', 'email');
    }
  }
}
```

---

## 5. index.ts — Ponto de Entrada

```typescript
import { UserService, InMemoryUserRepository } from './userService.js';
import { UserNotFoundError, EmailAlreadyExistsError } from './errors.js';

/**
 * Módulo principal que exporta as classes e funções para uso externo.
 */
export { UserService, InMemoryUserRepository };
export type { UserRepository } from './repository.js';
export type { User, FindUserResult } from './types.js';
export { UserNotFoundError, EmailAlreadyExistsError, ValidationError } from './errors.js';

/**
 * Exemplo de uso do serviço.
 */
async function main(): Promise<void> {
  const repository = new InMemoryUserRepository();
  const userService = new UserService(repository);

  try {
    // Salvar usuários
    const id1 = await userService.saveUser('Alice Silva', 'alice@email.com');
    console.log(`Usuário criado com ID: ${id1}`);

    const id2 = await userService.saveUser('Bob Santos', 'bob@email.com');
    console.log(`Usuário criado com ID: ${id2}`);

    // Buscar usuário
    const user = await userService.findUser('alice@email.com');
    if (user) {
      console.log(`Encontrado: ${user.name} <${user.email}>`);
    } else {
      console.log('Usuário não encontrado.');
    }

    // Tentar salvar e-mail duplicado
    try {
      await userService.saveUser('Charlie', 'alice@email.com');
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        console.error(error.message);
      }
    }

    // Buscar usuário inexistente
    const notFound = await userService.findUser('inexistent@exemplo.com');
    console.log(notFound === null ? 'Usuário não encontrado.' : '');
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Erro: ${error.message}`);
    } else {
      console.error('Erro desconhecido:', error);
    }
  }
}

main();
```

---

## Explicação das Mudanças

| Aspecto | Código Original | Refatorado | Benefício |
|---------|----------------|------------|-----------|
| **Tipagem** | Nenhum tipo | Interfaces, tipos genéricos e `Promise` | Autocompletar, refatoração segura, documentação implícita |
| **Módulos** | Tudo em um arquivo | 5 arquivos separados por responsabilidade | Separação de preocupações, reutilização |
| **Testabilidade** | Difícil de testar (estado global) | Repositório injetável + `clear()` para testes | Mock fácil, testes unitários isolados |
| **Tratamento de erros** | Nenhum tratamento explícito | Custom errors com nomes específicos | Tratamento diferenciado por tipo de erro |
| **Validação** | Nenhuma validação | Validação no serviço e repositório | Feedback claro ao usuário, dados consistentes |
| **Imutabilidade** | Array mutável global | `Map` interno + normalização de e-mail | Previsibilidade, menos bugs de estado |
| **Normalização** | E-mails em caixa baixa não garantida | `.toLowerCase().trim()` no repositório | Buscas consistentes independentemente do input |

---

## Exemplo de Teste Unitário (Jest)

```typescript
// userService.test.ts
import { UserService, InMemoryUserRepository } from './userService.js';
import { UserNotFoundError, EmailAlreadyExistsError } from './errors.js';

describe('UserService', () => {
  let repository: InMemoryUserRepository;
  let service: UserService;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    service = new UserService(repository);
  });

  afterEach(() => {
    repository.clear();
  });

  test('deve salvar um usuário e retornar o ID', async () => {
    const id = await service.saveUser('João', 'joao@teste.com');
    expect(id).toBe(1);
  });

  test('deve lançar EmailAlreadyExistsError ao duplicar e-mail', async () => {
    await service.saveUser('João', 'joao@teste.com');
    await expect(service.saveUser('Maria', 'joao@teste.com')).rejects.toThrow(
      EmailAlreadyExistsError
    );
  });

  test('deve encontrar usuário pelo e-mail', async () => {
    const id = await service.saveUser('João', 'joao@teste.com');
    const user = await service.findUser('joao@teste.com');
    expect(user).toEqual({ id, name: 'João', email: 'joao@teste.com' });
  });

  test('deve retornar null quando usuário não existe', async () => {
    const result = await service.findUser('naoexiste@teste.com');
    expect(result).toBeNull();
  });

  test('deve validar e-mail inválido', async () => {
    await expect(service.saveUser('João', 'invalid-email')).rejects.toThrow(
      ValidationError
    );
  });
});
```

---

## Resumo das Boas Práticas Aplicadas

1. **Single Responsibility** — Cada módulo tem uma única responsabilidade clara.
2. **Dependency Injection** — O repositório é injetado, permitindo testes com mocks.
3. **Fail Fast** — Validação antecipada com erros específicos.
4. **Imutabilidade** — Estado interno protegido por `Map` e normalização.
5. **Tipagem Estrita** — TypeScript como primeira linha de defesa contra bugs.
6. **Testabilidade** — Repositório limpo via `clear()`, sem estado global persistente.
