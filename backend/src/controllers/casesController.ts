import { Request, Response, NextFunction } from 'express';
import {
    createCase as createCaseModel,
    getCaseById,
    getCaseByNumber,
    getCaseDetailById,
    listCases as listCasesModel,
    updateCase as updateCaseModel
} from '../models/caseModel';
import { recordAuditLog } from '../models/auditLogModel';
import { validateCasePayload } from '../utils/validation';

export const listCases = (req: Request, res: Response, next: NextFunction) => {
    try {
        const cases = listCasesModel(req.query as any);
        res.json(cases);
    } catch (error) {
        next(error);
    }
};

export const getCase = (req: Request, res: Response, next: NextFunction) => {
    try {
        const record = getCaseById(req.params.id);
        if (!record) {
            return res.status(404).json({ message: 'Case not found' });
        }
        res.json(record);
    } catch (error) {
        next(error);
    }
};

export const getCaseDetail = (req: Request, res: Response, next: NextFunction) => {
    try {
        const record = getCaseDetailById(req.params.id);
        if (!record) {
            return res.status(404).json({ message: 'Case not found' });
        }
        res.json(record);
    } catch (error) {
        next(error);
    }
};

export const createCase = (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;
        validateCasePayload(payload);
        const existing = getCaseByNumber(payload.caseNumber);
        if (existing) {
            return res.status(409).json({ message: 'Case number already exists' });
        }

        const created = createCaseModel(payload);
        recordAuditLog({
            entity: 'case',
            entityId: created?.id || 'unknown',
            action: 'created',
            performedBy: req.user?.id || payload.assignedTo || 'system',
            details: `New case created: ${payload.caseNumber}`
        });
        res.status(201).json(created);
    } catch (error) {
        next(error);
    }
};

export const updateCase = (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = updateCaseModel(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Case not found' });
        }
        recordAuditLog({
            entity: 'case',
            entityId: updated.id,
            action: 'updated',
            performedBy: req.user?.id || req.body.assignedTo || 'system',
            details: `Case status changed to ${updated.status}`
        });
        res.json(updated);
    } catch (error) {
        next(error);
    }
};
