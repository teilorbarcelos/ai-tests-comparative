// frontend/src/api/cartApi.ts
import axios from 'axios';
import { CartItem, Product } from '../domain/types';

const api = axios.create({
  baseURL: 'http://localhost:4000/api'
});

export const getCart = async (): Promise<CartItem[]> => {
  const res = await api.get('/cart');
  return res.data;
};

export const addToCart = async (product: Product, quantity: number): Promise<CartItem[]> => {
  const res = await api.post('/cart/add', { product, quantity });
  return res.data;
};

export const removeFromCart = async (id: string): Promise<CartItem[]> => {
  const res = await api.post('/cart/remove', { id });
  return res.data;
};