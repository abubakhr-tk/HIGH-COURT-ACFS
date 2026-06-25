import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { setAuth } from '../utils/auth';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            setAuth(response.data);
            navigate('/');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to login');
        }
    };

    return (
        <div className="page-card" style={{ maxWidth: 420 }}>
            <h1>Login</h1>
            <form className="grid" onSubmit={handleSubmit}>
                <label>
                    Email
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
                </label>
                <label>
                    Password
                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
                </label>
                <button type="submit">Sign in</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;
