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