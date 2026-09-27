# Tarefa: ServiÃ§o com TypeScript: tratamento de erros

**ID**: backend-02  **Categoria**: backend
**Latencia**: 22.79s  **Tokens out**: 788  **tps**: 34.58

---

Aqui está o código completo em TypeScript, seguindo suas especificações:

```typescript
// Interfaces e classes customizadas
interface User {
  id: string;
  name: string;
  email: string;
}

class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserNotFoundError";
  }
}

// Função principal com timeout e tratamento de erros
async function fetchUserData(userId: string): Promise<User> {
  // Configuração do timeout (5 segundos)
  const timeout = 5000;

  // Cria uma promise que resolve após o timeout
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${timeout}ms`));
    }, timeout);
  });

  try {
    // Realiza a requisição com fetch e aplica o timeout usando Promise.race
    const response = await Promise.race([
      fetch(`https://api.example.com/users/${userId}`),
      timeoutPromise,
    ]);

    // Verifica se a resposta é válida (status 2xx)
    if (!response.ok) {
      throw new UserNotFoundError(
        `User not found or server error: ${response.status}`
      );
    }

    // Converte a resposta para JSON e retorna os dados
    const userData = await response.json();
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
    };
  } catch (error) {
    // Trata erros de rede ou timeout
    if (error instanceof UserNotFoundError) {
      throw error;
    }
    // Lança um erro genérico para outros casos
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
}

// Exemplo de uso com try/catch
async function exampleUsage() {
  const userId = "123";

  try {
    const user = await fetchUserData(userId);
    console.log("User data:", user);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      console.error("Custom error:", error.message);
    } else {
      console.error("General error:", error.message);
    }
  }
}

// Executa o exemplo
exampleUsage();
```

### Explicações detalhadas:

1. **Interface `User`**:
   - Define a estrutura dos dados esperados da API.

2. **Classe `UserNotFoundError`**:
   - Extende `Error` para criar uma exceção customizada tipada.
   - Útil para identificar erros específicos no código chamador.

3. **Função `fetchUserData`**:
   - **Timeout**: Usa `Promise.race` para cancelar a requisição se demorar mais que 5 segundos.
   - **Tratamento de erros**:
     - Verifica o status HTTP (`response.ok`) e lança `UserNotFoundError` para status não-2xx.
     - Captura erros de rede ou timeout e os relança com mensagens claras.

4. **Exemplo de uso**:
   - Demonstra como chamar a função com `try/catch`.
   - Diferencia o tratamento entre erros customizados (`UserNotFoundError`) e genéricos.

### Observações:
- Substitua `https://api.example.com/users/${userId}` pela URL real da sua API.
- Para ambientes Node.js, você pode precisar do pacote `node-fetch` ou similar (ex: `import fetch from 'node-fetch'`).
- O código está 100% tipado e pronto para ser usado em projetos TypeScript.
