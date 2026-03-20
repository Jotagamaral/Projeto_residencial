import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function buscarReservas() {
    try {
        const response = await axios.get(`${API_BASE_URL}/Reserva`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar reservas:', error);
        throw error;
    }
}

export async function buscarLocais() {
    try {
        const response = await axios.get(`${API_BASE_URL}/Local`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar locais:', error);
        throw error;
    }
}

export async function publicarReserva(reservaData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/Reserva`, reservaData);
        return response.data;
    } catch (error) {
        console.error('Erro ao publicar reserva:', error);
        throw error;
    }
}