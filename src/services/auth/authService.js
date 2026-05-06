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
    } else {
        // --- ESTO ES LO NUEVO ---
        // Creamos un objeto de error que contenga el status y los datos
        const errorPersonalizado = {
            status: response.status,
            data: datos
        };
        throw errorPersonalizado; // Lanzamos el error para que caiga en el 'catch'
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


// Para recuperar la contraseña envia solo Correo
export const enviarEnlaceRecuperacion = async (correo) => {
    try {
        const response = await fetch(API_CONFIG.ENDPOINTS.AUTH.RECUPERAR, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ correo:correo }), // El backend espera el campo "correo"
        });

        const data = await response.json();
        console.log("Data: ",data)

        if (!response.ok) {
            // Si el correo no existe o hay error, lanzamos el mensaje del backend
            console.log("Data error: ", data.error);
            throw new Error(data.error || data.detail || "No se pudo enviar el correo de recuperación");
        }

        return data;
    } catch (error) {
        console.error("Error en enviarEnlaceRecuperacion:", error);
        throw error;
    }
};





// para restablecer enviando la nueva contraseña 
export const confirmarRestablecerPassword = async (uid, token, nuevaContrasena) => {
    const response = await fetch(API_CONFIG.ENDPOINTS.AUTH.RESETEAR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            uid: uid,
            token: token,
            new_password: nuevaContrasena,
            confirm_password: nuevaContrasena 
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al restablecer");
    }

    return data;
};