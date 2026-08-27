# Tarefa: ServiÃ§o com TypeScript: tratamento de erros

**ID**: backend-02  **Categoria**: backend
**Latencia**: 12.71s  **Tokens out**: 1056  **tps**: 83.08

---

```typescript
// ============================================
// 1. Definição da interface User
// ============================================

interface User {
  id: string;
  name: string;
  email: string;
}

// ============================================
// 2. Exceção customizada UserNotFoundError
// ============================================

class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserNotFoundError";
  }
}

// ============================================
// 3. Função fetchUserData com timeout e tratamento de erros
// ============================================

async function fetchUserData(userId: string): Promise<User> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos

  try {
    const response = await fetch(`https://api.exemplo.com/users/${userId}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new UserNotFoundError(
        `Usuário não encontrado (Status: ${response.status})`
      );
    }

    const data = await response.json();

    // Validação básica do formato da resposta
    if (!data.id || !data.name || !data.email) {
      throw new Error("Resposta da API inválida");
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof UserNotFoundError) {
      throw error; // Re-lança o erro customizado
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("A requisição expirou. Tente novamente.");
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new UserNotFoundError(
        "Erro de rede ao buscar dados do usuário."
      );
    }

    // Erros genéricos não tratados
    throw new Error(
      `Erro desconhecido: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// ============================================
// 4. Exemplo de uso com try/catch
// ============================================

async function main() {
  const userId = "12345";

  try {
    console.log(`Buscando usuário: ${userId}...`);
    const user = await fetchUserData(userId);

    console.log("Usuário encontrado:");
    console.log(JSON.stringify(user, null, 2));
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      console.error(`❌ Usuário não encontrado: ${userId}`);
    } else if (error instanceof Error) {
      console.error(`⚠️ Erro: ${error.message}`);
    } else {
      console.error("Erro desconhecido");
    }
  }
}

// ============================================
// Execução do exemplo
// ============================================

main();
```

## Explicação dos pontos principais:

| Conceito | Implementação |
|----------|---------------|
| **Timeout** | `AbortController` + `setTimeout(5000)` aborta a requisição após 5s |
| **Erro HTTP não-2xx** | Verificação de `response.ok` antes do `.json()` |
| **Erro de rede** | Capturado via `TypeError` com mensagem contendo "fetch" |
| **Exceção customizada** | Classe estendendo `Error` com nome próprio |
| **Limpeza de timeout** | `clearTimeout(timeoutId)` em todos os blocos `catch` para evitar vazamento de memória |

## Pontos importantes:

1. **AbortController** é a forma moderna e recomendada de fazer timeout no fetch (substitui o antigo método com `XMLHttpRequest`).
2. O `clearTimeout` é chamado em **todos** os caminhos (`try`, `catch`) para garantir que o timer não fique pendente.
3. A exceção customizada permite diferenciar entre "usuário não encontrado" e outros erros de rede, facilitando a lógica no `catch`.
4. A validação extra dos campos da resposta adiciona uma camada de segurança contra respostas malformadas da API.
