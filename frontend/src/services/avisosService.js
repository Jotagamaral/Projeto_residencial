import api from './api';

const urlAvisos = '/avisos'

export async function publicarAviso(avisoData) {
  try {
    const response = await api.post(urlAvisos, avisoData);
    return response.data;
  } catch (error) {
    console.error('[avisosService] Erro ao publicar aviso:', error);
    throw error;
  }
}

export async function buscarTodosAvisosGestao() {
  try {
    const response = await api.get(urlAvisos);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar avisos (gestão):', error);
    throw error;
  }
}

export async function buscarAvisosAtivos() {
  try {
    const response = await api.get(`${urlAvisos}/ativos`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar avisos:', error);
    throw error;
  }
}

export async function atualizarAviso(id, avisoData) {
  try {
    const response = await api.put(`${urlAvisos}/${id}`, avisoData);
    return response.data;
  } catch (error) {
    console.error('[avisosService] Erro ao atualizar aviso:', error);
    throw error;
  }
}

export async function definirAtivoAviso(id, ativo) {
  try {
    const response = await api.patch(`${urlAvisos}/${id}/ativo`, { ativo });
    return response.data;
  } catch (error) {
    console.error('[avisosService] Erro ao alterar status do aviso:', error);
    throw error;
  }
}
