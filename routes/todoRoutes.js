import express from 'express';
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  markTodoCompleted,
  shareTodo,
  unshareTodo,
  getWeeklyStats
} from '../controllers/todoController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  validateCreateTodo,
  validateUpdateTodo,
  validateShareTodo
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect);

/**
 * Analytics and search endpoints.
 */
router.get('/stats/weekly', getWeeklyStats);

/**
 * Task CRUD.
 */
router.get('/', getTodos);
router.post('/', validateCreateTodo, createTodo);
router.get('/:id', getTodoById);
router.put('/:id', validateUpdateTodo, updateTodo);
router.put('/:id/complete', markTodoCompleted);
router.delete('/:id', deleteTodo);

/**
 * Collaboration.
 */
router.post('/:id/share', validateShareTodo, shareTodo);
router.delete('/:id/share/:userId', unshareTodo);

/**
 * Admin-only example route.
 */
router.get('/admin/all', authorize('admin'), (req, res) => {
  res.json({ message: 'All Todos (Admin only)' });
});

export default router;
