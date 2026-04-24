// services/moradoresService.js
import api from './api';

const urlMoradores = '/moradores';

// ---------------- READ ----------------

export async function buscarMoradores() {
  try {
    const response = await api.get(urlMoradores);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro desconhecido ao buscar moradores.';
    console.error(`[moradoresService.js] Erro: ${mensagemErro}`);
    throw new Error(mensagemErro);
  }
}

export async function buscarMoradorPorId(id) {
  try {
    const response = await api.get(`${urlMoradores}/${id}`);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao buscar os detalhes do morador.';
    console.error(`[moradoresService.js] Erro: ${mensagemErro}`);
    throw new Error(mensagemErro);
  }
}

// ---------------- UPDATE ----------------

export async function atualizarMorador(id, moradorData) {
  try {
    const response = await api.put(`${urlMoradores}/${id}`, moradorData);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao atualizar dados residenciais do morador.';
    console.error(`[moradoresService.js] Erro: ${mensagemErro}`);
    throw new Error(mensagemErro);
  }
}

export async function atualizarDadosPessoais(id, dadosPessoais) {
  try {
    const response = await api.put(`${urlMoradores}/${id}/dados-pessoais`, dadosPessoais);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao atualizar dados pessoais.';
    throw new Error(mensagemErro);
  }
}

export async function alterarSenhaMorador(id, senhaData) {
  try {
    // Note que usamos o objeto esperado pelo backend (SenhaAtual, NovaSenha, ConfirmarNovaSenha)
    const response = await api.put(`${urlMoradores}/${id}/alterar-senha`, senhaData);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao alterar senha.';
    throw new Error(mensagemErro);
  }
}

// ---------------- DELETE ----------------

export async function deletarMorador(id) {
  try {
    const response = await api.delete(`${urlMoradores}/${id}`);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao inativar/excluir o morador.';
    console.error(`[moradoresService.js] Erro: ${mensagemErro}`);
    throw new Error(mensagemErro);
  }
}