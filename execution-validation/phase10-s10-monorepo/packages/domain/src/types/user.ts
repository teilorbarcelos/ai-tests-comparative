// packages/domain/src/types/user.ts
export interface User {
  id: string;          // UUID v4
  email: string;
  passwordHash: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}