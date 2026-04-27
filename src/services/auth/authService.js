import { API_CONFIG } from '../apiConfig';

// recuerden que los nombres dentro de JSON.stringify({ ... }) deben ser exactamente iguales a los que el backend de Django. 
// Si ellos nos dicen que el campo se llama new_password y nosotros pusimos password, el servidor nos va a dar error

// Login 
// services/auth/authService.js
export const loginUser = async (correo, clave) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            correo: correo, 
            password: clave 
        })
    });

    const datos = await response.json(); 

    if (response.ok) {
        return datos; 
    }
};

// Registro de usuario - sin token (porque son usuarios nuevos)
export const registerUser = async (datos) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos)
    });

    const result = await response.json();

    if (!response.ok) {
        const claves = Object.keys(result);
        if (claves.length > 0) {
            const primerError = result[claves[0]];
            const mensaje = Array.isArray(primerError) ? primerError[0] : primerError;
            throw new Error(mensaje);
        }
        throw new Error('Error al registrar');
    }

    return result;
};


