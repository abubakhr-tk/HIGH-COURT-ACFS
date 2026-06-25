import { useEffect, useState } from 'react';
import { api } from '../api/client';

const Dashboard = () => {
    const [summary, setSummary] = useState<any[]>([]);
    const [workflow, setWorkflow] = useState<any>({ byCategory: [], assignments: [] });

    useEffect(() => {
        api.get('/analytics/case-summary').then(res => setSummary(res.data));
        api.get('/analytics/workflow-metrics').then(res => setWorkflow(res.data));
    }, []);

    return (
        <div className="page-card">
            <h1>Dashboard</h1>
            <section className="grid">
                <div className="page-card">
                    <h2>Case Summary</h2>
                    <table className="table">
                        <thead>
                            <tr><th>Status</th><th>Count</th></tr>
                        </thead>
                        <tbody>
                            {summary.map((item, idx) => (
                                <tr key={idx}><td>{item.status}</td><td>{item.count}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="page-card">
                    <h2>Workflow Metrics</h2>
                    <p><strong>By Category</strong></p>
                    <ul>{workflow.byCategory.map((item: any) => <li key={item.category}>{item.category}: {item.total}</li>)}</ul>
                    <p><strong>Assigned Cases</strong></p>
                    <ul>{workflow.assignments.map((item: any) => <li key={item.assignedTo || 'unassigned'}>{item.assignedTo || 'Unassigned'}: {item.total}</li>)}</ul>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
