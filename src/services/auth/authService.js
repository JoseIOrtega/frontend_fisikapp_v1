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
            username: correo, 
            password: clave 
        })
    });

    const datos = await response.json(); 
    console.log("Respuesta del servidor:", datos); 

    if (response.ok) {
        return datos; 
    }
};


