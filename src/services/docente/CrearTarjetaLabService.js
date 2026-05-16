import { API_CONFIG } from '../apiConfig';

// Ayudante genérico (Copiado de tu ConfLabService para asegurar compatibilidad)
const fetchGet = async (url) => {
    try {
        const response = await fetch(url, { headers: API_CONFIG.getHeaders() });
        
        // Si el servidor responde 401 aquí, es porque el token en getHeaders() es inválido
        if (!response.ok) throw new Error(`Error ${response.status} en la petición`);

        const data = await response.json();
        
        // Manejo de paginación de Django: si existe .results, devolvemos eso
        if (data.results && Array.isArray(data.results)) return data.results;
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(`Error en GET ${url}:`, error);
        return [];
    }
};

const CrearTarjetaLaboratorio = {
    obtenerCategorias: () => fetchGet(API_CONFIG.ENDPOINTS.ADMIN.CATEGORIAS.LIST),
    
    obtenerPlantillasBase: () => fetchGet(API_CONFIG.ENDPOINTS.ADMIN.LABORATORIOS.LIST),

    obtenerMisLaboratorios: () => fetchGet(API_CONFIG.ENDPOINTS.DOCENTE.LABORATORIOS_DOCENTE),

    crearInstancia: async (plantillaId) => {
        const response = await fetch(API_CONFIG.ENDPOINTS.DOCENTE.LABORATORIOS_DOCENTE, {
            method: "POST",
            headers: {
                ...API_CONFIG.getHeaders(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                plantilla_id: plantillaId,
                estado: "inactivo" 
            }),
        });
        const result = await response.json();
        if (!response.ok) throw result;
        return result;
    }
};

export default CrearTarjetaLaboratorio;