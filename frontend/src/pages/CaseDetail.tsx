import { useEffect, useState, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';

const CaseDetail = () => {
    const { id } = useParams();
    const [record, setRecord] = useState<any>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [docTitle, setDocTitle] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!id) return;
        api.get(`/cases/${id}/detail`).then(res => setRecord(res.data));
        api.get('/documents', { params: { caseId: id } }).then(res => setDocuments(res.data));
    }, [id]);

    const handleUpload = async (event: FormEvent) => {
        event.preventDefault();
        if (!id || !file) return;

        const formData = new FormData();
        formData.append('caseId', id);
        formData.append('title', docTitle || file.name);
        formData.append('type', 'Petition');
        formData.append('status', 'Submitted');
        formData.append('uploadedBy', record?.assignedTo || 'system');
        formData.append('file', file);

        try {
            const response = await api.post('/documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setDocuments(prev => [response.data, ...prev]);
            setMessage('Document uploaded successfully');
            setDocTitle('');
            setFile(null);
        } catch (err: any) {
            setMessage(err?.response?.data?.message || 'Upload failed');
        }
    };

    if (!record) {
        return <div className="page-card"><h1>Loading case...</h1></div>;
    }

    return (
        <div className="page-card">
            <h1>Case Details</h1>
            <div className="grid">
                <div>
                    <p><strong>Case Number:</strong> {record.caseNumber}</p>
                    <p><strong>Title:</strong> {record.title}</p>
                    <p><strong>Status:</strong> {record.status}</p>
                    <p><strong>Priority:</strong> {record.priority}</p>
                    <p><strong>Category:</strong> {record.category}</p>
                    <p><strong>Filing Date:</strong> {new Date(record.filingDate).toLocaleDateString()}</p>
                    <p><strong>Hearing Date:</strong> {record.hearingDate ? new Date(record.hearingDate).toLocaleDateString() : 'Not scheduled'}</p>
                    <p><strong>Assigned To:</strong> {record.assignedToName || 'Unassigned'}</p>
                    <p><strong>Court:</strong> {record.courtName || 'Not assigned'}</p>
                </div>
                <div>
                    <p><strong>Case Description</strong></p>
                    <p>{record.description || 'No description provided.'}</p>
                </div>
            </div>

            <div className="page-card">
                <h2>Documents</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Uploaded At</th>
                            <th>File</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map(doc => (
                            <tr key={doc.id}>
                                <td>{doc.title}</td>
                                <td>{doc.type}</td>
                                <td>{doc.status}</td>
                                <td>{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                                <td>{doc.fileUrl ? <a target="_blank" rel="noreferrer" href={doc.fileUrl}>Download</a> : 'None'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="page-card">
                <h2>Upload a Document</h2>
                <form className="grid" onSubmit={handleUpload}>
                    <label>
                        Document Title
                        <input value={docTitle} onChange={e => setDocTitle(e.target.value)} placeholder="Optional title" />
                    </label>
                    <label>
                        File
                        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} required />
                    </label>
                    <button type="submit">Upload</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default CaseDetail;
