// ---------- Definições -------------------------------------------------------

import { groupBy } from './groupBy';

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