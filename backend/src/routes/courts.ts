import { Router } from 'express';
import { createCourt, getCourts, getCourtById, updateCourt } from '../controllers/courtsController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

export const courtsRouter = Router();

courtsRouter.get('/', authenticateToken, getCourts);
courtsRouter.get('/:id', authenticateToken, getCourtById);
courtsRouter.post('/', authenticateToken, authorizeRoles('Admin', 'Registry Officer'), createCourt);
courtsRouter.put('/:id', authenticateToken, authorizeRoles('Admin', 'Registry Officer'), updateCourt);
