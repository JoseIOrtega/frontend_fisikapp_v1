import { API_CONFIG } from "../apiConfig";

// Ayudante genérico para GET
const fetchGet = async (url) => {
    try {
        const response = await fetch(url, { headers: API_CONFIG.getHeaders() });
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(`Error en GET ${url}:`, error);
        return [];
    }
};

// --- CATEGORÍAS ---
export const getCategorias = () => fetchGet(API_CONFIG.ENDPOINTS.ADMIN.CATEGORIAS.LIST);
export const crearCategoria = async (data) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.CATEGORIAS.CREATE, {
        method: "POST",
        headers: API_CONFIG.getHeaders(),
        body: JSON.stringify(data),
    });
    return await response.json();
};

// --- OBJETIVOS ---
export const getObjetivos = () => fetchGet(API_CONFIG.ENDPOINTS.ADMIN.OBJETIVOS.LIST);

export const crearObjetivo = async (data) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.OBJETIVOS.CREATE, {
        method: "POST",
        headers: API_CONFIG.getHeaders(),
        // Corrección técnica: mapeo de campos según respuesta 400 de Django
        body: JSON.stringify({
            tipo_objetivo: data.nombre,
            descripcion_objetivo: data.descripcion
        }),
    });
    return await response.json();
};

// --- PALABRAS CLAVE ---
export const getPalabrasClave = () => fetchGet(API_CONFIG.ENDPOINTS.ADMIN.PALABRAS_CLAVE.LIST);
export const crearPalabraClave = async (data) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.PALABRAS_CLAVE.CREATE, {
        method: "POST",
        headers: API_CONFIG.getHeaders(),
        body: JSON.stringify(data),
    });
    return await response.json();
};

// --- LABORATORIO COMPLETO ---
export const crearLaboratorio = async (data) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.LABORATORIOS.CREATE, {
        method: "POST",
        headers: API_CONFIG.getHeaders(),
        body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw result;
    return result;
};