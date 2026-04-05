const BASE_URL = "https://tu-api-django.com/rest/v1";

export const API_CONFIG = {
    BASE_URL,
    getHeaders: () => {
        // Buscamos el token del usuario que guardamos al hacer Login
        const token = localStorage.getItem('token'); 
        return {
            "Content-Type": "application/json",
            "apikey": "tu_token_fijo_del_proyecto", // Este no cambia
            "Authorization": token ? `Bearer ${token}` : "" // Este sí cambia por usuario
        };
    },

    // Centralizamos todas las Rutas
    ENDPOINTS: {
        AUTH: {
            LOGIN: `${BASE_URL}/auth/login`,        // Para Login.jsx
            REGISTER: `${BASE_URL}/auth/register`,  // Para RegistrarUsuario.jsx
            RECOVER: `${BASE_URL}/auth/recover`,    // Para RecuperarContrasena.jsx
            RESET: `${BASE_URL}/auth/reset`,        // Para RestablecerContrasena.jsx
        },
    }
};