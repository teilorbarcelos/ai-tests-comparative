# Tarefa: Tipos utilitÃ¡rios e genÃ©ricos

**ID**: backend-03  **Categoria**: backend
**Latencia**: 5.67s  **Tokens out**: 978  **tps**: 172.54

---

## 1️⃣  A interface base

```ts
interface Product {
  id: number;
  name: string;
  price: number;      // em reais
  stock: number;      // quantidade disponível
  createdAt: Date;    // data de criação do produto
}
```

---

## 2️⃣  Utilitário **`Partial<T>`**

> **O que faz?**  
> Torna *todos* os campos de `T` opcionais. Útil quando você quer atualizar apenas alguns atributos.

```ts
// Tipo que pode receber qualquer subconjunto dos campos de Product
type PartialProduct = Partial<Product>;

const updateProduct = (id: number, changes: PartialProduct) => {
  // aqui poderíamos fazer algo como:
  // db.update(id, changes);
};

updateProduct(1, { price: 19.99 });          // apenas altera o preço
updateProduct(2, { name: "Novo nome", stock: 5 }); // altera nome e estoque
```

---

## 3️⃣  Utilitário **`Pick<T, K>`**

> **O que faz?**  
> Cria um novo tipo contendo *apenas* as propriedades `K` de `T`.

```ts
// Tipo que contém apenas id e name
type ProductSummary = Pick<Product, "id" | "name">;

const getProductSummary = (product: Product): ProductSummary => ({
  id: product.id,
  name: product.name,
});

const prod: Product = {
  id: 42,
  name: "Camiseta",
  price: 49.99,
  stock: 10,
  createdAt: new Date(),
};

console.log(getProductSummary(prod)); // { id: 42, name: 'Camiseta' }
```

---

## 4️⃣  Utilitário **`Omit<T, K>`**

> **O que faz?**  
> Cria um novo tipo contendo *todas* as propriedades de `T`, exceto as listadas em `K`.

```ts
// Tipo que contém tudo menos createdAt (por exemplo, para enviar ao cliente)
type ProductWithoutCreated = Omit<Product, "createdAt">;

const sendToClient = (product: Product) => {
  const payload: ProductWithoutCreated = {
    id: product.id,
    name: product.name,
    price: product.price,
    stock: product.stock,
  };
  // enviar payload via API...
};
```

---

## 5️⃣  Utilitário **`Readonly<T>`**

> **O que faz?**  
> Torna *todas* as propriedades de `T` imutáveis (apenas leitura). Útil para garantir que objetos não sejam alterados depois de criados.

```ts
// Tipo onde nenhum campo pode ser modificado
type ReadonlyProduct = Readonly<Product>;

const prod: ReadonlyProduct = {
  id: 1,
  name: "Caneca",
  price: 15.5,
  stock: 20,
  createdAt: new Date(),
};

// prod.price = 12; // ❌ Erro de compilação
```

---

## 6️⃣  Utilitário **`ReturnType<T>`**

> **O que faz?**  
> Obtém o tipo do valor retornado por uma função `T`.

```ts
function createProduct(name: string, price: number): Product {
  return {
    id: Math.floor(Math.random() * 1000),
    name,
    price,
    stock: 0,
    createdAt: new Date(),
  };
}

// Tipo que corresponde ao retorno de createProduct
type CreatedProduct = ReturnType<typeof createProduct>;

const newProd: CreatedProduct = createProduct("Livro", 29.99);
```

---

## Resumo rápido

| Utilitário | O que faz | Exemplo de uso |
|------------|-----------|----------------|
| `Partial<T>` | Torna todas as propriedades opcionais | Atualizar parcialmente um produto |
| `Pick<T, K>` | Seleciona apenas algumas propriedades | Retornar resumo do produto |
| `Omit<T, K>` | Remove propriedades específicas | Enviar dados sem data de criação |
| `Readonly<T>` | Impede mutação das propriedades | Garantir imutabilidade de objetos |
| `ReturnType<T>` | Obtém o tipo retornado por uma função | Inferir tipo do retorno de `createProduct` |

Esses utilitários são extremamente úteis para manter seu código **fortemente tipado** e evitar erros comuns em projetos TypeScript. 🚀
