import { API_CONFIG } from "../apiConfig";

// 🔹 Obtener TODOS los laboratorios de auditoría
export const getLaboratorios = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.LABS_AUDITORIA, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Error al obtener los laboratorios");
  }

  return await response.json();
};

// 🔹 Obtener UN laboratorio por ID usando la ruta dinámica del apiConfig
export const getLaboratorioById = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.LABS_AUDITORIA_DETALLE(id), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Error al obtener el laboratorio");
  }

  return await response.json();
};

// 🔹 Actualizar el estado (Activo/Inactivo) de un laboratorio en Django
export const updateEstadoLaboratorio = async (id, nuevoEstado) => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.LABS_AUDITORIA_DETALLE(id), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ estado: nuevoEstado })
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el estado del laboratorio");
  }

  return await response.json();
};