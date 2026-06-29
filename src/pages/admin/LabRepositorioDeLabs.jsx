import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from '../../context/ModalContext';
import AdminLayout from "../../layouts/AdminLayout"
import AdminDataTable from "../../components/UI/admin/AdminDataTable"
import AdminIconButton from "../../components/UI/admin/AdminIconButton";
import { Edit, Eye, UserX, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateHelpers';
import { 
  getLaboratorios, 
  patchLaboratorioAPI
} from '../../services/admin/adminLab';
import style from './LabRepositorioDeLabs.module.css'

function LabRepositorioDeLabs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [laboratorios, setLaboratorios] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const { showModal } = useModal();
  const navigate = useNavigate();

  // --- ESTADO DE PAGINACIÓN ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Resetear a pág 1 cuando se busca
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

 useEffect(() => {
   const loadLaboratorios = async () => {
     try {
       setLoading(true);

       const data = await getLaboratorios(currentPage);

       console.log("Página:", currentPage);
       console.log(data);

       setLaboratorios(data.laboratorios);
       setTotalItems(data.total);
     } catch (error) {
       console.error(error);
       setLaboratorios([]);
     } finally {
       setLoading(false);
     }
   };

   loadLaboratorios();
 }, [currentPage]);

  const columnas = [
    { label: "Nombre de Laboratorio" },
    { label: "Categoría" },
    { label: "Estado" },
    { label: "Creado" },
    { label: "Acciones", style: { textAlign: 'center' } }
  ];

  const filteredLaboratorios = laboratorios.filter((laboratorio) => {
    const nombre = String(
      laboratorio.nombre_de_laboratorio ?? "",
    ).toLowerCase();
    const categoria = String(laboratorio.categoria ?? "").toLowerCase();
    const estado = String(laboratorio.estado ?? "").toLowerCase();
    const fecha = new Date(laboratorio.fecha_creacion)
      .toLocaleString()
      .toLowerCase();

    const busqueda = searchTerm.toLowerCase();

    return (
      nombre.includes(busqueda) ||
      categoria.includes(busqueda) ||
      estado.includes(busqueda) ||
      fecha.includes(busqueda)
    );
  });

  // --- LÓGICA DE CÁLCULO DE PAGINACIÓN ---
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- NUEVA LÓGICA INTEGRADA DE EDICIÓN (SIN TOCAR ARCHIVO DE TU COMPAÑERO) ---
  const handleEdit = (laboratorio) => {
    // 1. Guardamos temporalmente el objeto completo en el storage como puente de comunicación
    localStorage.setItem("fisikapp_laboratorio_en_edicion", JSON.stringify(laboratorio));
    
    // 2. Redirige limpiamente al archivo de configuración
    navigate("/admin/laboratorio/configurar_labs");
  };

  const handleView = (laboratorio) => {
    navigate(`/admin/laboratorio/repositorio_labs/${laboratorio.id}`);
  };

  const toggleBloqueo = async (laboratorio) => {
    const nuevoEstado = laboratorio.estado === "Activo" ? "Inactivo" : "Activo";
    try {
      const resultado = await patchLaboratorioAPI(laboratorio.id, {
          estado: nuevoEstado === "Activo"
              ? "ACTIVO"
              : "INACTIVO"
      });
    
      if (!resultado?.success) throw new Error(resultado?.error || "Error");
      setLaboratorios(prevLabs =>
        prevLabs.map(lab => lab.id === laboratorio.id ? { ...lab, estado: nuevoEstado } : lab)
      );
      showModal('success', `Laboratorio ${nuevoEstado === "Activo" ? "desbloqueado" : "bloqueado"} exitosamente.`);
    } catch (error) {
      showModal('error', "No se pudo actualizar el estado.");
    }
  };

  return (
    <AdminLayout onSearch={setSearchTerm}>
      <div className={style["layout"]}>
        <div className={style["seccion_del_header"]}>
          <h2 className={style.titulo_header_laboratorio}>
            Repositorio de Laboratorios
          </h2>
          {loading && <span className={style.loadingText}>Cargando...</span>}
        </div>

        {laboratorios.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
            No hay laboratorios disponibles
          </div>
        )}

        {laboratorios.length > 0 && (
          <>
            <AdminDataTable
              columns={columnas}
              data={filteredLaboratorios}
              renderRow={(laboratorio) => (
                <tr key={laboratorio.id}>
                  <td className={style.nombre_laboratorio}>
                    {laboratorio.nombre_de_laboratorio}
                  </td>
                  <td>{laboratorio.categoria}</td>
                  <td>
                    <span
                      className={
                        laboratorio.estado === "Activo"
                          ? style.statusActive
                          : style.statusInactive
                      }
                    >
                      {laboratorio.estado}
                    </span>
                  </td>
                  <td
                    title={new Date(
                      laboratorio.fecha_creacion,
                    ).toLocaleString()}
                    style={{ cursor: "help" }}
                  >
                    {getRelativeTime(laboratorio.fecha_creacion)}
                  </td>
                  <td className={style.actionsDetails}>
                    <AdminIconButton
                      icon={Edit}
                      title="editar"
                      type="edit"
                      onClick={() => handleEdit(laboratorio)}
                      disabled={laboratorio.estado !== "Activo"}
                    />
                    <AdminIconButton
                      icon={Eye}
                      title="ver"
                      type="detail"
                      onClick={() => handleView(laboratorio)}
                    />
                    <AdminIconButton
                      icon={laboratorio.estado === "Activo" ? UserX : UserCheck}
                      title={
                        laboratorio.estado === "Activo"
                          ? "bloquear"
                          : "desbloquear"
                      }
                      type={
                        laboratorio.estado === "Inactivo" ? "blocked" : "delete"
                      }
                      onClick={() => toggleBloqueo(laboratorio)}
                    />
                  </td>
                </tr>
              )}
            />

            {/* --- BLOQUE DE PAGINACIÓN --- */}
            {totalPages > 1 && (
              <div className={style.paginationContainer}>
                <button
                  className={style.paginationBtn}
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                >
                  <ChevronLeft size={18} />
                </button>

                <div className={style.pageNumbers}>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`${style.pageBtn} ${currentPage === i + 1 ? style.activePage : ""}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  className={style.paginationBtn}
                  disabled={currentPage === totalPages}
                  onClick={() => paginate(currentPage + 1)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default LabRepositorioDeLabs;