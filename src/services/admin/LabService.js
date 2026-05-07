import { API_CONFIG } from "../../services/apiConfig";

/**
 * Obtiene la lista completa de laboratorios con soporte para paginación y búsqueda.
 * @param {number} pagina - Página actual para la paginación (defecto 1).
 * @param {string} termino - Término de búsqueda desde el Navbar.
 * @returns {Promise<Object>} La respuesta completa del backend (results, count, next, previous).
 */
export const getLaboratorios = async (pagina = 1, termino = "") => {
    try {
        // 1. Construimos la URL usando el endpoint base de laboratorios
        let url = `${API_CONFIG.ENDPOINTS.ADMIN.LABS}?page=${pagina}`;
        
        // 2. Si hay búsqueda, concatenamos el parámetro search
        if (termino) {
            url += `&search=${encodeURIComponent(termino)}`;
        }
        
        const response = await fetch(url, {
            method: "GET",
            headers: API_CONFIG.getHeaders(), 
        });

        if (!response.ok) {
            throw new Error("No se pudo obtener la lista de laboratorios");
        }

        // 3. Retornamos el JSON completo (data) igual que en el servicio de usuarios
        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Error en LaboratorioService:", error);
        throw error;
    }
};