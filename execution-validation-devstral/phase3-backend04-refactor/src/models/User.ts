export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
}

export class UserBuilder {
  private user: Partial<User> = {};

  withName(name: string): this {
    this.user.name = name;
    return this;
  }

  withEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  build(): User {
    if (!this.user.name) {
      throw new Error("Name is required");
    }
    if (!this.user.email) {
      throw new Error("Email is required");
    }
    const name: string = this.user.name;
    const email: string = this.user.email;
    return {
      id: crypto.randomUUID(),
      name,
      email,
      createdAt: new Date()
    };
  }
}