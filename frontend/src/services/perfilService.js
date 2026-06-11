// src/services/perfilService.js
import api from './api';

// GET
export const buscarPerfilAdmin = async () => {
    const response = await api.get('/arearestrita/area-admin');
    return response.data;
};

export const buscarPerfilMorador = async () => {
    const response = await api.get('/arearestrita/area-morador');
    return response.data;
};

export const buscarPerfilFuncionario = async () => {
    const response = await api.get('/arearestrita/area-funcionario');
    return response.data;
};

// UPDATE
export async function AtualizarMeusDadosMorador(dadosPessoais) {
  try {
    const response = await api.put(`arearestrita/area-morador/meus-dados`, dadosPessoais);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.detail || error.response?.data?.message || 'Erro ao atualizar dados pessoais.';
    throw new Error(mensagemErro);
  }
}

export async function AlterarMinhaSenhaMorador(senhaData) {
  try {
    // Note que usamos o objeto esperado pelo backend (SenhaAtual, NovaSenha, ConfirmarNovaSenha)
    const response = await api.put(`arearestrita/area-morador/minha-senha`, senhaData);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.detail || error.response?.data?.message || 'Erro ao alterar senha.';
    throw new Error(mensagemErro);
  }
}

export async function AtualizarMeusDadosFuncionario(dadosPessoais) {
  try {
    const response = await api.put(`arearestrita/area-funcionario/meus-dados`, dadosPessoais);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.detail || error.response?.data?.message || 'Erro ao atualizar dados pessoais do funcionário.';
    throw new Error(mensagemErro);
  }
}

export async function AlterarMinhaSenhaFuncionario(senhaData) {
  try {
    const response = await api.put(`arearestrita/area-funcionario/minha-senha`, senhaData);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.detail || error.response?.data?.message || 'Erro ao alterar senha do funcionário.';
    throw new Error(mensagemErro);
  }
}

export async function AtualizarMeusDadosAdmin(dadosPessoais) {
  try {
    const response = await api.put(`arearestrita/area-admin/meus-dados`, dadosPessoais);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.detail || error.response?.data?.message || 'Erro ao atualizar dados pessoais do funcionário.';
    throw new Error(mensagemErro);
  }
}

export async function AlterarMinhaSenhaAdmin(senhaData) {
  try {
    const response = await api.put(`arearestrita/area-admin/minha-senha`, senhaData);
    return response.data;
  } catch (error) {
    const mensagemErro = error.response?.data?.detail || error.response?.data?.message || 'Erro ao alterar senha do funcionário.';
    throw new Error(mensagemErro);
  }
}