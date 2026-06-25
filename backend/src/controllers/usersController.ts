import { Request, Response, NextFunction } from 'express';
import {
    createUser as createUserModel,
    getUserById as getUserByIdModel,
    listUsers as listUsersModel,
    updateUser as updateUserModel,
    getUserRecordById
} from '../models/userModel';
import { recordAuditLog } from '../models/auditLogModel';
import { validateUserPayload } from '../utils/validation';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = listUsersModel();
        res.json(users);
    } catch (error) {
        next(error);
    }
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = getUserByIdModel(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;
        validateUserPayload(payload);
        const created = createUserModel(payload);
        recordAuditLog({
            entity: 'user',
            entityId: created?.id || 'unknown',
            action: 'created',
            performedBy: req.user?.id || payload.email,
            details: `New user created: ${payload.email}`
        });
        res.status(201).json(created);
    } catch (error) {
        next(error);
    }
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = updateUserModel(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userRecord = getUserRecordById(req.params.id);
        recordAuditLog({
            entity: 'user',
            entityId: updated.id,
            action: 'updated',
            performedBy: userRecord?.email || 'system',
        });
        res.json(updated);
    } catch (error) {
        next(error);
    }
};
