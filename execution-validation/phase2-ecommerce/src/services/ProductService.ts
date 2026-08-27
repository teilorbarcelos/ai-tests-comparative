import { Product } from '../models/Product';
import { InMemoryProductRepository } from '../repositories/InMemoryProductRepository';
import { z } from 'zod';
import { paginate, PaginationParams } from '../utils/pagination';

/**
 * Schemas de validação com Zod.
 */
const productCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  quantity: z.number().int().nonnegative()
});

const productUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  quantity: z.number().int().nonnegative().optional()
});

/**
 * Serviço de negócio – camada entre controller e repositório.
 */
export class ProductService {
  constructor(private repo = new InMemoryProductRepository()) {}

  async create(data: unknown): Promise<Product> {
    const parsed = productCreateSchema.parse(data);
    return this.repo.create(parsed);
  }

  async list(filters: { name?: string; minPrice?: number; maxPrice?: number } = {}, pagination: PaginationParams = {}): Promise<{ items: Product[]; total: number }> {
    let items = await this.repo.findAll();

    // Filtros simples
    if (filters.name) {
      const term = filters.name.toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(term));
    }
    if (filters.minPrice !== undefined) {
      items = items.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      items = items.filter(p => p.price <= filters.maxPrice!);
    }

    const total = items.length;
    items = paginate(items, pagination);

    return { items, total };
  }

  async getById(id: string): Promise<Product> {
    const product = await this.repo.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  async update(id: string, data: unknown): Promise<Product> {
    const parsed = productUpdateSchema.parse(data);
    const updated = await this.repo.update(id, parsed);
    if (!updated) throw new Error('Product not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const ok = await this.repo.delete(id);
    if (!ok) throw new Error('Product not found');
  }
}