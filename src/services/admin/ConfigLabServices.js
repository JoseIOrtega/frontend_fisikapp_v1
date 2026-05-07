import { API_CONFIG } from "../apiConfig";

// Ayudante genérico para GET
const fetchGet = async (url) => {
    try {
        const response = await fetch(url, { headers: API_CONFIG.getHeaders() });
        const data = await response.json();
        if (data.results && Array.isArray(data.results)) return data.results;
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(`Error en GET ${url}:`, error);
        return [];
    }
};

export const getCategorias = () => fetchGet(API_CONFIG.ENDPOINTS.ADMIN.CATEGORIAS.LIST);
export const getObjetivos = () => fetchGet(API_CONFIG.ENDPOINTS.ADMIN.OBJETIVOS.LIST);
export const getPalabrasClave = () => fetchGet(API_CONFIG.ENDPOINTS.ADMIN.PALABRAS_CLAVE.LIST);

export const crearCategoria = async (data) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.CATEGORIAS.CREATE, {
        method: "POST",
        headers: {
            ...API_CONFIG.getHeaders(),
            "Content-Type": "application/json" // Inyección manual para evitar error 415
        },
        body: JSON.stringify({
            nombre: data.nombre,
            descripcion: data.descripcion
        }),
    });
    const result = await response.json();
    if (!response.ok) throw result;
    return result;
};

export const crearObjetivo = async (data) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.OBJETIVOS.CREATE, {
        method: "POST",
        headers: {
            ...API_CONFIG.getHeaders(),
            "Content-Type": "application/json" // Inyección manual para evitar error 415
        },
        body: JSON.stringify({
            tipo_objetivo: data.nombre,
            descripcion_objetivo: data.descripcion
        }),
    });
    const result = await response.json();
    if (!response.ok) throw result;
    return result;
};

export const crearPalabraClave = async (data) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.PALABRAS_CLAVE.CREATE, {
        method: "POST",
        headers: {
            ...API_CONFIG.getHeaders(),
            "Content-Type": "application/json" // ESTO REPARA TU ERROR 415
        },
        body: JSON.stringify({
            palabra_clave: data.nombre,
            descripcion: data.descripcion,
            categoria: data.categoria_id 
        }),
    });
    const result = await response.json();
    if (!response.ok) throw result;
    return result;
};

export const crearLaboratorio = async (payload) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.LABORATORIOS.CREATE, {
        method: "POST",
        headers: {
            ...API_CONFIG.getHeaders(),
            "Content-Type": "application/json" // Inyección manual
        },
        body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) throw result;
    return result;
};