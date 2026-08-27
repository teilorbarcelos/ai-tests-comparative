import { UserRepository } from "../domain/repositories";
import { User } from "../domain/models";
import { hashPassword, verifyPassword } from "../presentation/utils/hash";
import { AuthError } from "../presentation/errors/customErrors";

export interface AuthServiceDeps {
  userRepo: UserRepository;
}

export class AuthService {
  constructor(private readonly deps: AuthServiceDeps) {}

  /**
   * Registra um novo usuário.
   */
  async register(email: string, password: string): Promise<void> {
    const existing = await this.deps.userRepo.findByEmail(email);
    if (existing) {
      throw new AuthError("E‑mail já cadastrado");
    }

    const user: User = {
      id: crypto.randomUUID(),
      email,
      passwordHash: hashPassword(password),
    };

    await this.deps.userRepo.save(user);
  }

  /**
   * Faz login e devolve um token (simulado).
   */
  async login(email: string, password: string): Promise<string> {
    const user = await this.deps.userRepo.findByEmail(email);
    if (!user) throw new AuthError("Credenciais inválidas");

    const ok = verifyPassword(password, user.passwordHash);
    if (!ok) throw new AuthError("Credenciais inválidas");

    // Token JWT “simulado” – em produção use jsonwebtoken ou similar
    return `token-${user.id}-${Date.now()}`;
  }
}