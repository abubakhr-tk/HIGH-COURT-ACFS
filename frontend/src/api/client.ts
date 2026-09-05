import axios from 'axios';
import { getToken } from '../utils/auth';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://acfs-591h.onrender.com/api',
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
    const token = getToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
