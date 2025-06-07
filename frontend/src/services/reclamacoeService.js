// services/reclamacoesService.js
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export async function buscarReclamacoes() {
    try {
        const response = await axios.get(`${API_BASE_URL}/reclamacoes`);
        console.log("[reclamacoeService] Dados recebidos:", response.data);
        return response.data
    } catch (error) {
        console.error("[reclamacoeService] Erro ao buscar reclamacoes:", error);
        throw error; // repassa o erro para quem chamou lidar
    }
}

export async function publicarReclamacao(reclamacoesData) {

    try {
        const response = await axios.post(`${API_BASE_URL}/reclamacoes`, reclamacoesData);
        console.log("[reclamacoeService] Reclamação publicada: ", response.status)
        console.log(response.data) 
        
    } catch (error) {
        console.log("[reclamacoeService] Erro ao publicar reclamações: ", error)
    }
    
}
