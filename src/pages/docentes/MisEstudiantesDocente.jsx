import { useState, useEffect, useCallback, useRef } from "react";
import DocenteLayout from "../../layouts/DocenteLayout";
import AdminDataTable from "../../components/UI/admin/AdminDataTable";
import AdminIconButton from "../../components/UI/admin/AdminIconButton";
import { Edit, Eye } from "lucide-react";
import { getRelativeTime } from '../../utils/dateHelpers';
import { getUsuarios } from "../../services/admin/UsuariosService"; 
import { useModal } from '../../context/ModalContext';
import style from "./MisEstudiantesDocente.module.css";
import PaginationControls from '../../components/UI/paginacion/PaginationControls';
import ModalVerProgresoEstudiante from '../../components/modals/ModalVerProgresoEstudiante';


// IMPORTA TU NUEVO MODAL (Deberás crearlo en la carpeta de modals)


// MisEstudiantesDocente.jsx corregido
function MisEstudiantesDocente() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { showModal } = useModal();
  
  // Estados para el Modal de Ver Detalle
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const scrollRef = useRef(null);

  const columnas = [
    { label: "Nombre" }, { label: "Estado" }, 
    { label: "Último ingreso" }, { label: "Acciones" }
  ];

  const fetchDatos = useCallback(async () => {
    try {
      setCargando(true);

      const dataFalsa = {
      results: [
        { 
          id: 1, 
          nombre: "Andrés Felipe López", 
          correo: "andres.fisica@correo.com", 
          estado: true, 
          ultimo_ingreso: "2026-05-10T14:30:00Z" 
        },
        { 
          id: 2, 
          nombre: "Laura Sofía Restrepo", 
          correo: "laura.lab@correo.com", 
          estado: true, 
          ultimo_ingreso: "2026-05-12T09:15:00Z" 
        },
        { 
          id: 3, 
          nombre: "Carlos Mario Duarte", 
          correo: "carlos.duarte@correo.com", 
          estado: false, 
          ultimo_ingreso: null 
        }
      ],
      count: 3
    };
      //const data = await getUsuarios(paginaActual, searchTerm ,'estudiante');
      //const listaEstudiantes = data.results || [];
      //if (data.count) setTotalPaginas(Math.ceil(data.count / 10));
      //setEstudiantes(listaEstudiantes.map(u => ({ ...u, estado: Boolean(u.estado) })));
      // 3. Usamos la dataFalsa en lugar de la del servidor
    const listaEstudiantes = dataFalsa.results || [];
    setTotalPaginas(1); // Como son poquitos, solo hay 1 página
    
    setEstudiantes(listaEstudiantes.map(u => ({ 
      ...u, 
      estado: Boolean(u.estado) 
    })));
    } catch (error) {
      showModal('error', 'Error al cargar los estudiantes.');
    } finally {
      setCargando(false);
    }
  },[showModal]); //[paginaActual, searchTerm, showModal]);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  // Funciones para manejar el modal
  const handleAbrirVer = (id) => {
    setIdSeleccionado(id);
    setModalVerAbierto(true);
  };

  const handleCerrarVer = () => {
    setModalVerAbierto(false);
    setIdSeleccionado(null);
  };

  return (
<<<<<<< HEAD
    <div className={style["layout"]} style={{ padding: '20px' }}>
        <h2>Mis Estudiantes</h2>
        {/* Aquí va el resto de tu código, como la tabla de alumnos */}
    </div>
=======
    <DocenteLayout onSearch={(v) => { setSearchTerm(v); setPaginaActual(1); }}>
      <div className={style.layout}>
        <div className={style.contentWrapper}>
          {cargando && <div className={style.overlayCarga}><span>Cargando...</span></div>}

          <div className={style.headerSection}>
            <h2 className={style.title}>Mis Estudiantes</h2>
          </div>

          <div className={style.tableContainer} ref={scrollRef}>
            <AdminDataTable 
              columns={columnas} 
              data={estudiantes}
              renderRow={(estudiante) => (
                <tr key={estudiante.id}>
                  <td className={style.userCell}>
                    <div className={style.userInfoContainer}>
                      <span className={style.nameText}>{estudiante.nombre}</span>
                      <span className={style.emailText}>{estudiante.correo}</span>
                    </div>
                  </td>
                  <td>
                    <span className={estudiante.estado ? style.statusActive : style.statusInactive}>
                      {estudiante.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>{estudiante.ultimo_ingreso ? getRelativeTime(estudiante.ultimo_ingreso) : "Nunca"}</td>
                  <td className={style.actionsCell}>
                    <AdminIconButton icon={Edit} type="edit" title="Editar" onClick={() => {}} />
                    <AdminIconButton 
                      icon={Eye} 
                      type="detail" 
                      title="Ver Progreso" 
                      onClick={() => handleAbrirVer(estudiante.id)} 
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
              onPaginaChange={setPaginaActual} 
            />
          </footer>
        </div>
      </div>

      {/* Renderizado del Modal */}
      <ModalVerProgresoEstudiante 
        isOpen={modalVerAbierto}
        onClose={handleCerrarVer}
        estudianteId={idSeleccionado}
      />
    </DocenteLayout>
>>>>>>> main
  );
}

export default MisEstudiantesDocente;