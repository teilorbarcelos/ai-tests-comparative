# Tarefa: ServiÃ§o com TypeScript: tratamento de erros

**ID**: backend-02  **Categoria**: backend
**Latencia**: 5.55s  **Tokens out**: 923  **tps**: 166.29

---

```ts
/* -------------------------------------------------------------
 * 1️⃣  Tipos e interfaces
 * ------------------------------------------------------------- */
export interface User {
  id: string;
  name: string;
  email: string;
}

/* -------------------------------------------------------------
 * 2️⃣  Erro customizado – usado quando o usuário não existe
 * ------------------------------------------------------------- */
export class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`Usuário com ID "${userId}" não encontrado`);
    this.name = 'UserNotFoundError';
    // garante que a stack trace seja correta em TS/JS
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, UserNotFoundError);
    }
  }
}

/* -------------------------------------------------------------
 * 3️⃣  Função principal – busca dados de usuário com timeout
 * ------------------------------------------------------------- */
export async function fetchUserData(userId: string): Promise<User> {
  // URL fictícia da API externa (substitua pela real)
  const url = `https://api.exemplo.com/users/${encodeURIComponent(userId)}`;

  // AbortController para implementar o timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos

  try {
    const response = await fetch(url, { signal: controller.signal });

    // Se a resposta não for ok (status 2xx) tratamos separadamente
    if (!response.ok) {
      // Se o status for 404 lançamos UserNotFoundError
      if (response.status === 404) {
        throw new UserNotFoundError(userId);
      }

      // Para qualquer outro erro HTTP, lançamos um erro genérico
      const text = await response.text();
      throw new Error(
        `Erro ao buscar usuário: ${response.status} ${response.statusText}. Corpo: ${text}`
      );
    }

    // Parse do corpo JSON e validação básica de tipos
    const data = (await response.json()) as Partial<User>;

    if (!data.id || !data.name || !data.email) {
      throw new Error('Formato inesperado da resposta da API');
    }

    return { id: data.id, name: data.name, email: data.email };
  } catch (err) {
    // Se o erro for abortado pelo timeout
    if ((err as any).name === 'AbortError') {
      throw new Error(`Tempo limite excedido ao buscar usuário ${userId}`);
    }

    // Re‑lançamos erros já tipados (UserNotFoundError, etc.)
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/* -------------------------------------------------------------
 * 4️⃣  Exemplo de uso com try/catch
 * ------------------------------------------------------------- */
async function demo() {
  const userId = '12345';

  try {
    const user = await fetchUserData(userId);
    console.log('Usuário encontrado:', user);
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      console.warn(err.message); // usuário não existe
    } else {
      console.error('Falha inesperada:', err);
    }
  }
}

// Chamada de demonstração (remova se usar em outro contexto)
demo().catch(console.error);
```

### Como funciona

1. **Interface `User`** – define os campos obrigatórios que esperamos receber da API.
2. **Erro customizado `UserNotFoundError`** – usado exclusivamente quando a resposta HTTP for 404, permitindo tratamento diferenciado no `try/catch`.
3. **Timeout com `AbortController`** – se a requisição demorar mais de 5 s o fetch será abortado e lançaremos um erro de timeout.
4. **Tratamento de status HTTP**  
   - Status 2xx → parse do JSON.  
   - Status 404 → lança `UserNotFoundError`.  
   - Outros status → lança erro genérico com corpo da resposta para facilitar debugging.
5. **Exemplo de uso** – demonstra como capturar o erro customizado e tratar outros erros.

> **Obs.:** Substitua a URL (`https://api.exemplo.com/users/...`) pela endpoint real que você está consumindo.
