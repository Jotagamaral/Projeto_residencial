// services/reclamacoesService.js
import api from './api';


export async function buscarReclamacoes() {
    try {
        const response = await api.get(`/reclamacoes`);
        console.log("[reclamacoeService] Dados recebidos:", response.data);
        return response.data
    } catch (error) {
        console.error("[reclamacoeService] Erro ao buscar reclamacoes:", error);
        throw error; // repassa o erro para quem chamou lidar
    }
}

export async function publicarReclamacao(reclamacoesData) {
    try {
        const response = await api.post(`/reclamacoes`, reclamacoesData);
        console.log("[reclamacoeService] Reclamação publicada: ", response.status);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("[reclamacoeService] Erro ao publicar reclamações: ", error);
        throw error;
    }
}
