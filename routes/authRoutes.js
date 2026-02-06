import express from 'express';
import { registerUser, loginUser , logoutUser} from '../controllers/authController.js';
import { validateRegister, validateLogin, validateChangePassword } from '../middleware/validationMiddleware.js';
import { protect } from '../middleware/authMiddleware.js'; // إذا لديك حماية JWT
import { changePassword } from '../controllers/changePassword.js';
const router = express.Router();

router.post('/register', validateRegister, registerUser);

router.post('/login', validateLogin, loginUser);

router.put('/change-password', protect, validateChangePassword, changePassword);

router.post('/logout', protect, logoutUser);


export default router;
