import { API_CONFIG } from '../apiConfig';


/*




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
    console.log("Respuesta del servidor:", datos); 

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
    return response;
};






*/



export const AdminLab = async (tituloLaboratorio, descripcion, introduxxion, marcoTeorico, categorIA, object, palabrasClave) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.LABS, {   // <----  hasta aqui alcancé

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            titulo_lab:       tituloLaboratorio, 
            resumen:          descripcion,
            introduccion:     introduxxion,
            marco_teorico:    marcoTeorico,
            categoria:        categorIA,
            objetivo:         object,
            palabras_clave:   palabrasClave
        })
    });

    const datos = await response.json(); 
    console.log("Respuesta del servidor:", datos); 

    if (response.ok) {
        return datos; 
    }
};