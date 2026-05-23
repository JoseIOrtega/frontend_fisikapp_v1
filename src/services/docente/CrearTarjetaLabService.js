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

    // 🚀 MODIFICADO: Ahora recibe grado y jornada como parámetros adicionales
    crearInstancia: async (plantillaId, tituloPersonalizado, grado, jornada) => {
        const response = await fetch(API_CONFIG.ENDPOINTS.DOCENTE.CREAR_LABORATORIO, {
            method: "POST",
            headers: {
                ...API_CONFIG.getHeaders(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                laboratorio: plantillaId, 
                titulo_lab: tituloPersonalizado, // El nombre limpio que el docente digite
                grado: grado || null,            // Enviamos el grado directamente a su nuevo campo
                jornada: jornada || null,        // Enviamos la jornada directamente a su nuevo campo
                estado: true                     // El laboratorio inicia activo por defecto
            }),
        });

        // CONTROL DE ERRORES: Si el backend falla con 500 HTML, evitamos el SyntaxError
        if (!response.ok) {
            let errorDetalle;
            try {
                errorDetalle = await response.json(); // Intentamos leer el JSON si Django mandó un error controlado
            } catch {
                errorDetalle = { message: `Error de servidor (${response.status}). No se devolvió un JSON válido.` };
            }
            throw errorDetalle; // Lanza el error capturado para que caiga en el catch de tu vista
        }

        return await response.json(); // Si todo salió bien (Status 201/200), procesamos el objeto real creado
    }
};

export const ActualizarEstado = async (id, nuevoEstado) => {
  //Usamos FETCH apuntando al ID de la tarjeta que queremos cambiar
  const respuesta = await  fetch(API_CONFIG.ENDPOINTS.DOCENTE.ACTUALIZAR_ESTADO(id), {
    method: 'PATCH', // Usamos PATCH porque solo vamos a modificar el campo 'estado'
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

// Ponemos "export" directamente aquí también
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