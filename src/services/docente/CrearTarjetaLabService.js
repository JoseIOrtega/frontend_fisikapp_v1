import { API_CONFIG } from '../apiConfig';

const fetchGet = async (url) => {
    try {
        const response = await fetch(url, { headers: API_CONFIG.getHeaders() });
        if (!response.ok) throw new Error(`Error ${response.status} en la petición`);
        const data = await response.json();
        // Si el nuevo endpoint `/plantillas/` devuelve una lista directa o un objeto con "results", esto lo maneja:
        return (data.results && Array.isArray(data.results)) ? data.results : (Array.isArray(data) ? data : []);
    } catch (error) {
        console.error(`Error en GET ${url}:`, error);
        return [];
    }
};

export const CrearTarjetaLaboratorio = {
    // Estas funciones se mantienen, pero ahora apuntan a los nuevos endpoints que configuraste
    obtenerCategorias: () => fetchGet(API_CONFIG.ENDPOINTS.ADMIN.CATEGORIAS.LIST),
    obtenerPlantillasBase: () => fetchGet(API_CONFIG.ENDPOINTS.ADMIN.LABORATORIOS.LIST),
    obtenerMisLaboratorios: () => fetchGet(API_CONFIG.ENDPOINTS.DOCENTE.LABORATORIOS_DOCENTE),

    // SIMPLIFICADO: Ahora solo enviamos lo que el backend pide (el ID de la plantilla)
    crearInstancia: async (tarjetaNuevaData) => {
        const { id_plantilla, grado, jornada } = tarjetaNuevaData; 

        // Ajuste según el esquema mostrado en Swagger image_834a05.png
        const bodyCompleto = {
            plantilla: id_plantilla,
            grado: grado || "",
            jornada: jornada || "",
            estado: "BORRADOR",
            resumen: "Sin resumen",       // Valor por defecto
            prologo: "Sin prólogo",       // Campo requerido por el backend
            introduccion: "Sin intro",
            marco_teorico: "Sin marco",
            generado_ia: false,           // Booleano requerido por el Swagger
            palabras_clave: [],           // Lista vacía
            conceptos_basicos: [],        // Lista vacía
            objetivo_general: {           // Objeto anidado requerido
                descripcion: "Sin descripción",
                laboratorio: id_plantilla
            }
        };

        const response = await fetch(API_CONFIG.ENDPOINTS.DOCENTE.CREAR_LABORATORIO, {
            method: "POST",
            headers: {
                ...API_CONFIG.getHeaders(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyCompleto),
        });

        if (!response.ok) {
            const errorDetalle = await response.json();
            console.error("El backend rechaza estos datos:", errorDetalle);
            throw errorDetalle;
        }

        return await response.json(); 
    }
};

// ActualizarEstado y EliminarLabService se mantienen igual si esos endpoints no cambiaron
export const ActualizarEstado = async (id, nuevoEstado) => {
  const respuesta = await fetch(API_CONFIG.ENDPOINTS.DOCENTE.ACTUALIZAR_ESTADO(id), {
    method: 'PATCH', 
    headers: { ...API_CONFIG.getHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ estado: nuevoEstado })
  });
  if (!respuesta.ok) throw new Error('Error al actualizar el estado');
  return await respuesta.json();
};

export const EliminarLabService = {
  eliminarInstancia: async (id) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.DOCENTE.ELIMINAR_LABORATORIO(id), {
      method: 'DELETE',
      headers: { ...API_CONFIG.getHeaders(), "Content-Type": "application/json" }
    });
    if (!response.ok) throw new Error('No se pudo eliminar el laboratorio');
    return true;
  }
};