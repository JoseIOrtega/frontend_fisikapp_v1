const BASE_URL = "http://127.0.0.1:8000";

export const API_CONFIG = {
    BASE_URL,
    getHeaders: () => {
        // Buscamos el token del usuario que guardamos al hacer Login
        const token = localStorage.getItem('token'); 

        // Para realizar pruebas
        // const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc1NjkzNzM2LCJpYXQiOjE3NzU2OTM0MzYsImp0aSI6ImE3MTllNDY4ZWQ3ZDQ4MWQ4ZGJhMTRjYmNhYmQ4ODI1IiwidXNlcl9pZCI6Mn0.8oZe0fILIxp6spcpsf2Ek8YY5EjZKf_KLwSRFtciBGw"
        return {
            "Content-Type": "application/json",
            //"apikey": "token_fijo_del_proyecto", // Este no cambia
            "Authorization": `Bearer ${token}`
        };
    },

    // Centralizamos todas las Rutas
    ENDPOINTS: {
        AUTH: {
            LOGIN: `${BASE_URL}/api/users/login/`,                        // Para Login.jsx
            REGISTER: `${BASE_URL}/api/users/Registrar/`,                 // Para RegistrarUsuario.jsx
            // RECOVER: `${BASE_URL}/auth/recover/`,                      // Para RecuperarContrasena.jsx
            // RESET: `${BASE_URL}/api/users/restablecer-password/`,      // Para RestablecerContrasena.jsx
        },

        ADMIN: {
            PERFIL: `${BASE_URL}/api/users/Registrar/`,                    // Para perfil de usuarios.jsx
        },
        
    }
};