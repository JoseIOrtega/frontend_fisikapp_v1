import { API_CONFIG } from '../apiConfig';


// Para obtener los datos por ID usando la configuración global
export const getPerfilUse = async (id) => {
    const token = localStorage.getItem('token');
    
    //const url = `${API_CONFIG.ENDPOINTS.ADMIN.PERFIL}${id}/`;
    const url = API_CONFIG.ENDPOINTS.ADMIN.USUARIO_DETALLE(id);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // <--- Usamos 'Token' como en tus otros servicios
        }
    });

    if (!response.ok) throw new Error("No se pudo obtener el usuario por ID");

    return await response.json();
};


// Funcion para traer los datos del usuario y agregarlos a los campos del formulario perfil
export const getPerfilUser = async () => {
    const token = localStorage.getItem('token');
    const url = API_CONFIG.ENDPOINTS.ADMIN.PERFIL;

    const response = await fetch(url, { 
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) throw new Error("No se pudieron cargar los datos.");

    const data = await response.json();

    // --- PROCESAMIENTO DE DATOS ---
    // Si el backend envía "/media/perfil/foto.jpg", aquí lo completamos
    if (data.foto && typeof data.foto === 'string' && !data.foto.startsWith('http')) {
        const baseUrl = API_CONFIG.BASE_URL.replace('/api', ''); 
        data.foto = `${baseUrl}${data.foto}`; 
    }

    return data; // Ahora data.foto ya es una URL completa
};

// Función para actualizar los datos y foto (FormData)
export const updatePerfilUser = async (dataAEnviar) => {
    const token = localStorage.getItem('token');
    const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.PERFIL, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` },
        body: dataAEnviar
    });

    if (!response.ok) {
        // En lugar de lanzar un Error genérico, lanzamos el JSON del backend
        const errorData = await response.json(); 
        throw errorData; 
    }
    return await response.json();
};
// export const updatePerfilUser = async (dataAEnviar) => {
//     const token = localStorage.getItem('token');
//     const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.PERFIL, {
//         method: "PATCH",
//         headers: { "Authorization": `Bearer ${token}` }, // Sin Content-Type para FormData
//         body: dataAEnviar
//     });
//     if (!response.ok) throw new Error("Error al actualizar perfil");
//     return await response.json();
// };

// Función para el cambio de la contraseña (JSON)
// export const changePasswordUser = async (passwords) => {
//     const token = localStorage.getItem('token');
//     const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.CHANGE_PASSWORD, {
//         method: "POST", // Usualmente es POST para cambios de seguridad
//         headers: { 
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}` 
//         },
//         body: JSON.stringify(passwords)
//     });
//     if (!response.ok) {
//         const error = await response.json();
//         throw error; // Lanzamos el error del backend (ej: "Clave actual incorrecta")
//     }
//     return await response.json();
// };
export const changePasswordUser = async (passwords) => {
    const token = localStorage.getItem('token');
    const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.CHANGE_PASSWORD, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(passwords)
    });

    if (!response.ok) {
        // IMPORTANTE: Esperamos el JSON antes de lanzarlo
        const errorData = await response.json(); 
        throw errorData; 
    }
    return await response.json();
};