import { API_CONFIG } from "../apiConfig";

// 🔹 Obtener TODOS los laboratorios
export const getLaboratorios = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN.LABS, {
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

// 🔹 Obtener UN laboratorio por ID
export const getLaboratorioById = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_CONFIG.ENDPOINTS.ADMIN.LABS}/${id}/`, {
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



