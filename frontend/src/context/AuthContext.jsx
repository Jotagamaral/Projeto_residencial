import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/userService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('jwtToken'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const navigate = useNavigate();

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            config => {
                if (token) config.headers.Authorization = `Bearer ${token}`;
                return config;
            },
            error => Promise.reject(error)
        );

        const responseInterceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) logout();
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [token]);

    const login = async (cpf, senha) => {
        try {
            const data = await loginUser(cpf, senha);
            const { token: jwt, user: userData } = data;

            localStorage.setItem('jwtToken', jwt);
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(jwt);
            setUser(userData);
            setIsAuthenticated(true);
            
            navigate('/home');
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);