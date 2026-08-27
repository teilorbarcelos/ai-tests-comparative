# Tarefa: Tipos utilitÃ¡rios e genÃ©ricos

**ID**: backend-03  **Categoria**: backend
**Latencia**: 83.15s  **Tokens out**: 1172  **tps**: 14.1

---

Aqui está um exemplo completo usando os tipos utilitários do TypeScript aplicados à interface `Product`:

```typescript
// Interface base
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
}

// Exemplo 1: Partial<T>
type PartialProduct = Partial<Product>;

// Uso prático: Atualização parcial de um produto
const updateProductPartial = (id: string, updates: PartialProduct) => {
  // Simula atualização no banco de dados
  console.log(`Atualizando produto ${id} com:`, updates);
};

updateProductPartial("123", { name: "Novo Nome", price: 99.99 });

// Exemplo 2: Pick<T, K>
type ProductSummary = Pick<Product, 'name' | 'price'>;

// Uso prático: Listagem de resumo de produtos
const listProductSummaries = (products: Product[]): ProductSummary[] => {
  return products.map(product => ({
    name: product.name,
    price: product.price
  }));
};

// Exemplo 3: Omit<T, K>
type ProductWithoutTimestamp = Omit<Product, 'createdAt'>;

// Uso prático: Criação de novo produto sem precisar do timestamp
const createNewProduct = (data: ProductWithoutTimestamp): Product => {
  return { ...data, createdAt: new Date() };
};

// Exemplo 4: Readonly<T>
type ImmutableProduct = Readonly<Product>;

// Uso prático: Garantir imutabilidade de um produto
const getImmutableProduct = (): ImmutableProduct => {
  return {
    id: "123",
    name: "Produto Imutável",
    price: 100,
    stock: 50,
    createdAt: new Date()
  };
};

// Exemplo 5: ReturnType<T>
function getNewProduct(): Product {
  return {
    id: "456",
    name: "Novo Produto",
    price: 200,
    stock: 10,
    createdAt: new Date()
  };
}

type NewProductType = ReturnType<typeof getNewProduct>;

// Uso prático: Inferência de tipo a partir de uma função
const product: NewProductType = {
  id: "789",
  name: "Produto Inferido",
  price: 300,
  stock: 20,
  createdAt: new Date()
};
```

### Explicações dos tipos utilitários:

1. **`Partial<T>`**  
   - Transforma todos os campos de `T` em opcionais (permite `undefined`).  
   - Útil para atualizações parciais de objetos, onde não precisamos fornecer todos os campos.

2. **`Pick<T, K>`**  
   - Cria um novo tipo com apenas os campos especificados em `K`.  
   - Útil para extrair subconjuntos de dados (ex: mostrar apenas nome e preço em uma lista).

3. **`Omit<T, K>`**  
   - Cria um novo tipo excluindo os campos especificados em `K`.  
   - Útil quando queremos ignorar campos específicos (ex: não incluir timestamp ao criar um produto).

4. **`Readonly<T>`**  
   - Torna todos os campos de `T` somente leitura (não podem ser modificados).  
   - Útil para garantir que objetos importantes não sejam alterados acidentalmente.

5. **`ReturnType<T>`**  
   - Extrai o tipo de retorno de uma função `T`.  
   - Útil para inferir tipos a partir de funções sem precisar reescrever os tipos manualmente.

Esses utilitários são fundamentais para criar tipos mais específicos e flexíveis, mantendo a consistência do código TypeScript.
