import { API_CONFIG } from "../apiConfig"; // Ajusta la ruta relativa si es necesario

export const getHistorialReportes = async (fecha = null) => {
  try {
    // 1. Usamos la ruta centralizada que acabamos de mapear en apiConfig
    const API_URL_BASE = API_CONFIG.ENDPOINTS.DOCENTE.HISTORIAL_REPORTES;
    
    const urlCompleta = fecha 
      ? `${API_URL_BASE}?fecha=${fecha}` 
      : API_URL_BASE;

    const respuesta = await fetch(urlCompleta, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 2. Traemos automáticamente los encabezados con el token usando tu función global
        ...API_CONFIG.getHeaders()
      }
    });

    if (!respuesta.ok) {
      throw new Error(`Error en el servidor: Status ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    // Tu validación genial para prevenir caídas de renderizado
    if (datos && datos.results && Array.isArray(datos.results)) {
      return datos.results;
    }
    
    return Array.isArray(datos) ? datos : [];

  } catch (error) {
    console.error("Error detallado en reporteService:", error.message);
    throw error;
  }
};

export default {
  getHistorialReportes
};

export const getHistorialFiltrado = async (estudiante = '', laboratorio = '') => {
    try {
        const API_URL_BASE = API_CONFIG.ENDPOINTS.DOCENTE.HISTORIAL_REPORTES;

        const params = new URLSearchParams();
        
        // SOLO agregamos el parámetro si el usuario realmente escribió algo
        if (estudiante && estudiante.trim() !== '') {
            params.append('estudiante', estudiante.trim());
        }
        if (laboratorio && laboratorio.trim() !== '') {
            params.append('laboratorio', laboratorio.trim());
        }

        // Si no se escribió nada en ningún input, usamos la URL limpia sin el "?"
        const cadenaParams = params.toString();
        const urlCompleta = cadenaParams ? `${API_URL_BASE}?${cadenaParams}` : API_URL_BASE;

        console.log("🚀 URL ENVIADA AL BACKEND:", urlCompleta);
        const respuesta = await fetch(urlCompleta, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...API_CONFIG.getHeaders()
            }
        });

        if (!respuesta.ok) {
            throw new Error(`Error en el servidor al filtrar: Status ${respuesta.status}`);
        }

        return await respuesta.json();
    } catch (error) {
        console.error("Error en getHistorialFiltrado:", error);
        throw error;
    }
};