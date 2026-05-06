const BASE_URL = "http://127.0.0.1:8000/api";
//const BASE_URL = "https://backend-fisikapp.onrender.com";

export const API_CONFIG = {
    BASE_URL,
    getHeaders: () => {
        // Buscamos el token del usuario que guardamos al hacer Login
        const token = localStorage.getItem('token'); 

        return {
            // "Content-Type": "application/json", // No lo vamos a usar porque puede interferir con la carga o envio de la foto de perfil
            //"apikey": "token_fijo_del_proyecto", // Este no cambia
            "Authorization": `Bearer ${token}`
        };
    },

    // Centralizamos todas las Rutas
    ENDPOINTS: {
        AUTH: {
            LOGIN: `${BASE_URL}/users/login/`,                            // Para Login.jsx
            REGISTER: `${BASE_URL}/users/register/`,                      // Para RegistrarUsuario.jsx
            RECUPERAR: `${BASE_URL}/users/recuperar-contrasena/`,         // Para RecuperarContrasena.jsx
            RESETEAR: `${BASE_URL}/users/restablecer-contrasena/`,        // Para RestablecerContrasena.jsx
        },

        ADMIN: {
            PERFIL:`${BASE_URL}/users/perfil/`,                             // Solo uso exclusivo para perfil  
            CHANGE_PASSWORD: `${BASE_URL}/users/change-password/`,          // Para cambiar la contraseña en el perfil                 
            USUARIO_DETALLE: (id) => `${BASE_URL}/users/usuarios/${id}/`,  // Para usuario por id.jsx
            USUARIOS_BASE: `${BASE_URL}/users/usuarios/`,                  // Para todos los usuarios
           
            CREAR_ADMIN: `${BASE_URL}/users/crear-admin/`,                  // Para crear un usuario como Admin
            CREAR_PROFESOR_ESTUDIANTE: `${BASE_URL}/users/crear-profesor/`, // Para crear un usuario como profesor o estudiante

            LOGS: `${BASE_URL}/logs/`,
            LABS: `${BASE_URL}/laboratorios`,  // Para LaboratorioAdmin.jsx - corregida según rutas Django

            CATEGORIAS: {
                LIST: `${BASE_URL}/categorias/`, 
                CREATE: `${BASE_URL}/categorias/`,
            },
            OBJETIVOS: {
                LIST: `${BASE_URL}/objetivos/`,
                CREATE: `${BASE_URL}/objetivos/`,
            },
            PALABRAS_CLAVE: {
                LIST: `${BASE_URL}/palabras-clave/`,
                CREATE: `${BASE_URL}/palabras-clave/`,
            },
            LABORATORIOS: {
                LIST: `${BASE_URL}/laboratorios/`,
                CREATE: `${BASE_URL}/laboratorios/`,
            }

        },



    }
};