import { Request, Response, NextFunction } from 'express';
import { createCourt as createCourtModel, getCourtById as getCourtByIdModel, listCourts as listCourtsModel, updateCourt as updateCourtModel } from '../models/courtModel';
import { recordAuditLog } from '../models/auditLogModel';
import { validateCourtPayload } from '../utils/validation';

export const getCourts = (req: Request, res: Response, next: NextFunction) => {
    try {
        const courts = listCourtsModel();
        res.json(courts);
    } catch (error) {
        next(error);
    }
};

export const getCourtById = (req: Request, res: Response, next: NextFunction) => {
    try {
        const court = getCourtByIdModel(req.params.id);
        if (!court) {
            return res.status(404).json({ message: 'Court not found' });
        }
        res.json(court);
    } catch (error) {
        next(error);
    }
};

export const createCourt = (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;
        validateCourtPayload(payload);
        const created = createCourtModel(payload);
        recordAuditLog({
            entity: 'court',
            entityId: created?.id || 'unknown',
            action: 'created',
            performedBy: req.user?.id || payload.contact || 'system',
            details: `Court created: ${payload.name}`
        });
        res.status(201).json(created);
    } catch (error) {
        next(error);
    }
};

export const updateCourt = (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = updateCourtModel(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Court not found' });
        }
        recordAuditLog({
            entity: 'court',
            entityId: updated.id,
            action: 'updated',
            performedBy: req.user?.id || updated.contact || 'system',
        });
        res.json(updated);
    } catch (error) {
        next(error);
    }
};
