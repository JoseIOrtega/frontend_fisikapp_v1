import { API_CONFIG } from '../apiConfig';

export const obtenerDetalleFicha = async (id) => {
    try {
        const response = await fetch(API_CONFIG.ENDPOINTS.DOCENTE.DETALLE_LABORATORIO(id), { 
            headers: API_CONFIG.getHeaders() 
        });
        
        if (!response.ok) throw new Error(`Error ${response.status} en la petición GET`);
        
        const data = await response.json();
        return data && typeof data === 'object' && !Array.isArray(data) ? data : null;
    } catch (error) {
        console.error(`Error en obtenerDetalleFicha (${id}):`, error);
        return null;
    }
};

export const actualizarEstadoHabilitado = async (id, nuevoEstado) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.DOCENTE.ACTUALIZAR_ESTADO(id), {
        method: 'PATCH',
        headers: {
            ...API_CONFIG.getHeaders(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            estado: nuevoEstado
        })
    });

    if (!response.ok) {
        let errorDetalle;
        try {
            errorDetalle = await response.json();
        } catch {
            errorDetalle = { message: `Error de servidor (${response.status}). No se pudo actualizar el estado.` };
        }
        throw errorDetalle;
    }

    return await response.json();
};