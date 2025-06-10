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
