// src/services/userService.js
import axios from 'axios';


export async function registerUser(userData) {
    try {
        const response = await axios.post(`/register`, userData);
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
