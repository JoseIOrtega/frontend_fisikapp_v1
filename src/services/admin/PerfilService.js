import { API_CONFIG } from '../apiConfig';

// 1. FUNCIÓN PARA TRAER LOS DATOS (Al cargar la página)
export const getPerfilUser = async () => {
    const token = localStorage.getItem('token');
    const correoLogueado = localStorage.getItem('user_email');
    
    const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.PERFIL, { 
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Token ${token}` // <--- Mantén 'Token' lo que pide Django
        }
    });

    if (!response.ok) throw new Error("Error al obtener perfil");

    const datos = await response.json();


    if (Array.isArray(datos)) {
        // Buscamos al usuario que coincida con el correo que ingresó en el Login
        const usuarioCorrecto = datos.find(u => u.correo === correoLogueado);
        return usuarioCorrecto || datos[0]; 
    }
};

// 2. FUNCIÓN PARA ACTUALIZAR (Cuando presionan "Guardar Cambios")
export const updatePerfilUser = async (userData) => {
    const token = localStorage.getItem('token');
    
    // Forzamos la URL para que siempre tenga el ID y el slash final
    // Si userData.id no existe, usa un ID manual para probar (ej. 1)
    const idUsuario = userData.id || 1; 
    const url = `${API_CONFIG.ENDPOINTS.ADMIN.PERFIL}${idUsuario}/`;

    console.log("Intentando actualizar en:", url);
    console.log("Datos enviados:", userData);

    const response = await fetch(url, { 
        method: "PATCH", 
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Token ${token}` 
        },
        body: JSON.stringify(userData)
    });

    const datos = await response.json();
    
    if (!response.ok) {
        console.error("Error detallado del servidor:", datos);
        throw new Error("No se pudo actualizar");
    }
    
    return datos;
};