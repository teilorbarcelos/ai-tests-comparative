# Tarefa: Tipos utilitÃ¡rios e genÃ©ricos

**ID**: backend-03  **Categoria**: backend
**Latencia**: 18.93s  **Tokens out**: 1598  **tps**: 84.44

---


Vou explicar cada utilitário TypeScript aplicado à interface `Product`:

```typescript
// Interface base para um produto
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
}

// 1. Partial<T>
type PartialProduct = Partial<Product>; // Torna todas as propriedades opcionais

function updatePartialProduct(product: Product, data: PartialProduct): void {
  Object.assign(product, data); // Aceita atualizações parciais
}
```

**Explicação:** `Partial` converte todas as propriedades obrigatórias em opcionais. Útil para funções que atualizam objetos parcialmente.

---

```typescript
// 2. Pick<T, K>
type ProductNameAndPrice = Pick<Product, 'name' | 'price'>; // Seleciona apenas name e price

interface ProductPreview {
  product: ProductNameAndPrice;
}

const preview: ProductPreview = {
  product: { name: "Smartphone", price: 1999.90 } // Não precisa de id ou stock
};
```

**Explicação:** `Pick` cria um tipo com apenas as propriedades especificadas (ideal para projeções parciais).

---

```typescript
// 3. Omit<T, K>
type ProductWithoutDate = Omit<Product, 'createdAt'>; // Remove createdAt

function displayProduct(product: ProductWithoutDate): void {
  console.log(`Produto ${product.name} custa R$${product.price}`);
}
```

**Explicação:** `Omit` exclui propriedades específicas (útil para dados que não precisam de datas).

---

```typescript
// 4. Readonly<T>
type ReadonlyProduct = Readonly<Product>; // Torna todas as propriedades somente leitura

const productData: ReadonlyProduct = {
  id: 1,
  name: "Teclado Mecânico",
  price: 299.90,
  stock: 5,
  createdAt: new Date()
};

// Tentativa de modificação (causa erro)
productData.stock = 10; // Type error!
```

**Explicação:** `Readonly` impede a reatribuição das propriedades após a criação do objeto.

---

```typescript
// 5. ReturnType<T>
type ProductCreationResult = ReturnType<typeof createProduct>; 

function createProduct(): { success: boolean, product?: Product } {
  return { 
    success: true,
    product: { id: 101, name: "Produto Novo", price: 99.90, stock: 3, createdAt: new Date() }
  };
}

const result: ProductCreationResult = createProduct();
console.log(result.product?.name); // Garante o tipo do retorno
```

**Explicação:** `ReturnType` captura o tipo exato de um retorno de função (útil para tipar resultados).
