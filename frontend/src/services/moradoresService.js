import api from './api';

const urlMoradores = '/moradores'

export async function buscarMoradores() {
  try {
    const response = await api.get(urlMoradores);
    return response.data;
  } catch (error) {
    console.error('[encomendasService.js] Erro ao buscar moradores:', error);
    throw error;
  }
}

