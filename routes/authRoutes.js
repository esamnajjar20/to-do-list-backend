import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  changePassword
} from '../controllers/authController.js';
import {
  validateRegister,
  validateLogin,
  validateChangePassword
} from '../middleware/validationMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Auth routes.
 */
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.put('/change-password', protect, validateChangePassword, changePassword);
router.post('/logout', protect, logoutUser);

export default router;
