// src/services/userService.js
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// LOGIN
export async function loginUser(cpf, senha) {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, { cpf, senha });
        return response.data;
    } catch (error) {
        console.error('Erro na requisição de login:', error);
        const message = error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
        throw new Error(message);
    }
}

// REGISTER
export async function registerUser(userData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        console.error("Erro na requisição de cadastro:", error);

        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("Erro ao fazer cadastro. Tente novamente.");
        }
    }
}
