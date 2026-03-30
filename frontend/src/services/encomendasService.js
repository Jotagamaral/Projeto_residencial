import api from './api';

export async function buscarEncomendas() {
  try {
    const response = await api.get(`/Encomenda/todas-encomendas`);
    return response.data;
  } catch (error) {
    console.error('[encomendasService.js] Erro ao buscar encomendas:', error);
    throw error;
  }
}

export async function buscarMinhasEncomendas() {
  try {
    const response = await api.get(`/Encomenda/minhas-encomendas`);
    return response.data;
  } catch (error) {
    console.error('[encomendasService.js] Erro ao buscar encomendas:', error);
    throw error;
  }
}

export async function publicarEncomenda(encomendaData) {
  try {
    const response = await api.post(`/Encomenda/criar-encomenda`, encomendaData);
    return response.data;
  } catch (error) {
    console.error('[encomendasService.js] Erro ao cadastrar encomenda:', error);
    throw error;
  }
}

export async function buscarMoradores() {
  try {
    const response = await api.get(`/Morador`);
    return response.data;
  } catch (error) {
    console.error('[encomendasService.js] Erro ao buscar moradores:', error);
    throw error;
  }
}

export async function atualizarRetiradaEncomenda(encomendaId, retirada) {
  try {
    const response = await api.patch(
      `/Encomenda/atualizar-encomenda/${encomendaId}/retirada`,
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
