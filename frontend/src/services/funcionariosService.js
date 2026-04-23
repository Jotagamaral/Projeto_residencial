// services/funcionariosService.js
import api from './api';

const urlFuncionarios = '/funcionarios';

// ---------------- READ ----------------

export async function buscarFuncionarios() {
  try {
    const response = await api.get(urlFuncionarios);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro desconhecido ao buscar funcionários.';
    console.error(`[funcionariosService.js] Erro: ${mensagemErro}`);
    throw new Error(mensagemErro);
  }
}

export async function buscarFuncionarioPorId(id) {
  try {
    const response = await api.get(`${urlFuncionarios}/${id}`);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao buscar os detalhes do funcionário.';
    console.error(`[funcionariosService.js] Erro: ${mensagemErro}`);
    throw new Error(mensagemErro);
  }
}

// ---------------- UPDATE ----------------

export async function atualizarFuncionario(id, funcionarioData) {
  try {
    const response = await api.put(`${urlFuncionarios}/${id}`, funcionarioData);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao atualizar dados do funcionário.';
    console.error(`[funcionariosService.js] Erro: ${mensagemErro}`);
    throw new Error(mensagemErro);
  }
}

// ---------------- DELETE ----------------

export async function deletarFuncionario(id) {
  try {
    const response = await api.delete(`${urlFuncionarios}/${id}`);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Erro ao inativar/excluir o funcionário.';
    console.error(`[funcionariosService.js] Erro: ${mensagemErro}`);
    throw new Error(mensagemErro);
  }
}
