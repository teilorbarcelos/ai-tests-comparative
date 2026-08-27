# Tarefa: ServiÃ§o com TypeScript: tratamento de erros

**ID**: backend-02  **Categoria**: backend
**Latencia**: 183.54s  **Tokens out**: 2607  **tps**: 14.2

---

Aqui está uma implementação completa e tipada em TypeScript que atende aos requisitos solicitados:

```typescript
// Definição da interface do usuário
interface User {
  id: string;
  name: string;
  email: string;
}

// Exceção personalizada para quando o usuário não é encontrado
class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

/**
 * Função assíncrona que busca dados de um usuário em uma API externa.
 * @param userId - ID do usuário a ser buscado
 * @returns Promise<User> com os dados do usuário
 */
async function fetchUserData(userId: string): Promise<User> {
  // Cria uma promessa que rejeita após 5 segundos (timeout)
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Request timeout'));
    }, 5000);
  });

  try {
    // Realiza a requisição com timeout
    const response = await Promise.race([
      fetch(`https://api.example.com/users/${userId}`),
      timeout
    ]);

    // Verifica se a resposta é bem-sucedida (status 2xx)
    if (!response.ok) {
      throw new UserNotFoundError(
        `User not found. Status: ${response.status}`
      );
    }

    // Converte a resposta para JSON e retorna o usuário
    const data: User = await response.json();
    return data;
  } catch (error) {
    // Trata erros de timeout ou outros erros de rede
    if (error instanceof Error) {
      if (error.message === 'Request timeout') {
        throw new UserNotFoundError('Timeout occurred while fetching user data');
      } else {
        throw new UserNotFoundError('Network error occurred while fetching user data');
      }
    } else {
      // Caso o erro não seja uma instância de Error
      throw new UserNotFoundError('Unexpected error occurred while fetching user data');
    }
  }
}

// Exemplo de uso com try/catch
async function exampleUsage() {
  try {
    const user = await fetchUserData('12345');
    console.log('User found:', user);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      console.error('Error fetching user data:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// Chamada da função de exemplo
exampleUsage();
```

### Explicação detalhada:

1. **Interface `User`**:
   - Define os campos obrigatórios (`id`, `name`, `email`) que devem estar presentes na resposta da API.

2. **Classe `UserNotFoundError`**:
   - Extende a classe built-in `Error` do JavaScript.
   - Permite identificar claramente quando um usuário não é encontrado ou ocorre um erro relacionado à busca.

3. **Função `fetchUserData`**:
   - **Timeout de 5 segundos**: Cria uma promessa que rejeita após 5 segundos usando `setTimeout`.
   - **Tratamento de erros**:
     - Se a resposta da API não for bem-sucedida (`response.ok === false`), lança `UserNotFoundError` com o status HTTP.
     - Se ocorrer um erro de rede ou timeout, lança `UserNotFoundError` com uma mensagem apropriada.
   - **Tipagem**: A função retorna uma `Promise<User>` garantindo que os dados sejam do tipo esperado.

4. **Exemplo de uso**:
   - Demonstra como chamar a função `fetchUserData`.
   - Usa `try/catch` para tratar possíveis erros, incluindo o erro personalizado `UserNotFoundError`.

### Observações importantes:

- A URL da API (`https://api.example.com/users/${userId}`) é apenas um exemplo. Substitua-a pela URL real da sua API.
- O timeout de 5 segundos garante que a requisição não fique pendente indefinidamente, evitando bloqueios no front-end.
- A função lança `UserNotFoundError` em todos os casos de erro (timeout, status HTTP inválido ou erros de rede), permitindo um tratamento unificado de falhas relacionadas à busca do usuário.
