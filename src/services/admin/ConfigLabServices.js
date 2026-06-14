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

// CATEGORIAS
export const getCategorias = () => fetchGet(API_CONFIG.ENDPOINTS.ADMIN.CATEGORIAS.LIST);

export const crearCategoria = async (data) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.CATEGORIAS.CREATE, {
        method: "POST",
        headers: { ...API_CONFIG.getHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: data.nombre, descripcion: data.descripcion }),
    });
    const result = await response.json();
    if (!response.ok) throw result;
    return result;
};

// =====================================================
// OBJETIVOS GENERALES
// =====================================================
export const getObjetivosGenerales = () =>
    fetchGet(API_CONFIG.ENDPOINTS.ADMIN.OBJETIVOS_GENERALES.LIST);

export const crearObjetivoGeneral = async (data) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.OBJETIVOS_GENERALES.CREATE, {
        method: "POST",
        headers: { ...API_CONFIG.getHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
            plantilla: data.plantilla,
            descripcion: data.descripcion
        }),
    });
    const result = await response.json();
    if (!response.ok) throw result;
    return result;
};

// =====================================================
// OBJETIVOS ESPECIFICOS
// =====================================================
export const getObjetivosEspecificos = () =>
    fetchGet(API_CONFIG.ENDPOINTS.ADMIN.OBJETIVOS_ESPECIFICOS.LIST);

export const crearObjetivoEspecifico = async (data) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.OBJETIVOS_ESPECIFICOS.CREATE, {
        method: "POST",
        headers: { ...API_CONFIG.getHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
            objetivo_general: data.objetivo_general,
            descripcion: data.descripcion
        }),
    });
    const result = await response.json();
    if (!response.ok) throw result;
    return result;
};
export const getPalabrasClave = () => fetchGet(API_CONFIG.ENDPOINTS.ADMIN.PALABRAS_CLAVE.LIST);

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