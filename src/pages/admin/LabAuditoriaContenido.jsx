import { useState, useEffect } from "react";
import { getLaboratorios, updateEstadoLaboratorio } from "../../services/admin/LabAuditoriaContenidoService";
import AdminLayout from "../../layouts/AdminLayout";
import AdminDataTable from "../../components/UI/admin/AdminDataTable";
import AdminIconButton from "../../components/UI/admin/AdminIconButton";
import { Eye, UserX, UserCheck } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateHelpers';
import style from './LabAuditoriaContenido.module.css';
import { useNavigate } from "react-router-dom";

function LabAuditoriaContenido() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const toggleEstadoLocal = async (id, estadoActual) => {
    try {
      const nuevoEstado = !estadoActual;
      await updateEstadoLaboratorio(id, nuevoEstado);

      const nuevos = laboratorios.map((lab) =>
        lab.id === id ? { ...lab, estado: nuevoEstado } : lab
      );
      setLaboratorios(nuevos);
    } catch (error) {
      console.error("No se pudo cambiar el estado en el servidor:", error);
    }
  };

  const columnas = [
    { label: "Nombre de Laboratorio" },
    { label: "Categoría" },
    { label: "Creador" },
    { label: "Estado" },
    { label: "Último ingreso" },
    { label: "Acciones", style: { textAlign: 'center' } }
  ];

  useEffect(() => {
    fetchLaboratorios();
  }, []);

  const fetchLaboratorios = async () => {
    try {
      const data = await getLaboratorios();
      let listaOriginal = [];

      if (data && Array.isArray(data.results)) {
        listaOriginal = data.results;
      } else if (Array.isArray(data)) {
        listaOriginal = data;
      }

      // 🔹 SOLUCIÓN DEFENSIVA: Si Django no envía 'id', generamos uno correlativo (1, 2, 3...) 
      // para que React pueda construir la ruta de navegación correctamente.
      const laboratoriosProcesados = listaOriginal.map((lab, index) => ({
        ...lab,
        id: lab.id !== undefined ? lab.id : (index + 1)
      }));

      setLaboratorios(laboratoriosProcesados);
    } catch (error) {
      console.error("Error al obtener laboratorios en el componente:", error);
      setLaboratorios([]);
    }
  };

  const filteredAdmins = Array.isArray(laboratorios)
    ? laboratorios.filter((lab) =>
        lab.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
  return (
    <AdminLayout onSearch={setSearchTerm}>
        <div className={style["layout"]}>
            <div className={style["seccion_del_header"]}>
              <h2 className={style.titulo_header_laboratorio}>Auditoría de contenido</h2>
            </div>

            <AdminDataTable
              columns={columnas}
              data={filteredAdmins}
              renderRow={(laboratorio) => (
                <tr key={laboratorio.id}>
                  
                  <td className={style.nombre_laboratorio}>
                    {laboratorio.titulo}
                  </td>

                  <td>{laboratorio.categoria}</td>

                  <td>
                    <span className={style.creador}>
                      {laboratorio.creador}
                    </span>
                  </td>

                  <td>
                    <span className={laboratorio.estado ? style.statusActive : style.statusInactive}>
                      {laboratorio.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td title={laboratorio.ultimo_ingreso ? new Date(laboratorio.ultimo_ingreso).toLocaleString() : ""}>
                    {laboratorio.ultimo_ingreso ? getRelativeTime(laboratorio.ultimo_ingreso) : "Sin ingresos"}
                  </td>

                  <td className={style.actionsDetails}>
                    <AdminIconButton 
                      icon={Eye} 
                      title="ver" 
                      type="detail" 
                      onClick={() => navigate(`/admin/laboratorio/auditoria_contenido/${laboratorio.id}`)}
                    />
                    <AdminIconButton   
                      icon={laboratorio.estado ? UserX : UserCheck}   
                      type="delete"  
                      onClick={() => toggleEstadoLocal(laboratorio.id, laboratorio.estado)}
                    />
                  </td>

                </tr>
              )}
            />
        </div>
    </AdminLayout>
  );
}

export default LabAuditoriaContenido;