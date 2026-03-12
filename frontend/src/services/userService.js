// src/services/userService.js
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// LOGIN
export async function loginUser(cpf, senha) {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { cpf, senha });
        console.log(response.data)
        return response.data; // Retorna { token, user }
    } catch (error) {
        console.error("Erro na requisição de login:", error);
        const message = error.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais.";
        throw new Error(message);
    }
}

// REGISTER
export async function registerUser(userData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, userData);
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

// Função para validar CPF via API externa
export async function validarCpfApi(cpf) {
    try {
        // Validação de CPF será feita no Backend
        const response = await axios.get(`${API_BASE_URL}/valida-cpf?cpf=${cpf}`);
        return response.data.valido; // true ou false
    } catch (error) {
        console.error("Erro na validação de CPF:", error);
        throw new Error("Erro ao validar CPF. Tente novamente.");
    }
}
