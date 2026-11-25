# Tarefa: Tipos utilitÃ¡rios e genÃ©ricos

**ID**: backend-03  **Categoria**: backend
**Latencia**: 201.89s  **Tokens out**: 3314  **tps**: 16.41

---

```ts
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
}
```

## `Partial<T>` — torna todas as propriedades opcionais

```ts
type ProductPatch = Partial<Product>;

const patch: ProductPatch = {
  name: 'Teclado Mecânico',
  price: 249.9,
}; // stock e createdAt ficam ausentes sem erro

function saveDraft(draft: ProductPatch) {
  // valida o payload antes de persistir
  console.log(draft);
}
```

Uso prático: corpo de uma requisição `PATCH`/formulário parcial, onde nem todos os campos precisam ser enviados.  
Observação: como torna até `id` opcional, em código real costuma-se combinar com `Omit` para impedir alteração de chaves imutáveis, ex.: `Partial<Omit<Product, 'id' | 'createdAt'>>`.

## `Pick<T, Keys>` — escolhe apenas algumas propriedades

```ts
type ProductCard = Pick<Product, 'id' | 'name' | 'price'>;

const card: ProductCard = {
  id: 'p1',
  name: 'Mouse Gamer',
  price: 129.9,
}; // não precisa de stock nem createdAt
```

Uso prático: props de um componente de lista/card que só exibe nome e preço.  
`Pick` cria um tipo novo contendo apenas as chaves escolhidas, mantendo os tipos originais.

## `Omit<T, Keys>` — remove algumas propriedades

```ts
type PublicProduct = Omit<Product, 'stock' | 'createdAt'>;

const publicView: PublicProduct = {
  id: 'p1',
  name: 'Mouse Gamer',
  price: 129.9,
}; // sem stock e createdAt
```

Uso prático: resposta pública da API ou view model que não deve expor dados internos como `stock` ou data de criação.  
Diferente de `Pick`, você define o que **não** quer manter.

## `Readonly<T>` — torna as propriedades somente leitura

```ts
type ProductSnapshot = Readonly<Product>;

const snapshot: ProductSnapshot = {
  id: 'p1',
  name: 'Mouse Gamer',
  price: 129.9,
  stock: 10,
  createdAt: new Date(),
};

// snapshot.price = 999; // erro de TypeScript: não pode atribuir a propriedade readonly
```

Uso prático: estado imutável em React/Redux, cache ou objeto vindo do servidor que não deve ser alterado acidentalmente pelo código da aplicação.  
Atenção: `Readonly` é **raso** — propriedades aninhadas continuam mutáveis se forem objetos/arrays. Para deep readonly, seria necessário um tipo customizado recursivo.

## `ReturnType<T>` — extrai o tipo de retorno de uma função

```ts
function createProduct(name: string, price: number) {
  return {
    id: crypto.randomUUID(),
    name,
    price,
    stock: 0,
    createdAt: new Date(),
  };
}

type NewProduct = ReturnType<typeof createProduct>;

const product: NewProduct = createProduct('Mouse Gamer', 129.9);
```

Uso prático com serviço assíncrono:

```ts
async function getProductById(id: string) {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error('Produto não encontrado');
  return (await res.json()) as Product;
}

type GetProductResult = ReturnType<typeof getProductById>; // Promise<Product>

async function load() {
  const product: Awaited<GetProductResult> = await getProductById('p1');
  console.log(product.name);
}
```

Uso prático: evita duplicar manualmente o tipo de retorno quando a função já tem inferência forte, como factories, services ou hooks.  
Observação: se a função for `async`, `ReturnType` devolve algo como `Promise<Product>`; para obter `Product`, use `Awaited<ReturnType<typeof fn>>`.

Resumo em português:

- `Partial<T>`: todas as propriedades viram opcionais.
- `Pick<T, Keys>`: mantém apenas algumas propriedades escolhidas.
- `Omit<T, Keys>`: remove algumas propriedades escolhidas.
- `Readonly<T>`: torna as propriedades somente leitura, de forma raso.
- `ReturnType<typeof fn>`: extrai o tipo de retorno da função/método informado.
