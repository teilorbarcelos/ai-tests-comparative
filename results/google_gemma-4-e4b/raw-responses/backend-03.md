# Tarefa: Tipos utilitÃ¡rios e genÃ©ricos

**ID**: backend-03  **Categoria**: backend
**Latencia**: 26.07s  **Tokens out**: 2644  **tps**: 101.4

---

Olá! Como seu assistente especialista em desenvolvimento de software, vou demonstrar como os utilitários do TypeScript podem ser usados para criar tipos robustos e reutilizáveis, garantindo que nosso código seja seguro e previsível.

Vamos começar definindo nossa interface base `Product`.

### 📦 Interface Base: `Product`

```typescript
/**
 * Representa o modelo completo de um produto em nosso sistema.
 */
interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    createdAt: Date; // Usamos Date para tipagem mais precisa
}

// Exemplo de um produto real
const initialProduct: Product = {
    id: "prod-123",
    name: "Laptop Pro X",
    price: 1500.00,
    stock: 45,
    createdAt: new Date(),
};

console.log("--- Produto Base Definido ---");
```

---

### 🛠️ Utilidades do TypeScript Aplicadas a `Product`

#### 1. `Partial<T>` (Parcial)

**O que faz:** Transforma todas as propriedades de um tipo em opcionais (`?`). É ideal quando você está recebendo dados parciais, como em operações de atualização (PATCH).

**Tipo Derivado:** `UpdateProduct`

```typescript
/**
 * Tipo para atualizar um produto. Permite enviar apenas os campos que precisam ser alterados.
 */
type UpdateProduct = Partial<Product>;

// Uso Prático: Função de Atualização
function updateProduct(productId: string, updates: UpdateProduct): Product {
    console.log(`\n--- 1. Partial (Atualização) ---`);
    console.log(`Recebendo atualizações para o produto ${productId}:`, updates);

    // Simulação da lógica de atualização
    const updatedProduct = { ...initialProduct, ...updates } as Product;
    return updatedProduct;
}

// Exemplo de uso: Queremos apenas mudar o preço e o nome.
const partialUpdatePayload: UpdateProduct = {
    name: "Laptop Pro X (Revisado)",
    price: 1450.00,
};

const productAfterPartial = updateProduct(initialProduct.id, partialUpdatePayload);
console.log("Produto Atualizado:", productAfterPartial);
```

#### 2. `Pick<T, K>` (Seleção)

**O que faz:** Cria um novo tipo selecionando apenas as propriedades especificadas (`K`) de um tipo existente (`T`). É ótimo para criar "visões" leves dos dados.

**Tipo Derivado:** `ProductSummary`

```typescript
/**
 * Tipo para exibir em uma lista ou tabela, contendo apenas informações essenciais (sem ID e Stock).
 */
type ProductSummary = Pick<Product, 'name' | 'price'>;

// Uso Prático: Componente de Listagem
function displayProductSummary(summary: ProductSummary) {
    console.log(`\n--- 2. Pick (Resumo) ---`);
    console.log(`Nome do Produto: ${summary.name}`);
    console.log(`Preço: R$${summary.price.toFixed(2)}`);
}

// Exemplo de uso: Pegamos apenas o nome e preço para uma lista de produtos.
const summaryData: ProductSummary = {
    name: initialProduct.name,
    price: initialProduct.price,
};

displayProductSummary(summaryData);
```

#### 3. `Omit<T, K>` (Exclusão)

**O que faz:** Cria um novo tipo excluindo as propriedades especificadas (`K`) de um tipo existente (`T`). É perfeito para payloads de criação onde o servidor deve gerar campos como ID e data de criação.

**Tipo Derivado:** `CreateProductInput`

```typescript
/**
 * Tipo usado ao criar um produto, omitindo 'id' e 'createdAt', pois eles são gerados pelo backend.
 */
type CreateProductInput = Omit<Product, 'id' | 'createdAt'>;

// Uso Prático: Payload de Criação (POST request)
function createNewProduct(input: CreateProductInput): Product {
    console.log(`\n--- 3. Omit (Criação) ---`);
    console.log("Payload recebido para criação:", input);

    // Simulação da geração do ID e data pelo servidor
    const newProduct: Product = {
        ...input,
        id: `prod-${Date.now()}`, // Novo ID gerado
        createdAt: new Date(),   // Nova data gerada
    };
    return newProduct;
}

// Exemplo de uso: Enviamos apenas os dados que o usuário fornece.
const creationPayload: CreateProductInput = {
    name: "Mouse Ergonômico",
    price: 89.90,
    stock: 120,
    // Não precisamos incluir 'id' ou 'createdAt' aqui!
};

const newProduct = createNewProduct(creationPayload);
console.log("Produto Criado com Sucesso:", newProduct);
```

#### 4. `Readonly<T>` (Somente Leitura)

**O que faz:** Transforma todas as propriedades de um tipo em somente leitura (`readonly`). Isso garante a imutabilidade dos dados, prevenindo modificações acidentais após o objeto ter sido criado ou persistido.

**Tipo Derivado:** `ImmutableProduct`

```typescript
/**
 * Tipo para representar o estado final e imutável do produto no banco de dados.
 */
type ImmutableProduct = Readonly<Product>;

// Uso Prático: Garantir a integridade dos dados após o salvamento
function printImmutableData(product: ImmutableProduct) {
    console.log(`\n--- 4. Readonly (Imutabilidade) ---`);
    console.log(`Produto Imutável: ${product.name}`);

    // TENTATIVA DE MODIFICAÇÃO (Isso causaria um erro de compilação!)
    // product.price = 0; // <-- TypeScript impediria isso!
}

// Exemplo de uso: Usamos o produto salvo para garantir que ele não seja alterado acidentalmente.
const immutableProduct: ImmutableProduct = initialProduct as ImmutableProduct;
printImmutableData(immutableProduct);
```

#### 5. `ReturnType<T>` (Tipo de Retorno)

**O que faz:** Extrai e retorna o tipo de valor que uma função específica (`T`) promete retornar. É extremamente útil para tipar variáveis baseadas no comportamento de funções complexas ou serviços.

**Tipo Derivado:** `ProductDetail` (que é igual a `Product`)

```typescript
// 1. Definimos um serviço simulado
function fetchProductById(id: string): Product {
    console.log(`\n--- 5. ReturnType (Tipagem de Função) ---`);
    if (id === "prod-123") {
        return initialProduct;
    }
    throw new Error("Produto não encontrado");
}

// 2. Usamos ReturnType para inferir o tipo exato que a função retorna
type ProductDetail = ReturnType<typeof fetchProductById>;

// Uso Prático: Tipar a variável de resultado da chamada ao serviço
function displayDetails(productId: string) {
    try {
        // A variável 'product' agora é tipada automaticamente como Product (ou ProductDetail)
        const product: ProductDetail = fetchProductById(productId); 

        console.log(`Detalhes do Produto Carregados com Sucesso.`);
        console.log(`Nome: ${product.name}, Preço: R$${product.price.toFixed(2)}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Erro ao buscar produto:", error.message);
        }
    }
}

// Exemplo de uso: Chamamos a função e confiamos no ReturnType para tipar o resultado.
displayDetails(initialProduct.id);
```

### 🚀 Resumo dos Utilizadores

| Utilitário | Propósito Principal | Cenário de Uso Comum | O que faz? |
| :--- | :--- | :--- | :--- |
| **`Partial<T>`** | Flexibilidade na entrada | Atualizações (PATCH) | Torna todos os campos opcionais. |
| **`Pick<T, K>`** | Seleção de dados | Listagens/Resumos | Mantém apenas um subconjunto específico de campos. |
| **`Omit<T, K>`** | Remoção de dados | Criações (POST) | Remove campos que o sistema deve gerar (`id`, `createdAt`). |
| **`Readonly<T>`** | Imutabilidade | Dados persistidos/Configurações | Impede a reatribuição de qualquer propriedade. |
| **`ReturnType<T>`** | Tipagem dinâmica | Chamadas de API/Serviços | Extrai o tipo exato que uma função retorna. |
