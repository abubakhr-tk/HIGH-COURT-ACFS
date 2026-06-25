export type CaseStatus = 'New' | 'Open' | 'Under Review' | 'Hearing Scheduled' | 'Closed' | 'Appealed';
export type CasePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type CaseCategory = 'Civil' | 'Criminal' | 'Family' | 'Labor' | 'Regulatory' | 'Others';
export type DocumentStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
export type DocumentType = 'Petition' | 'Affidavit' | 'Exhibit' | 'Response' | 'Order';
export type UserRole = 'Clerk' | 'Judge' | 'Attorney' | 'Admin' | 'Registry Officer';

export interface CaseRecord {
    id: string;
    caseNumber: string;
    title: string;
    description: string;
    status: CaseStatus;
    category: CaseCategory;
    assignedTo: string | null;
    courtId: string | null;
    filingDate: string;
    hearingDate: string | null;
    priority: CasePriority;
    createdAt: string;
    updatedAt: string;
}

export interface CaseSearchParams {
    status?: CaseStatus;
    category?: CaseCategory;
    assignedTo?: string;
    courtId?: string;
}

export type CaseUpdatePayload = Partial<Pick<CaseRecord, 'title' | 'description' | 'status' | 'category' | 'assignedTo' | 'courtId' | 'hearingDate' | 'priority'>>;

export interface UserRecord {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    department: string;
    password: string;
    createdAt: string;
}

export interface UserUpdatePayload {
    name: string;
    role: UserRole;
    department?: string;
}

export interface CourtRecord {
    id: string;
    name: string;
    jurisdiction: string;
    location: string;
    contact: string;
    createdAt: string;
}

export interface CourtUpdatePayload {
    name: string;
    jurisdiction: string;
    location?: string;
    contact?: string;
}

export interface DocumentRecord {
    id: string;
    caseId: string;
    title: string;
    type: DocumentType;
    status: DocumentStatus;
    uploadedBy: string;
    uploadedAt: string;
    fileUrl: string;
    notes: string;
}

export interface DocumentCreatePayload {
    caseId: string;
    title: string;
    type: DocumentType;
    status: DocumentStatus;
    uploadedBy: string;
    fileUrl?: string;
    notes?: string;
}

export interface AuditLogRecord {
    id: string;
    entity: string;
    entityId: string;
    action: string;
    performedBy: string;
    performedAt: string;
    details: string;
}
