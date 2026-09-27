import { User } from "./User";

export interface UserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async save(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    return user ? Promise.resolve(user) : Promise.resolve(null);
  }

  async findAll(): Promise<User[]> {
    return Promise.resolve([...this.users]);
  }
}