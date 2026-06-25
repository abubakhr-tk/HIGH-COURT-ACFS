import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

const CaseList = () => {
    const [cases, setCases] = useState<any[]>([]);

    useEffect(() => {
        api.get('/cases').then(res => setCases(res.data));
    }, []);

    return (
        <div className="page-card">
            <h1>Case List</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Case #</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Filing Date</th>
                    </tr>
                </thead>
                <tbody>
                    {cases.length ? cases.map(caseItem => (
                        <tr key={caseItem.id}>
                            <td><Link to={`/cases/${caseItem.id}`}>{caseItem.caseNumber}</Link></td>
                            <td>{caseItem.status}</td>
                            <td>{caseItem.priority}</td>
                            <td>{new Date(caseItem.filingDate).toLocaleDateString()}</td>
                        </tr>
                    )) : (
                        <tr><td colSpan={5}>No cases found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CaseList;
