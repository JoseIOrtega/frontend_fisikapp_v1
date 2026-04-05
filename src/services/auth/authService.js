import { API_CONFIG } from '../apiConfig';

// recuerden que los nombres dentro de JSON.stringify({ ... }) deben ser exactamente iguales a los que el backend de Django. 
// Si ellos nos dicen que el campo se llama new_password y nosotros pusimos password, el servidor nos va a dar error

// Login 
export const loginUser = async (email, password) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": "tu_token_fijo_del_proyecto" 
        },
        body: JSON.stringify({ email, password })
    });
    return response; 
};

// Recuperar Contraseña - Envío de correo 
export const recoverPassword = async (email) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.AUTH.RECOVER, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": "tu_token_fijo_del_proyecto" 
        },
        body: JSON.stringify({ email: email })
    });
    return response;
};

// Registro de usuario - sin token (porque son usuarios nuevos)
export const registerUser = async (datos) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": "tu_token_fijo_del_proyecto"
        },
        body: JSON.stringify(datos)
    });
    return response;
};

// Restablecer Contraseña
export const resetPassword = async (token, newPassword) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.AUTH.RESET, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": "tu_token_fijo_del_proyecto" 
        },
        // Enviamos el token que validó el correo y la nueva contraseña
        body: JSON.stringify({ 
            token: token, 
            password: newPassword 
        })
    });
    return response;
};