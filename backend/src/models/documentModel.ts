import { v4 as uuidv4 } from 'uuid';
import db from './db';
import { DocumentRecord, DocumentCreatePayload } from '../utils/enums';

export const listDocuments = (caseId?: string) => {
    const stmt = caseId
        ? db.prepare('SELECT * FROM documents WHERE caseId = ? ORDER BY uploadedAt DESC')
        : db.prepare('SELECT * FROM documents ORDER BY uploadedAt DESC');
    return caseId ? stmt.all(caseId) as DocumentRecord[] : stmt.all() as DocumentRecord[];
};

export const getDocumentById = (id: string) => {
    const stmt = db.prepare('SELECT * FROM documents WHERE id = ?');
    return stmt.get(id) as DocumentRecord | undefined;
};

export const createDocument = (payload: DocumentCreatePayload) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const stmt = db.prepare(
        `INSERT INTO documents (id, caseId, title, type, status, uploadedBy, uploadedAt, fileUrl, notes)
     VALUES (@id, @caseId, @title, @type, @status, @uploadedBy, @uploadedAt, @fileUrl, @notes)`
    );
    stmt.run({
        id,
        caseId: payload.caseId,
        title: payload.title,
        type: payload.type,
        status: payload.status,
        uploadedBy: payload.uploadedBy,
        uploadedAt: now,
        fileUrl: payload.fileUrl || '',
        notes: payload.notes || ''
    });

    return getDocumentById(id);
};
