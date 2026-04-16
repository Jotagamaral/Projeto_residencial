// src/services/userService.js
import api from './api';

const urlAuth = '/auth';

// ---------------- LOGIN ----------------

export async function loginUser(cpf, senha) {
    try {
        const response = await api.post(`${urlAuth}/login`, { cpf, senha });
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
        console.error(`[userService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

// ---------------- REGISTER ----------------

export async function registerUser(userData) {
    try {
        const response = await api.post(`${urlAuth}/register`, userData);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao realizar o cadastro. Tente novamente.';
        console.error(`[userService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}