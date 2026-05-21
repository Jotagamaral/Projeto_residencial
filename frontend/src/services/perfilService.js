// src/services/perfilService.js
import api from './api';

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