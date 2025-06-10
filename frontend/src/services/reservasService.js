// services/reservaService.js
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export async function buscarReservas() {
    try {
        const response = await axios.get(`${API_BASE_URL}/reservas`);
        console.log("Dados recebidos:", response.data); // Log dos dados recebidos
        return response.data
    } catch (error) {
        console.error("Erro ao buscar reservas:", error);
        throw error; // repassa o erro para quem chamou lidar
    }
}

export async function buscarLocais() {
    try {
        const response = await axios.get(`${API_BASE_URL}/locais`);
        console.log("Locais recebidos:", response.data); // Log dos locais recebidos
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar locais:", error);
        throw error; // repassa o erro para quem chamou lidar
    }
}

export async function publicarReserva(reservaData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/reservas`, reservaData);
        console.log("[reservasService] Reserva publicada:", response.status);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("[reservasService] Erro ao publicar reserva:", error);
        throw error;
    }
}