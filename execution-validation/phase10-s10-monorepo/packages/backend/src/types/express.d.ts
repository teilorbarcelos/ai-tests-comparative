// Augmentação global do Express Request para expor `req.user` (definido pelo authMiddleware).
declare global {
  namespace Express {
    interface Request {
      user: { id: string; email: string };
    }
  }
}

export {};