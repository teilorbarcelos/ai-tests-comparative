// src/api/mock.ts
import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Ana Silva',
    email: 'ana.silva@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'Bruno Costa',
    email: 'bruno.costa@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  // ...adicione mais usuários se quiser
];