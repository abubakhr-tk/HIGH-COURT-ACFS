import { Router } from 'express';
import { caseSummary, workflowMetrics } from '../controllers/analyticsController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

export const analyticsRouter = Router();

analyticsRouter.get('/case-summary', authenticateToken, authorizeRoles('Admin'), caseSummary);
analyticsRouter.get('/workflow-metrics', authenticateToken, authorizeRoles('Admin'), workflowMetrics);
