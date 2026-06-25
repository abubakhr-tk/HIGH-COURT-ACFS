import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CaseList from './pages/CaseList';
import CaseCreate from './pages/CaseCreate';
import CaseDetail from './pages/CaseDetail';
import Users from './pages/Users';
import Login from './pages/Login';
import RequireAuth from './components/RequireAuth';
import { getAuthUser, clearAuth } from './utils/auth';

const App = () => {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setUser(getAuthUser());
    }, []);

    const handleLogout = () => {
        clearAuth();
        setUser(null);
        navigate('/login');
    };

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="brand">Kano Case Filing</div>
                <nav>
                    <Link to="/">Dashboard</Link>
                    <Link to="/cases">Cases</Link>
                    <Link to="/cases/new">New Case</Link>
                    <Link to="/users">Users</Link>
                    {!user ? <Link to="/login">Login</Link> : <button onClick={handleLogout}>Logout</button>}
                </nav>
                {user && (
                    <div style={{ marginTop: 24, fontSize: 14 }}>
                        <p>Signed in as</p>
                        <p><strong>{user.name}</strong></p>
                        <p>{user.role}</p>
                    </div>
                )}
            </aside>
            <main className="content">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
                    <Route path="/cases" element={<RequireAuth><CaseList /></RequireAuth>} />
                    <Route path="/cases/new" element={<RequireAuth><CaseCreate /></RequireAuth>} />
                    <Route path="/cases/:id" element={<RequireAuth><CaseDetail /></RequireAuth>} />
                    <Route path="/users" element={<RequireAuth><Users /></RequireAuth>} />
                </Routes>
            </main>
        </div>
    );
};

export default App;
