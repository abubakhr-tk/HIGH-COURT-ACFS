import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

export const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/register', authenticateToken, authorizeRoles('Admin'), register);
