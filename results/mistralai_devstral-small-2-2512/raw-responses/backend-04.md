# Tarefa: RefatoraÃ§Ã£o e boas prÃ¡ticas

**ID**: backend-04  **Categoria**: backend
**Latencia**: 46.15s  **Tokens out**: 1589  **tps**: 34.43

---

# Refatoração para TypeScript com Boas Práticas

Vou refatorar o código original para TypeScript, implementando boas práticas como:
- Separação em módulos
- Tipagem forte
- Tratamento de erros
- Testabilidade
- Uso de interfaces e classes
- Injeção de dependência

## Estrutura Final

```
src/
├── models/
│   ├── User.ts
│   └── UserRepository.ts
├── services/
│   └── UserService.ts
└── index.ts
```

### 1. `models/User.ts`

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
}

export class UserBuilder {
  private user: Partial<User> = {};

  withName(name: string): this {
    this.user.name = name;
    return this;
  }

  withEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  build(): User {
    if (!this.user.name) {
      throw new Error("Name is required");
    }
    if (!this.user.email) {
      throw new Error("Email is required");
    }
    return {
      id: crypto.randomUUID(),
      ...this.user,
      createdAt: new Date()
    };
  }
}
```

### 2. `models/UserRepository.ts`

```typescript
import { User } from "./User";

export interface UserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async save(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    return user ? Promise.resolve(user) : Promise.resolve(null);
  }

  async findAll(): Promise<User[]> {
    return Promise.resolve([...this.users]);
  }
}
```

### 3. `services/UserService.ts`

```typescript
import { User } from "../models/User";
import { UserRepository } from "../models/UserRepository";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(name: string, email: string): Promise<User> {
    try {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const user = new UserBuilder()
        .withName(name)
        .withEmail(email)
        .build();

      return await this.userRepository.save(user);
    } catch (error) {
      console.error(`Error creating user: ${error}`);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findByEmail(email);
      return user;
    } catch (error) {
      console.error(`Error finding user by email: ${error}`);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      console.error(`Error getting all users: ${error}`);
      throw error;
    }
  }
}
```

### 4. `index.ts` (Ponto de entrada)

```typescript
import { UserService } from "./services/UserService";
import { InMemoryUserRepository } from "./models/UserRepository";

// Injeção de dependência
const userRepository = new InMemoryUserRepository();
const userService = new UserService(userRepository);

// Exemplo de uso
(async () => {
  try {
    const user1 = await userService.createUser("John Doe", "john@example.com");
    console.log("Created user:", user1);

    const user2 = await userService.getUserByEmail("john@example.com");
    console.log("Found user:", user2);

    const allUsers = await userService.getAllUsers();
    console.log("All users:", allUsers);
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
```

## Explicação das Mudanças

1. **Tipagem Forte**:
   - Criamos interfaces para definir a estrutura dos dados (`User`)
   - Usamos TypeScript para tipar todas as funções e métodos
   - Adicionamos validações nos builders

2. **Separação de Responsabilidades**:
   - `User`: Interface que define a estrutura do usuário
   - `UserBuilder`: Classe para construir usuários com padrão Builder
   - `UserRepository`: Interface para operações de persistência
   - `InMemoryUserRepository`: Implementação concreta do repositório
   - `UserService`: Serviço que orquestra as operações de negócio

3. **Tratamento de Erros**:
   - Adicionamos try/catch em todas as operações assíncronas
   - Lançamos erros com mensagens significativas
   - Validamos entradas antes de criar usuários

4. **Testabilidade**:
   - O repositório é injetado no serviço, permitindo mocks em testes
   - Funções puras são mais fáceis de testar
   - Interface clara entre componentes

5. **Boas Práticas Adicionais**:
   - Uso de UUID para IDs únicos
   - Data de criação automática
   - Padrão Builder para construção de objetos complexos
   - Injeção de dependência para facilidade de teste e manutenção

6. **Assincronia**:
   - Todas as operações são assíncronas (mesmo que a implementação seja síncrona)
   - Facilita migração para bancos de dados reais no futuro

## Como Testar

Para tornar o código testável, você pode criar testes unitários usando Jest ou Mocha:

```typescript
// userService.test.ts
import { UserService } from "./services/UserService";
import { InMemoryUserRepository } from "./models/UserRepository";

describe("UserService", () => {
  let userService: UserService;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    userService = new UserService(userRepository);
  });

  it("should create a user successfully", async () => {
    const user = await userService.createUser("Test User", "test@example.com");
    expect(user.name).toBe("Test User");
    expect(user.email).toBe("test@example.com");
    expect(user.id).toBeDefined();
  });

  it("should throw error when creating duplicate user", async () => {
    await userService.createUser("Test User", "test@example.com");
    await expect(
      userService.createUser("Another User", "test@example.com")
    ).rejects.toThrow("User with this email already exists");
  });

  it("should find a user by email", async () => {
    const createdUser = await userService.createUser("Test User", "test@example.com");
    const foundUser = await userService.getUserByEmail("test@example.com");
    expect(foundUser).toEqual(createdUser);
  });
});
```

Essa refatoração torna o código mais robusto, mantenedor e pronto para escalar em aplicações reais.
