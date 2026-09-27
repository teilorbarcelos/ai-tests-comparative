# Tarefa: Tipos utilitÃ¡rios e genÃ©ricos

**ID**: backend-03  **Categoria**: backend
**Latencia**: 33.5s  **Tokens out**: 1161  **tps**: 34.66

---

Vou criar exemplos práticos usando os tipos utilitários do TypeScript aplicados à interface `Product`. Cada exemplo incluirá a explicação do que o tipo utilitário faz e um caso de uso.

### 1. **Partial<T>**
**O que faz:** Cria um tipo onde todas as propriedades são opcionais.
**Uso prático:** Quando você precisa atualizar apenas algumas propriedades de um objeto, sem precisar preencher todas.

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
}

// Tipo Partial<Product>
type PartialProduct = Partial<Product>;

// Uso prático: Atualizar apenas o nome e o estoque de um produto
function updateProduct(productId: string, updates: PartialProduct): void {
  console.log(`Atualizando produto ${productId} com:`, updates);
}

updateProduct("123", { name: "Novo Nome", stock: 50 });
```

---

### 2. **Pick<T, K>**
**O que faz:** Seleciona apenas as propriedades `K` do tipo `T`.
**Uso prático:** Quando você precisa criar um tipo com apenas algumas propriedades específicas de outro tipo.

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
}

// Tipo Pick<Product, "id" | "name">
type ProductSummary = Pick<Product, "id" | "name">;

// Uso prático: Mostrar apenas o ID e o nome do produto em uma lista
function showProductSummary(products: ProductSummary[]): void {
  products.forEach((product) => {
    console.log(`ID: ${product.id}, Nome: ${product.name}`);
  });
}

const summaries = [{ id: "1", name: "Produto A" }, { id: "2", name: "Produto B" }];
showProductSummary(summaries);
```

---

### 3. **Omit<T, K>**
**O que faz:** Exclui as propriedades `K` do tipo `T`.
**Uso prático:** Quando você precisa criar um tipo sem algumas propriedades específicas.

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
}

// Tipo Omit<Product, "id" | "createdAt">
type ProductWithoutIdAndDate = Omit<Product, "id" | "createdAt">;

// Uso prático: Criar um novo produto sem precisar informar ID ou data de criação
function createProduct(productData: ProductWithoutIdAndDate): void {
  console.log("Criando produto:", productData);
}

createProduct({ name: "Produto Novo", price: 10.99, stock: 100 });
```

---

### 4. **Readonly<T>**
**O que faz:** Torna todas as propriedades do tipo `T` como somente leitura.
**Uso prático:** Quando você precisa garantir que um objeto não será modificado.

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
}

// Tipo Readonly<Product>
type ReadonlyProduct = Readonly<Product>;

// Uso prático: Garantir que os dados do produto não sejam alterados
function displayProduct(product: ReadonlyProduct): void {
  console.log("Produto:", product);
  // product.name = "Alterado"; // Erro: Cannot assign to 'name' because it is read-only.
}

const readonlyProduct: ReadonlyProduct = {
  id: "1",
  name: "Produto A",
  price: 9.99,
  stock: 50,
  createdAt: new Date(),
};

displayProduct(readonlyProduct);
```

---

### 5. **ReturnType<T>**
**O que faz:** Extrai o tipo de retorno de uma função.
**Uso prático:** Quando você precisa tipar uma variável com base no retorno de uma função.

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
}

// Função que retorna um Product
function getProduct(): Product {
  return {
    id: "1",
    name: "Produto A",
    price: 9.99,
    stock: 50,
    createdAt: new Date(),
  };
}

// Tipo ReturnType<typeof getProduct>
type ProductReturnType = ReturnType<typeof getProduct>;

// Uso prático: Tipar uma variável com base no retorno da função
const product: ProductReturnType = getProduct();
console.log("Produto obtido:", product);
```

---

### Resumo dos tipos utilitários:
- **Partial<T>:** Torna todas as propriedades opcionais.
- **Pick<T, K>:** Seleciona apenas as propriedades `K` de `T`.
- **Omit<T, K>:** Exclui as propriedades `K` de `T`.
- **Readonly<T>:** Torna todas as propriedades somente leitura.
- **ReturnType<T>:** Extrai o tipo de retorno da função `T`.

Esses tipos são muito úteis para tornar o código mais flexível e seguro, especialmente em aplicações complexas com muitas interfaces.
