import api from './api';

const urlVisitantes = '/visitantes';

export async function listarVisitantes() {
  try {
    const response = await api.get(urlVisitantes);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao buscar visitantes.';
    throw new Error(mensagemErro);
  }
}

export async function listarVisitantesComAcesso() {
  try {
    const response = await api.get(`${urlVisitantes}/com-acesso`);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao buscar visitantes com acesso.';
    throw new Error(mensagemErro);
  }
}

export async function registrarEntradaVisitante(dadosEntrada) {
  try {
    const response = await api.post(`${urlVisitantes}/entrada`, dadosEntrada);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao registrar entrada do visitante.';
    throw new Error(mensagemErro);
  }
}

export async function registrarSaidaVisitante(idAcesso) {
  try {
    const response = await api.patch(`${urlVisitantes}/saida/${idAcesso}`);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao registrar saída do visitante.';
    throw new Error(mensagemErro);
  }
}

export async function listarAcessosVisitantes() {
  try {
    const response = await api.get(`${urlVisitantes}/acessos`);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao buscar histórico de acessos.';
    throw new Error(mensagemErro);
  }
}

export async function listarAcessosAbertos() {
  try {
    const response = await api.get(`${urlVisitantes}/acessos/abertos`);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao buscar visitantes em aberto.';
    throw new Error(mensagemErro);
  }
}

export async function inativarVisitante(id) {
  try {
    await api.patch(`/visitantes/${id}/inativar`);
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao inativar visitante.';
    throw new Error(mensagemErro);
  }
}

export async function atualizarVisitante(id, dados) {
  try {
    const response = await api.put(`/visitantes/${id}`, dados);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao atualizar visitante.';
    throw new Error(mensagemErro);
  }
}

export async function registrarAcessoVisitanteExistente(idVisitante, dados) {
  try {
    const response = await api.post(`/visitantes/${idVisitante}/acessos`, dados);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao registrar acesso.';
    throw new Error(mensagemErro);
  }
}
