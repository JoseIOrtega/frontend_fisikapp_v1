import { API_CONFIG } from "../../services/apiConfig";

/**
 * Obtiene la lista completa de usuarios (Estudiantes y Profesores)
 * @returns {Promise<Array>} Lista de usuarios desde la base de datos
 */
export const getUsuarios = async () => {
    try {
        const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.USUARIOS_BASE, {
            method: "GET",
            headers: API_CONFIG.getHeaders(), // Incluye el Token de autorización
        });

        if (!response.ok) {
            throw new Error("No se pudo obtener la lista de usuarios");
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Error en usuariosService:", error);
        throw error;
    }
};

// 2. Obtener Logs de ingreso
export const getLoginLogsService = async () => {
    try {
        const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.LOGS, {
            method: "GET",
            headers: API_CONFIG.getHeaders(),
        });
        if (!response.ok) throw new Error("No se pudieron obtener los logs");
        return await response.json();
    } catch (error) {
        console.error("Error en LogsService:", error);
        throw error;
    }
};

// 3. Actualizar usuario (PATCH para cambios parciales como el Estado o Datos)
export const actualizarUsuarioService = async (id, datosActualizados) => {
    try {
        // Usamos la función dinámica de ApiConfig pasando el ID
        const url = API_CONFIG.ENDPOINTS.ADMIN.USUARIO_DETALLE(id);
        
        const response = await fetch(url, {
            method: "PATCH", 
            headers: {
                ...API_CONFIG.getHeaders(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosActualizados),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData;
            // throw new Error(errorData.detail || "No se pudo actualizar el usuario");
            // // En lugar de lanzar un Error genérico, lanzamos el JSON del backend 
        }
        return await response.json();
    } catch (error) {
        console.error("Error en actualizarUsuarioService:", error);
        throw error;
    }
};

//4. Nueva función para ver detalles de los usuarios
export const getUsuarioDetalle = async (id) => {
    const token = localStorage.getItem('token');
    // Usamos el endpoint que recibe ID que ya tienes en tu config
    const url = API_CONFIG.ENDPOINTS.ADMIN.USUARIO_DETALLE(id);

    const response = await fetch(url, { 
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) throw new Error("No se pudo obtener el detalle del usuario.");

    const data = await response.json();

    // Reutilizamos tu lógica de la foto para que no salga rota
    if (data.foto && typeof data.foto === 'string' && !data.foto.startsWith('http')) {
        const baseUrl = API_CONFIG.BASE_URL.replace('/api', ''); 
        data.foto = `${baseUrl}${data.foto}`; 
    }

    return data;
};


// 5. Crear nuevo usuario profesor o estudiante
export const crearNuevoUsuario = async (datosUsuario) => {
    try {
        const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.CREAR_PROFESOR_ESTUDIANTE, {
            method: "POST",
            headers: {
                ...API_CONFIG.getHeaders(),
                "Content-Type": "application/json"
            },
            // PURIFICADO: Solo enviamos nombre y correo.
            // Se asume que el backend asignará el rol 'profesor' por defecto 
            // o lo gestionará internamente al usar este endpoint.
            body: JSON.stringify({
                nombre: datosUsuario.nombre,
                correo: datosUsuario.correo
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            
            const traducciones = {
                "users with this correo already exists.": "Este correo electrónico ya está registrado en el sistema.",
                "This field is required.": "Este campo es obligatorio.",
                "Enter a valid email address.": "Ingresa un correo electrónico válido."
            };

            if (errorData.correo) {
                errorData.correo = errorData.correo.map(msg => traducciones[msg] || msg);
            }

            const errorCustom = new Error("Error de validación");
            errorCustom.detalles = errorData; 
            throw errorCustom;
        }

        return await response.json();
    } catch (error) {
        console.error("Error en crearNuevoUsuario:", error);
        throw error;
    }
};