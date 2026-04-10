import api from './api';

const urlLocais = '/locais'

export async function buscarLocais() {
    try {
        const response = await api.get(urlLocais);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar locais:', error);
        throw error;
    }
}