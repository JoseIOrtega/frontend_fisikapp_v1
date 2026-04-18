import { getLaboratoriosAPI, getLaboratorioByIdAPI, createLaboratorioAPI, updateLaboratorioAPI } from './adminLab';

const STORAGE_KEY = "fisikapp_laboratorios";

const initialLaboratorios = [
  { id: 1, nombre_de_laboratorio: "Lab. Caída Libre", categoria: "Cinemática", estado: "Activo", fechacreacion: "2026-04-03T15:30:00Z", resumen: "Estudio de caída libre y aceleración gravitatoria.", introduccion: "El laboratorio explora la caída de objetos bajo gravedad.", marco_teorico: "Se utilizan las ecuaciones de movimiento uniformemente acelerado." },
  { id: 2, nombre_de_laboratorio: "Lab. Mov. Rect. Uniforme", categoria: "Cinemática", estado: "Activo", fechacreacion: new Date().toISOString(), resumen: "Análisis del movimiento rectilíneo uniforme.", introduccion: "Se estudia el desplazamiento constante en el tiempo.", marco_teorico: "La velocidad es constante y la aceleración es cero." },
  { id: 3, nombre_de_laboratorio: "Lab. Tiro Parabólico", categoria: "Cinemática", estado: "Inactivo", fechacreacion: "2026-04-02T09:00:00Z", resumen: "Descripción del lanzamiento de proyectiles en dos dimensiones.", introduccion: "Se evalúa la trayectoria parabólica de un objeto lanzado.", marco_teorico: "El movimiento es independiente en los ejes horizontal y vertical." },
  { id: 4, nombre_de_laboratorio: "Lab. Leyes de Newton", categoria: "Mecánica", estado: "Activo", fechacreacion: "2026-04-01T11:20:00Z", resumen: "Aplicación de las tres leyes de Newton.", introduccion: "El laboratorio investiga fuerzas y aceleraciones.", marco_teorico: "La fuerza neta es igual a masa por aceleración." },
  { id: 5, nombre_de_laboratorio: "Lab. Energía Cinética y Potencial", categoria: "Mecánica", estado: "Activo", fechacreacion: "2026-03-30T14:10:00Z", resumen: "Exploración de energía cinética y potencial en sistemas físicos.", introduccion: "Se analiza la conservación de energía mecánica.", marco_teorico: "La energía total se conserva en ausencia de fuerzas no conservativas." },
];

export async function getLaboratorios() {
  try {
    // Intentar obtener datos del backend
    const apiData = await getLaboratoriosAPI();
    if (apiData && Array.isArray(apiData)) {
      // Transformar datos del API al formato del frontend
      const transformedData = apiData.map(item => ({
        id: item.id,
        nombre_de_laboratorio: item.titulo_lab,
        categoria: item.categoria,
        estado: item.estado ? "Activo" : "Inactivo",
        fechacreacion: item.fechacreacion,
        resumen: item.resumen || "",
        introduccion: item.introduccion || "",
        marco_teorico: item.marco_teorico || ""
      }));
      console.log("Datos obtenidos del backend:", transformedData);
      return transformedData;
    }
  } catch (error) {
    console.warn("Backend no disponible o error de autenticación, usando localStorage:", error.message);
  }

  // Fallback a localStorage
  return getLaboratoriosFromStorage();
}

export async function saveLaboratorio(laboratorio) {
  let backendSuccess = false;

  try {
    // Intentar guardar en el backend
    let result;
    if (laboratorio.id && laboratorio.id <= 5) { // IDs iniciales, intentar actualizar
      result = await updateLaboratorioAPI(laboratorio.id, laboratorio);
    } else {
      result = await createLaboratorioAPI(laboratorio);
    }

    if (result.success) {
      console.log("Laboratorio guardado en backend exitosamente");
      backendSuccess = true;
    } else {
      console.warn("Error al guardar en backend:", result.error);
    }
  } catch (error) {
    console.warn("Backend no disponible o error de autenticación:", error.message);
  }

  // Siempre mantener localStorage como respaldo
  const labs = getLaboratoriosFromStorage();
  const updated = labs.map((item) => item.id === laboratorio.id ? { ...item, ...laboratorio } : item);
  const newLabs = updated.some((item) => item.id === laboratorio.id) ? updated : [...labs, laboratorio];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newLabs));

  if (backendSuccess) {
    console.log("Guardado exitoso en backend y localStorage");
  } else {
    console.log("Guardado en localStorage (backend no disponible)");
  }

  return newLabs;
}

export async function getLaboratorioById(id) {
  try {
    // Intentar obtener del backend
    const apiData = await getLaboratorioByIdAPI(id);
    if (apiData) {
      return {
        id: apiData.id,
        nombre_de_laboratorio: apiData.titulo_lab,
        categoria: apiData.categoria,
        estado: apiData.estado ? "Activo" : "Inactivo",
        fechacreacion: apiData.fechacreacion,
        resumen: apiData.resumen || "",
        introduccion: apiData.introduccion || "",
        marco_teorico: apiData.marco_teorico || "",
        rawData: apiData
      };
    }
  } catch (error) {
    console.warn("Error al obtener laboratorio del backend:", error);
  }

  // Fallback a localStorage
  const labs = getLaboratoriosFromStorage();
  return labs.find((item) => item.id === id) || null;
}

// Función auxiliar para obtener datos solo de localStorage
function getLaboratoriosFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error parsing laboratorios from storage", error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  return initialLaboratorios;
}
