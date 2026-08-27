import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"; // apenas para ilustrar; não usado no exemplo completo

/**
 * Middleware que verifica se o header Authorization contém um token válido.
 * Em produção valide JWT real e busque usuário do banco.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token ausente" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Simulação de verificação – em produção use jwt.verify
    const payload = JSON.parse(Buffer.from(token.replace("token-", ""), "base64").toString());
    (req as any).userId = payload.id; // anexar dados ao request
    next();
  } catch (_) {
    return res.status(401).json({ error: "Token inválido" });
  }
}