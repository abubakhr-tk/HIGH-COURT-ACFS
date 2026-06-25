import { useEffect, useState } from 'react';
import { api } from '../api/client';

const Users = () => {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        api.get('/users').then(res => setUsers(res.data));
    }, []);

    return (
        <div className="page-card">
            <h1>Users</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Department</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length ? users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.department}</td>
                        </tr>
                    )) : (
                        <tr><td colSpan={4}>No users available.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
