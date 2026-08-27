import { prisma } from '../config';
import type { Task } from '@todo/domain';

export class TaskService {
  async list(userId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: { ownerId: userId },
      orderBy: [{ dueDate: 'asc' }, { priority: 'desc' }],
    });
  }

  async create(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    return prisma.task.create({ data });
  }

  async update(id: string, userId: string, patch: Partial<Task>): Promise<Task> {
    // Garantir que o usuário seja dono da tarefa
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.ownerId !== userId) {
      throw new Error('Task not found or unauthorized');
    }

    return prisma.task.update({
      where: { id },
      data: patch,
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task || task.ownerId !== userId) {
      throw new Error('Task not found or unauthorized');
    }

    await prisma.task.delete({ where: { id } });
  }
}