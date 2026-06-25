import { Router } from 'express';
import multer from 'multer';
import { createDocument, getDocuments, getDocumentById } from '../controllers/documentsController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const upload = multer({ dest: 'uploads/' });

export const documentsRouter = Router();

documentsRouter.get('/', authenticateToken, getDocuments);
documentsRouter.get('/:id', authenticateToken, getDocumentById);
documentsRouter.post('/', authenticateToken, authorizeRoles('Admin', 'Clerk', 'Attorney', 'Registry Officer'), upload.single('file'), createDocument);
