import { API_CONFIG } from '../apiConfig';

const fetchGet = async (url) => {
    try {
        const response = await fetch(url, { headers: API_CONFIG.getHeaders() });
        if (!response.ok) throw new Error(`Error ${response.status} en la petición`);
        const data = await response.json();
        if (data.results && Array.isArray(data.results)) return data.results;
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(`Error en GET ${url}:`, error);
        return [];
    }
};

export const CrearTarjetaLaboratorio = {
    obtenerCategorias: () => fetchGet(API_CONFIG.ENDPOINTS.ADMIN.CATEGORIAS.LIST),
    obtenerPlantillasBase: () => fetchGet(API_CONFIG.ENDPOINTS.ADMIN.LABORATORIOS.LIST),
    obtenerObjetivos: () => fetchGet(API_CONFIG.ENDPOINTS.ADMIN.OBJETIVOS.LIST),
    obtenerMisLaboratorios: () => fetchGet(API_CONFIG.ENDPOINTS.DOCENTE.LABORATORIOS_DOCENTE),

    // ACTUALIZADO: Recibe el objeto con los parámetros correctos para el Backend
    crearInstancia: async (tarjetaNuevaData) => {
        // Desestructuramos las variables que vienen del modal y de la vista padre
        const { id_padre, grado, jornada } = tarjetaNuevaData;

        const response = await fetch(API_CONFIG.ENDPOINTS.DOCENTE.CREAR_LABORATORIO, {
            method: "POST",
            headers: {
                ...API_CONFIG.getHeaders(),
                "Content-Type": "application/json"
            },
            // Enviamos exactamente lo que el Serializer de Django exige
            body: JSON.stringify({ 
                id_padre: id_padre,              // El ID de la plantilla obligatoria que arrojaba el 400
                grado: grado || null,            // Campo del grado (string "10-A", etc.)
                jornada: jornada || null,        // Campo de la jornada (string "Mañana", etc.)
                estado: false                    // Iniciamos en falso para que requiera configuración (según tus capturas de flujo)
            }),
        });

        // CONTROL DE ERRORES: Si el backend falla evitamos romper la app y pasamos el JSON detallado
        if (!response.ok) {
            let errorDetalle;
            try {
                errorDetalle = await response.json(); // Intentamos leer el array de errores de Django
            } catch {
                errorDetalle = { message: `Error de servidor (${response.status}). No se devolvió un JSON válido.` };
            }
            throw errorDetalle; // Se lanza al catch de MisLaboratoriosDocente.jsx
        }

        return await response.json(); 
    }
};

export const ActualizarEstado = async (id, nuevoEstado) => {
  const respuesta = await fetch(API_CONFIG.ENDPOINTS.DOCENTE.ACTUALIZAR_ESTADO(id), {
    method: 'PATCH', 
    headers: {
      ...API_CONFIG.getHeaders(),
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
      estado: nuevoEstado
    })
  });

  if (!respuesta.ok) {
    throw new Error('Error al actualizar el estado en el servidor');
  }

  return await respuesta.json();
};

export const EliminarLabService = {
  eliminarInstancia: async (id) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.DOCENTE.ELIMINAR_LABORATORIO(id), {
      method: 'DELETE',
      headers: {
        ...API_CONFIG.getHeaders(),
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error('No se pudo eliminar el laboratorio en el servidor.');
    }

    return true;
  }
};