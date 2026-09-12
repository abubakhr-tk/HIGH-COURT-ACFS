import express from 'express';
import cors from 'cors';
import { authRouter as authRoutes } from './routes/auth';
import { casesRouter as casesRoutes } from './routes/cases';
import { courtsRouter as courtsRoutes } from './routes/courts';
import { documentsRouter as documentsRoutes } from './routes/documents';
import { usersRouter as usersRoutes } from './routes/users';
import { analyticsRouter as analyticsRoutes } from './routes/analytics';
import { kanoRouter as kanoRoutes } from './routes/kano';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({
  origin: [
    'https://high-court-acfs.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/courts', courtsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/kano', kanoRoutes);

app.use(errorHandler);

export default app;
