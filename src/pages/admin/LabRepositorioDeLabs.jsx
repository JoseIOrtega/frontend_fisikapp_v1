import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout"
import AdminDataTable from "../../components/UI/admin/AdminDataTable"
import AdminIconButton from "../../components/UI/admin/AdminIconButton";
import { Edit, Eye, Trash2, UserX, UserCheck, CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateHelpers';
import { 
  getLaboratorios, 
  patchLaboratorioAPI, 
  deleteLaboratorioAPI 
} from '../../services/admin/adminLab';
import style from './LabRepositorioDeLabs.module.css'

function LabRepositorioDeLabs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'info',
    message: '',
    isConfirm: false,
    onConfirm: null,
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
  });
  const navigate = useNavigate();

  const showModal = (type, message) => {
    setModalConfig({
      isOpen: true,
      type,
      message,
      isConfirm: false,
      onConfirm: null,
      confirmText: 'Aceptar',
      cancelText: 'Cancelar',
    });
  };

  const showConfirm = (type, message, onConfirm, confirmText = 'Eliminar', cancelText = 'Cancelar') => {
    setModalConfig({
      isOpen: true,
      type,
      message,
      isConfirm: true,
      onConfirm,
      confirmText,
      cancelText,
    });
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false, isConfirm: false, onConfirm: null }));
  };

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

    try {
      // Guardar solo el campo de estado en backend
      const resultado = await patchLaboratorioAPI(laboratorio.id, {
        estado: nuevoEstado === "Activo"
      });

      if (!resultado?.success) {
        throw new Error(resultado?.error || "Error al actualizar el laboratorio");
      }

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
      showModal('error', "Error al actualizar el laboratorio. Por favor, intenta de nuevo.");
    }
  };

  const handleDelete = (laboratorio) => {
    showConfirm(
      'warning',
      `¿Estás seguro de que deseas eliminar el laboratorio "${laboratorio.nombre_de_laboratorio}"?`,
      async () => {
        try {
          const resultado = await deleteLaboratorioAPI(laboratorio.id);

          if (resultado.success) {
            console.log("Laboratorio eliminado del backend exitosamente");
          } else {
            console.warn("Error al eliminar del backend:", resultado.error);
            showModal('error', "Error al eliminar el laboratorio del servidor. " + (resultado.error?.detail || "Intenta de nuevo."));
            return;
          }

          setLaboratorios(prevLabs =>
            prevLabs.filter(lab => lab.id !== laboratorio.id)
          );

          closeModal();
          console.log("Laboratorio eliminado exitosamente");
        } catch (error) {
          console.error("Error al eliminar laboratorio:", error);
          showModal('error', "Error al eliminar el laboratorio. Por favor, intenta de nuevo.");
        }
      },
      'Eliminar',
      'Cancelar'
    );
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
              <tr key={laboratorio.id}>
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
                    type={laboratorio.estado === "Inactivo" ? "blocked" : "delete"}
                    onClick={() => handleToggleBloqueo(laboratorio)}
                    isBlocked={laboratorio.estado === "Inactivo"}
                  />
                  <AdminIconButton icon={Trash2} title="Eliminar" type="delete" onClick={() => handleDelete(laboratorio)} />
                </td>
              </tr>
            )}
          ></AdminDataTable>
        )}
      </div>

      {modalConfig.isOpen && (
        <div className={style.overlay} onClick={closeModal}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <button className={style.closeBtn} onClick={closeModal}>
              <X size={20} />
            </button>

            <div className={style.iconContainer}>{
              {
                success: <CheckCircle color="#05cd99" size={50} />,
                error: <XCircle color="#EE5D50" size={50} />,
                warning: <AlertTriangle color="#FFBC11" size={50} />,
                info: <Info color="#422AFB" size={50} />
              }[modalConfig.type] || <Info color="#422AFB" size={50} />
            }</div>

            <h3 className={style.title}>
              {
                {
                  success: '¡Ok!',
                  error: 'Hubo un error',
                  warning: 'Atención',
                  info: 'Información'
                }[modalConfig.type] || 'Información'
              }
            </h3>
            <p className={style.message}>{modalConfig.message}</p>

            {modalConfig.isConfirm ? (
              <div className={style.buttonContainer}>
                <button className={`${style.actionBtn} ${style.cancelBtn}`} onClick={closeModal}>
                  {modalConfig.cancelText}
                </button>
                <button className={`${style.actionBtn} ${style.confirmBtn}`} onClick={modalConfig.onConfirm}>
                  {modalConfig.confirmText}
                </button>
              </div>
            ) : (
              <button className={style.actionBtn} onClick={closeModal}>
                Aceptar
              </button>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default LabRepositorioDeLabs;;
