# Tarefa: RefatoraÃ§Ã£o e boas prÃ¡ticas

**ID**: backend-04  **Categoria**: backend
**Latencia**: 140.76s  **Tokens out**: 1938  **tps**: 13.77

---

Aqui está a refatoração do código com TypeScript, seguindo boas práticas de desenvolvimento:

```typescript
// src/models/User.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

// src/repositories/UsersRepository.ts
import { User } from '../models/User';

class UsersRepository {
  private users: User[] = [];

  public saveUser(name: string, email: string): number {
    if (!name || !email) {
      throw new Error('Nome e e-mail são obrigatórios');
    }

    const existingUser = this.findUser(email);
    if (existingUser) {
      throw new Error('Já existe um usuário com esse e-mail');
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email
    };

    this.users.push(newUser);
    return this.users.length;
  }

  public findUser(email: string): User | null {
    return this.users.find(user => user.email === email) || null;
  }
}

export default UsersRepository;

// src/services/UserService.ts
import { User } from '../models/User';
import UsersRepository from '../repositories/UsersRepository';

class UserService {
  private usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async saveUser(name: string, email: string): Promise<number> {
    try {
      return await this.usersRepository.saveUser(name, email);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error.message);
      throw error;
    }
  }

  public findUser(email: string): User | null {
    return this.usersRepository.findUser(email);
  }
}

export default UserService;

// src/index.ts
import UsersRepository from './repositories/UsersRepository';
import UserService from './services/UserService';

const usersRepository = new UsersRepository();
const userService = new UserService(usersRepository);

// Exemplo de uso
try {
  const userIdsCount = userService.saveUser('João Silva', 'joao@example.com');
  console.log(`Usuário salvo. Total de usuários: ${userIdsCount}`);
  
  const foundUser = userService.findUser('joao@example.com');
  if (foundUser) {
    console.log('Usuário encontrado:', foundUser);
  } else {
    console.log('Usuário não encontrado');
  }
} catch (error) {
  console.error('Erro no sistema:', error.message);
}
```

### Mudanças e melhorias:

1. **Tipagem com TypeScript**:
   - Adicionei interfaces para definir a estrutura de `User`
   - Defini tipos claros para parâmetros e retornos das funções
   - Utilizei `User | null` para indicar possibilidade de retorno nulo

2. **Arquitetura modular**:
   - Separei em três camadas: modelo (models), repositório (repositories) e serviço (services)
   - Cada componente tem responsabilidade única
   - Facilita a manutenção e expansão do código

3. **Tratamento de erros**:
   - Validações para campos obrigatórios
   - Verificação de duplicidade de e-mail
   - Tratamento de exceções com try/catch
   - Mensagens claras de erro

4. **Testabilidade**:
   - Injeção de dependência (UsersRepository é injetado no UserService)
   - Facilita a criação de mocks para testes unitários
   - Separação lógica entre persistência e negócios

5. **Melhorias funcionais**:
   - Adicionei `id` único aos usuários
   - Utilizei `Date.now()` para geração de IDs (pode ser substituído por UUID em produção)
   - Melhorei a estrutura do código com classes e métodos

### Exemplo de teste unitário com Jest:

```typescript
// src/__tests__/UserService.test.ts
import UserService from '../services/UserService';
import UsersRepository from '../repositories/UsersRepository';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UsersRepository>;

  beforeEach(() => {
    repository = {
      saveUser: jest.fn(),
      findUser: jest.fn()
    } as any;
    
    service = new UserService(repository);
  });

  it('deve salvar um usuário com sucesso', async () => {
    repository.saveUser.mockReturnValue(1);
    
    const result = await service.saveUser('Maria Silva', 'maria@example.com');
    
    expect(result).toBe(1);
    expect(repository.saveUser).toHaveBeenCalledWith('Maria Silva', 'maria@example.com');
  });

  it('deve lançar erro ao tentar salvar usuário com e-mail duplicado', async () => {
    repository.findUser.mockReturnValue({ id: '123', name: 'João', email: 'joao@example.com' } as User);
    
    await expect(service.saveUser('João Silva', 'joao@example.com')).rejects.toThrow(
      'Já existe um usuário com esse e-mail'
    );
  });
});
```

### Benefícios da refatoração:

1. **Manutenibilidade**: Cada componente tem uma única responsabilidade
2. **Escalabilidade**: Facilita a adição de novas funcionalidades
3. **Segurança**: Validações claras e tratamento de erros
4. **Testabilidade**: Estrutura que permite testes unitários eficientes
5. **Legibilidade**: Código mais claro com tipos explícitos

Essa abordagem segue padrões modernos de desenvolvimento, permitindo fácil expansão para sistemas maiores e mais complexos.
