// src/types/index.d.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

export type AuthContextType = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};