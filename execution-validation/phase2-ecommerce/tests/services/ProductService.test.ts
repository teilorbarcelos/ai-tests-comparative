import { ProductService } from '../../src/services/ProductService';
import { InMemoryProductRepository } from '../../src/repositories/InMemoryProductRepository';

describe('ProductService', () => {
  let service: ProductService;
  let repo: InMemoryProductRepository;

  beforeEach(() => {
    repo = new InMemoryProductRepository();
    service = new ProductService(repo);
  });

  test('create product', async () => {
    const data = { name: 'Camisa', price: 49.99, quantity: 10 };
    const product = await service.create(data);
    expect(product).toHaveProperty('id');
    expect(product.name).toBe('Camisa');
  });

  test('list products with pagination', async () => {
    // criar 15 produtos
    for (let i = 0; i < 15; i++) {
      await service.create({ name: `Item${i}`, price: 10 + i, quantity: 5 });
    }
    const { items, total } = await service.list({}, { page: 2, limit: 5 });
    expect(items).toHaveLength(5);
    expect(total).toBe(15);
  });

  test('get by id', async () => {
    const created = await service.create({ name: 'Bola', price: 20, quantity: 3 });
    const found = await service.getById(created.id);
    expect(found.name).toBe('Bola');
  });

  test('update product', async () => {
    const created = await service.create({ name: 'Livro', price: 30, quantity: 2 });
    const updated = await service.update(created.id, { price: 35 });
    expect(updated.price).toBe(35);
  });

  test('delete product', async () => {
    const created = await service.create({ name: 'Caneta', price: 5, quantity: 50 });
    await service.delete(created.id);
    await expect(service.getById(created.id)).rejects.toThrow('Product not found');
  });

  test('validation error on create', async () => {
    await expect(
      service.create({ name: '', price: -10, quantity: -5 })
    ).rejects.toThrow();
  });
});