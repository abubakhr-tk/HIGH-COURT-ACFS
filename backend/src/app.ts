import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { join } from 'path';
import { casesRouter } from './routes/cases';
import { usersRouter } from './routes/users';
import { courtsRouter } from './routes/courts';
import { documentsRouter } from './routes/documents';
import { analyticsRouter } from './routes/analytics';
import { authRouter } from './routes/auth';
import { kanoRouter } from './routes/kano';
import { errorHandler } from './middleware/errorHandler';
import './models/db';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(join(__dirname, '../uploads')));

app.use('/api/auth', authRouter);
app.use('/api/cases', casesRouter);
app.use('/api/users', usersRouter);
app.use('/api/courts', courtsRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/kano', kanoRouter);

app.get('/api/health', (_req, res) => {
    app.use(errorHandler);

    export default app;
