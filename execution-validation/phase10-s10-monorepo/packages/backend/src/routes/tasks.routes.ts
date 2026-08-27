import express from 'express';
import { TaskService } from '../services/taskService';
import { validateBody } from '../middlewares/validationMiddleware';
import {
  createTaskSchema,
  updateTaskSchema,
} from '../validators/taskValidator';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();
const service = new TaskService();

router.use(authMiddleware); // todas as rotas precisam de token

router.get('/', async (req, res, next) => {
  try {
    const tasks = await service.list(req.user.id);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  validateBody(createTaskSchema),
  async (req, res, next) => {
    try {
      const task = await service.create({
        ...req.body,
        ownerId: req.user.id,
      });
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  },
);

router.patch(
  '/:id',
  validateBody(updateTaskSchema),
  async (req, res, next) => {
    try {
      const task = await service.update(req.params.id as string, req.user.id, req.body);
      res.json(task);
    } catch (err) {
      next(err);
    }
  },
);

router.delete('/:id', async (req, res, next) => {
  try {
    await service.delete(req.params.id as string, req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;