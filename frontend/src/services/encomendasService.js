import api from './api';

const urlEncomendas = '/encomendas';

// ---------------- READ ----------------

export async function buscarTodasEncomendas() {
  try {
    const response = await api.get(urlEncomendas);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro desconhecido ao buscar todas as encomendas.';
    console.error(`[encomendasService.js] Erro: ${mensagemErro}`);
    throw new Error(mensagemErro);
  }
}

export async function buscarMinhasEncomendas() {
  try {
    const response = await api.get(`${urlEncomendas}/minhas`);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao buscar suas encomendas.';
    console.error(`[encomendasService.js] Erro: ${mensagemErro}`);
    throw new Error(mensagemErro);
  }
}

// ---------------- CREATE ----------------

export async function criarEncomenda(encomendaData) {
  try {
    const response = await api.post(urlEncomendas, encomendaData);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao cadastrar encomenda.';
    console.error(`[encomendasService.js] Erro: ${mensagemErro}`);
    throw new Error(mensagemErro);
  }
}

// ---------------- UPDATE ----------------

export async function atualizarEncomenda(id, encomendaData) {
  try {
    const response = await api.put(`${urlEncomendas}/${id}`, encomendaData);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao atualizar dados da encomenda.';
    console.error(`[encomendasService.js] Erro: ${mensagemErro}`);
    throw new Error(mensagemErro);
  }
}

export async function atualizarRetiradaEncomenda(id, retiradaData) {
  try {
    const response = await api.patch(`${urlEncomendas}/${id}/retirada`, retiradaData, { timeout: 30000 });
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao registrar retirada da encomenda.';
    console.error(`[encomendasService.js] Erro: ${mensagemErro}`);
    throw new Error(mensagemErro);
  }
}

// ---------------- DELETE ----------------

export async function deletarEncomenda(id) {
  try {
    const response = await api.delete(`${urlEncomendas}/${id}`);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao excluir/inativar encomenda.';
    console.error(`[encomendasService.js] Erro: ${mensagemErro}`);
    throw new Error(mensagemErro);
  }
}