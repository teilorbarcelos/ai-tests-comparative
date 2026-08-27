# Tarefa: RefatoraÃ§Ã£o e boas prÃ¡ticas

**ID**: backend-04  **Categoria**: backend
**Latencia**: 31.58s  **Tokens out**: 3155  **tps**: 99.9

---

Este é um excelente exercício de refatoração. O código original, embora funcional em JavaScript puro, sofre com acoplamento global, falta de segurança de tipos e ausência de tratamento de erros.

Abaixo está a solução completa, separada em módulos, tipada com TypeScript, robusta e pronta para ser testada.

---

## 📁 Estrutura do Projeto

Para garantir a modularidade, vamos dividir o código em três arquivos principais:

1.  `src/types.ts`: Define os contratos (interfaces).
2.  `src/UserService.ts`: Contém a lógica de negócio e o estado (o repositório/serviço).
3.  `index.ts`: Demonstra como usar o serviço.

## 💻 Código Completo

### 1. `src/types.ts` (Definição de Tipos)

Este módulo define a estrutura que nossos dados devem seguir, garantindo que todos os lugares do código saibam exatamente o formato de um usuário.

```typescript
// src/types.ts

/**
 * Interface User: Define a estrutura obrigatória de um objeto Usuário.
 */
export interface User {
  id: number; // Adicionamos um ID para melhor gerenciamento e unicidade
  name: string;
  email: string;
}

// Definimos um tipo para o resultado da busca, que pode ser um usuário ou undefined (nulo)
export type FindUserResult = User | undefined;
```

### 2. `src/UserService.ts` (Lógica de Negócio e Repositório)

Este é o coração do sistema. Usamos uma **Classe** para encapsular o estado (`users`) e os métodos, tornando-o um serviço testável. Adicionamos tratamento de erros e validade.

```typescript
// src/UserService.ts

import { User, FindUserResult } from './types';

/**
 * UserService: Serviço responsável por gerenciar as operações CRUD (Create, Read) dos usuários.
 * O estado (users) é encapsulado dentro da classe, evitando variáveis globais.
 */
export class UserService {
  // Estado interno do serviço - privado para que não possa ser alterado externamente
  private users: User[] = [];
  private nextId: number = 1;

  /**
   * Salva um novo usuário no sistema.
   * @param name Nome completo do usuário.
   * @param email Email do usuário (deve ser único).
   * @returns O objeto User recém-criado.
   * @throws Error se o e-mail já estiver cadastrado ou os dados forem inválidos.
   */
  public async saveUser(name: string, email: string): Promise<User> {
    // 1. Validação de Entrada (Boas Práticas)
    if (!name || !email || typeof name !== 'string' || typeof email !== 'string') {
      throw new Error("Dados inválidos: Nome e Email são obrigatórios.");
    }

    // 2. Tratamento de Erro (Unicidade do E-mail)
    const existingUser = this.findUserByEmail(email);
    if (existingUser) {
      throw new Error(`Erro ao salvar usuário: O email "${email}" já está cadastrado.`);
    }

    // 3. Criação e Persistência
    const newUser: User = {
      id: this.nextId++, // Atribui ID único
      name,
      email,
    };

    this.users.push(newUser);
    console.log(`[LOG] Usuário ${newUser.id} salvo com sucesso.`);
    return newUser;
  }

  /**
   * Busca um usuário pelo seu endereço de e-mail.
   * @param email O e-mail a ser procurado.
   * @returns Um objeto User ou undefined se não for encontrado.
   */
  public async findUser(email: string): Promise<FindUserResult> {
    // Usamos o método nativo .find() do JavaScript, que é mais limpo que um loop 'for' tradicional.
    const user = this.users.find((u) => u.email === email);
    return user; // Retorna User ou undefined (que corresponde ao null original)
  }

  /**
   * Método auxiliar privado para buscar por e-mail, usado internamente pelo saveUser.
   */
  private findUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  /**
   * Retorna todos os usuários cadastrados (útil para testes).
   */
  public getAllUsers(): User[] {
    return [...this.users]; // Retorna uma cópia, protegendo o estado interno
  }
}
```

### 3. `index.ts` (Demonstração de Uso)

Este arquivo simula a aplicação principal e demonstra como lidar com os erros que foram introduzidos no serviço.

```typescript
// index.ts

import { UserService } from './src/UserService';

async function main() {
  console.log("--- Iniciando o Sistema de Gerenciamento de Usuários ---");
  const userService = new UserService();

  try {
    // 1. Teste de Cadastro Bem-Sucedido
    console.log("\n[TESTE 1] Tentando cadastrar Alice...");
    const alice = await userService.saveUser("Alice Silva", "alice@example.com");
    console.log(`✅ Sucesso! Usuário criado: ${alice.name} (ID: ${alice.id})`);

    // 2. Teste de Cadastro Bem-Sucedido
    console.log("\n[TESTE 2] Tentando cadastrar Bob...");
    const bob = await userService.saveUser("Bob Souza", "bob@example.com");
    console.log(`✅ Sucesso! Usuário criado: ${bob.name} (ID: ${bob.id})`);

    // 3. Teste de Erro - E-mail Duplicado
    console.log("\n[TESTE 3] Tentando cadastrar Alice novamente (Deve falhar)...");
    await userService.saveUser("Alice Clone", "alice@example.com"); // Isso deve lançar um erro
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ ERRO CAPTURADO: ${error.message}`);
    } else {
      console.error("Erro desconhecido.");
    }
  }

  // 4. Teste de Busca Bem-Sucedida
  console.log("\n[TESTE 4] Buscando Bob...");
  const foundBob = await userService.findUser("bob@example.com");
  if (foundBob) {
    console.log(`✅ Usuário encontrado: ${foundBob.name}, Email: ${foundBob.email}`);
  } else {
    console.log("❌ Bob não foi encontrado.");
  }

  // 5. Teste de Busca Não Encontrada
  console.log("\n[TESTE 5] Buscando usuário inexistente...");
  const foundGhost = await userService.findUser("ghost@example.com");
  if (!foundGhost) {
    console.log("✅ Usuário 'ghost' não encontrado (Resultado esperado).");
  }

  // 6. Verificação Final do Estado Interno
  console.log("\n--- Lista Final de Usuários ---");
  console.table(userService.getAllUsers());
}

main();
```

## ✨ Explicação das Mudanças e Boas Práticas Aplicadas

### 1. Tipagem Forte (TypeScript)
*   **O que mudou:** Introduzimos `interface User` em `src/types.ts`. Todos os parâmetros de função (`name: string`, `email: string`) e todos os retornos de função são explicitamente tipados (`Promise<User>`, `FindUserResult`).
*   **Benefício:** O compilador TypeScript agora atua como um revisor de código, pegando erros de digitação ou uso incorreto de variáveis *antes* que o código chegue ao ambiente de execução.

### 2. Modularização e Encapsulamento (Classes)
*   **O que mudou:** Substituímos a variável global `const users = []` por um campo privado (`private users: User[]`) dentro da classe `UserService`.
*   **Benefício:** O estado do sistema está contido no serviço. Isso elimina o risco de outros módulos alterarem acidentalmente os dados, e torna o código mais organizado (Princípio da Responsabilidade Única).

### 3. Tratamento de Erros Robusto (`try...catch` e `throw`)
*   **O que mudou:** Os métodos agora verificam a validade dos dados de entrada (ex: se o nome está vazio) e, crucialmente, verificam a unicidade do email antes de salvar. Se houver um problema lógico, em vez de retornar `null` ou falhar silenciosamente, o método **lança (`throw`)** um erro específico.
*   **Benefício:** O código que *chama* o serviço (como no `index.ts`) é forçado a usar blocos `try...catch`, garantindo que ele saiba como reagir a uma falha de negócio (ex: "Email já existe").

### 4. Testabilidade
*   **O que mudou:** Ao encapsular a lógica em uma classe (`UserService`), podemos facilmente criar instâncias diferentes para testes unitários. Em um teste, você pode inicializar `new UserService()` e verificar se os métodos funcionam sem depender de um estado global compartilhado.
*   **Benefício:** Testes são mais isolados, rápidos e confiáveis.

### 5. Boas Práticas Modernas (Async/Await)
*   **O que mudou:** Os métodos foram marcados como `async` e retornam `Promise<T>`. Embora este exemplo seja em memória (síncrono), usar `async/await` é o padrão de mercado para serviços Node.js, pois prepara a arquitetura para quando você substituir o array por um banco de dados real (que sempre será assíncrono).
*   **Benefício:** Código mais limpo e previsível ao lidar com operações demoradas.

### 6. Melhoria na Busca (`find` vs `for`)
*   **O que mudou:** O loop `for` tradicional foi substituído pelo método nativo `Array.prototype.find()`.
*   **Benefício:** Código mais declarativo e legível, expressando a *intenção* ("encontrar o primeiro elemento que satisfaça esta condição") em vez de descrever o *passo a passo* do loop.
