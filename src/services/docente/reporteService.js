// Definición limpia de la URL base apuntando directo al puerto 8000 de Django
const API_URL_BASE = 'http://127.0.0.1:8000/api/reportes/historial/';

// Cambiamos el nombre a 'getHistorialReportes' para solucionar el quiebre de importación
export const getHistorialReportes = async (fecha = null) => {
  try {
    const urlCompleta = fecha 
      ? `${API_URL_BASE}?fecha=${fecha}` 
      : API_URL_BASE;

    // Extraemos el token que guardó el Login
    const token = localStorage.getItem('token'); 

    const respuesta = await fetch(urlCompleta, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Inyectamos el JWT para que Django verifique la sesión del docente
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });

    // Capturamos el 401, 404 o cualquier error del servidor limpiamente
    if (!respuesta.ok) {
      throw new Error(`Error en el servidor: Status ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    // COMPROBACIÓN CRÍTICA: Aseguramos entregar siempre un Array puro para evitar el quiebre del .map
    if (datos && datos.results && Array.isArray(datos.results)) {
      return datos.results; // Si viene paginado por Django Rest Framework
    }
    
    return Array.isArray(datos) ? datos : []; // Retorno seguro por defecto

  } catch (error) {
    console.error("Error detallado en reporteService:", error.message);
    throw error;
  }
};

// Por si acaso tu componente lo importa como default, dejamos la exportación también abajo
export default {
  getHistorialReportes
};