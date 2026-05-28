// services/dominioService.js
import api from './api';

const urlDominios = '/dominios';

/**
 * Busca a lista de status de encomendas.
 * Endpoint: GET /api/dominios/status/encomendas
 */
export async function buscarStatusEncomendas() {
    try {
        const response = await api.get(`${urlDominios}/status/encomendas`);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao buscar status de encomendas.';
        console.error(`[dominioService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

/**
 * Busca a lista de status de reclamações.
 * Endpoint: GET /api/dominios/status/reclamacoes
 */
export async function buscarStatusReclamacoes() {
    try {
        const response = await api.get(`${urlDominios}/status/reclamacoes`);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao buscar status de reclamações.';
        console.error(`[dominioService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

/**
 * Busca a lista de status de reservas.
 * Endpoint: GET /api/dominios/status/reservas
 */
export async function buscarStatusReservas() {
    try {
        const response = await api.get(`${urlDominios}/status/reservas`);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao buscar status de reservas.';
        console.error(`[dominioService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}
