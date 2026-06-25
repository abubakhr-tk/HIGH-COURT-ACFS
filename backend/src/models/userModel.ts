import { v4 as uuidv4 } from 'uuid';
import db from './db';
import { UserRecord, UserUpdatePayload } from '../utils/enums';
import { hashPassword } from '../utils/password';

export const listUsers = () => {
    const stmt = db.prepare('SELECT id, name, email, role, department, createdAt FROM users ORDER BY name');
    return stmt.all() as Omit<UserRecord, 'password'>[];
};

export const getUserById = (id: string) => {
    const stmt = db.prepare('SELECT id, name, email, role, department, createdAt FROM users WHERE id = ?');
    return stmt.get(id) as Omit<UserRecord, 'password'> | undefined;
};

export const getUserRecordById = (id: string) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as UserRecord | undefined;
};

export const getUserByEmail = (email: string) => {
    const stmt = db.prepare('SELECT id, name, email, role, department, createdAt FROM users WHERE email = ?');
    return stmt.get(email) as Omit<UserRecord, 'password'> | undefined;
};

export const getUserWithPasswordByEmail = (email: string) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as UserRecord | undefined;
};

export const createUser = (payload: Omit<UserRecord, 'id' | 'createdAt'>) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const stmt = db.prepare(
        `INSERT INTO users (id, name, email, role, department, password, createdAt)
     VALUES (@id, @name, @email, @role, @department, @password, @createdAt)`
    );

    stmt.run({
        id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        department: payload.department || '',
        password: hashPassword(payload.password),
        createdAt: now
    });

    return getUserById(id);
};

export const updateUser = (id: string, payload: UserUpdatePayload) => {
    const existing = getUserRecordById(id);
    if (!existing) return null;

    const updated = {
        ...existing,
        ...payload
    } as UserRecord;

    const stmt = db.prepare(
        `UPDATE users SET name = @name, role = @role, department = @department WHERE id = @id`
    );
    stmt.run({ id, name: updated.name, role: updated.role, department: updated.department || '' });
    return getUserById(id);
};
