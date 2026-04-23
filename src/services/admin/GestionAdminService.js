import { API_CONFIG } from '../apiConfig';

// 1. Obtener todos los usuarios
export const getAdminsService = async () => {
    try {
        const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.USUARIOS_BASE, {
            method: "GET",
            headers: API_CONFIG.getHeaders(),
        });

        if (!response.ok) {
            throw new Error("No se pudo obtener la lista de usuarios del servidor");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en getAdminsService:", error);
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

// 3. Crear nuevo administrador (POST a la base)
export const crearNuevoAdmin = async (datosAdmin) => {
    try {
        const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.USUARIOS_ADMIN, {
            method: "POST",
            headers: {
                ...API_CONFIG.getHeaders(),
                "Content-Type": "application/json" // Necesario para que el backend lea el JSON
            },
            body: JSON.stringify({
                nombre: datosAdmin.nombre,
                correo: datosAdmin.correo,
                password: datosAdmin.clave,
                rol: datosAdmin.rol,
                estado: true,
                foto: null // IMPORTANTE: Envíalo como null explícito si es nuevo 
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            
            // 1. Diccionario de traducciones para campos específicos
            const traducciones = {
                "users with this correo already exists.": "Este correo electrónico ya está registrado en el sistema.",
                "This field is required.": "Este campo es obligatorio.",
                "Enter a valid email address.": "Ingresa un correo electrónico válido."
            };

            // 2. Revisamos si el error de 'correo' necesita traducción
            if (errorData.correo) {
                // Mapeamos los mensajes de inglés a español
                errorData.correo = errorData.correo.map(msg => traducciones[msg] || msg);
            }

            // 3. Lanzamos el error con los datos ya traducidos
            const errorCustom = new Error("Error de validación");
            errorCustom.detalles = errorData; 
            throw errorCustom;
        }

        return await response.json();
    } catch (error) {
        console.error("Error en crearNuevoAdmin:", error);
        throw error;
    }
};

// --- NUEVAS FUNCIONES PARA GESTIÓN POR ID ---

// 4. Actualizar usuario (PATCH para cambios parciales como el Estado o Datos)
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
            throw new Error(errorData.detail || "No se pudo actualizar el usuario");
        }
        return await response.json();
    } catch (error) {
        console.error("Error en actualizarUsuarioService:", error);
        throw error;
    }
};

// 5. Eliminar usuario (DELETE usando ID)
export const eliminarUsuarioService = async (id) => {
    try {
        const url = API_CONFIG.ENDPOINTS.ADMIN.USUARIO_DETALLE(id);
        
        const response = await fetch(url, {
            method: "DELETE",
            headers: API_CONFIG.getHeaders(),
        });

        if (!response.ok) throw new Error("No se pudo eliminar el usuario");
        
        return true; // Éxito
    } catch (error) {
        console.error("Error en eliminarUsuarioService:", error);
        throw error;
    }
};

// 6. Registrar Log de Login (Ajustado a tu Swagger)
export const registrarLogLogin = async (userId) => {
    try {
        const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.LOGS, {
            method: "POST",
            headers: {
                ...API_CONFIG.getHeaders(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accion: "Inicio de Sesión", // String según Swagger
                descripcion: "El usuario ha ingresado exitosamente a Fisikapp.", // String según Swagger
                usuario: userId // Number según Swagger (datos.user.id)
            }),
        });

        if (!response.ok) {
            throw new Error("No se pudo registrar el log de actividad");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en registrarLogLogin:", error);
        throw error;
    }
};