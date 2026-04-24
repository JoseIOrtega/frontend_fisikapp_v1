import AdminLayout from "../../layouts/AdminLayout";
import AdminDataTable from "../../components/UI/admin/AdminDataTable";
import AdminIconButton from "../../components/UI/admin/AdminIconButton";
import AdminCreateButton from "../../components/UI/admin/AdminCreateButton";
import { UserPlus, Edit, Key, Eye, UserX, UserCheck } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react'; // Agregamos useCallback
import { getRelativeTime } from '../../utils/dateHelpers';
import { 
    getAdminsService, 
    getLoginLogsService, 
    crearNuevoAdmin,
    actualizarUsuarioService, // Importamos los nuevos servicios
} from '../../services/admin/GestionAdminService';
import { useModal } from '../../context/ModalContext';
import GenericModal from '../../components/modals/GenericModal';
import AddMemberForm from '../../components/UI/admin/gestion_admins/AddMemberForm';
import style from './GestionAdmin.module.css';

function GestionAdmin() {
  const [admins, setAdmins] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [cargando, setCargando] = useState(true);
  const { showModal } = useModal();
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [erroresBackend, setErroresBackend] = useState({});

  const columnas = [
    {label: "Nombre"}, {label: "Correo"}, {label: "Rol"}, 
    {label: "Estado"}, {label: "Último Ingreso"}, {label: "Acciones"}
  ];

  // 1. OBTENER Y FILTRAR DATOS
  // Usamos useCallback para que la función sea estable y eficiente
  const fetchDatos = useCallback(async () => {
    try {
      const [usuarios, logs] = await Promise.all([
        getAdminsService(),
        getLoginLogsService(),
      ]);

      // FILTRO CRUCIAL: Solo permitimos roles de gestión en esta vista
      const soloAdmins = usuarios.filter(u => 
        //u.rol === 'administrador' || u.rol === 'superadmin'
        u.rol === 'admin' 
      );

      // Cruzamos los datos con los Logs para obtener la fecha de ingreso
      const adminsConSuUltimaFecha = soloAdmins.map(admin => {
        const logsDeEsteAdmin = logs.filter(l => 
          Number(l.usuario) === Number(admin.id) && l.accion === "Login"
        );
        const logsOrdenados = logsDeEsteAdmin.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        return {
          ...admin,
          ultimo_ingreso_real: logsOrdenados.length > 0 ? logsOrdenados[0].fecha : null
        };
      });

      setAdmins(adminsConSuUltimaFecha);
    } catch (error) {
      console.error("Error al cargar:", error);
      showModal('error', 'No se pudieron sincronizar los datos de administración.');
    } finally {
      setCargando(false);
    }
  }, [showModal]);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  // 2. LÓGICA DE ACCIONES (ELIMINAR/ACTIVAR)
  const handleToggleEstado = async (admin) => {
    const nuevoEstado = !admin.estado;
    const accion = nuevoEstado ? "activar" : "desactivar";
    
    try {
        // Llamamos al servicio usando el ID dinámico que configuramos
        await actualizarUsuarioService(admin.id, { estado: nuevoEstado });
        showModal('success', `Usuario ${accion}ado correctamente.`);
        fetchDatos(); // Refrescamos la lista
    } catch (error) {
        showModal('error', `No se pudo ${accion} al usuario.`);
    }
  };

  // 3. FILTRADO PARA LA BARRA DE BÚSQUEDA
  const filteredAdmins = admins.filter(admin => 
    admin.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGuardarNuevoAdmin = async (datosNuevoAdmin) => {
      setErroresBackend({}); // Limpiamos rastros rojos previos
      setGuardando(true);
      
      try {
          await crearNuevoAdmin(datosNuevoAdmin);
          showModal('success', '¡Nuevo miembro del equipo registrado!');
          setMostrarModalCrear(false);
          fetchDatos(); 
      } catch (error) {
          // 1. Si el error trae detalles (como el correo repetido)
          if (error.detalles) {
              setErroresBackend(error.detalles);
              // Opcional: un mensaje más suave en el modal
              showModal('error', 'Por favor, corrige los campos resaltados.');
          } else {
              // 2. Si es un error general (ej. el servidor se cayó)
              showModal('error', error.message || 'Error al crear el registro.');
          }
      } finally {
          setGuardando(false);
      }
  };

  if (cargando) {
      return (
          <AdminLayout onSearch={setSearchTerm}>
              <div className={style.loadingContainer}><p>Sincronizando con el servidor...</p></div>
          </AdminLayout>
      );
  }

  const cerrarModalYLimpiar = () => {
      setMostrarModalCrear(false); // Cierra el modal
      setErroresBackend({});       // Borra los bordes rojos
  };

  return (
    <AdminLayout onSearch={setSearchTerm}>
      <div className={style.layout}>
        <div className={style.headerSection}>
          <h2 className={style.title}>Gestión de Personal</h2>
          <AdminCreateButton 
                icon={UserPlus} 
                text="Añadir Miembro" 
                onClick={() => setMostrarModalCrear(true)} 
          />
        </div>

        <AdminDataTable 
          columns={columnas} 
          data={filteredAdmins} 
          renderRow={(admin) => (
            <tr key={admin.id}>
              <td className={style.nameText}>{admin.nombre}</td>
              <td>{admin.correo}</td>
              <td>
                <span className={`${style.roleBadge} ${admin.rol === 'superadmin' ? style.super : ''}`}>
                    {admin.rol}
                </span>
              </td>
              
              <td>
                <span className={admin.estado ? style.statusActive : style.statusInactive}>
                  {admin.estado ? "Activo" : "Inactivo"}
                </span>
              </td>

              <td title={admin.ultimo_ingreso_real ? new Date(admin.ultimo_ingreso_real).toLocaleString() : "Sin registros"}>
                {admin.ultimo_ingreso_real ? getRelativeTime(admin.ultimo_ingreso_real) : "Nunca"}
              </td>

              <td className={style.actionsCell}>
                <AdminIconButton icon={Edit} type="edit" title="Editar datos" />
                <AdminIconButton icon={Key} type="reset" title="Cambiar clave" />
                <AdminIconButton icon={Eye} type="detail" title="Ver detalles" />
                
                {/* Botón dinámico para activar/desactivar */}
                <AdminIconButton 
                  icon={admin.estado ? UserX : UserCheck} 
                  type={admin.estado ? "delete" : "success"} 
                  onClick={() => handleToggleEstado(admin)}
                  title={admin.estado ? "Desactivar" : "Activar"}
                />
              </td>
            </tr>
          )}
        />
      </div>

      <GenericModal 
        isOpen={mostrarModalCrear} 
        onClose={cerrarModalYLimpiar} // <--- Cambiado aquí
        title="Registro de Administrador"
    >
        <AddMemberForm 
            onSave={handleGuardarNuevoAdmin} 
            errores={erroresBackend}
            onCancel={cerrarModalYLimpiar} // <--- Cambiado aquí
            cargando={guardando} 
        />
    </GenericModal>  

    </AdminLayout>
  );
}

export default GestionAdmin;