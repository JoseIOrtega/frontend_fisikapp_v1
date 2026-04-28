import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout"
import AdminDataTable from "../../components/UI/admin/AdminDataTable"
import AdminIconButton from "../../components/UI/admin/AdminIconButton";
import { Edit, Eye, Trash2, UserX, UserCheck } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateHelpers';
import { 
  getLaboratorios, 
  saveLaboratorio, 
  deleteLaboratorioAPI 
} from '../../services/admin/adminLab';
import style from './LabRepositorioDeLabs.module.css'

function LabRepositorioDeLabs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [laboratorios, setLaboratorios] = useState([]);
  const [laboratoriosBloqueados, setLaboratoriosBloqueados] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLaboratorios = async () => {
      try {
        setLoading(true);
        const data = await getLaboratorios();
        setLaboratorios(data || []);
      } catch (error) {
        console.error("Error al cargar laboratorios:", error);
        setLaboratorios([]);
      } finally {
        setLoading(false);
      }
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
    new Date(laboratorio.fecha_creacion).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase())
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
    const esBloqueado = !laboratoriosBloqueados[laboratorio.id];

    try {
      // Actualizar estado visual inmediatamente
      setLaboratoriosBloqueados(prev => ({
        ...prev,
        [laboratorio.id]: esBloqueado
      }));

      // Preparar datos actualizados
      const laboratorioActualizado = {
        ...laboratorio,
        estado: nuevoEstado
      };

      // Guardar cambios en backend
      await saveLaboratorio(laboratorioActualizado);

      // Actualizar en la lista visual
      setLaboratorios(prevLabs =>
        prevLabs.map(lab =>
          lab.id === laboratorio.id
            ? { ...lab, estado: nuevoEstado }
            : lab
        )
      );

      console.log(`Laboratorio ${laboratorio.nombre_de_laboratorio} actualizado a estado: ${nuevoEstado}`);
    } catch (error) {
      console.error("Error al actualizar laboratorio:", error);
      alert("Error al actualizar el laboratorio. Por favor, intenta de nuevo.");
      
      // Revertir cambios visuales
      setLaboratoriosBloqueados(prev => ({
        ...prev,
        [laboratorio.id]: !esBloqueado
      }));
    }
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
        alert("Error al eliminar el laboratorio del servidor. " + (resultado.error?.detail || "Intenta de nuevo."));
        return;
      }

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
          {loading && <span style={{ marginLeft: '10px', color: '#999' }}>Cargando...</span>}
        </div>

        {laboratorios.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            No hay laboratorios disponibles
          </div>
        )}

        {laboratorios.length > 0 && (
          <AdminDataTable
            columns={columnas}
            data={filteredLaboratorios}
            renderRow={(laboratorio) => (
              <tr key={laboratorio.id} className={laboratoriosBloqueados[laboratorio.id] ? style.filaBloqueada : ""}>
                <td className={style.nombre_laboratorio}>{laboratorio.nombre_de_laboratorio}</td>
                <td>{laboratorio.categoria}</td>
                <td><span className={laboratorio.estado === "Activo" ? style.statusActive : style.statusInactive}>{laboratorio.estado}</span></td>
                <td title={new Date(laboratorio.fecha_creacion).toLocaleString()} style={{ cursor: 'help' }}>{getRelativeTime(laboratorio.fecha_creacion)}</td>
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
        )}
      </div>
    </AdminLayout>
  )
}

export default LabRepositorioDeLabs;;
