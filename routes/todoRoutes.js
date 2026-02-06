import express from 'express';
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  markTodoCompleted
} from '../controllers/todoController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  validateCreateTodo,
  validateUpdateTodo
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getTodos);

router.get('/:id', getTodoById);

router.post('/', validateCreateTodo, createTodo);

router.put('/:id', validateUpdateTodo, updateTodo);

router.put('/:id/complete', markTodoCompleted);

router.delete('/:id', deleteTodo);


router.get('/admin/all', authorize('admin'), (req, res) => {
  res.json({ message: 'All Todos (Admin only)' });
});

export default router;
