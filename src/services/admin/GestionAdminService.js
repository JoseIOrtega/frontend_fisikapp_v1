import { API_CONFIG } from '../apiConfig';



export const getAdminsService = async () => {
    try {
        const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.USUARIOS_BASE, {
            method: "GET",
            headers: API_CONFIG.getHeaders(), // Aquí ya va el Token incluido
        });

        if (!response.ok) {
            throw new Error("No se pudo obtener la lista de usuarios del servidor");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en GestionAdminService:", error);
        throw error;
    }
};

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

export const registrarLogLogin = async (userId) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.LOGS, {
        method: 'POST',
        headers: API_CONFIG.getHeaders(),
        body: JSON.stringify({
            accion: "Login",
            descripcion: "Inicio de sesión exitoso desde la plataforma web",
            usuario: userId
        })
    });
    
    if (!response.ok) throw new Error("Error al crear el log");
    return await response.json();
};


export const crearNuevoAdmin = async (datosAdmin) => {
    try {
        const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.USUARIOS_BASE, {
            method: "POST",
            headers: API_CONFIG.getHeaders(),
            body: JSON.stringify({
                nombre: datosAdmin.nombre,
                correo: datosAdmin.correo, // Ojo: verifica si tu backend espera 'email' o 'correo'
                password: datosAdmin.clave,
                rol: datosAdmin.rol,
                estado: true // Por defecto lo creamos activo
            }),
        });

       if (!response.ok) {
    const errorData = await response.json();
    
    const mensajes = {
        correo: 'El correo ya está registrado',
        nombre: 'El nombre es inválido',
        password: 'La contraseña no cumple los requisitos',
    };

    const campoConError = Object.keys(mensajes).find(campo => errorData[campo]);
    const primerError = errorData.detail || errorData.message || mensajes[campoConError] || "Error al crear el miembro";
    
    throw new Error(primerError);
}

        return await response.json();
    } catch (error) {
        console.error("Error en crearNuevoAdmin:", error);
        throw error;
    }
};