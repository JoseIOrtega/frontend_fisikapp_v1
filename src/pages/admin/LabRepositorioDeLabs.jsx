import { useState, useEffect, useCallback, useRef } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminDataTable from "../../components/UI/admin/AdminDataTable";
import AdminIconButton from "../../components/UI/admin/AdminIconButton";
import AdminCreateButton from "../../components/UI/admin/AdminCreateButton";
import { Beaker, Edit, Eye, Trash2, CheckCircle, FilePlus } from "lucide-react";
import { getLaboratorios } from "../../services/admin/LabService";
import { useModal } from '../../context/ModalContext';
import PaginationControls from '../../components/UI/paginacion/PaginationControls';

// Reutilizamos tu CSS de UsuariosAdmin
import style from "./UsuariosAdmin.module.css"; 

function LabRepositorioDeLabs() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { showModal } = useModal();
  
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const scrollRef = useRef(null);

  // Columnas adaptadas a Laboratorios
  const columnas = [
    { label: "Laboratorio" }, // Aquí irá Código y Título (como Nombre y Correo)
    { label: "Resumen" },
    { label: "Estado" },
    { label: "Acciones" }
  ];

  const fetchDatos = useCallback(async () => {
    try {
      setCargando(true);
      
      // Llamada al servicio que creamos
      const data = await getLaboratorios(paginaActual, searchTerm);
      
      const listaLabs = data.results || [];

      if (data.count) {
        // Asumiendo que el backend pagina de a 10
        setTotalPaginas(Math.ceil(data.count / 10));
      }

      // Mapeo básico para asegurar el booleano del estado
      const resultado = listaLabs.map(lab => ({
        ...lab,
        estado: Boolean(lab.estado)
      }));

      setLaboratorios(resultado); 
    } catch (error) {
      console.error("Error al cargar laboratorios:", error);
      showModal('error', 'Error al sincronizar los laboratorios.');
    } finally {
      setCargando(false);
    }
  }, [paginaActual, searchTerm, showModal]);

  useEffect(() => {
    fetchDatos();
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [fetchDatos]);

  const handleBusqueda = (valor) => {
    setSearchTerm(valor);
    setPaginaActual(1); 
  };

  return (
    <AdminLayout onSearch={handleBusqueda}>
      <div className={style.layout}>
        <div className={style.contentWrapper}>
          
          {cargando && (
            <div className={style.overlayCarga}>
              <span>Sincronizando laboratorios...</span>
            </div>
          )}

          <div className={style.headerSection}>
            <h2 className={style.title}>Repositorio de Laboratorios</h2>
            
          </div>

          <div className={style.tableContainer} ref={scrollRef}>
            <AdminDataTable 
              columns={columnas} 
              data={laboratorios}
              renderRow={(lab) => (
                <tr key={lab.id}>
                  {/* Celda Principal: Código y Título (Estilo userInfoContainer) */}
                  <td className={style.userCell}>
                    <div className={style.userInfoContainer}>
                      <span className={style.nameText}>{lab.codigo_lab}</span>
                      <span className={style.emailText}>{lab.titulo_lab}</span>
                    </div>
                  </td>

                  {/* Resumen o Categoría */}
                  <td>
                    <span className={style.emailText}>
                        {lab.resumen?.length > 40 ? `${lab.resumen.substring(0, 40)}...` : lab.resumen}
                    </span>
                  </td>

                  {/* Estado con tus clases de CSS */}
                  <td>
                    <span className={lab.estado ? style.statusActive : style.statusInactive}>
                      {lab.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className={style.actionsCell}>
                    <AdminIconButton 
                      icon={Edit} 
                      type="edit" 
                      title="Editar" 
                      onClick={() => console.log("Edit", lab.id)} 
                    />
                    
                    <AdminIconButton 
                      icon={Eye} 
                      type="detail" 
                      title="Ver simulador" 
                      onClick={() => console.log("Ver", lab.id)} 
                    />

                    <AdminIconButton 
                      icon={lab.estado ? Trash2 : CheckCircle} 
                      type={lab.estado ? "delete" : "success"} 
                      title={lab.estado ? "Desactivar" : "Activar"} 
                      onClick={() => console.log("Toggle", lab.id)} 
                    />
                  </td>
                </tr>
              )}
            />
          </div>
          
          <footer className={style.paginationContainer}>
            <PaginationControls 
              paginaActual={paginaActual}
              totalPaginas={totalPaginas} 
              onPaginaChange={(nueva) => setPaginaActual(nueva)} 
            />
          </footer>
        </div>
      </div>
    </AdminLayout>
  );
}

export default LabRepositorioDeLabs;
