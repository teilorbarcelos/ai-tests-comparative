// frontend/src/hooks/useCart.ts
import { useEffect, useState } from 'react';
import { CartItem, Product } from '../domain/types';
import * as cartApi from '../api/cartApi';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await cartApi.getCart();
      setItems(data);
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar carrinho');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const add = async (product: Product, quantity: number) => {
    try {
      const data = await cartApi.addToCart(product, quantity);
      setItems(data);
    } catch (e: any) {
      setError(e.message || 'Erro ao adicionar');
    }
  };

  const remove = async (id: string) => {
    try {
      const data = await cartApi.removeFromCart(id);
      setItems(data);
    } catch (e: any) {
      setError(e.message || 'Erro ao remover');
    }
  };

  return { items, loading, error, add, remove };
};