# Tarefa: ServiÃ§o com TypeScript: tratamento de erros

**ID**: backend-02  **Categoria**: backend
**Latencia**: 14.99s  **Tokens out**: 1261  **tps**: 84.14

---


Aqui está a implementação solicitada:

```typescript
interface User {
    id: string;
    name: string;
    email: string;
}

class UserNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UserNotFoundError';
    }
}

async function fetchUserData(userId: string): Promise<User> {
    // Configurar timeout usando Promise.race
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(`https://api.example.com/users/${userId}`, {
            signal: controller.signal,
            headers: { 'Accept': 'application/json' }
        });

        clearTimeout(timeoutId); // Cancela o timeout se a resposta chegar primeiro

        if (!response.ok) {
            throw new UserNotFoundError(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        return {
            id: data.id,
            name: data.name || '',
            email: data.email || ''
        };

    } catch (error) {
        // Limpa o timeout se a Promise for rejeitada
        clearTimeout(timeoutId);
        
        if (error instanceof UserNotFoundError) {
            throw error;
        }
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new Error(`Failed to fetch user data: ${errorMessage}`);
    } finally {
        // Garante que o timeout será cancelado mesmo em caso de erro
        clearTimeout(timeoutId);
    }
}

// Exemplo de uso:
async function exampleUsage() {
    try {
        const userData = await fetchUserData('123');
        console.log(userData);
        
    } catch (error) {
        if (error instanceof UserNotFoundError) {
            console.error(`User not found: ${error.message}`);
        } else {
            console.error(`Error fetching user data: ${error.message}`);
        }
    }
}

// Iniciar o exemplo
exampleUsage();
```

Explicação do código:

1. **Interface User**: Define a estrutura dos dados esperados da API.

2. **Classe Customizada de Erro**:
   - `UserNotFoundError` estende Error e inclui um campo name para identificação
   - Permite tratamento diferenciado de erros relacionados à inexistência do usuário

3. **Função fetchUserData**:
   - Usa AbortController para implementar timeout (cancela após 5 segundos)
   - Configura headers para aceitar JSON
   - Verifica o status HTTP com `response.ok`
   - Converte a resposta usando response.json()
   - Retorna um objeto User ou lança exceções

4. **Tratamento de Erros**:
   - Timeout: Cancela a operação após 5 segundos e lança uma mensagem genérica
   - Status HTTP não-2xx: Lança UserNotFoundError com o código HTTP específico
   - Erros desconhecidos: Converte para Error com mensagem formatada

5. **Exemplo de Uso**:
   - Demonstra como chamar a função de forma assíncrona
   - Mostra tratamento diferenciado para UserNotFoundError e outros erros
   - Usa finally block para garantir limpeza do timeout em todos os casos

Para usar com uma API real, substitua `https://api.example.com/users/${userId}` pela URL da sua API. O código mantém a mesma funcionalidade de tratamento de erros e timeout independentemente da implementação backend.

Características importantes:
- Timeout configurado via Promise.race
- AbortController para cancelar requisições em andamento
- Tratamento adequado de diferentes tipos de erro
- Limpeza dos recursos (timeout) no finally block
- Resposta JSON com campos vazios como fallback
