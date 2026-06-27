import { API_CONFIG } from '../apiConfig';

// Función genérica para obtener datos (GET)
const fetchGet = async (url) => {
    try {
        const response = await fetch(url, { headers: API_CONFIG.getHeaders() });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        return (data.results && Array.isArray(data.results)) ? data.results : (Array.isArray(data) ? data : []);
    } catch (error) {
        console.error(`Error en GET ${url}:`, error);
        return [];
    }
};

export const CrearTarjetaLaboratorio = {
    // Consultas generales
    obtenerCategorias: () => fetchGet(API_CONFIG.ENDPOINTS.ADMIN.CATEGORIAS.LIST),
    obtenerPlantillasBase: () => fetchGet(API_CONFIG.ENDPOINTS.ADMIN.LABORATORIOS.LIST),
    obtenerMisLaboratorios: () => fetchGet(API_CONFIG.ENDPOINTS.DOCENTE.LABORATORIOS_DOCENTE),

    // Nueva función para traer el detalle completo de la plantilla por ID
    obtenerDetallePlantilla: async (id) => {
        const response = await fetch(API_CONFIG.ENDPOINTS.DOCENTE.DETALLE_PLANTILLA(id), { 
            headers: API_CONFIG.getHeaders() 
        });
        
        if (!response.ok) {
            const errorDetalle = await response.json().catch(() => ({}));
            throw errorDetalle;
        }
        return await response.json();
    },

    crearInstancia: async (plantillaSeleccionada) => {
        // Probamos con la estructura mínima posible para evitar conflictos en el backend.
        const body = {
            plantilla: plantillaSeleccionada.id,
            estado: "ACTIVO"
            // Eliminamos: resumen, introduccion, marco_teorico, objetivo_general y conceptos_basicos
            // Si el backend los necesita, al borrarlos nos dará error de "campo requerido", 
            // pero si el error 500 desaparece, sabremos que el conflicto estaba en esos campos.
        };

        const response = await fetch(API_CONFIG.ENDPOINTS.DOCENTE.CREAR_LABORATORIO, {
            method: "POST",
            headers: {
                ...API_CONFIG.getHeaders(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body), 
        });

        // Manejo de error más robusto para capturar el HTML que está rompiendo el JSON
        if (!response.ok) {
            const text = await response.text(); // Leemos como texto primero
            try {
                const errorDetalle = JSON.parse(text);
                console.error("Error del servidor (JSON):", errorDetalle);
                throw errorDetalle;
            } catch (e) {
                console.error("Error del servidor (HTML/No JSON):", text);
                throw new Error("El servidor devolvió un error grave (500)");
            }
        }
        return await response.json(); 
    }
};

export const ActualizarEstado = async (id, nuevoEstado) => {
    // En el Estado Convertimos a 1 (para activo) o 0 (para Inactivo)
    const valorParaBD = (nuevoEstado === true || nuevoEstado === 'activo') ? 1 : 0;
    
    const respuesta = await fetch(API_CONFIG.ENDPOINTS.DOCENTE.ACTUALIZAR_ESTADO(id), {
        method: 'PATCH',
        headers: { 
            ...API_CONFIG.getHeaders(), 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ estado: valorParaBD }) // Enviamos 1 o 0
    });
    
    if (!respuesta.ok) {
        throw new Error("No se pudo actualizar el estado");
    }
    return await respuesta.json();
};

export const EliminarLabService = {
    eliminarInstancia: async (id) => {
        const response = await fetch(API_CONFIG.ENDPOINTS.DOCENTE.ELIMINAR_LABORATORIO(id), {
            method: 'DELETE',
            headers: { ...API_CONFIG.getHeaders() }
        });
        
        if (!response.ok) {
            const errorDetalle = await response.json().catch(() => ({}));
            throw errorDetalle;
        }
        return true;
    }
};