/**
 * Modelo de Produto – apenas tipagem.
 */
export interface Product {
  id: string;          // UUID ou qualquer identificador único
  name: string;
  description?: string;
  price: number;       // valor em reais (ex.: 19.99)
  quantity: number;    // estoque disponível
  createdAt: Date;
  updatedAt: Date;
}