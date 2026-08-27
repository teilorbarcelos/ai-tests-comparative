import express from "express";
import { InMemoryUserRepository } from "./infrastructure/inMemoryUserRepository";
import { AuthService } from "./application/authService";
import { authMiddleware } from "./presentation/middleware/authMiddleware";

const app = express();
app.use(express.json());

// DI simples
const userRepo = new InMemoryUserRepository();
const authService = new AuthService({ userRepo });

/* ---------- Rotas de autenticação ---------- */

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    await authService.register(email, password);
    res.status(201).json({ message: "Usuário criado" });
  } catch (err: any) {
    if (err.name === "AuthError") return res.status(400).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (err: any) {
    if (err.name === "AuthError") return res.status(401).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

/* ---------- Rotas protegidas ---------- */

app.get("/me", authMiddleware, async (req, res) => {
  // Em produção buscaria o usuário do banco usando req.userId
  res.json({ message: `Usuário ${(req as any).userId} autenticado` });
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));