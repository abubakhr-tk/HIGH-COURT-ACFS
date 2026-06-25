import { Request, Response, NextFunction } from 'express';
import { getUserWithPasswordByEmail, createUser as createUserModel } from '../models/userModel';
import { comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { validateUserPayload } from '../utils/validation';
import { recordAuditLog } from '../models/auditLogModel';

export const login = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = getUserWithPasswordByEmail(email);
        if (!user || !comparePassword(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = signToken({ id: user.id, email: user.email, role: user.role });
        const { password: _pass, ...userProfile } = user;
        res.json({ token, user: userProfile });
    } catch (error) {
        next(error);
    }
};

export const register = (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;
        validateUserPayload(payload);
        const created = createUserModel(payload);
        recordAuditLog({
            entity: 'user',
            entityId: created?.id || 'unknown',
            action: 'created',
            performedBy: req.user?.id || payload.email,
            details: `New user registered: ${payload.email}`
        });
        res.status(201).json(created);
    } catch (error) {
        next(error);
    }
};
