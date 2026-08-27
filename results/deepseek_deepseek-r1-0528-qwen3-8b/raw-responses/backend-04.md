# Tarefa: RefatoraÃ§Ã£o e boas prÃ¡ticas

**ID**: backend-04  **Categoria**: backend
**Latencia**: 54.98s  **Tokens out**: 4518  **tps**: 82.18

---


Vou refatorar esse código para TypeScript seguindo princípios de boas práticas:

```typescript
// user.ts (interface)
interface User {
  id?: number;
  name: string;
  email: string;
}

// userRepository.ts (dependência injetável)
class AbstractUserRepository implements UserRepository {
  save(user: Omit<User, 'id'>): Promise<number> {
    throw new Error('Method not implemented.');
  }

  findByEmail(email: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
}

class InMemoryUserRepository extends AbstractUserRepository {
  private users: User[] = [];
  
  async save(userWithoutId: Omit<User, 'id'>): Promise<number> {
    const id = this.users.length + 1;
    const user: User = { ...userWithoutId, id };
    
    try {
      if (!this.validateUser(user)) throw new Error('Dados inválidos');
      
      await this.delaySave(); // Simula operação assíncrona
      this.users.push(user);
      return id;
    } catch (error) {
      console.error(error.message);
      throw error; // Re-lança a exceção para o chamador tratar
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      await this.delayFind(); // Simula operação assíncrona
      return this.users.find(u => u.email === email) || null;
    } catch (error) {
      console.error(error.message);
      throw error; // Re-lança a exceção para o chamador tratar
    }
  }

  private validateUser(user: Omit<User, 'id'>): boolean {
    return !!user.name && typeof user.email === 'string' && 
           this.isValidEmail(user.email) && !this.duplicateEmail(user.email);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private duplicateEmail(email: string): boolean {
    return this.users.some(u => u.email === email);
  }

  // Métodos utilitários para simular operações assíncronas
  private async delaySave(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  private async delayFind(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

// userService.ts (classe principal)
class UserService {
  constructor(private userRepository: UserRepository) {}

  async saveUser(name: string, email: string): Promise<number> {
    if (!this.userRepository.validateInput(name, email)) throw new Error('Entrada inválida');
    
    try {
      return await this.userRepository.save({ name, email });
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async findUser(email: string): Promise<User | null> {
    if (!this.userRepository.validateInput(undefined, email)) throw new Error('Email inválido');
    
    try {
      return await this.userRepository.findByEmail(email);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  private validateInput(name?: string, email?: string): boolean {
    if (!name && !email) return false;
    if (!email || typeof email !== 'string') return false;
    return true; // Considera que o nome pode ser opcional
  }
}

// main.ts (exemplo de uso)
import { UserService } from './userService';
import { InMemoryUserRepository } from './userRepository';

async function runExample() {
  const userRepository = new InMemoryUserRepository();
  const userService = new UserService(userRepository);

  try {
    // Teste save
    console.log('Salvando usuário...');
    const id1 = await userService.saveUser('João Silva', 'joao@email.com');
    console.log(`Usuário salvo com ID: ${id1}`);

    // Teste find
    console.log('\nBuscando usuário por email...');
    const userFound = await userService.findUser('joao@email.com');
    if (userFound) {
      console.log('Dados do usuário:', JSON.stringify(userFound));
    } else {
      console.log('Usuário não encontrado.');
    }

    // Teste de erro
    console.log('\nTentando salvar dados inválidos...');
    await userService.saveUser('', 'invalido@email'); // Falha na validação

  } catch (error) {
    console.error('\nErro:', error.message);
  }
}

runExample();
```

**Principais mudanças e benefícios:**

1. **Tipagem Estruturada**
   - Definição clara de interface `User` com tipos específicos
   - Tipagens completas para todos os parâmetros e retornos
   - Uso do `Omit<T, 'id'>` para garantir que o ID não seja incluído na criação

2. **Módulos Separados**
   - Separação de responsabilidades: 
     - `user.ts`: Definição da interface de usuário
     - `userRepository.ts`: Implementação do repositório abstrato e concreto
     - `userService.ts`: Lógica de negócio principal

3. **Tratamento de Erros**
   - Uso consistente de try/catch para capturar erros em operações assíncronas
   - Validação prévia dos dados antes do processamento
   - Mensagens de erro claras e específicas
   - Re-lançamento de exceções mantém o fluxo controlado

4. **Testabilidade**
   - Implementação abstrata `AbstractUserRepository` para mocking em testes
   - Injeção de dependência no construtor do `UserService`
   - Métodos utilitários separados facilitam a substituição da implementação real por mocks

5. **Princípio S.O.L.I.D**
   - Abstração via interface (`UserRepository`)
   - Segregação de preocupações (cada arquivo tem uma responsabilidade única)
   - Inversão de dependências (depende do abstrato, não da implementação concreta)

6. **Melhorias Adicionais**
   - Operações assíncronas simuladas com `delaySave` e `delayFind`
   - Validação completa de email formato
   - Detecção de duplicatas no banco de dados
   - Código mais declarativo usando async/await

**Como testar:**

```typescript
// user.service.test.ts
import { UserService } from './userService';
import { AbstractUserRepository } from './userRepository';

describe('UserService', () => {
  let service: UserService;
  const mockRepo = new class extends AbstractUserRepository {
    saveCount = 0;
    findCount = 0;

    async save(userWithoutId: Omit<User, 'id'>): Promise<number> {
      this.saveCount++;
      return 123; // ID fixo para testes
    }

    async findByEmail(email: string): Promise<User | null> {
      this.findCount++;
      return { name: 'Teste', email } as User;
    }
    
    validateInput(name?: string, email?: string): boolean {
      return true;
    }
  };

  beforeEach(() => {
    service = new UserService(mockRepo);
  });

  it('deve salvar usuário com sucesso', async () => {
    const result = await service.saveUser('Teste', 'teste@email.com');
    expect(result).toBe(123);
    expect(mockRepo.saveCount).toBe(1);
  });

  it('deve lançar erro para email inválido', async () => {
    await expect(service.findUser('invalido')).rejects.toThrow();
  });
});
```

**Principais vantagens da refatoração:**

- Código mais seguro com validações de tipos
- Melhor desempenho em testes unitários (injeção de mocks)
- Facilidade para adicionar operações assíncronas no futuro
- Manutenibilidade aprimorada graças à separação de módulos
- Compatibilidade com princípios de design modernos
