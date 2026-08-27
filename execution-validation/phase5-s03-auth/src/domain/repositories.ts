import { User } from "./models";

/**
 * Interface que descreve as operações de persistência de usuários.
 */
export interface UserRepository {
  /** Busca um usuário pelo e‑mail. */
  findByEmail(email: string): Promise<User | null>;

  /** Salva um novo usuário. */
  save(user: User): Promise<void>;
}