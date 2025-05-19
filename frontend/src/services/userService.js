// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function loginUser(cpf, senha) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpf, senha }),
        });

        if (!response.ok) {
        throw new Error("Erro ao fazer login");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro na requisição de login:", error);
        throw error;
    }
}

export async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        });

        if (!response.ok) {
        throw new Error("Erro ao fazer cadastro");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro na requisição de cadastro:", error);
        throw error;
    }
}
