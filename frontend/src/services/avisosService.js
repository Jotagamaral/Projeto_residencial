// services/avisosService.js
import api from './api';


export async function buscarAvisos() {
    try {
        const response = await api.get(`/avisos`);
        console.log("Dados recebidos:", response.data); // Log dos dados recebidos
        return response.data
    } catch (error) {
        console.error("Erro ao buscar avisos:", error);
        throw error; // repassa o erro para quem chamou lidar
    }
}

export async function publicarAviso(avisoData) {
    try {
        const response = await api.post(`/avisos`, avisoData);
        console.log("[avisosService] Aviso publicado:", response.status);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("[avisosService] Erro ao publicar aviso:", error);
        throw error;
    }
}