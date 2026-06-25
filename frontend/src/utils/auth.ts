export const getToken = () => localStorage.getItem('kano_token');
export const getAuthUser = () => {
    const data = localStorage.getItem('kano_user');
    return data ? JSON.parse(data) : null;
};

export const setAuth = ({ token, user }: { token: string; user: any }) => {
    localStorage.setItem('kano_token', token);
    localStorage.setItem('kano_user', JSON.stringify(user));
};

export const clearAuth = () => {
    localStorage.removeItem('kano_token');
    localStorage.removeItem('kano_user');
};
