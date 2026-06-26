import { useState, useEffect } from "react";
import { getLaboratorios, updateEstadoLaboratorio } from "../../services/admin/LabAuditoriaContenidoService";
import AdminLayout from "../../layouts/AdminLayout";
import AdminDataTable from "../../components/UI/admin/AdminDataTable";
import AdminIconButton from "../../components/UI/admin/AdminIconButton";
import { Eye, UserX, UserCheck } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateHelpers';
import style from './LabAuditoriaContenido.module.css';
import { useNavigate } from "react-router-dom";

// Imports requeridos por tu líder para el modal global de Fisikapp
import GenericModal from "../../components/modals/GenericModal";
import { useModal } from '../../context/ModalContext'; 

function LabAuditoriaContenido() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  // Conectamos las alertas globales del líder
  const { showModal } = useModal();

  // Lógica de cambio de estado
  const toggleEstadoLocal = async (id, estadoActual) => {
    // ⚠️ Validación defensiva: Si el id es undefined o es un string "undefined", no disparamos la petición
    if (!id || id === "undefined") {
      console.error("Error: Se intentó actualizar un laboratorio sin un ID válido de la base de datos.");
      showModal('error', 'No se puede actualizar el laboratorio porque el backend no está enviando su ID único.');
      return;
    }

    const estadoReal = Boolean(estadoActual); 
    const nuevoEstado = !estadoReal;
    
    try {
      // Intentamos el PATCH al servicio con el id real de base de datos
      await updateEstadoLaboratorio(id, nuevoEstado);

      // Si Django responde correctamente, modificamos el estado en la tabla de forma reactiva
      const nuevos = laboratorios.map((lab) =>
        lab.id === id ? { ...lab, estado: nuevoEstado } : lab
      );
      setLaboratorios(nuevos);

      showModal('success', `El laboratorio ha sido ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);

    } catch (error) {
      console.error("No se pudo cambiar el estado en el servidor:", error);
      showModal('error', 'No se pudo cambiar el estado del laboratorio. Inténtalo de nuevo.');
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

      // 🔍 ANALIZADOR TEMPORAL: Esto imprimirá el primer laboratorio en tu consola de desarrollador
      // para que podamos ver el nombre exacto de TODAS las propiedades que envía Django.
      if (listaOriginal.length > 0) {
        console.log("Campos reales que devuelve el backend:", Object.keys(listaOriginal[0]), listaOriginal[0]);
      }

      const laboratoriosProcesados = listaOriginal.map((lab, index) => {
        // Intentamos recuperar cualquier variante común de ID numérico que maneje Django
        // Si el backend definitivamente omitió el ID, usaremos temporalmente el index para que la tabla pinte,
        // pero requerirá el ajuste en Python (Django) para que el PATCH/GET por ID funcione.
        const idReal = lab.id ?? lab.pk ?? lab.id_laboratorio ?? lab.laboratorio_id ?? (index + 1);

        return {
          ...lab,
          id: idReal
        };
      });

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
                      onClick={() => navigate(`/admin/laboratorio/auditoria_contenido/${encodeURIComponent(laboratorio.id)}`)}
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