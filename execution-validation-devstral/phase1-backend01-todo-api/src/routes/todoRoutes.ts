import { Router } from 'express';
import * as todoController from '../controllers/todoController';

const router = Router();

router.get('/', todoController.getAllTodos);
router.post('/', todoController.createTodo);
router.patch('/:id', todoController.toggleTodo);
router.delete('/:id', todoController.deleteTodo);

export default router;