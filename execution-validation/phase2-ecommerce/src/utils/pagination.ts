/**
 * Função utilitária para paginar resultados.
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export function paginate<T>(items: T[], { page = 1, limit = 10 }: PaginationParams) {
  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
}