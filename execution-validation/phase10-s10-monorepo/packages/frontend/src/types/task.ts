// src/types/task.ts — re-export do pacote domain (tipos compartilhados)
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}