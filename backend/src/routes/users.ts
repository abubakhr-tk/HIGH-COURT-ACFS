import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser } from '../controllers/usersController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

export const usersRouter = Router();

usersRouter.use(authenticateToken);
usersRouter.get('/', authorizeRoles('Admin'), getUsers);
usersRouter.get('/:id', authorizeRoles('Admin', 'Clerk', 'Attorney', 'Judge', 'Registry Officer'), getUserById);
usersRouter.post('/', authorizeRoles('Admin'), createUser);
usersRouter.put('/:id', authorizeRoles('Admin'), updateUser);
