import { CaseCategory, CasePriority, CaseStatus, DocumentStatus, DocumentType, UserRole } from './enums';

const caseStatuses: CaseStatus[] = ['New', 'Open', 'Under Review', 'Hearing Scheduled', 'Closed', 'Appealed'];
const casePriorities: CasePriority[] = ['Low', 'Medium', 'High', 'Critical'];
const caseCategories: CaseCategory[] = ['Civil', 'Criminal', 'Family', 'Labor', 'Regulatory', 'Others'];
const documentStatuses: DocumentStatus[] = ['Draft', 'Submitted', 'Approved', 'Rejected'];
const documentTypes: DocumentType[] = ['Petition', 'Affidavit', 'Exhibit', 'Response', 'Order'];
const userRoles: UserRole[] = ['Clerk', 'Judge', 'Attorney', 'Admin', 'Registry Officer'];

const ensureString = (value: unknown, field: string) => {
    if (typeof value !== 'string' || !value.trim()) {
        throw new Error(`${field} is required and must be a string`);
    }
};

export const validateCasePayload = (payload: any) => {
    ensureString(payload.caseNumber, 'caseNumber');
    ensureString(payload.title, 'title');
    ensureString(payload.status, 'status');
    ensureString(payload.category, 'category');
    ensureString(payload.priority, 'priority');
    ensureString(payload.filingDate, 'filingDate');

    if (!caseStatuses.includes(payload.status)) {
        throw new Error('Invalid case status');
    }
    if (!caseCategories.includes(payload.category)) {
        throw new Error('Invalid case category');
    }
    if (!casePriorities.includes(payload.priority)) {
        throw new Error('Invalid case priority');
    }
};

export const validateUserPayload = (payload: any) => {
    ensureString(payload.name, 'name');
    ensureString(payload.email, 'email');
    ensureString(payload.role, 'role');
    ensureString(payload.password, 'password');
    if (!userRoles.includes(payload.role)) {
        throw new Error('Invalid user role');
    }
};

export const validateCourtPayload = (payload: any) => {
    ensureString(payload.name, 'name');
    ensureString(payload.jurisdiction, 'jurisdiction');
};

export const validateDocumentPayload = (payload: any) => {
    ensureString(payload.caseId, 'caseId');
    ensureString(payload.title, 'title');
    ensureString(payload.type, 'type');
    ensureString(payload.status, 'status');
    ensureString(payload.uploadedBy, 'uploadedBy');
    if (!documentTypes.includes(payload.type)) {
        throw new Error('Invalid document type');
    }
    if (!documentStatuses.includes(payload.status)) {
        throw new Error('Invalid document status');
    }
};
