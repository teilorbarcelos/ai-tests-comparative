import type { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  const status = err.status || 500;
  const message =
    status === 500
      ? 'Erro interno do servidor'
      : err.message || 'Falha na requisição';

  res.status(status).json({ error: message });
}