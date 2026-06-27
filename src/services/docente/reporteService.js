<<<<<<< HEAD
// Definición limpia de la URL base apuntando directo al puerto 8000 de Django
const API_URL_BASE = 'http://127.0.0.1:8000/api/reportes/historial/';

// Cambiamos el nombre a 'getHistorialReportes' para solucionar el quiebre de importación
export const getHistorialReportes = async (fecha = null) => {
  try {
=======
import { API_CONFIG } from "../apiConfig"; // Ajusta la ruta relativa si es necesario

export const getHistorialReportes = async (fecha = null) => {
  try {
    // 1. Usamos la ruta centralizada que acabamos de mapear en apiConfig
    const API_URL_BASE = API_CONFIG.ENDPOINTS.DOCENTE.HISTORIAL_REPORTES;
    
>>>>>>> main
    const urlCompleta = fecha 
      ? `${API_URL_BASE}?fecha=${fecha}` 
      : API_URL_BASE;

<<<<<<< HEAD
    // Extraemos el token que guardó el Login
    const token = localStorage.getItem('token'); 

=======
>>>>>>> main
    const respuesta = await fetch(urlCompleta, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
<<<<<<< HEAD
        // Inyectamos el JWT para que Django verifique la sesión del docente
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });

    // Capturamos el 401, 404 o cualquier error del servidor limpiamente
=======
        // 2. Traemos automáticamente los encabezados con el token usando tu función global
        ...API_CONFIG.getHeaders()
      }
    });

>>>>>>> main
    if (!respuesta.ok) {
      throw new Error(`Error en el servidor: Status ${respuesta.status}`);
    }

    const datos = await respuesta.json();

<<<<<<< HEAD
    // COMPROBACIÓN CRÍTICA: Aseguramos entregar siempre un Array puro para evitar el quiebre del .map
    if (datos && datos.results && Array.isArray(datos.results)) {
      return datos.results; // Si viene paginado por Django Rest Framework
    }
    
    return Array.isArray(datos) ? datos : []; // Retorno seguro por defecto
=======
    // Tu validación genial para prevenir caídas de renderizado
    if (datos && datos.results && Array.isArray(datos.results)) {
      return datos.results;
    }
    
    return Array.isArray(datos) ? datos : [];
>>>>>>> main

  } catch (error) {
    console.error("Error detallado en reporteService:", error.message);
    throw error;
  }
};

<<<<<<< HEAD
// Por si acaso tu componente lo importa como default, dejamos la exportación también abajo
=======
>>>>>>> main
export default {
  getHistorialReportes
};