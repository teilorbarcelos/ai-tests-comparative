// backend/src/domain/types.ts

export interface Product {
  id: string;
  name: string;
  price: number; // em reais, ex.: 19.99
}

export interface CartItem extends Product {
  quantity: number;
}