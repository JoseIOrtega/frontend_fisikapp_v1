const STORAGE_KEY = "fisikapp_laboratorios";

const initialLaboratorios = [
  { id: 1, nombre_de_laboratorio: "Lab. Caída Libre", categoria: "Cinemática", estado: "Activo", fechacreacion: "2026-04-03T15:30:00Z", resumen: "Estudio de caída libre y aceleración gravitatoria.", introduccion: "El laboratorio explora la caída de objetos bajo gravedad.", marco_teorico: "Se utilizan las ecuaciones de movimiento uniformemente acelerado." },
  { id: 2, nombre_de_laboratorio: "Lab. Mov. Rect. Uniforme", categoria: "Cinemática", estado: "Activo", fechacreacion: new Date().toISOString(), resumen: "Análisis del movimiento rectilíneo uniforme.", introduccion: "Se estudia el desplazamiento constante en el tiempo.", marco_teorico: "La velocidad es constante y la aceleración es cero." },
  { id: 3, nombre_de_laboratorio: "Lab. Tiro Parabólico", categoria: "Cinemática", estado: "Inactivo", fechacreacion: "2026-04-02T09:00:00Z", resumen: "Descripción del lanzamiento de proyectiles en dos dimensiones.", introduccion: "Se evalúa la trayectoria parabólica de un objeto lanzado.", marco_teorico: "El movimiento es independiente en los ejes horizontal y vertical." },
  { id: 4, nombre_de_laboratorio: "Lab. Leyes de Newton", categoria: "Mecánica", estado: "Activo", fechacreacion: "2026-04-01T11:20:00Z", resumen: "Aplicación de las tres leyes de Newton.", introduccion: "El laboratorio investiga fuerzas y aceleraciones.", marco_teorico: "La fuerza neta es igual a masa por aceleración." },
  { id: 5, nombre_de_laboratorio: "Lab. Energía Cinética y Potencial", categoria: "Mecánica", estado: "Activo", fechacreacion: "2026-03-30T14:10:00Z", resumen: "Exploración de energía cinética y potencial en sistemas físicos.", introduccion: "Se analiza la conservación de energía mecánica.", marco_teorico: "La energía total se conserva en ausencia de fuerzas no conservativas." },
];

export function getLaboratorios() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error parsing laboratorios from storage", error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialLaboratorios));
  return initialLaboratorios;
}

export function saveLaboratorio(laboratorio) {
  const labs = getLaboratorios();
  const updated = labs.map((item) => item.id === laboratorio.id ? { ...item, ...laboratorio } : item);
  const newLabs = updated.some((item) => item.id === laboratorio.id) ? updated : [...labs, laboratorio];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newLabs));
  return newLabs;
}

export function getLaboratorioById(id) {
  return getLaboratorios().find((item) => item.id === id);
}
