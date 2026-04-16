// services/locaisService.js
import api from './api';

const urlLocais = '/locais';

// ---------------- READ ----------------

export async function buscarLocais() {
    try {
        const response = await api.get(urlLocais);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao buscar a lista de locais.';
        console.error(`[locaisService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

export async function buscarLocalPorId(id) {
    try {
        const response = await api.get(`${urlLocais}/${id}`);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao buscar detalhes do local.';
        console.error(`[locaisService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

// ---------------- CREATE ----------------

export async function criarLocal(localData) {
    try {
        const response = await api.post(urlLocais, localData);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao cadastrar novo local.';
        console.error(`[locaisService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

// ---------------- UPDATE ----------------

export async function atualizarLocal(id, localData) {
    try {
        const response = await api.put(`${urlLocais}/${id}`, localData);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao atualizar dados do local.';
        console.error(`[locaisService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

// ---------------- DELETE ----------------

export async function deletarLocal(id) {
    try {
        const response = await api.delete(`${urlLocais}/${id}`);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao inativar/excluir o local.';
        console.error(`[locaisService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}