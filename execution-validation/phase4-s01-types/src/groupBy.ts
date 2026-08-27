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