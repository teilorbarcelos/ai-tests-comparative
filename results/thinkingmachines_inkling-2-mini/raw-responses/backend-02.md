# Tarefa: ServiÃ§o com TypeScript: tratamento de erros

**ID**: backend-02  **Categoria**: backend
**Latencia**: 265.14s  **Tokens out**: 4369  **tps**: 16.48

---

Segue uma implementação completa e tipada, em TypeScript estrito:

```ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export type UserErrorReason =
  | 'not_found'
  | 'http_error'
  | 'network_error'
  | 'timeout'
  | 'invalid_response';

export class UserNotFoundError extends Error {
  readonly reason: UserErrorReason;
  readonly userId?: string;
  readonly statusCode?: number;
  override readonly cause?: unknown;

  constructor(
    message: string,
    options: {
      reason: UserErrorReason;
      userId?: string;
      statusCode?: number;
      cause?: unknown;
    }
  ) {
    super(message);
    this.name = 'UserNotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);

    this.reason = options.reason;
    this.userId = options.userId;
    this.statusCode = options.statusCode;
    this.cause = options.cause;
  }
}

const DEFAULT_BASE_URL = 'https://api.exemplo.com/users';
const DEFAULT_TIMEOUT_MS = 5000;

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.email === 'string'
  );
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { name?: string }).name === 'AbortError'
  );
}

export async function fetchUserData(
  userId: string,
  options: { baseUrl?: string; timeoutMs?: number } = {}
): Promise<User> {
  if (!userId || typeof userId !== 'string') {
    throw new UserNotFoundError('O parâmetro userId é obrigatório e deve ser uma string.', {
      reason: 'invalid_response',
    });
  }

  const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}/${encodeURIComponent(userId)}`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new UserNotFoundError(
        `Falha ao buscar usuário "${userId}": HTTP ${response.status}`,
        {
          reason: response.status === 404 ? 'not_found' : 'http_error',
          userId,
          statusCode: response.status,
        }
      );
    }

    let data: unknown;

    try {
      data = await response.json();
    } catch (error) {
      throw new UserNotFoundError(
        `Resposta inválida do servidor para o usuário "${userId}".`,
        { reason: 'invalid_response', userId, cause: error }
      );
    }

    if (!isUser(data)) {
      throw new UserNotFoundError(
        `Formato de resposta inesperado para o usuário "${userId}".`,
        { reason: 'invalid_response', userId }
      );
    }

    return data;
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      throw error;
    }

    if (isAbortError(error)) {
      throw new UserNotFoundError(
        `Timeout de ${timeoutMs}ms ao buscar o usuário "${userId}".`,
        { reason: 'timeout', userId, cause: error }
      );
    }

    throw new UserNotFoundError(
      `Erro de rede ao buscar o usuário "${userId}".`,
      { reason: 'network_error', userId, cause: error }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
```

Exemplo de uso com `try/catch`:

```ts
async function main(): Promise<void> {
  try {
    const user = await fetchUserData('user-123', {
      baseUrl: 'https://api.exemplo.com/users',
      timeoutMs: 5000,
    });

    console.log('Usuário encontrado:', user);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      console.error('Erro ao buscar usuário:', error.message);
      console.error('Motivo:', error.reason);

      if (error.statusCode !== undefined) {
        console.error('Status HTTP:', error.statusCode);
      }

      // Exemplo de tratamento por motivo
      switch (error.reason) {
        case 'not_found':
          console.log('Usuário não existe ou foi removido.');
          break;
        case 'timeout':
          console.log('A API demorou demais para responder.');
          break;
        case 'network_error':
          console.log('Falha de conexão com a API.');
          break;
        default:
          console.log('Erro inesperado ao processar resposta.');
      }

      return;
    }

    throw error; // erros não esperados sobem para quem chamou a função
  }
}

main().catch(console.error);
```

Pontos importantes:

- `UserNotFoundError` é uma exceção tipada customizada, com campos adicionais como `reason`, `userId`, `statusCode` e `cause`.
- O timeout de 5 segundos é implementado com `AbortController` + `setTimeout`; no `finally`, o timer é sempre limpo.
- Erros HTTP não-2xx são tratados antes de tentar ler o corpo da resposta.
- A validação de tipo garante que a API retornou um objeto compatível com `User`.
- Em Node.js moderno e navegadores recentes, `fetch` está disponível globalmente; em versões antigas do Node, pode ser necessário importar uma implementação compatível ou usar `undici`/`node-fetch`.
