# Tarefa: Tipos utilitÃ¡rios e genÃ©ricos

**ID**: backend-03  **Categoria**: backend
**Latencia**: 18.66s  **Tokens out**: 1430  **tps**: 76.65

---

# Tipos Utilitários do TypeScript com Interface `Product`

Abaixo estão exemplos práticos dos principais tipos utilitários do TypeScript aplicados à interface `Product`. Cada exemplo inclui o tipo derivado, um uso realista e uma explicação clara em português.

---

## 1. Interface Base: `Product`

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
}
```

---

## 2. `Partial<T>` – Todos os campos opcionais

### Tipo Derivado
```typescript
type PartialProduct = Partial<Product>;
```

### Uso Prático
```typescript
function updateProduct(product: Product, updates: PartialProduct): Product {
  return {
    ...product,
    ...updates
  };
}

// Exemplo de uso
const product: Product = {
  id: 1,
  name: "Notebook",
  price: 4500,
  stock: 10,
  createdAt: new Date()
};

const updatedProduct = updateProduct(product, {
  stock: 15,
  price: 4200
});
```

### Explicação
`Partial<T>` torna todos os campos opcionais. Útil quando você precisa atualizar apenas alguns atributos de um objeto sem precisar fornecer todos os campos obrigatórios.

---

## 3. `Pick<T, K>` – Selecionar campos específicos

### Tipo Derivado
```typescript
type ProductSummary = Pick<Product, "id" | "name" | "price">;
```

### Uso Prático
```typescript
function displayProductInfo(product: Product): ProductSummary {
  return {
    id: product.id,
    name: product.name,
    price: product.price
  };
}

// Exemplo de uso
const summary = displayProductInfo(product);
console.log(summary); // { id: 1, name: "Notebook", price: 4500 }
```

### Explicação
`Pick<T, K>` seleciona apenas os campos especificados em `K`. Ideal para criar tipos mais simples ou para passar dados parciais a APIs externas.

---

## 4. `Omit<T, K>` – Remover campos específicos

### Tipo Derivado
```typescript
type ProductForCart = Omit<Product, "id" | "createdAt">;
```

### Uso Prático
```typescript
function addToCart(product: Product): ProductForCart {
  return {
    ...product,
    id: undefined as never,
    createdAt: undefined as never
  };
}

// Exemplo de uso
const cartItem = addToCart(product);
console.log(cartItem); // { name: "Notebook", price: 4500, stock: 10 }
```

### Explicação
`Omit<T, K>` remove os campos especificados em `K`. Útil quando você precisa criar uma versão simplificada de um objeto para evitar vazamento de dados sensíveis ou metadados desnecessários.

---

## 5. `Readonly<T>` – Impedir mutações

### Tipo Derivado
```typescript
type ReadOnlyProduct = Readonly<Product>;
```

### Uso Prático
```typescript
function getProductDetails(product: ReadOnlyProduct): void {
  console.log(`ID: ${product.id}, Nome: ${product.name}`);
}

// Exemplo de uso
const product: Product = {
  id: 1,
  name: "Notebook",
  price: 4500,
  stock: 10,
  createdAt: new Date()
};

getProductDetails(product); // Funciona normalmente

// Tenta mutar (erro de compilação)
product.name = "Laptop"; // ❌ Erro: Property 'name' is read-only.
```

### Explicação
`Readonly<T>` torna todos os campos do objeto imutáveis após a criação. Ideal para dados que devem ser protegidos contra alterações acidentais, como configurações ou dados de API.

---

## 6. `ReturnType<T>` – Tipo de retorno de função

### Tipo Derivado
```typescript
type CreateProductResult = ReturnType<typeof createProduct>;

function createProduct(
  name: string,
  price: number,
  stock: number
): Product {
  return {
    id: Date.now(),
    name,
    price,
    stock,
    createdAt: new Date()
  };
}
```

### Uso Prático
```typescript
function handleProductCreation(
  productData: CreateProductResult
): void {
  console.log(`Produto criado com ID: ${productData.id}`);
}

// Exemplo de uso
const newProduct = createProduct("Mouse", 150, 20);
handleProductCreation(newProduct); // Funciona corretamente
```

### Explicação
`ReturnType<T>` extrai o tipo de retorno de uma função. Útil para inferir tipos sem precisar escrever manualmente a interface do objeto retornado.

---

## Resumo Comparativo

| Utilitário       | O que faz                              | Caso de uso comum                          |
|------------------|----------------------------------------|--------------------------------------------|
| `Partial<T>`     | Todos os campos opcionais              | Atualizações parciais                      |
| `Pick<T, K>`     | Seleciona campos específicos           | Resumos ou dados simplificados             |
| `Omit<T, K>`     | Remove campos específicos              | Dados para carrinho ou APIs externas       |
| `Readonly<T>`    | Impede mutações                        | Dados imutáveis (ex: configs)              |
| `ReturnType<T>`  | Extrai tipo de retorno de função       | Inferência automática de tipos             |

---

## Conclusão

Esses utilitários do TypeScript permitem criar tipos mais seguros, flexíveis e expressivos. Eles são fundamentais para escrever código robusto, especialmente em projetos grandes ou quando se trabalha com APIs externas e dados complexos.
