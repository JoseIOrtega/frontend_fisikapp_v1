import { API_CONFIG } from '../apiConfig';


// Para obtener los datos por ID usando la configuración global
export const obtenerDatosPorId = async (id) => {
    const token = localStorage.getItem('token');
    
    // Construimos la URL usando la constante de tu configuración
    // Asegúrate de que API_CONFIG.ENDPOINTS.ADMIN.PERFIL termine en '/'
    const url = `${API_CONFIG.ENDPOINTS.ADMIN.PERFIL}${id}/`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}` // <--- Usamos 'Token' como en tus otros servicios
        }
    });

    if (!response.ok) throw new Error("No se pudo obtener el usuario por ID");

    return await response.json();
};

export const getPerfilUser = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id'); 

    // Validación de seguridad
    if (!userId) {
        console.error("Error: No hay user_id en el localStorage");
        throw new Error("Sesión no identificada");
    }

    // Construcción de la URL: http://127.0.0.1:8000/api/users/Registrar/{id}/
    const url = `${API_CONFIG.ENDPOINTS.ADMIN.PERFIL}${userId}/`;

    console.log("Intentando conectar a:", url); // Para que verifiques en consola

    const response = await fetch(url, { 
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Cambiado a Bearer para JWT
        }
    });

    if (!response.ok) {
        const errorHtml = await response.text();
        console.error("El servidor respondió con un error:", errorHtml);
        throw new Error("No se pudieron cargar los datos del perfil.");
    }

    // Retorna el objeto del usuario directamente
    return await response.json(); 
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


