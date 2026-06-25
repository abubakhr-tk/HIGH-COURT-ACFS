import { v4 as uuidv4 } from 'uuid';
import db from './db';
import { CaseRecord, CaseSearchParams, CaseUpdatePayload } from '../utils/enums';

export const listCases = (filter: CaseSearchParams = {}) => {
    const conditions: string[] = [];
    const params: any = {};

    if (filter.status) {
        conditions.push('status = @status');
        params.status = filter.status;
    }
    if (filter.category) {
        conditions.push('category = @category');
        params.category = filter.category;
    }
    if (filter.assignedTo) {
        conditions.push('assignedTo = @assignedTo');
        params.assignedTo = filter.assignedTo;
    }
    if (filter.courtId) {
        conditions.push('courtId = @courtId');
        params.courtId = filter.courtId;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const stmt = db.prepare(`SELECT * FROM cases ${whereClause} ORDER BY filingDate DESC`);
    return stmt.all(params) as CaseRecord[];
};

export const getCaseById = (id: string) => {
    const stmt = db.prepare('SELECT * FROM cases WHERE id = ?');
    return stmt.get(id) as CaseRecord | undefined;
};

export const getCaseByNumber = (caseNumber: string) => {
    const stmt = db.prepare('SELECT * FROM cases WHERE caseNumber = ?');
    return stmt.get(caseNumber) as CaseRecord | undefined;
};

export const getCaseDetailById = (id: string) => {
    const stmt = db.prepare(
        `SELECT
        cases.*, 
        users.name AS assignedToName,
        users.email AS assignedToEmail,
        courts.name AS courtName,
        courts.jurisdiction AS courtJurisdiction
      FROM cases
      LEFT JOIN users ON cases.assignedTo = users.id
      LEFT JOIN courts ON cases.courtId = courts.id
      WHERE cases.id = ?`
    );
    return stmt.get(id) as any;
};

export const createCase = (payload: Omit<CaseRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const id = uuidv4();
    const stmt = db.prepare(
        `INSERT INTO cases (id, caseNumber, title, description, status, category, assignedTo, courtId, filingDate, hearingDate, priority, createdAt, updatedAt)
     VALUES (@id, @caseNumber, @title, @description, @status, @category, @assignedTo, @courtId, @filingDate, @hearingDate, @priority, @createdAt, @updatedAt)`
    );

    stmt.run({
        id,
        caseNumber: payload.caseNumber,
        title: payload.title,
        description: payload.description || '',
        status: payload.status,
        category: payload.category,
        assignedTo: payload.assignedTo || null,
        courtId: payload.courtId || null,
        filingDate: payload.filingDate,
        hearingDate: payload.hearingDate || null,
        priority: payload.priority,
        createdAt: now,
        updatedAt: now
    });

    return getCaseById(id);
};

export const updateCase = (id: string, payload: CaseUpdatePayload) => {
    const existing = getCaseById(id);
    if (!existing) return null;

    const updated = {
        ...existing,
        ...payload,
        updatedAt: new Date().toISOString()
    } as CaseRecord;

    const stmt = db.prepare(
        `UPDATE cases SET
      title = @title,
      description = @description,
      status = @status,
      category = @category,
      assignedTo = @assignedTo,
      courtId = @courtId,
      hearingDate = @hearingDate,
      priority = @priority,
      updatedAt = @updatedAt
     WHERE id = @id`
    );

    stmt.run({
        id,
        title: updated.title,
        description: updated.description,
        status: updated.status,
        category: updated.category,
        assignedTo: updated.assignedTo,
        courtId: updated.courtId,
        hearingDate: updated.hearingDate,
        priority: updated.priority,
        updatedAt: updated.updatedAt
    });

    return getCaseById(id);
};
