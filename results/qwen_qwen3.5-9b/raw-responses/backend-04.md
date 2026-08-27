# Tarefa: RefatoraÃ§Ã£o e boas prÃ¡ticas

**ID**: backend-04  **Categoria**: backend
**Latencia**: 25.33s  **Tokens out**: 1958  **tps**: 77.29

---

# Refatoração para TypeScript com Boas Práticas

Abaixo está uma versão completa e organizada do código original, seguindo boas práticas de desenvolvimento com Node.js, React e TypeScript. O objetivo foi:

- Tipagem explícita e segura
- Separação de responsabilidades (módulos)
- Tratamento de erros robusto
- Código testável
- Documentação clara

---

## 📁 Estrutura de Arquivos Sugerida

```
src/
├── types/
│   └── user.ts
├── services/
│   └── userService.ts
├── repository/
│   └── userRepository.ts
├── errors/
│   └── appError.ts
├── index.ts
└── tests/
    └── userService.test.ts
```

---

## 1. `src/types/user.ts` — Definição de Tipos

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
}

export type CreateUserInput = {
  name: string;
  email: string;
};

export type FindUserByEmailInput = {
  email: string;
};
```

---

## 2. `src/errors/appError.ts` — Classe de Erro Personalizada

```typescript
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly message: string;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

export class EmailNotFoundError extends AppError {
  constructor(email: string) {
    super(`Usuário com email ${email} não encontrado`, 404);
  }
}

export class InvalidEmailError extends AppError {
  constructor(email: string) {
    super(`Email inválido: ${email}`, 400);
  }
}
```

---

## 3. `src/repository/userRepository.ts` — Camada de Persistência (Mockável)

```typescript
import { User, CreateUserInput, FindUserByEmailInput } from '../types/user';
import { EmailNotFoundError, InvalidEmailError } from '../errors/appError';

export class UserRepository {
  private users: User[] = [];
  private nextId = 1;

  public save(user: CreateUserInput): User {
    if (!user.name || !user.email) {
      throw new InvalidEmailError('Nome e email são obrigatórios');
    }

    const existingUser = this.users.find(u => u.email === user.email);
    if (existingUser) {
      throw new EmailNotFoundError(user.email);
    }

    const newUser: User = {
      id: this.nextId++,
      name: user.name,
      email: user.email.toLowerCase().trim(),
    };

    this.users.push(newUser);
    return newUser;
  }

  public findByEmail(email: string): User | null {
    if (!email || typeof email !== 'string') {
      throw new InvalidEmailError('Email inválido');
    }

    const normalizedEmail = email.toLowerCase().trim();
    return this.users.find(u => u.email === normalizedEmail) || null;
  }

  public getAll(): User[] {
    return [...this.users];
  }

  public clear(): void {
    this.users = [];
    this.nextId = 1;
  }
}
```

---

## 4. `src/services/userService.ts` — Lógica de Negócio

```typescript
import { User, CreateUserInput, FindUserByEmailInput } from '../types/user';
import { UserRepository } from '../repository/userRepository';
import { EmailNotFoundError, InvalidEmailError } from '../errors/appError';

export class UserService {
  private repository: UserRepository;

  constructor(repository?: UserRepository) {
    this.repository = repository || new UserRepository();
  }

  public saveUser(input: CreateUserInput): User {
    try {
      return this.repository.save(input);
    } catch (error) {
      if (error instanceof InvalidEmailError || error instanceof EmailNotFoundError) {
        throw error;
      }
      throw new Error('Erro ao salvar usuário');
    }
  }

  public findUserByEmail(email: string): User | null {
    try {
      return this.repository.findByEmail(email);
    } catch (error) {
      if (error instanceof InvalidEmailError) {
        throw error;
      }
      throw new Error('Erro ao buscar usuário');
    }
  }

  public getAllUsers(): User[] {
    try {
      return this.repository.getAll();
    } catch (error) {
      throw new Error('Erro ao listar usuários');
    }
  }
}
```

---

## 5. `src/index.ts` — Exportação Principal

```typescript
export * from './types/user';
export * from './errors/appError';
export { UserService } from './services/userService';
export { UserRepository } from './repository/userRepository';
```

---

## 6. `tests/userService.test.ts` — Exemplo de Testes (Jest)

```typescript
import { UserService } from '../src/services/userService';
import { UserRepository } from '../src/repository/userRepository';
import { EmailNotFoundError, InvalidEmailError } from '../src/errors/appError';

describe('UserService', () => {
  let userService: UserService;
  let repository: UserRepository;

  beforeEach(() => {
    repository = new UserRepository();
    userService = new UserService(repository);
  });

  afterEach(() => {
    repository.clear();
  });

  describe('saveUser', () => {
    it('deve salvar usuário com sucesso', () => {
      const user = userService.saveUser({ name: 'João', email: 'joao@email.com' });
      expect(user).toHaveProperty('id');
      expect(user.name).toBe('João');
      expect(user.email).toBe('joao@email.com');
    });

    it('deve lançar EmailNotFoundError se email já existe', () => {
      userService.saveUser({ name: 'João', email: 'joao@email.com' });
      expect(() =>
        userService.saveUser({ name: 'Maria', email: 'joao@email.com' })
      ).toThrow(EmailNotFoundError);
    });

    it('deve lançar InvalidEmailError se campos obrigatórios faltarem', () => {
      expect(() => userService.saveUser({ name: '' })).toThrow(InvalidEmailError);
    });
  });

  describe('findUserByEmail', () => {
    it('deve encontrar usuário pelo email', () => {
      const user = userService.saveUser({ name: 'Ana', email: 'ana@email.com' });
      const found = userService.findUserByEmail('ana@email.com');
      expect(found?.email).toBe('ana@email.com');
    });

    it('deve retornar null se usuário não existir', () => {
      const notFound = userService.findUserByEmail('inexistente@email.com');
      expect(notFound).toBeNull();
    });
  });
});
```

---

## ✅ Principais Melhorias Realizadas

| Aspecto               | Antes                          | Depois                                |
|-----------------------|--------------------------------|----------------------------------------|
| Tipagem               | Sem tipos                      | TypeScript com interfaces e types     |
| Separação de Módulos  | Código monolítico              | Repositório, Serviço, Tipos, Erros    |
| Tratamento de Erros   | Sem tratamento                 | Classes de erro personalizadas        |
| Testabilidade         | Difícil de testar              | Mockável e com testes unitários       |
| Documentação          | Nenhuma                        | Interfaces claras e comentários       |

---

## 🚀 Como Executar os Testes

```bash
npm install --save-dev jest ts-jest @types/jest typescript
npx tsc --noEmit
npx jest tests/userService.test.ts
```

---

Esta estrutura é escalável, testável e segue padrões modernos de desenvolvimento com TypeScript. Você pode expandir para autenticação, validação de email, persistência real (ex: PostgreSQL), ou integração com React conforme necessário.
