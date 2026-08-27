import express from 'express';
import { ProductController } from '../controllers/ProductController';

const router = express.Router();
const controller = new ProductController();

router.post('/', controller.create.bind(controller));
router.get('/', controller.list.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;