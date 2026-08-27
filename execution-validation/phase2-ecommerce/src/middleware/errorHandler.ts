import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

/**
 * Middleware centralizado de tratamento de erros.
 */
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors
    });
  }

  const status = err instanceof Error && err.message === 'Product not found' ? 404 : 500;
  res.status(status).json({
    status: 'error',
    message: err instanceof Error ? err.message : 'Internal Server Error'
  });
}