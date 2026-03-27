import api from './api';

export async function buscarReservas() {
    try {
        const response = await api.get(`/Reserva/todas-reservas`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar reservas:', error);
        throw error;
    }
}

export async function buscarMinhasReservas() {
    try {
        const response = await api.get(`/Reserva/minhas-reservas`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar reservas:', error);
        throw error;
    }
}

export async function buscarLocais() {
    try {
        const response = await api.get(`/Local`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar locais:', error);
        throw error;
    }
}

export async function publicarReserva(reservaData) {
    try {
        const response = await api.post(`/Reserva/criar-reservas`, reservaData);
        return response.data;
    } catch (error) {
        // console.error('Erro ao publicar reserva:', error);
        console.warn('Falha na reserva:', error.response?.data?.message || error.message);
        throw error;
    }
}