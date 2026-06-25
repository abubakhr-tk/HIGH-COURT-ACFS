import Database from 'better-sqlite3';
import fs from 'fs';
import { join } from 'path';
import { hashPassword } from '../utils/password';
import { v4 as uuidv4 } from 'uuid';

const dataPath = join(__dirname, '../../data');
const uploadPath = join(__dirname, '../uploads');

if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
}
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const dbPath = process.env.DB_PATH || join(dataPath, 'kano-case-filing.db');
const db = new Database(dbPath);

const createUsers = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  department TEXT,
  password TEXT NOT NULL,
  createdAt TEXT NOT NULL
);
`;

const createCourts = `
CREATE TABLE IF NOT EXISTS courts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  location TEXT,
  contact TEXT,
  createdAt TEXT NOT NULL
);
`;

const createCases = `
CREATE TABLE IF NOT EXISTS cases (
  id TEXT PRIMARY KEY,
  caseNumber TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  category TEXT NOT NULL,
  assignedTo TEXT,
  courtId TEXT,
  filingDate TEXT NOT NULL,
  hearingDate TEXT,
  priority TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (assignedTo) REFERENCES users(id),
  FOREIGN KEY (courtId) REFERENCES courts(id)
);
`;

const createDocuments = `
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  caseId TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  uploadedBy TEXT NOT NULL,
  uploadedAt TEXT NOT NULL,
  fileUrl TEXT,
  notes TEXT,
  FOREIGN KEY (caseId) REFERENCES cases(id),
  FOREIGN KEY (uploadedBy) REFERENCES users(id)
);
`;

const createAuditLogs = `
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  entity TEXT NOT NULL,
  entityId TEXT NOT NULL,
  action TEXT NOT NULL,
  performedBy TEXT NOT NULL,
  performedAt TEXT NOT NULL,
  details TEXT,
  FOREIGN KEY (performedBy) REFERENCES users(id)
);
`;

const createTableWithAlter = (createStatement: string) => {
    db.exec(createStatement);
};

createTableWithAlter(createUsers);
createTableWithAlter(createCourts);
createTableWithAlter(createCases);
createTableWithAlter(createDocuments);
createTableWithAlter(createAuditLogs);

const hasPasswordColumn = db
    .prepare("PRAGMA table_info(users)")
    .all()
    .some((column: any) => column.name === 'password');

if (!hasPasswordColumn) {
    try {
        db.exec('ALTER TABLE users ADD COLUMN password TEXT NOT NULL DEFAULT ""');
    } catch (error) {
        console.warn('Could not add password column:', error);
    }
}

const hasUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
if (!hasUsers) {
    const adminId = uuidv4();
    const adminPassword = hashPassword('Admin123!');
    db.prepare(
        `INSERT INTO users (id, name, email, role, department, password, createdAt)
     VALUES (@id, @name, @email, @role, @department, @password, @createdAt)`
    ).run({
        id: adminId,
        name: 'Kano State Administrator',
        email: 'admin@kano.gov.ng',
        role: 'Admin',
        department: 'Registry',
        password: adminPassword,
        createdAt: new Date().toISOString()
    });
}

const hasCourts = db.prepare('SELECT COUNT(*) as count FROM courts').get().count;
if (!hasCourts) {
    const courts = [
        { name: 'High Court of Kano State', jurisdiction: 'Statewide', location: 'Kano', contact: '074-123-4567' },
        { name: 'Kano State Magistrate Court', jurisdiction: 'Local', location: 'Kano', contact: '074-123-4568' },
        { name: 'Kano State Sharia Court', jurisdiction: 'Religious', location: 'Kano', contact: '074-123-4569' }
    ];
    const stmt = db.prepare(
        `INSERT INTO courts (id, name, jurisdiction, location, contact, createdAt)
     VALUES (@id, @name, @jurisdiction, @location, @contact, @createdAt)`
    );
    for (const court of courts) {
        stmt.run({
            id: uuidv4(),
            name: court.name,
            jurisdiction: court.jurisdiction,
            location: court.location,
            contact: court.contact,
            createdAt: new Date().toISOString()
        });
    }
}

console.log(`Database initialized at ${dbPath}`);

export default db;
