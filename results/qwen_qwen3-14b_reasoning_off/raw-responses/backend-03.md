# Tarefa: Tipos utilitÃ¡rios e genÃ©ricos

**ID**: backend-03  **Categoria**: backend
**Latencia**: 58.28s  **Tokens out**: 1032  **tps**: 17.71

---

Claro! Vamos explorar os tipos utilitários do TypeScript (`Partial`, `Pick`, `Omit`, `Readonly` e `ReturnType`) aplicados a uma interface chamada `Product`. A interface `Product` tem as seguintes propriedades:

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
}
```

Agora, vamos ver como cada tipo utilitário pode ser usado com essa interface.

---

### 🔹 `Partial<T>`

**O que faz?**  
Permite que **todas as propriedades de um tipo sejam opcionais**, ou seja, elas podem ou não existir em uma instância do tipo.

**Exemplo:**

```typescript
type PartialProduct = Partial<Product>;
```

**Uso prático:**
```typescript
const newProduct: PartialProduct = {
  name: "Notebook",
  price: 2999.90,
};
```

> Neste caso, `id`, `stock` e `createdAt` são opcionais.

---

### 🔹 `Pick<T, K>` 

**O que faz?**  
Permite **selecionar um subconjunto de propriedades** de um tipo `T`.

**Exemplo:**

```typescript
type ProductInfo = Pick<Product, 'name' | 'price'>;
```

**Uso prático:**
```typescript
const productInfo: ProductInfo = {
  name: "Teclado",
  price: 120.50,
};
```

> Aqui estamos pegando apenas as propriedades `name` e `price`.

---

### 🔹 `Omit<T, K>` 

**O que faz?**  
Permite **excluir um subconjunto de propriedades** de um tipo `T`.

**Exemplo:**

```typescript
type ProductWithoutId = Omit<Product, 'id'>;
```

**Uso prático:**
```typescript
const productData: ProductWithoutId = {
  name: "Mouse",
  price: 59.0,
  stock: 100,
  createdAt: new Date(),
};
```

> Aqui excluímos a propriedade `id`.

---

### 🔹 `Readonly<T>` 

**O que faz?**  
Torna **todas as propriedades de um tipo somente leitura**, ou seja, não podem ser modificadas após a criação do objeto.

**Exemplo:**

```typescript
type ReadonlyProduct = Readonly<Product>;
```

**Uso prático:**
```typescript
const readOnlyProduct: ReadonlyProduct = {
  id: 1,
  name: "Monitor",
  price: 899.0,
  stock: 50,
  createdAt: new Date(),
};

// Erro de compilação:
// readOnlyProduct.name = "Novo Monitor"; // ❌ Não é permitido
```

> Isso ajuda a prevenir modificações acidentais em objetos importantes.

---

### 🔹 `ReturnType<T>` 

**O que faz?**  
Retorna o **tipo de retorno de uma função**, dado seu tipo (geralmente obtido com `typeof`).

**Exemplo:**

```typescript
function createProduct(): Product {
  return {
    id: 1,
    name: "Tablet",
    price: 699.0,
    stock: 20,
    createdAt: new Date(),
  };
}

type CreateProductReturn = ReturnType<typeof createProduct>;
```

**Uso prático:**
```typescript
const product: CreateProductReturn = {
  id: 2,
  name: "Smartphone",
  price: 1499.90,
  stock: 30,
  createdAt: new Date(),
};
```

> Isso é útil para tipar o retorno de funções sem repetir os tipos manualmente.

---

### 📦 Resumo dos Tipos Utilitários

| Tipo Utilitário | Descrição |
|------------------|-----------|
| `Partial<T>`     | Torna todas as propriedades de `T` **opcionais**. |
| `Pick<T, K>`     | Seleciona um subconjunto de propriedades (`K`) do tipo `T`. |
| `Omit<T, K>`     | Exclui um subconjunto de propriedades (`K`) do tipo `T`. |
| `Readonly<T>`    | Torna todas as propriedades de `T` **somente leitura**. |
| `ReturnType<T>`  | Retorna o **tipo de retorno** da função `T`. |

---

Se quiser, posso também criar um exemplo prático integrado com React e Node.js usando esses tipos utilitários em uma aplicação real!
