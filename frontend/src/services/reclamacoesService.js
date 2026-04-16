// services/reclamacoesService.js
import api from './api';

const urlReclamacoes = '/reclamacoes';

// ---------------- READ ----------------

export async function buscarReclamacoesPublicas() {
    try {
        const response = await api.get(`${urlReclamacoes}/publicas`);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || "Erro ao buscar mural de reclamações.";
        console.error(`[reclamacoesService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

export async function buscarReclamacoesAdmin() {
    try {
        const response = await api.get(urlReclamacoes);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || "Erro ao buscar reclamações para gestão.";
        console.error(`[reclamacoesService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

export async function buscarMinhasReclamacoes() {
    try {
        const response = await api.get(`${urlReclamacoes}/minhas`);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || "Erro ao buscar suas reclamações.";
        console.error(`[reclamacoesService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

// ---------------- CREATE ----------------

export async function criarReclamacao(reclamacaoData) {
    try {
        const response = await api.post(urlReclamacoes, reclamacaoData);   
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || "Erro ao registrar nova reclamação.";
        console.error(`[reclamacoesService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

// ---------------- UPDATE ----------------

export async function atualizarReclamacao(id, reclamacaoData) {
    try {
        const response = await api.put(`${urlReclamacoes}/${id}`, reclamacaoData);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || "Erro ao atualizar a reclamação.";
        console.error(`[reclamacoesService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

export async function atualizarReclamacaoAdmin(id, adminReclamacaoData) {
    try {
        const response = await api.put(`${urlReclamacoes}/${id}/admin`, adminReclamacaoData);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || "Erro gerencial ao atualizar reclamação.";
        console.error(`[reclamacoesService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

// ---------------- DELETE ----------------

export async function deletarReclamacao(id) {
    try {
        const response = await api.delete(`${urlReclamacoes}/${id}`);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || "Erro ao cancelar a reclamação.";
        console.error(`[reclamacoesService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

export async function deletarReclamacaoAdmin(id) {
    try {
        const response = await api.delete(`${urlReclamacoes}/${id}/admin`);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || "Erro gerencial ao inativar reclamação.";
        console.error(`[reclamacoesService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}