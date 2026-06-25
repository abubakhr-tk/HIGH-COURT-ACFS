import { useEffect, useState, FormEvent } from 'react';
import { api } from '../api/client';

const initialForm = {
    caseNumber: '',
    title: '',
    description: '',
    status: 'New',
    category: 'Civil',
    assignedTo: '',
    courtId: '',
    filingDate: new Date().toISOString().slice(0, 10),
    hearingDate: '',
    priority: 'Medium'
};

const CaseCreate = () => {
    const [form, setForm] = useState(initialForm);
    const [users, setUsers] = useState<any[]>([]);
    const [courts, setCourts] = useState<any[]>([]);
    const [kanoConfig, setKanoConfig] = useState<any>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get('/users').then(res => setUsers(res.data));
        api.get('/courts').then(res => setCourts(res.data));
        api.get('/kano/config').then(res => setKanoConfig(res.data));
    }, []);

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            await api.post('/cases', form);
            setMessage('Case created successfully.');
            setForm(initialForm);
        } catch (error: any) {
            setMessage(error?.response?.data?.message || 'Unable to create case');
        }
    };

    const suggestedCourts = kanoConfig?.categoryCourtMapping?.[form.category] || [];

    return (
        <div className="page-card">
            <h1>New Case Filing</h1>
            <form className="grid" onSubmit={handleSubmit}>
                <label>
                    Case Number
                    <input value={form.caseNumber} onChange={e => handleChange('caseNumber', e.target.value)} required />
                </label>
                <label>
                    Title
                    <input value={form.title} onChange={e => handleChange('title', e.target.value)} required />
                </label>
                <label>
                    Description
                    <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} rows={4} />
                </label>
                <label>
                    Status
                    <select value={form.status} onChange={e => handleChange('status', e.target.value)}>
                        <option value="New">New</option>
                        <option value="Open">Open</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Hearing Scheduled">Hearing Scheduled</option>
                        <option value="Closed">Closed</option>
                        <option value="Appealed">Appealed</option>
                    </select>
                </label>
                <label>
                    Category
                    <select value={form.category} onChange={e => handleChange('category', e.target.value)}>
                        <option value="Civil">Civil</option>
                        <option value="Criminal">Criminal</option>
                        <option value="Family">Family</option>
                        <option value="Labor">Labor</option>
                        <option value="Regulatory">Regulatory</option>
                        <option value="Others">Others</option>
                    </select>
                </label>
                <label>
                    Priority
                    <select value={form.priority} onChange={e => handleChange('priority', e.target.value)}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </select>
                </label>
                <label>
                    Assigned To
                    <select value={form.assignedTo} onChange={e => handleChange('assignedTo', e.target.value)}>
                        <option value="">Unassigned</option>
                        {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                    </select>
                </label>
                <label>
                    Court
                    <select value={form.courtId} onChange={e => handleChange('courtId', e.target.value)}>
                        <option value="">Select Court</option>
                        {courts.map(court => <option key={court.id} value={court.id}>{court.name}</option>)}
                    </select>
                </label>
                {suggestedCourts.length > 0 && (
                    <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', padding: 12, borderRadius: 10 }}>
                        <strong>Recommended court types for {form.category}:</strong>
                        <div>{suggestedCourts.join(', ')}</div>
                    </div>
                )}
                <label>
                    Filing Date
                    <input type="date" value={form.filingDate} onChange={e => handleChange('filingDate', e.target.value)} required />
                </label>
                <label>
                    Hearing Date
                    <input type="date" value={form.hearingDate} onChange={e => handleChange('hearingDate', e.target.value)} />
                </label>
                <button type="submit">Create Case</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CaseCreate;

