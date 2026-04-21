import { API_CONFIG } from "../apiConfig";

// ===== CATEGORIAS =====
export const getCategorias = async () => {
    const response = await fetch(API_CONFIG.ENDPOINTS.CATEGORIAS.LIST, {
        method: "GET",
        headers: API_CONFIG.getHeaders(),
    });
    return await response.json();
};

export const createCategoria = async (data) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.CATEGORIAS.CREATE, {
        method: "POST",
        headers: API_CONFIG.getHeaders(),
        body: JSON.stringify(data),
    });
    return await response.json();
};

// ===== PALABRAS CLAVE =====
export const getPalabrasClave = async () => {
    try {
        const response = await fetch(
            API_CONFIG.ENDPOINTS.PALABRAS_CLAVE.LIST,
            {
                method: "GET",
                headers: API_CONFIG.getHeaders(),
            }
        );

        return await response.json();

    } catch (error) {
        console.error("Error al obtener palabras clave:", error);
        return [];
    }
};

// ===== OBJETIVOS =====
export const getObjetivos = async () => {
    try {
        const response = await fetch(
            API_CONFIG.ENDPOINTS.OBJETIVOS.LIST,
            {
                method: "GET",
                headers: API_CONFIG.getHeaders(),
            }
        );

        return await response.json();

    } catch (error) {
        console.error("Error al obtener objetivos:", error);
        return [];
    }
};