// services/avisosService.js
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export async function buscarAvisos() {
    try {
        const response = await axios.get(`${API_BASE_URL}/avisos`);
        console.log("Dados recebidos:", response.data); // Log dos dados recebidos
        return response.data
    } catch (error) {
        console.error("Erro ao buscar avisos:", error);
        throw error; // repassa o erro para quem chamou lidar
    }
}
