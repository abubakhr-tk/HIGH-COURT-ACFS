import { Request, Response, NextFunction } from 'express';
import { createDocument as createDocumentModel, getDocumentById as getDocumentByIdModel, listDocuments as listDocumentsModel } from '../models/documentModel';
import { recordAuditLog } from '../models/auditLogModel';
import { validateDocumentPayload } from '../utils/validation';

export const getDocuments = (req: Request, res: Response, next: NextFunction) => {
    try {
        const documents = listDocumentsModel(req.query.caseId as string | undefined);
        res.json(documents);
    } catch (error) {
        next(error);
    }
};

export const getDocumentById = (req: Request, res: Response, next: NextFunction) => {
    try {
        const document = getDocumentByIdModel(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json(document);
    } catch (error) {
        next(error);
    }
};

export const createDocument = (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = {
            ...req.body,
            fileUrl: req.file ? `/uploads/${req.file.filename}` : req.body.fileUrl
        };
        validateDocumentPayload(payload);
        const created = createDocumentModel(payload);
        recordAuditLog({
            entity: 'document',
            entityId: created?.id || 'unknown',
            action: 'created',
            performedBy: req.user?.id || payload.uploadedBy,
            details: `Document uploaded for case ${payload.caseId}`
        });
        res.status(201).json(created);
    } catch (error) {
        next(error);
    }
};
