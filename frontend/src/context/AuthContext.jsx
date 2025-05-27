import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// Configurar a base URL do Axios
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.baseURL = API_BASE_URL;

export const AuthProvider = ({ children }) => {

const [token, setToken] = useState(localStorage.getItem('jwtToken'));
const [isAuthenticated, setIsAuthenticated] = useState(!!token);

const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
const navigate = useNavigate();

useEffect(() => {
    // Interceptador de requisição para adicionar o token
    const requestInterceptor = axios.interceptors.request.use(
    config => {
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
    );

    // Erros de autenticação
    const responseInterceptor = axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
        console.error("Sessão expirada ou não autorizada. Deslogando...");
        logout();
        }
        return Promise.reject(error);
    }
    );

    return () => {
    axios.interceptors.request.eject(requestInterceptor);
    axios.interceptors.response.eject(responseInterceptor);
    };
}, [token, navigate]);

// Função de login
const login = async (cpf, senha) => {
    try {
    const response = await axios.post('/login', { cpf, senha });
    const { jwt, user: userDataFromBackend } = response.data;

    localStorage.setItem('jwtToken', jwt);
    localStorage.setItem('user', JSON.stringify(userDataFromBackend));

    setToken(jwt);
    setIsAuthenticated(true);
    setUser(userDataFromBackend);
    console.log("Usuário logado com sucesso:", userDataFromBackend);
    navigate('/');
    } catch (error) {
    console.error("Erro no AuthContext login:", error);
    if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
    } else {
        throw new Error("Erro ao fazer login. Verifique suas credenciais.");
    }
    }
};

// Função de logout
const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);

    console.log("Usuário deslogado com sucesso.");
    navigate('/login');
};

return (
    <AuthContext.Provider value={{ token, isAuthenticated, user, login, logout, axiosInstance: axios }}>
    {children}
    </AuthContext.Provider>
);
};

export const useAuth = () => {
return useContext(AuthContext);
};