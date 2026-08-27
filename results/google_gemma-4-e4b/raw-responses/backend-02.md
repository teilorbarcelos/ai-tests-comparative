# Tarefa: ServiÃ§o com TypeScript: tratamento de erros

**ID**: backend-02  **Categoria**: backend
**Latencia**: 25.7s  **Tokens out**: 2623  **tps**: 102.06

---

Este é um desafio clássico de desenvolvimento robusto em aplicações modernas. Para garantir que a função seja resiliente, utilizaremos `Promise.race` para o timeout e trataremos os erros em múltiplas camadas (rede, status HTTP e lógica de negócio).

Abaixo está o código completo, tipado e comentado.

### Código TypeScript Completo

```typescript
// ==================================================
// 1. DEFINIÇÕES DE TIPOS E ERROS CUSTOMIZADOS
// ==================================================

/**
 * Interface que define a estrutura de um usuário.
 */
interface User {
    id: string;
    name: string;
    email: string;
}

/**
 * Exceção customizada para quando o usuário não é encontrado na API (ex: 404).
 */
export class UserNotFoundError extends Error {
    constructor(userId: string) {
        super(`Usuário com ID ${userId} não foi encontrado.`);
        this.name = 'UserNotFoundError';
    }
}

/**
 * Exceção customizada para timeouts de requisição.
 */
export class TimeoutError extends Error {
    constructor() {
        super("A requisição excedeu o tempo limite (5 segundos).");
        this.name = 'TimeoutError';
    }
}


// ==================================================
// 2. FUNÇÃO PRINCIPAL: fetchUserData
// ==================================================

/**
 * Função assíncrona que busca dados de um usuário em uma API externa,
 * com tratamento robusto de erros e timeout.
 * 
 * @param userId O ID do usuário a ser buscado.
 * @returns Uma Promise resolvida com os dados do usuário (User).
 * @throws UserNotFoundError Se o status HTTP for 404 ou similar.
 * @throws TimeoutError Se a requisição demorar mais de 5 segundos.
 * @throws Error Para outros erros de rede ou servidor.
 */
async function fetchUserData(userId: string): Promise<User> {
    const API_URL = `https://jsonplaceholder.typicode.com/users/${userId}`; // Usando uma API mock para demonstração
    const TIMEOUT_MS = 5000;

    // Cria uma Promise que rejeita após o tempo limite definido
    const timeoutPromise = new Promise<User>((_, reject) => {
        setTimeout(() => {
            reject(new TimeoutError());
        }, TIMEOUT_MS);
    });

    // A função principal de busca, encapsulada em uma Promise para ser race com o timeout
    const fetchPromise = fetch(API_URL).then((response) => {
        if (!response.ok) {
            // Trata status HTTP não-2xx (ex: 404 Not Found, 500 Internal Server Error)
            if (response.status === 404) {
                throw new UserNotFoundError(userId);
            }
            // Lança um erro genérico para outros códigos de status
            throw new Error(`Erro HTTP ${response.status}: Falha ao buscar dados.`);
        }
        return response.json() as Promise<User>; // Converte a resposta JSON para o tipo User
    });

    try {
        // Usa Promise.race: resolve assim que a primeira Promise (fetch ou timeout) for concluída.
        const userData = await Promise.race([fetchPromise, timeoutPromise]);
        return userData;
    } catch (error) {
        // Verifica se o erro é um dos nossos erros customizados para re-lançá-lo corretamente
        if (error instanceof UserNotFoundError || error instanceof TimeoutError) {
            throw error; // Re-lança os erros conhecidos
        }
        
        // Trata erros de rede genéricos (ex: DNS falhou, sem conexão) ou outros erros não mapeados.
        console.error(`[ERRO CRÍTICO] Falha na requisição para o usuário ${userId}:`, error);
        throw new Error("Falha de comunicação com a API externa.");
    }
}


// ==================================================
// 3. EXEMPLO DE USO (Demonstração)
// ==================================================

/**
 * Função auxiliar para simular um cenário de falha intencional (ex: ID inexistente).
 */
async function runExample(userId: string, scenario: string) {
    console.log(`\n==================================================`);
    console.log(`[TESTE] Cenário: ${scenario} (ID: ${userId})`);
    try {
        const user = await fetchUserData(userId);
        console.log('✅ SUCESSO! Dados do Usuário:', user);

    } catch (error) {
        // O bloco catch captura todos os erros lançados pela função, 
        // incluindo UserNotFoundError e TimeoutError.
        if (error instanceof UserNotFoundError) {
            console.error(`❌ ERRO DE NEGÓCIO: ${error.message}`);
        } else if (error instanceof TimeoutError) {
            console.error(`⏳ ERRO DE TEMPO LIMITE: ${error.message}`);
        } else if (error instanceof Error) {
             // Captura erros genéricos de rede ou servidor
            console.error(`🛑 ERRO GERAL DA API: ${error.message}`);
        } else {
            console.error("❌ Ocorreu um erro desconhecido.");
        }
    }
}

async function main() {
    // 1. Cenário de Sucesso (ID válido na API mock)
    await runExample('1', 'Sucesso');

    // 2. Cenário de Falha de Negócio (Usuário não encontrado - ID inválido)
    await runExample('99999', 'Usuário Não Encontrado (404)');

    // 3. Cenário de Timeout (Simulação: Se a API demorasse mais que 5s, o timeout seria acionado)
    // Nota: Para testar o timeout real, você precisaria de um endpoint intencionalmente lento.
    // Aqui, apenas demonstramos como o bloco catch trataria o erro se ele ocorresse.
    console.log(`\n==================================================`);
    console.log('[TESTE] Cenário: Timeout (Simulado)');
    try {
        // Vamos forçar um timeout simulando uma chamada que falharia em tempo real
        const slowPromise = new Promise<User>((_, reject) => 
            setTimeout(() => reject(new TimeoutError()), 100) // Simula algo muito rápido, mas o conceito é o mesmo.
        );
        await Promise.race([slowPromise, new Promise((_, rej) => setTimeout(() => rej(new TimeoutError()), 50))]);

    } catch (error) {
         if (error instanceof TimeoutError) {
            console.error(`⏳ ERRO DE TEMPO LIMITE: ${error.message}`);
        } else {
             console.error("❌ Outro erro inesperado no teste de timeout.");
        }
    }

}

main();
```

### Explicações Detalhadas em Português

#### 1. Estrutura e Tipagem (`User` e Erros)

*   **`interface User`**: Define o contrato de dados que esperamos receber da API, garantindo que nosso código seja estritamente tipado (TypeScript).
*   **`class UserNotFoundError extends Error`**: Criamos uma exceção customizada. Isso é crucial porque permite que o bloco `try...catch` saiba *exatamente* por qual motivo a requisição falhou (se foi um erro de negócio, como 404, ou um erro técnico, como rede).
*   **`class TimeoutError extends Error`**: Uma exceção específica para quando o tempo limite é atingido.

#### 2. Mecanismo de Timeout (`Promise.race`)

O coração da resiliência desta função está no uso de `Promise.race`.

1.  **`timeoutPromise`**: É uma Promise que, por si só, não faz nada até que um `setTimeout` seja acionado (5000ms). Após 5 segundos, ela **rejeita** com o `TimeoutError`.
2.  **`fetchPromise`**: É a Promise que executa a chamada real à API. Ela pode resolver ou rejeitar em qualquer momento.
3.  **`await Promise.race([fetchPromise, timeoutPromise])`**: Esta linha instrui o JavaScript a esperar pela **primeira** das duas Promises para ser resolvida ou rejeitada. Se `fetchPromise` demorar mais de 5 segundos, `timeoutPromise` vencerá e forçará um erro (`TimeoutError`), interrompendo a espera do `fetch`.

#### 3. Tratamento de Erros (Camadas)

O tratamento de erros é feito em três níveis dentro da função:

1.  **Nível HTTP (Dentro de `fetchPromise`)**:
    *   Verificamos `if (!response.ok)`. Se o status não for 2xx, sabemos que houve um problema.
    *   Se o status for **404**, lançamos nosso erro customizado (`UserNotFoundError`).
    *   Para qualquer outro status de falha (ex: 500), lançamos um `Error` genérico para indicar uma falha do servidor.
2.  **Nível Timeout (Via `Promise.race`)**: Se o tempo limite for atingido, a Promise rejeita com `TimeoutError`.
3.  **Nível Rede/Geral (Bloco `catch` principal)**: Este bloco captura erros que não são de status HTTP (ex: falha na conexão de internet, DNS inválido). Ele verifica se o erro já é um dos nossos tipos customizados (`UserNotFoundError`, `TimeoutError`) e re-lança. Caso contrário, trata como uma falha crítica de comunicação.

#### 4. Exemplo de Uso (`try/catch` no `main`)

O bloco `try...catch` externo permite que o código chamador (o consumidor da função) trate os diferentes tipos de falhas de maneira específica:

*   Se for um `UserNotFoundError`, ele exibe uma mensagem amigável ao usuário ("Usuário não existe").
*   Se for um `TimeoutError`, ele informa sobre a lentidão do sistema.
*   Qualquer outro erro é tratado como uma falha técnica grave.
