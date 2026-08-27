import { User } from "../domain/models";
import { UserRepository } from "../domain/repositories";

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, User>(); // key: email

  async findByEmail(email: string): Promise<User | null> {
    return this.users.get(email) ?? null;
  }

  async save(user: User): Promise<void> {
    if (this.users.has(user.email)) {
      throw new Error(`User with email ${user.email} already exists`);
    }
    this.users.set(user.email, user);
  }
}