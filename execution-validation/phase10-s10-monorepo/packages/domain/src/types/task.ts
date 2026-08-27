// packages/domain/src/types/task.ts
export interface Task {
  id: string;          // UUID v4
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;     // FK para User
}