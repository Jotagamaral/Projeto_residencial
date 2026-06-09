import axios from 'axios';
import { alertErro } from '../utils/swal';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Adiciona o token JWT em toda requisição
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Trata 401 (token expirado/inválido) e força logout
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                await alertErro('Sessão expirada', 'Sua sessão expirou. Faça login novamente.');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
