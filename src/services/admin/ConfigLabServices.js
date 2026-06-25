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

// =========================================================
// 🔄 MÉTODOS GET (LISTAR)
// =========================================================

export const getCategorias = () => fetchGet(API_CONFIG.ENDPOINTS.ADMIN.CATEGORIAS.LIST);
export const getPalabrasClave = () => fetchGet(API_CONFIG.ENDPOINTS.ADMIN.PALABRAS_CLAVE.LIST);

// Nuevos métodos GET para objetivos separados
export const getObjetivosGenerales = () => 
    fetchGet(API_CONFIG.ENDPOINTS.ADMIN.OBJETIVOS_GENERALES.LIST);

export const getObjetivosEspecificos = () => 
    fetchGet(API_CONFIG.ENDPOINTS.ADMIN.OBJETIVOS_ESPECIFICOS.LIST);


// =========================================================
// ➕ MÉTODOS POST (CREAR)
// =========================================================

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

// 1. Crear Objetivo General (Adaptado a Swagger: descripcion y plantilla)
export const crearObjetivoGeneral = async (data) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.OBJETIVOS_GENERALES.CREATE, {
        method: "POST",
        headers: {
            ...API_CONFIG.getHeaders(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            descripcion: data.descripcion,
            plantilla: data.plantillaId // ID numérico de la plantilla
        }),
    });
    const result = await response.json();
    if (!response.ok) throw result;
    return result;
};

// 2. Crear Objetivo Específico (Adaptado a Swagger: descripcion y objetivo_general)
export const crearObjetivoEspecifico = async (data) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.OBJETIVOS_ESPECIFICOS.CREATE, {
        method: "POST",
        headers: {
            ...API_CONFIG.getHeaders(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            descripcion: data.descripcion,
            objetivo_general: data.objetivoGeneralId // ID numérico del objetivo general
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