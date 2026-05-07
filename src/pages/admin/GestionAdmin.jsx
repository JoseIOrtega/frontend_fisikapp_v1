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
    actualizarUsuarioService 
} from '../../services/admin/GestionAdminService';
import { useModal } from '../../context/ModalContext';
import GenericModal from '../../components/modals/GenericModal';
import AddMemberForm from '../../components/UI/admin/gestion_admins/AddMemberForm';
import style from './GestionAdmin.module.css';
import ModalEditarAdmin from '../../components/modals/ModalEditarAdmin';
import ModalVerAdmin from '../../components/modals/ModalVerAdmin';

import PaginationControls from '../../components/UI/paginacion/PaginationControls'

function GestionAdmin() {
  const [admins, setAdmins] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [cargando, setCargando] = useState(true);
  const { showModal } = useModal();

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [erroresBackend, setErroresBackend] = useState({});
  const [adminSeleccionado, setAdminSeleccionado] = useState(null);
  const [mostrarModalEdit, setMostrarModalEdit] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const columnas = [
    {label: "Nombre"}, {label: "Rol"}, 
    {label: "Estado"}, {label: "Último Ingreso"}, {label: "Acciones"}
  ];

  // 1. OBTENER DATOS DESDE EL SERVIDOR (Con búsqueda y página)
  const fetchDatos = useCallback(async () => {
    try {
      setCargando(true);
      // Pasamos los parámetros al servicio (ajustado en el paso anterior)
      const [data, logsData] = await Promise.all([
        getAdminsService(paginaActual, searchTerm),
        getLoginLogsService(),
      ]);

      const listaAdmins = data.results || [];
      const logs = logsData.results || logsData;

      if (data.count) {
        setTotalPaginas(Math.ceil(data.count / 10));
      }

      const resultadoFinal = listaAdmins.map(admin => {
          const logsDeEsteAdmin = Array.isArray(logs) 
              ? logs.filter(l => Number(l.usuario) === Number(admin.id))
              : [];

          return {
              ...admin,
              estado: Boolean(admin.estado),
              ultimo_ingreso_real: logsDeEsteAdmin.length > 0 ? logsDeEsteAdmin[0].fecha : null
          };
      });

      setAdmins(resultadoFinal);

    } catch (error) {
      console.error("Error al cargar:", error);
      showModal('error', 'No se pudieron sincronizar los datos.');
    } finally {
      setCargando(false);
    }
  }, [paginaActual, searchTerm, showModal]);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  // 2. LÓGICA DE ACTIVAR/DESACTIVAR (Corregida)
  const handleToggleEstado = async (admin) => {
      // Forzamos la conversión a booleano por si la DB manda 1/0
      const estadoActual = Boolean(admin.estado); 
      const nuevoEstado = !estadoActual;
      
      try {
          // Enviamos el booleano real al backend
          await actualizarUsuarioService(admin.id, { estado: nuevoEstado });
          
          showModal('success', `Usuario ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
          
          // RECARGA TOTAL para ver el cambio en la tabla
          await fetchDatos(); 
      } catch (error) {
          showModal('error', "No se pudo cambiar el estado del usuario.");
      }
  };

  // 4. GUARDAR NUEVO ADMIN (PURIFICADO)
  const handleGuardarNuevoAdmin = async (datosNuevoAdmin) => {
      setErroresBackend({}); 
      setGuardando(true);
      
      try {
          // Ya no enviamos password, el service se encarga de mandar solo nombre y correo
          await crearNuevoAdmin(datosNuevoAdmin);
          
          // Mensaje actualizado para reflejar la nueva realidad del sistema
          showModal('success', '¡Registro exitoso! Se ha enviado la contraseña al correo del usuario.');
          setMostrarModalCrear(false);
          fetchDatos(); 
      } catch (error) {
          if (error.detalles) {
              setErroresBackend(error.detalles);
              showModal('error', 'Por favor, corrige los campos resaltados.');
          } else {
              showModal('error', error.message || 'Error al crear el registro.');
          }
      } finally {
          setGuardando(false);
      }
  };

  // if (cargando) {
  //     return (
  //         <AdminLayout onSearch={setSearchTerm}>
  //             <div className={style.loadingContainer}><p>Sincronizando con el servidor...</p></div>
  //         </AdminLayout>
  //     );
  // }

  const cerrarModalYLimpiar = () => {
      setMostrarModalCrear(false); // Cierra el modal
      setErroresBackend({});       // Borra los bordes rojos
  };




    // Se activa al presionar el lápiz naranja
  const handleAbrirEditar = (admin) => {
      setAdminSeleccionado(admin);
      setMostrarModalEdit(true);
  };

  // Se activa al dar cancelar o cerrar en el modal
  const handleCerrarEditar = () => {
      setAdminSeleccionado(null);
      setMostrarModalEdit(false);
  };

  
  
  const handleGuardarCambios = async (datosEditados) => {
    try {
        const idUsuario = adminSeleccionado.id;
        await actualizarUsuarioService(idUsuario, datosEditados);

        // CORRECCIÓN: Usa el nombre exacto de tu estado de React
        setMostrarModalEdit(false); 
        
        await fetchDatos(); // Recarga la tabla para ver el cambio
        showModal('success', '¡Cambios guardados con éxito!');
    }catch (error) {
          const serverError = error.detalles || error; 

          if (serverError && serverError.identificacion) {
              let msgId = Array.isArray(serverError.identificacion) ? serverError.identificacion[0] : serverError.identificacion;
              showModal('error', msgId.includes("already exists") ? 'Esta identificación ya está registrada.' : msgId);
          }
          else if (serverError && serverError.correo) {
              let mensajeOriginal = Array.isArray(serverError.correo) ? serverError.correo[0] : serverError.correo;
              showModal('error', mensajeOriginal.includes("already exists") ? 'Este correo ya existe.' : mensajeOriginal);
          }
          else {
              showModal('error', 'No se pudieron guardar los cambios.');
          }
      }
  };

  const abrirModal = (id) => {
      setIdSeleccionado(id);
      setModalAbierto(true);
  };

  // 2. MANEJO DE BÚSQUEDA (Sincronizado con AdminLayout)
  const handleBusqueda = (valor) => {
    setSearchTerm(valor);
    setPaginaActual(1); // Siempre volver a la página 1 al buscar
  };


  return (
    <AdminLayout onSearch={handleBusqueda}>
      <div className={style.layout}>
        <div className={style.contentWrapper}>
          {/* Overlay de carga para que no se pierda el buscador */}
          {cargando && (
            <div className={style.overlayCarga}>
              <span>Sincronizando con el servidor...</span>
            </div>
          )}
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
            data={admins} 
            renderRow={(admin) => (
              <tr key={admin.id}>
                <td className={style.userCell}>
                  <div className={style.userInfoContainer}>
                    <span className={style.nameText}>{admin.nombre}</span>
                    <span className={style.emailText}>{admin.correo}</span>
                  </div>
                </td>
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
                  <AdminIconButton 
                      icon={Edit} 
                      type="edit" 
                      title="Editar datos" 
                      onClick={() => handleAbrirEditar(admin)}
                  />
                  {/*<AdminIconButton icon={Key} type="reset" title="Cambiar clave" />*/}
                  <AdminIconButton 
                      icon={Eye} 
                      type="detail" 
                      title="Ver detalles" 
                      onClick={() => abrirModal(admin.id)} // <--- CONEXIÓN AQUÍ
                  />
                  
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
          {/* Paginación similar a UsuariosAdmin */}
          <footer className={style.paginationContainer}>
            <PaginationControls 
              paginaActual={paginaActual}
              totalPaginas={totalPaginas} 
              // Cuando el usuario toca un número o flecha, se ejecuta esto:
              onPaginaChange={(nueva) => setPaginaActual(nueva)} 
            />
          </footer>
        </div>
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

      {mostrarModalEdit && (
        <ModalEditarAdmin 
          usuario={adminSeleccionado} 
          onClose={handleCerrarEditar} 
          onSave={handleGuardarCambios} 
        />
      )}

      <ModalVerAdmin 
          id={idSeleccionado} 
          isOpen={modalAbierto} 
          
          onClose={() => {
              setModalAbierto(false);
              setIdSeleccionado(null); // Limpiamos el ID al cerrar
          }}
          titulo="Perfil de Administrador"
      />
      

    </AdminLayout>
  );
}

export default GestionAdmin;