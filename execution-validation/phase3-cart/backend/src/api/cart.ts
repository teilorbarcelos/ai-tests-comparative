// backend/src/api/cart.ts
import express from 'express';
import { z } from 'zod';
import { MemoryCartStore } from '../infra/memoryCartStore';
import { CartItem, Product } from '../domain/types';

const router = express.Router();
const store = new MemoryCartStore();

const addSchema = z.object({
  product: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().positive()
  }),
  quantity: z.number().int().positive()
});

router.get('/cart', (_req, res) => {
  res.json(store.getAll());
});

router.post('/cart/add', (req, res) => {
  const result = addSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error.format());

  const { product, quantity } = result.data;
  store.add({ ...product, quantity });
  res.status(201).json(store.getAll());
});

router.post('/cart/remove', (req, res) => {
  const schema = z.object({
    id: z.string()
  });
  const result = schema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error.format());

  const removed = store.remove(result.data.id);
  if (!removed) return res.status(404).json({ message: 'Item não encontrado' });

  res.json(store.getAll());
});

export default router;