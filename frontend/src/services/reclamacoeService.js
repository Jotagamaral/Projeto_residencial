// services/reclamacoesService.js
import api from './api';

export async function buscarReclamacoes() {
    try {
        const response = await api.get(`/Reclamacao/todas-reclamacoes`);
        return response.data
    } catch (error) {
        console.error("[reclamacoeService] Erro ao buscar reclamacoes:", error);
        throw error;
    }
}

export async function buscarReclamacoesFuncionario() {
    try {
        const response = await api.get(`/Reclamacao/admin-reclamacoes`);
        return response.data
    } catch (error) {
        console.error("[reclamacoeService] Erro ao buscar reclamacoes:", error);
        throw error;
    }
}


export async function publicarReclamacao(reclamacoesData) {
    try {
        const response = await api.post(`/Reclamacao/criar-reclamacao`, reclamacoesData);
        console.log("[reclamacoeService] Reclamação publicada: ", response.status);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("[reclamacoeService] Erro ao publicar reclamações: ", error);
        console.log(reclamacoesData)
        throw error;
    }
}
