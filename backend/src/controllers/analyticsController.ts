import { Request, Response, NextFunction } from 'express';
import db from '../models/db';

export const caseSummary = (req: Request, res: Response, next: NextFunction) => {
    try {
        const summary = db.prepare(
            `SELECT status, COUNT(*) as count FROM cases GROUP BY status`
        ).all();
        res.json(summary);
    } catch (error) {
        next(error);
    }
};

export const workflowMetrics = (req: Request, res: Response, next: NextFunction) => {
    try {
        const byCategory = db.prepare(
            `SELECT category, COUNT(*) as total FROM cases GROUP BY category`
        ).all();
        const assignments = db.prepare(
            `SELECT assignedTo, COUNT(*) as total FROM cases GROUP BY assignedTo`
        ).all();
        res.json({ byCategory, assignments });
    } catch (error) {
        next(error);
    }
};
