import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/ProductService';

/**
 * Controlador – recebe HTTP e delega ao serviço.
 */
export class ProductController {
  constructor(private service = new ProductService()) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.service.create(req.body);
      res.status(201).json(product);
    } catch (err) { next(err); }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        name: req.query.name as string | undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined
      };
      const pagination = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10
      };
      const { items, total } = await this.service.list(filters, pagination);
      res.json({ items, total });
    } catch (err) { next(err); }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.service.getById(req.params.id);
      res.json(product);
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await this.service.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) { next(err); }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.service.delete(req.params.id);
      res.status(204).send();
    } catch (err) { next(err); }
  }
}