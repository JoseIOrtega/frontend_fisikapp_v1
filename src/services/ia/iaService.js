const BASE_URL_IA = "https://agentes-ia-9heysq.fly.dev";

/**
 * Genera el contenido detallado a partir de los metadatos iniciales del laboratorio.
 * @param {Object} payload - { categoria, objetivo, palabras_clave, titulo }
 */
export const generarContenidoLaboratorioIA = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL_IA}/generar-contenido`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Error en el servidor de IA: ${response.statusText}`);
    }

    return await response.json(); 
  } catch (error) {
    console.error("Error al generar contenido con IA:", error);
    throw error;
  }
};

//=====================================================//
//genera descripcion corta y los objetivos//
//=====================================================//

export const generarPortadaIA = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL_IA}/generar-portada`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Error en el servidor de IA: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al generar la portada:", error);
    throw error;
  }
};

//=====================================================//
//genera la imagen de portada//
//=====================================================//

export const generarImagenPortadaIA = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL_IA}/generar-imagen-portada`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Error en el servidor de IA: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al generar la imagen:", error);
    throw error;
  }
};