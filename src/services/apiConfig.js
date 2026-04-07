const BASE_URL = "http://127.0.0.1:8000/api";

export const API_CONFIG = {
    BASE_URL,
    getHeaders: () => {
        // Buscamos el token del usuario que guardamos al hacer Login
        // const token = localStorage.getItem('token'); 

        // Para realizar pruebas
        const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc1NTAzNDM2LCJpYXQiOjE3NzU0MTcwMzYsImp0aSI6ImE2ODRiZDllZDI1NjRkZWZhNWJlZDY2MTAyOTc4NTU2IiwidXNlcl9pZCI6Mn0.mzxhtZSBCTfc79dtgoGaEXJf8FezaRtnnx8SO_XFBWM"
        return {
            "Content-Type": "application/json",
            //"apikey": "token_fijo_del_proyecto", // Este no cambia
            "Authorization": `Bearer ${token}`
        };
    },

    // Centralizamos todas las Rutas
    ENDPOINTS: {
        AUTH: {
            LOGIN: `${BASE_URL}/auth/login/`,        // Para Login.jsx
            REGISTER: `${BASE_URL}/auth/register/`,  // Para RegistrarUsuario.jsx
            RECOVER: `${BASE_URL}/auth/recover/`,    // Para RecuperarContrasena.jsx
            RESET: `${BASE_URL}/auth/reset/`,        // Para RestablecerContrasena.jsx
        },
    }
};