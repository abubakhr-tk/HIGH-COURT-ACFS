import { v4 as uuidv4 } from 'uuid';
import db from './db';
import { AuditLogRecord } from '../utils/enums';

export const recordAuditLog = (payload: Omit<AuditLogRecord, 'id' | 'performedAt'>) => {
    const id = uuidv4();
    const performedAt = new Date().toISOString();
    const stmt = db.prepare(
        `INSERT INTO audit_logs (id, entity, entityId, action, performedBy, performedAt, details)
     VALUES (@id, @entity, @entityId, @action, @performedBy, @performedAt, @details)`
    );

    stmt.run({
        id,
        entity: payload.entity,
        entityId: payload.entityId,
        action: payload.action,
        performedBy: payload.performedBy,
        performedAt,
        details: payload.details || ''
    });
};
