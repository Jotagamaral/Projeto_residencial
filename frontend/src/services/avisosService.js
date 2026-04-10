import api from './api';

export async function buscarAvisos() {
  try {
    const response = await api.get('/Aviso/ativos');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar avisos:', error);
    throw error;
  }
}

export async function buscarTodosAvisosGestao() {
  try {
    const response = await api.get('/Aviso/todos');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar avisos (gestão):', error);
    throw error;
  }
}

export async function publicarAviso(avisoData) {
  try {
    const response = await api.post('/Aviso/criar-aviso', avisoData);
    return response.data;
  } catch (error) {
    console.error('[avisosService] Erro ao publicar aviso:', error);
    throw error;
  }
}

export async function atualizarAviso(id, avisoData) {
  try {
    const response = await api.put(`/Aviso/${id}`, avisoData);
    return response.data;
  } catch (error) {
    console.error('[avisosService] Erro ao atualizar aviso:', error);
    throw error;
  }
}

export async function definirAtivoAviso(id, ativo) {
  try {
    const response = await api.patch(`/Aviso/${id}/ativo`, { ativo });
    return response.data;
  } catch (error) {
    console.error('[avisosService] Erro ao alterar status do aviso:', error);
    throw error;
  }
}
