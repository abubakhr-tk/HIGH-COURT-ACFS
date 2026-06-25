import { v4 as uuidv4 } from 'uuid';
import db from './db';
import { CourtRecord, CourtUpdatePayload } from '../utils/enums';

export const listCourts = () => {
    const stmt = db.prepare('SELECT * FROM courts ORDER BY name');
    return stmt.all() as CourtRecord[];
};

export const getCourtById = (id: string) => {
    const stmt = db.prepare('SELECT * FROM courts WHERE id = ?');
    return stmt.get(id) as CourtRecord | undefined;
};

export const createCourt = (payload: Omit<CourtRecord, 'id' | 'createdAt'>) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const stmt = db.prepare(
        `INSERT INTO courts (id, name, jurisdiction, location, contact, createdAt)
     VALUES (@id, @name, @jurisdiction, @location, @contact, @createdAt)`
    );

    stmt.run({
        id,
        name: payload.name,
        jurisdiction: payload.jurisdiction,
        location: payload.location || '',
        contact: payload.contact || '',
        createdAt: now
    });

    return getCourtById(id);
};

export const updateCourt = (id: string, payload: CourtUpdatePayload) => {
    const existing = getCourtById(id);
    if (!existing) return null;

    const updated = {
        ...existing,
        ...payload
    } as CourtRecord;
    const stmt = db.prepare(
        `UPDATE courts SET name = @name, jurisdiction = @jurisdiction, location = @location, contact = @contact WHERE id = @id`
    );
    stmt.run({
        id,
        name: updated.name,
        jurisdiction: updated.jurisdiction,
        location: updated.location || '',
        contact: updated.contact || ''
    });

    return getCourtById(id);
};
