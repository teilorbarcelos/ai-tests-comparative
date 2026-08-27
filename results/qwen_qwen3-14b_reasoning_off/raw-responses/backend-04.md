# Tarefa: RefatoraÃ§Ã£o e boas prÃ¡ticas

**ID**: backend-04  **Categoria**: backend
**Latencia**: 74.85s  **Tokens out**: 1228  **tps**: 16.41

---

Claro! Vamos refatorar o código fornecido para TypeScript, seguindo **boas práticas**, como:

- Separação em módulos (arquivos separados).
- Adição de tipagem com `TypeScript`.
- Tratamento de erros.
- Tornando o código testável.

---

## ✅ 1. Estrutura do Projeto

Vamos organizar o projeto da seguinte forma:

```
src/
├── models/
│   └── User.ts
├── services/
│   └── UserService.ts
└── index.ts
```

---

## 📁 `models/User.ts` – Definição de Tipos

```ts
// src/models/User.ts
export interface User {
  id: number;
  name: string;
  email: string;
}
```

---

## 📁 `services/UserService.ts` – Lógica de Negócio com Tipagem e Tratamento de Erros

```ts
// src/services/UserService.ts
import { User } from '../models/User';

interface UserRepository {
  save(user: User): number;
  find(email: string): User | null;
}

class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  public save(user: User): number {
    this.users.push(user);
    return this.users.length;
  }

  public find(email: string): User | null {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error(`User with email ${email} not found.`);
    }
    return user;
  }
}

class UserService {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  public save(name: string, email: string): number {
    if (!name || !email) {
      throw new Error('Name and email are required.');
    }

    const newUser: User = {
      id: Date.now(), // Simplesmente usando timestamp como ID
      name,
      email,
    };

    return this.repository.save(newUser);
  }

  public find(email: string): User | null {
    try {
      return this.repository.find(email);
    } catch (error) {
      console.error(`Error finding user with email ${email}:`, error.message);
      return null;
    }
  }
}

export { UserService, InMemoryUserRepository };
```

---

## 📁 `index.ts` – Ponto de Entrada

```ts
// src/index.ts
import { UserService, InMemoryUserRepository } from './services/UserService';

const repository = new InMemoryUserRepository();
const userService = new UserService(repository);

// Exemplo de uso:
try {
  const userId = userService.save('João Silva', 'joao@example.com');
  console.log(`Usuário salvo com ID: ${userId}`);

  const user = userService.find('joao@example.com');
  if (user) {
    console.log('Usuário encontrado:', user);
  }
} catch (error) {
  console.error('Erro durante a operação:', error.message);
}
```

---

## 🧪 Testabilidade

Com essa estrutura, o código é **facilmente testável**:

### Exemplo de teste com `Jest`:

```ts
// __tests__/UserService.test.ts
import { UserService, InMemoryUserRepository } from '../src/services/UserService';

describe('UserService', () => {
  let userService: UserService;
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    userService = new UserService(repository);
  });

  it('should save a user and return the count', () => {
    const count = userService.save('Maria Souza', 'maria@example.com');
    expect(count).toBe(1);
  });

  it('should find a user by email', () => {
    userService.save('Ana Pereira', 'ana@example.com');
    const user = userService.find('ana@example.com');
    expect(user?.name).toBe('Ana Pereira');
  });

  it('should return null if user not found', () => {
    const user = userService.find('invalid@example.com');
    expect(user).toBeNull();
  });
});
```

---

## 🔍 Explicação das Mudanças

### ✅ 1. **Tipagem com TypeScript**
- Adicionamos interfaces (`User`) para definir a estrutura dos dados.
- Usamos `TypeScript` para validar os parâmetros e retornos de funções.

### ✅ 2. **Separação em Módulos**
- Separamos a lógica de persistência (`InMemoryUserRepository`) da lógica de negócios (`UserService`).
- Isso facilita manutenção, testes e substituição de implementações (ex: mudar para banco de dados).

### ✅ 3. **Tratamento de Erros**
- Adicionamos validação nos parâmetros.
- Usamos `try/catch` para capturar erros em chamadas ao repositório.
- Lançamos exceções com mensagens claras.

### ✅ 4. **Testabilidade**
- O código está desacoplado, permitindo testes unitários.
- Podemos mockar o repositório para testar apenas a lógica de negócios.

---

## 🧠 Conclusão

Com essa refatoração:

- O código é mais legível e mantível.
- Tem tipagem segura com TypeScript.
- É fácil de testar, pois está desacoplado.
- Pode ser expandido facilmente (ex: adicionar autenticação, validações avançadas, etc).

Se quiser, posso também criar um exemplo usando `Express` e `React`, caso você queira integrar com uma API.
