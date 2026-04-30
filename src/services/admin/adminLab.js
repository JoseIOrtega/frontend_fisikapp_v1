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
            headers: {
                ...API_CONFIG.getHeaders(),
                "Content-Type": "application/json"
            },
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
            headers: {
                ...API_CONFIG.getHeaders(),
                "Content-Type": "application/json"
            },
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

// Actualizar parcialmente un laboratorio (PATCH)
export const patchLaboratorioAPI = async (id, laboratoriopatch) => {
    try {
        const response = await fetch(`${API_CONFIG.ENDPOINTS.ADMIN.LABS}${id}/`, {
            method: "PATCH",
            headers: {
                ...API_CONFIG.getHeaders(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(laboratoriopatch)
        });

        const datos = await response.json();
        console.log("Respuesta del servidor PATCH:", datos);

        if (response.ok) {
            return { success: true, data: datos };
        } else if (response.status === 401) {
            return { success: false, error: "No autorizado - token inválido" };
        } else {
            console.error("Error al actualizar parcialmente laboratorio:", response.status, datos);
            return { success: false, error: datos };
        }
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return { success: false, error: "Backend no disponible" };
        }
        return { success: false, error: "Error de conexión" };
    }
};

// Eliminar un laboratorio
export const deleteLaboratorioAPI = async (id) => {
    try {
        const response = await fetch(`${API_CONFIG.ENDPOINTS.ADMIN.LABS}${id}/`, {
            method: "DELETE",
            headers: API_CONFIG.getHeaders()
        });

        console.log("Respuesta del servidor (DELETE):", response.status);

        if (response.ok) {
            return { success: true, message: "Laboratorio eliminado exitosamente" };
        } else if (response.status === 401) {
            return { success: false, error: "No autorizado - token inválido" };
        } else if (response.status === 404) {
            return { success: false, error: "Laboratorio no encontrado" };
        } else {
            const datos = await response.json().catch(() => ({}));
            console.error("Error al eliminar laboratorio:", response.status, datos);
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

// ============= FUNCIONES AUXILIARES CON FALLBACK =============

// Obtener laboratorios del localStorage
function getLaboratoriosFromStorage() {
    const STORAGE_KEY = "fisikapp_laboratorios";
    const initialLaboratorios = [
        { id: 1, nombre_de_laboratorio: "Lab. Caída Libre", categoria: "Cinemática", estado: "Activo", fecha_creacion: "2026-04-03T15:30:00Z", resumen: "Estudio de caída libre y aceleración gravitatoria.", introduccion: "El laboratorio explora la caída de objetos bajo gravedad.", marco_teorico: "Se utilizan las ecuaciones de movimiento uniformemente acelerado." },
        { id: 2, nombre_de_laboratorio: "Lab. Mov. Rect. Uniforme", categoria: "Cinemática", estado: "Activo", fecha_creacion: new Date().toISOString(), resumen: "Análisis del movimiento rectilíneo uniforme.", introduccion: "Se estudia el desplazamiento constante en el tiempo.", marco_teorico: "La velocidad es constante y la aceleración es cero." },
        { id: 3, nombre_de_laboratorio: "Lab. Tiro Parabólico", categoria: "Cinemática", estado: "Inactivo", fecha_creacion: "2026-04-02T09:00:00Z", resumen: "Descripción del lanzamiento de proyectiles en dos dimensiones.", introduccion: "Se evalúa la trayectoria parabólica de un objeto lanzado.", marco_teorico: "El movimiento es independiente en los ejes horizontal y vertical." },
        { id: 4, nombre_de_laboratorio: "Lab. Leyes de Newton", categoria: "Mecánica", estado: "Activo", fecha_creacion: "2026-04-01T11:20:00Z", resumen: "Aplicación de las tres leyes de Newton.", introduccion: "El laboratorio investiga fuerzas y aceleraciones.", marco_teorico: "La fuerza neta es igual a masa por aceleración." },
        { id: 5, nombre_de_laboratorio: "Lab. Energía Cinética y Potencial", categoria: "Mecánica", estado: "Activo", fecha_creacion: "2026-03-30T14:10:00Z", resumen: "Exploración de energía cinética y potencial en sistemas físicos.", introduccion: "Se analiza la conservación de energía mecánica.", marco_teorico: "La energía total se conserva en ausencia de fuerzas no conservativas." },
    ];

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (error) {
            console.error("Error parsing laboratorios from storage", error);
            localStorage.removeItem(STORAGE_KEY);
        }
    }
    return initialLaboratorios;
}

// Obtener laboratorios con transformación y fallback
export async function getLaboratorios() {
    try {
        const apiData = await getLaboratoriosAPI();
        
        // Manejar tanto respuestas de array como de objeto paginado
        const items = Array.isArray(apiData) ? apiData : (apiData?.results || []);
        
        if (items && items.length > 0) {
            const transformedData = items.map(item => ({
                id: item.id,
                nombre_de_laboratorio: item.titulo_lab,
                categoria: item.categoria?.nombre || item.categoria || "Sin categoría",
                estado: item.estado ? "Activo" : "Inactivo",
                fecha_creacion: item.fecha_creacion,
                resumen: item.resumen || "",
                introduccion: item.introduccion || "",
                marco_teorico: item.marco_teorico || "",
                codigo_lab: item.codigo_lab || "",
                objetivo: item.objetivo || null,
                palabras_clave: item.palabras_clave || [],
                creador: item.creador || null,
                ra: item.ra || false
            }));
            console.log("Datos obtenidos del backend:", transformedData);
            return transformedData;
        }
    } catch (error) {
        console.warn("Backend no disponible o error de autenticación, usando localStorage:", error.message);
    }

    return getLaboratoriosFromStorage();
}

// Obtener laboratorio por ID con transformación
export async function getLaboratorioById(id) {
    try {
        const apiData = await getLaboratorioByIdAPI(id);
        if (apiData) {
            return {
                id: apiData.id,
                nombre_de_laboratorio: apiData.titulo_lab,
                categoria: apiData.categoria?.nombre || apiData.categoria || "Sin categoría",
                estado: apiData.estado ? "Activo" : "Inactivo",
                fecha_creacion: apiData.fecha_creacion,
                resumen: apiData.resumen || "",
                introduccion: apiData.introduccion || "",
                marco_teorico: apiData.marco_teorico || "",
                codigo_lab: apiData.codigo_lab || "",
                objetivo: apiData.objetivo || null,
                palabras_clave: apiData.palabras_clave || [],
                creador: apiData.creador || null,
                ra: apiData.ra || false,
                rawData: apiData
            };
        }
    } catch (error) {
        console.warn("Error al obtener laboratorio del backend:", error);
    }

    const labs = getLaboratoriosFromStorage();
    return labs.find((item) => item.id === id) || null;
}

// Guardar laboratorio con fallback a localStorage
export async function saveLaboratorio(laboratorio) {
    const STORAGE_KEY = "fisikapp_laboratorios";
    let backendSuccess = false;

    try {
        let result;
        if (laboratorio.id) {
            result = await updateLaboratorioAPI(laboratorio.id, laboratorio);
        } else {
            result = await createLaboratorioAPI(laboratorio);
        }

        if (result?.success) {
            console.log("Laboratorio guardado en backend exitosamente");
            backendSuccess = true;
        } else {
            console.warn("Error al guardar en backend:", result?.error);
        }
    } catch (error) {
        console.warn("Backend no disponible o error de autenticación:", error.message);
    }

    // Siempre mantener localStorage como respaldo
    const labs = getLaboratoriosFromStorage();
    const updated = labs.map((item) => item.id === laboratorio.id ? { ...item, ...laboratorio } : item);
    const newLabs = updated.some((item) => item.id === laboratorio.id) ? updated : [...labs, laboratorio];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLabs));

    if (backendSuccess) {
        console.log("Guardado exitoso en backend y localStorage");
    } else {
        console.log("Guardado en localStorage (backend no disponible)");
    }

    return newLabs;
};