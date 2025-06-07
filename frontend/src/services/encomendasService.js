// services/encomendasService.js
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export async function buscarEncomendas() {
    try {
        const response = await axios.get(`${API_BASE_URL}/encomendas`);
        console.log("[encomendasService.js] Dados recebidos:", response.data); // Log dos dados recebidos
        return response.data
    } catch (error) {
        console.error("[encomendasService.js] Erro ao buscar encomendas:", error);
        throw error; // repassa o erro para quem chamou lidar
    }
}


export async function publicarEncomenda(encomendaData) {

    try {
        const response =  await axios.post(`${API_BASE_URL}/encomendas`, encomendaData)
        console.log("[encomendasService.js] Encomenda criada: ", response.status),
        console.log(response.data)

    } catch (error) {
        console.error("[encomendasService.js] Erro ao cadastrar encomenda: ", error)
    }
}


export async function buscarMoradores() {
    try {
        const response = await axios.get(`${API_BASE_URL}/moradores`);
        console.log("[encomendasService.js] Dados recebidos:", response.data); // Log dos dados recebidos
        return response.data
    } catch (error) {
        console.error("[encomendasService.js] Erro ao buscar moraroes:", error);
        throw error; // repassa o erro para quem chamou lidar
    }
}
