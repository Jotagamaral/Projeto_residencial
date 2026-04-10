// services/reservasService.js
import api from './api';

const urlReservas = '/reservas';

// ---------------- READ ----------------

export async function buscarReservasCalendario() {
    try {
        const response = await api.get(`${urlReservas}/calendario`);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao carregar o calendário de ocupações.';
        console.error(`[reservasService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

export async function buscarMinhasReservas() {
    try {
        const response = await api.get(`${urlReservas}/minhas`);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao buscar suas reservas.';
        console.error(`[reservasService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

export async function buscarTodasReservasAdmin() {
    try {
        const response = await api.get(urlReservas);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao carregar reservas gerenciais.';
        console.error(`[reservasService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

// ---------------- CREATE ----------------

export async function criarReserva(reservaData) {
    try {
        const response = await api.post(urlReservas, reservaData);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao confirmar a reserva.';
        console.error(`[reservasService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

export async function criarReservaAdmin(reservaData) {
    try {
        const response = await api.post(`${urlReservas}/admin`, reservaData);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro gerencial ao criar reserva.';
        console.error(`[reservasService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

// ---------------- UPDATE ----------------

export async function atualizarReserva(id, reservaData) {
    try {
        const response = await api.put(`${urlReservas}/${id}`, reservaData);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao atualizar dados da reserva.';
        console.error(`[reservasService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

export async function atualizarReservaAdmin(id, reservaData) {
    try {
        const response = await api.put(`${urlReservas}/${id}/admin`, reservaData);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro gerencial ao atualizar reserva.';
        console.error(`[reservasService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

// ---------------- DELETE ----------------

export async function cancelarReserva(id) {
    try {
        const response = await api.delete(`${urlReservas}/${id}`);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao cancelar a reserva.';
        console.error(`[reservasService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

export async function cancelarReservaAdmin(id) {
    try {
        const response = await api.delete(`${urlReservas}/${id}/admin`);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro gerencial ao cancelar reserva.';
        console.error(`[reservasService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}