import { Request, Response, NextFunction } from 'express';
import { kanoStateConfig } from '../utils/kanoConfig';

export const getKanoConfig = (_req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(kanoStateConfig);
    } catch (error) {
        next(error);
    }
};
