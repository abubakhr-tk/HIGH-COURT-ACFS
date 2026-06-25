import { Router } from 'express';
import { createCase, getCase, getCaseDetail, listCases, updateCase } from '../controllers/casesController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

export const casesRouter = Router();

casesRouter.get('/', authenticateToken, listCases);
casesRouter.get('/:id/detail', authenticateToken, getCaseDetail);
casesRouter.get('/:id', authenticateToken, getCase);
casesRouter.post('/', authenticateToken, authorizeRoles('Admin', 'Clerk', 'Attorney', 'Registry Officer'), createCase);
casesRouter.put('/:id', authenticateToken, authorizeRoles('Admin', 'Clerk', 'Attorney', 'Registry Officer'), updateCase);
