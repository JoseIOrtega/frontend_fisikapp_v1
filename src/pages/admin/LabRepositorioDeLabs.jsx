import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout"
import AdminDataTable from "../../components/UI/admin/AdminDataTable"
import AdminIconButton from "../../components/UI/admin/AdminIconButton";
import { Edit, Eye, Trash2, UserX, UserCheck } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateHelpers';
import { getLaboratoriosAPI, getLaboratorioByIdAPI, createLaboratorioAPI, updateLaboratorioAPI, deleteLaboratorioAPI } from '../../services/admin/adminLab';
import style from './LabRepositorioDeLabs.module.css'

function LabRepositorioDeLabs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [laboratorios, setLaboratorios] = useState([]);
  const [laboratoriosBloqueados, setLaboratoriosBloqueados] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadLaboratorios = async () => {
      const data = await getLaboratorios();
      setLaboratorios(data);
    };
    loadLaboratorios();
  }, []);

  const columnas = [
    { label: "Nombre de Laboratorio" },
    { label: "Categoría" },
    { label: "Estado" },
    { label: "Creado" },
    { label: "Acciones", style: { textAlign: 'center' } }
  ];

  const filteredLaboratorios = laboratorios.filter((laboratorio) =>
    laboratorio.nombre_de_laboratorio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    laboratorio.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    laboratorio.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    laboratorio.fechacreacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (laboratorio) => {
    navigate("/admin/laboratorio/configurar_labs", {
      state: { laboratorio }
    });
  };

  const handleView = (laboratorio) => {
    navigate(`/admin/laboratorio/repositorio_labs/${laboratorio.id}`);
  };

  const handleToggleBloqueo = async (laboratorio) => {
    const nuevoEstado = laboratorio.estado === "Activo" ? "Inactivo" : "Activo";
    
    // Actualizar el estado bloqueado visualmente
    setLaboratoriosBloqueados(prev => ({
      ...prev,
      [laboratorio.id]: !prev[laboratorio.id]
    }));

    // Actualizar el laboratorio
    const laboratorioActualizado = {
      ...laboratorio,
      estado: nuevoEstado
    };

    // Guardar cambios
    await saveLaboratorio(laboratorioActualizado);

    // Actualizar la lista de laboratorios
    setLaboratorios(prevLabs =>
      prevLabs.map(lab =>
        lab.id === laboratorio.id
          ? { ...lab, estado: nuevoEstado }
          : lab
      )
    );
  };

  const handleDelete = async (laboratorio) => {
    // Confirmar la eliminación
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el laboratorio "${laboratorio.nombre_de_laboratorio}"?`)) {
      return;
    }

    try {
      // Intentar eliminar del backend
      const resultado = await deleteLaboratorioAPI(laboratorio.id);

      if (resultado.success) {
        console.log("Laboratorio eliminado del backend exitosamente");
      } else {
        console.warn("Error al eliminar del backend:", resultado.error);
      }

      // Eliminar de localStorage
      const labs = getLaboratoriosFromStorage();
      const updatedLabs = labs.filter(lab => lab.id !== laboratorio.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLabs));

      // Eliminar de la lista visible
      setLaboratorios(prevLabs =>
        prevLabs.filter(lab => lab.id !== laboratorio.id)
      );

      // Limpiar estado de bloqueado si existía
      setLaboratoriosBloqueados(prev => {
        const newState = { ...prev };
        delete newState[laboratorio.id];
        return newState;
      });

      console.log("Laboratorio eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar laboratorio:", error);
      alert("Error al eliminar el laboratorio. Por favor, intenta de nuevo.");
    }
  };

  return (
    <AdminLayout onSearch={setSearchTerm}>
      <div className={style["layout"]}>
        <div className={style["seccion_del_header"]}>
          <h2 className={style.titulo_header_laboratorio}>Repositorio de Laboratorios</h2>
        </div>

        <AdminDataTable
          columns={columnas}
          data={filteredLaboratorios}
          renderRow={(laboratorio) => (
            <tr key={laboratorio.id} className={laboratoriosBloqueados[laboratorio.id] ? style.filaBloqueada : ""}>
              <td className={style.nombre_laboratorio}>{laboratorio.nombre_de_laboratorio}</td>
              <td>{laboratorio.categoria}</td>
              <td><span className={laboratorio.estado === "Activo" ? style.statusActive : style.statusInactive}>{laboratorio.estado}</span></td>
              <td title={new Date(laboratorio.fechacreacion).toLocaleString()} style={{ cursor: 'help' }}>{getRelativeTime(laboratorio.fechacreacion)}</td>
              <td className={style.actionsDetails}>
                <AdminIconButton icon={Edit} title="editar" type="edit" onClick={() => handleEdit(laboratorio)} />
                <AdminIconButton icon={Eye} title="ver" type="detail" onClick={() => handleView(laboratorio)} />
                <AdminIconButton 
                  icon={laboratorio.estado === "Activo" ? UserX : UserCheck} 
                  title="bloquear" 
                  type={laboratoriosBloqueados[laboratorio.id] ? "blocked" : "delete"}
                  onClick={() => handleToggleBloqueo(laboratorio)}
                  isBlocked={laboratoriosBloqueados[laboratorio.id]}
                />
                <AdminIconButton icon={Trash2} title="Eliminar" type="delete" onClick={() => handleDelete(laboratorio)} />
              </td>
            </tr>
          )}
        ></AdminDataTable>
      </div>
    </AdminLayout>
  )
}

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

export default LabRepositorioDeLabs
