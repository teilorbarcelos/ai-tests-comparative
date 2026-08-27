import { Product } from '../models/Product';
import { v4 as uuidv4 } from 'uuid';

/**
 * Repositório em memória – simula um banco SQL.
 */
export class InMemoryProductRepository {
  private products: Product[] = [];

  async create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const now = new Date();
    const product: Product = {
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      ...data
    };
    this.products.push(product);
    return product;
  }

  async findAll(): Promise<Product[]> {
    return [...this.products];
  }

  async findById(id: string): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async update(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | null> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    const existing = this.products[index];
    const updated: Product = {
      ...existing,
      ...data,
      updatedAt: new Date()
    };
    this.products[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }
}