import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function buscarEncomendas() {
  try {
    const response = await axios.get(`${API_BASE_URL}/Encomenda`);
    return response.data;
  } catch (error) {
    console.error('[encomendasService.js] Erro ao buscar encomendas:', error);
    throw error;
  }
}

export async function publicarEncomenda(encomendaData) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/Encomenda`,
      encomendaData
    );
    return response.data;
  } catch (error) {
    console.error('[encomendasService.js] Erro ao cadastrar encomenda:', error);
    throw error;
  }
}

export async function buscarMoradores() {
  try {
    const response = await axios.get(`${API_BASE_URL}/Morador`);
    return response.data;
  } catch (error) {
    console.error('[encomendasService.js] Erro ao buscar moradores:', error);
    throw error;
  }
}

export async function atualizarRetiradaEncomenda(encomendaId, retirada) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/Encomenda/${encomendaId}/retirada`,
      { retirada },
      { timeout: 30000 }
    );
    return response.data;
  } catch (error) {
    console.error(
      '[encomendasService.js] Erro ao atualizar retirada da encomenda:',
      error
    );
    throw error;
  }
}
