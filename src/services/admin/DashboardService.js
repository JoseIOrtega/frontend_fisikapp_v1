// src/services/admin/DashboardService.js
import { API_CONFIG } from "../apiConfig";
import { getLaboratoriosAPI, getLaboratorios } from "./adminLab";

const fetchJson = async (url) => {
  const response = await fetch(url, { headers: API_CONFIG.getHeaders() });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error fetching ${url}: ${response.status} ${response.statusText} - ${errorText}`);
  }
  return response.json();
};

export const getDashboardStats = async () => {
  try {
    // 1. Obtener laboratorios (plantillas base) - usamos la versión transformada como preferencia
    let allLabs = [];
    try {
      const transformed = await getLaboratorios(); // devuelve objetos con `estado` como "Activo"/"Inactivo"
      if (Array.isArray(transformed) && transformed.length > 0) {
        allLabs = transformed;
      } else {
        const allLabsData = await getLaboratoriosAPI();
        allLabs = Array.isArray(allLabsData) ? allLabsData : (allLabsData.results || []);
      }
    } catch (e) {
      const allLabsData = await getLaboratoriosAPI();
      allLabs = Array.isArray(allLabsData) ? allLabsData : (allLabsData.results || []);
    }

    const totalLaboratorios = allLabs.length;
    const isActiveFlag = (lab) => lab.estado === true || lab.estado === 'Activo' || lab.estado === 'activo' || lab.estado === 1;
    const activeLabsCount = allLabs.filter(lab => isActiveFlag(lab)).length;
    const inactiveLabsCount = totalLaboratorios - activeLabsCount;
    const activePercentage = totalLaboratorios > 0 ? Math.round((activeLabsCount / totalLaboratorios) * 100) : 0;
    const inactivePercentage = 100 - activePercentage;
    const laboratoriosEliminados = inactiveLabsCount;

    // 2. Variable temporal para evitar ReferenceError (Ajusta esto con tu lógica real)
    const totalUsuariosAdmin = 3; // O el cálculo/fetch correspondiente si tienes la data

    // 3. Obtener laboratorios profesores para IA si es necesario
    const LABORATORIO_PROFESOR_URL = `${API_CONFIG.BASE_URL}/laboratorio-profesor/`;
    const labsProfesorData = await fetchJson(LABORATORIO_PROFESOR_URL);
    const allLabsProfesor = Array.isArray(labsProfesorData) ? labsProfesorData : (labsProfesorData.results || []);

    // Laboratorios generados con IA (generado_ia=true y activos)
    const aiLabs = allLabsProfesor.filter(lab => lab.generado_ia === true && isActiveFlag(lab)).length;
    const profesorActiveCount = allLabsProfesor.filter(lab => isActiveFlag(lab)).length;
    const eficienciaIA = profesorActiveCount > 0 ? Math.round((aiLabs / profesorActiveCount) * 100) : 0;

    // 4. Tendencias: anual y últimos 12 meses
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const years = [];
    for (let y = currentYear - 4; y <= currentYear; y++) years.push(y);
    const yearlyCounts = {};
    years.forEach(y => yearlyCounts[y] = 0);

    const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Sept.','Oct.','Nov.','Dic.'];
    const last12MonthKeys = [];
    const last12MonthLabels = [];
    const last12MonthCounts = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      last12MonthKeys.push(key);
      last12MonthLabels.push(`${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`);
      last12MonthCounts.push(0);
    }

    allLabs.forEach(lab => {
      try {
        const d = new Date(lab.fecha_creacion);
        if (isNaN(d)) return;
        const y = d.getFullYear();
        const m = d.getMonth();
        const monthKey = `${y}-${m}`;

        if (yearlyCounts.hasOwnProperty(y)) yearlyCounts[y] += 1;

        const index = last12MonthKeys.indexOf(monthKey);
        if (index !== -1) {
          last12MonthCounts[index] += 1;
        }
      } catch (e) {
        // ignorar fecha inválida
      }
    });

    return {
      totalLaboratorios,
      totalUsuariosAdmin, // Ahora ya no romperá el código
      eficienciaIA,
      laboratoriosEliminados,
      activeLabsCount,
      inactiveLabsCount,
      activePercentage,
      inactivePercentage,
      trend: {
        yearlyCounts,
        last12MonthLabels,
        last12MonthCounts,
        years
      }
    };
  } catch (error) {
    console.error("Error en getDashboardStats:", error);
    throw error;
  }
};