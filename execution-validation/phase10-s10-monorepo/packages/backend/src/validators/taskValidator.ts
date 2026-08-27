import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();