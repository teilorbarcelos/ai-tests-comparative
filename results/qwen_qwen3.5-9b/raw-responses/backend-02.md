# Tarefa: ServiÃ§o com TypeScript: tratamento de erros

**ID**: backend-02  **Categoria**: backend
**Latencia**: 13.78s  **Tokens out**: 1054  **tps**: 76.48

---

# Função TypeScript para Buscar Dados de Usuário

Abaixo está uma implementação completa e tipada em TypeScript, incluindo interface `User`, exceção customizada `UserNotFoundError`, função assíncrona com timeout e tratamento de erros adequado, além de um exemplo de uso com `try/catch`.

```typescript
// Interface do usuário
export interface User {
  id: string;
  name: string;
  email: string;
}

// Exceção customizada para usuário não encontrado
export class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

// Função assíncrona com timeout de 5 segundos
async function fetchUserData(userId: string): Promise<User> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`https://api.exemplo.com/users/${userId}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Validação básica do formato esperado
    if (!data.id || !data.name || !data.email) {
      throw new UserNotFoundError('Dados do usuário inválidos');
    }

    return data as User;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Tempo limite de requisição excedido');
    }

    if (response?.status === 404 || response?.status === 401) {
      throw new UserNotFoundError(`Usuário com ID "${userId}" não encontrado`);
    }

    // Erros genéricos de rede ou outros
    throw error instanceof Error ? error : new Error('Erro desconhecido ao buscar usuário');
  }
}

// Exemplo de uso com tratamento de erro
async function main() {
  const userId = '12345';

  try {
    const user = await fetchUserData(userId);
    console.log('Usuário encontrado:', user);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      console.error(`Erro: ${error.message}`);
    } else if (error instanceof Error && error.message.includes('Tempo limite')) {
      console.error('Erro de timeout');
    } else {
      console.error('Erro desconhecido:', error);
    }
  }
}

// Executar exemplo
main();
```

## Explicações

### Interface `User`
Define a estrutura esperada para os dados retornados pela API, com campos obrigatórios: `id`, `name` e `email`.

### Exceção Customizada `UserNotFoundError`
Permite identificar claramente quando o usuário não é encontrado, facilitando tratamento específico de erro.

### Função `fetchUserData`
- Usa `AbortController` para implementar timeout de 5 segundos.
- Verifica status HTTP e lança exceções caso não seja 2xx.
- Valida estrutura básica do JSON retornado.
- Trata erros de rede, timeout e respostas inválidas.

### Exemplo de Uso
Demonstra como chamar a função e tratar diferentes tipos de erro com `try/catch`, incluindo casos específicos como `UserNotFoundError` e timeout.

## Observações

- A implementação assume que o ambiente possui suporte ao fetch nativo (Node.js 18+ ou navegador moderno).
- Em ambientes Node.js mais antigos, considere usar [node-fetch](https://www.npmjs.com/package/node-fetch) com tipagem adequada.
- Para produção, recomenda-se adicionar validações mais robustas e tratamento de logs.
