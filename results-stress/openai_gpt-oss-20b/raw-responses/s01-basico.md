# Tarefa: Tipos avancados e genericos

**ID**: s01-basico  **Categoria**: backend
**Latencia**: 29.22s  **Tokens out**: 1245  **tps**: 42.61

---

## 1️⃣ Função genérica `groupBy`

```ts
/**
 * Agrupa um array de itens em um Map, usando a chave retornada por `keySelector`.
 *
 * @param items          Array contendo os objetos que serão agrupados.
 * @param keySelector    Função que recebe um item e devolve a chave pelo qual ele será agrupado.
 * @returns              Um Map onde cada chave aponta para o array de itens que pertencem a ela.
 */
export function groupBy<T, K>(items: T[], keySelector: (item: T) => K): Map<K, T[]> {
  const result = new Map<K, T[]>();

  for (const item of items) {
    const key = keySelector(item);

    // Se ainda não existir um array para essa chave, cria‑o
    if (!result.has(key)) {
      result.set(key, []);
    }

    // Adiciona o item ao array da chave correspondente
    result.get(key)!.push(item);
  }

  return result;
}
```

### Por que usar `Map`?

- **Chaves não são apenas strings** – em JavaScript/TypeScript um `Map` aceita qualquer tipo como chave (`string`, `number`, objeto, etc.).
- **Preserva a ordem de inserção**, o que pode ser útil quando precisamos iterar na mesma sequência em que os grupos foram criados.
- **Métodos convenientes**: `has`, `get`, `set`, `forEach`.

---

## 2️⃣ Tipos utilitários

| Utilitário | O que faz | Exemplo |
|------------|-----------|---------|
| `Record<K, V>` | Cria um objeto cujas chaves são de tipo `K` e os valores de tipo `V`. | `Record<string, number>` → `{ [key: string]: number }` |
| `Partial<T>` | Torna todas as propriedades de `T` opcionais. | `Partial<User>` → `{ name?: string; age?: number; … }` |
| `Pick<T, K>` | Seleciona apenas um subconjunto das propriedades de `T`. | `Pick<Product, 'id' | 'name'>` → `{ id: string; name: string }` |

---

## 3️⃣ Exemplo prático

```ts
// ---------- Definições -------------------------------------------------------

interface Product {
  id: number;
  name: string;
  category: string;   // ex.: "electronics", "clothing"
  price: number;
}

// Um array de produtos fictícios
const products: Product[] = [
  { id: 1, name: 'Smartphone', category: 'electronics', price: 699 },
  { id: 2, name: 'T‑Shirt',    category: 'clothing',   price: 29  },
  { id: 3, name: 'Laptop',     category: 'electronics', price: 1299},
  { id: 4, name: 'Jeans',      category: 'clothing',   price: 49  },
];

// ---------- Uso da função groupBy -----------------------------------------

// Agrupa por categoria
const grouped = groupBy(products, p => p.category);

// `grouped` é um Map<string, Product[]>
console.log(grouped);
// Exemplo de saída:
// Map(2) {
//   'electronics' => [ {…}, {…} ],
//   'clothing'    => [ {…}, {…} ]
// }

// ---------- Trabalhando com Record ---------------------------------------

/**
 * Converte o Map em um objeto `Record` para facilitar a busca por chave.
 */
const groupedAsRecord: Record<string, Product[]> = Object.fromEntries(grouped);

// Agora podemos acessar diretamente:
console.log(groupedAsRecord['electronics']); // Array de produtos eletrônicos

// ---------- Partial e Pick -----------------------------------------------

// Suponha que queremos atualizar apenas o nome e preço de um produto
type UpdateProductDTO = Partial<Pick<Product, 'name' | 'price'>>;

// Exemplo de uso
const update: UpdateProductDTO = { price: 649 }; // só alteramos o preço

// Função fictícia que aplica a atualização (não implementada aqui)
function applyUpdate(product: Product, changes: UpdateProductDTO): Product {
  return { ...product, ...changes };
}
```

### Explicação do código

1. **`groupBy`**  
   - Percorre cada item no array `items`.  
   - Usa a função `keySelector` para obter a chave (`K`).  
   - Se o mapa ainda não tem essa chave, cria um array vazio.  
   - Adiciona o item ao array da chave correspondente.

2. **Uso com `Product`**  
   - Passamos `p => p.category` como `keySelector`.  
   - O resultado é um `Map<string, Product[]>`, onde cada categoria aponta para todos os produtos que pertencem a ela.

3. **Conversão para `Record`**  
   - `Object.fromEntries(grouped)` transforma o `Map` em um objeto simples (`Record`).  
   - Isso facilita buscas por chave usando sintaxe de ponto ou colchetes.

4. **Tipos utilitários**  
   - `Partial<Pick<Product, 'name' | 'price'>>` cria um tipo que permite atualizar apenas as propriedades `name` e/ou `price`.  
   - Assim, a função `applyUpdate` pode receber qualquer combinação dessas duas propriedades (ou nenhuma) sem erro de compilação.

---

💡 **Dica**: Se você precisar de agrupamento mais complexo (por exemplo, agrupar por múltiplas chaves), basta combinar as chaves em uma string ou usar um objeto como chave do `Map`. O `groupBy` genérico permanece o mesmo.
