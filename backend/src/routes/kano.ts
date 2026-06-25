import { Router } from 'express';
import { getKanoConfig } from '../controllers/kanoController';

export const kanoRouter = Router();

kanoRouter.get('/config', getKanoConfig);
