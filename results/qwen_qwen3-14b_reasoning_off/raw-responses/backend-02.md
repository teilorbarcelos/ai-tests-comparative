# Tarefa: ServiÃ§o com TypeScript: tratamento de erros

**ID**: backend-02  **Categoria**: backend
**Latencia**: 43.68s  **Tokens out**: 754  **tps**: 17.26

---

Claro! Vamos criar uma função assíncrona em TypeScript chamada `fetchUserData`, que busca dados de um usuário em uma API externa usando o método `fetch`. A função deve:

1. Ter um timeout de 5 segundos.
2. Tratar erros de rede e status HTTP não-2xx.
3. Lançar uma exceção personalizada caso o usuário não seja encontrado (`UserNotFoundError`).
4. Retornar um objeto do tipo `User`.

Abaixo está a implementação completa com explicações.

---

### ✅ Interface `User`

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}
```

---

### 🛠️ Exceção Personalizada

```typescript
class UserNotFoundError extends Error {
  constructor(message = "Usuário não encontrado") {
    super(message);
    this.name = "UserNotFoundError";
  }
}
```

---

### 📡 Função `fetchUserData` com timeout e tratamento de erros

```typescript
async function fetchUserData(userId: string): Promise<User> {
  const timeout = 5000; // 5 segundos

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Tempo limite excedido ao buscar dados do usuário"));
    }, timeout);

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(response => {
        clearTimeout(timer);
        if (!response.ok) {
          // Status HTTP não 2xx
          if (response.status === 404) {
            reject(new UserNotFoundError());
          } else {
            reject(new Error(`Erro na requisição: ${response.statusText}`));
          }
        }
        return response.json();
      })
      .then(data => {
        resolve({
          id: data.id.toString(),
          name: data.name,
          email: data.email
        });
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
}
```

---

### 🧪 Exemplo de uso com `try/catch`

```typescript
async function exampleUsage() {
  try {
    const user = await fetchUserData("1");
    console.log("Usuário encontrado:", user);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      console.error("Erro: ", error.message);
    } else if (error instanceof Error) {
      console.error("Ocorreu um erro inesperado:", error.message);
    }
  }
}

exampleUsage();
```

---

### 🔍 Explicação

- **`fetchUserData(userId)`**:
  - Usa `fetch()` para buscar dados de um usuário em uma API externa (neste caso, [JSONPlaceholder](https://jsonplaceholder.typicode.com/)).
  - Define um timeout de 5 segundos com `setTimeout()`.
  - Se o status HTTP não for 2xx, lança um erro apropriado.
  - Se o status for 404, lança uma exceção personalizada `UserNotFoundError`.
  - Caso contrário, retorna os dados do usuário como objeto `User`.

- **`exampleUsage()`**:
  - Chama a função `fetchUserData("1")`, que busca o usuário com ID "1".
  - Usa `try/catch` para tratar possíveis erros.
  - Verifica se o erro é uma instância de `UserNotFoundError` ou outro tipo de `Error`.

---

Se quiser, posso adaptar a API para outra base de dados ou incluir autenticação. 😊
