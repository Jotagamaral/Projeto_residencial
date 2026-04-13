// services/categoriaCargoService.js
import api from './api';

const urlCategorias = '/categorias-cargo';

// ---------------- READ ----------------

/**
 * Lista todas as categorias de cargo ativas.
 * Endpoint: GET /api/categorias-cargo
 */
export async function buscarCategoriasCargo() {
    try {
        const response = await api.get(urlCategorias);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao buscar a lista de categorias de cargo.';
        console.error(`[categoriaCargoService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

/**
 * Busca os detalhes de uma categoria específica pelo ID.
 * Endpoint: GET /api/categorias-cargo/{id}
 */
export async function buscarCategoriaCargoPorId(id) {
    try {
        const response = await api.get(`${urlCategorias}/${id}`);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao buscar detalhes da categoria de cargo.';
        console.error(`[categoriaCargoService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

// ---------------- CREATE ----------------

/**
 * Cria uma nova categoria de cargo (Acesso restrito: Admin).
 * Endpoint: POST /api/categorias-cargo
 */
export async function criarCategoriaCargo(categoriaData) {
    try {
        const response = await api.post(urlCategorias, categoriaData);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao cadastrar nova categoria de cargo.';
        console.error(`[categoriaCargoService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

// ---------------- UPDATE ----------------

/**
 * Atualiza os dados de uma categoria existente (Acesso restrito: Admin).
 * Endpoint: PUT /api/categorias-cargo/{id}
 */
export async function atualizarCategoriaCargo(id, categoriaData) {
    try {
        const response = await api.put(`${urlCategorias}/${id}`, categoriaData);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao atualizar dados da categoria de cargo.';
        console.error(`[categoriaCargoService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}

// ---------------- DELETE ----------------

/**
 * Inativa ou exclui uma categoria de cargo (Acesso restrito: Admin).
 * Endpoint: DELETE /api/categorias-cargo/{id}
 */
export async function deletarCategoriaCargo(id) {
    try {
        const response = await api.delete(`${urlCategorias}/${id}`);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao inativar/excluir a categoria de cargo.';
        console.error(`[categoriaCargoService.js] Erro: ${mensagemErro}`);
        throw new Error(mensagemErro);
    }
}