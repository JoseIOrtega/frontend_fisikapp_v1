import { API_CONFIG } from '../apiConfig';

// Obtener todos los laboratorios
export const getLaboratoriosAPI = async () => {
    try {
        const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.LABS, {
            method: "GET",
            headers: API_CONFIG.getHeaders()
        });

        if (response.ok) {
            const datos = await response.json();
            console.log("Laboratorios obtenidos:", datos);
            return datos;
        } else if (response.status === 401) {
            console.warn("No autorizado - token inválido o expirado");
            throw new Error("No autorizado");
        } else {
            console.error("Error al obtener laboratorios:", response.status, response.statusText);
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error("Backend no disponible");
        }
        throw error;
    }
};

// Obtener un laboratorio por ID
export const getLaboratorioByIdAPI = async (id) => {
    try {
        const response = await fetch(`${API_CONFIG.ENDPOINTS.ADMIN.LABS}${id}/`, {
            method: "GET",
            headers: API_CONFIG.getHeaders()
        });

        if (response.ok) {
            const datos = await response.json();
            console.log("Laboratorio obtenido:", datos);
            return datos;
        } else {
            console.error("Error al obtener laboratorio:", response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        return null;
    }
};

// Crear un nuevo laboratorio
export const createLaboratorioAPI = async (laboratorioData) => {
    try {
        const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.LABS, {
            method: "POST",
            headers: API_CONFIG.getHeaders(),
            body: JSON.stringify({
                titulo_lab: laboratorioData.nombre_de_laboratorio,
                resumen: laboratorioData.resumen,
                introduccion: laboratorioData.introduccion,
                marco_teorico: laboratorioData.marco_teorico,
                categoria: laboratorioData.categoria,
                estado: laboratorioData.estado === "Activo",
                fechacreacion: laboratorioData.fechacreacion
            })
        });

        const datos = await response.json();
        console.log("Respuesta del servidor:", datos);

        if (response.ok) {
            return { success: true, data: datos };
        } else if (response.status === 401) {
            return { success: false, error: "No autorizado - token inválido" };
        } else {
            console.error("Error al crear laboratorio:", response.status, datos);
            return { success: false, error: datos };
        }
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return { success: false, error: "Backend no disponible" };
        }
        return { success: false, error: "Error de conexión" };
    }
};

// Actualizar un laboratorio existente
export const updateLaboratorioAPI = async (id, laboratorioData) => {
    try {
        const response = await fetch(`${API_CONFIG.ENDPOINTS.ADMIN.LABS}${id}/`, {
            method: "PUT",
            headers: API_CONFIG.getHeaders(),
            body: JSON.stringify({
                titulo_lab: laboratorioData.nombre_de_laboratorio,
                resumen: laboratorioData.resumen,
                introduccion: laboratorioData.introduccion,
                marco_teorico: laboratorioData.marco_teorico,
                categoria: laboratorioData.categoria,
                estado: laboratorioData.estado === "Activo",
                fechacreacion: laboratorioData.fechacreacion
            })
        });

        const datos = await response.json();
        console.log("Respuesta del servidor:", datos);

        if (response.ok) {
            return { success: true, data: datos };
        } else if (response.status === 401) {
            return { success: false, error: "No autorizado - token inválido" };
        } else {
            console.error("Error al actualizar laboratorio:", response.status, datos);
            return { success: false, error: datos };
        }
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return { success: false, error: "Backend no disponible" };
        }
        return { success: false, error: "Error de conexión" };
    }
};

// Función antigua mantenida por compatibilidad
export const AdminLab = async (tituloLaboratorio, descripcion, introduxxion, marcoTeorico, categorIA, object, palabrasClave) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.LABS, {
        method: "POST",
        headers: API_CONFIG.getHeaders(),
        body: JSON.stringify({
            titulo_lab: tituloLaboratorio,
            resumen: descripcion,
            introduccion: introduxxion,
            marco_teorico: marcoTeorico,
            categoria: categorIA,
            objetivo: object,
            palabras_clave: palabrasClave
        })
    });

    const datos = await response.json();
    console.log("Respuesta del servidor:", datos);

    if (response.ok) {
        return datos;
    }
};