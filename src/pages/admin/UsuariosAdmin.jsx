import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminDataTable from "../../components/UI/admin/AdminDataTable";
import AdminIconButton from "../../components/UI/admin/AdminIconButton";
import AdminCreateButton from "../../components/UI/admin/AdminCreateButton";
import { UserPlus, Edit, Eye, UserX, UserCheck, FileUp } from "lucide-react";
import { getRelativeTime } from '../../utils/dateHelpers';
import { getUsuarios } from "../../services/admin/UsuariosService"; 
// Importamos el servicio de logs que ya existe
import { getLoginLogsService } from "../../services/admin/UsuariosService";
import { crearNuevoUsuario } from '../../services/admin/UsuariosService';
import { actualizarUsuarioService } from '../../services/admin/UsuariosService';
import ModalEditarAdmin from '../../components/modals/ModalEditarAdmin';
import ModalVerAdmin from '../../components/modals/ModalVerAdmin';
import ModalCargaCSVAdmin from '../../components/modals/ModalCargaCSVAdmin';
import GenericModal from "../../components/modals/GenericModal";
import AddMemberForm from "../../components/UI/admin/gestion_admins/AddMemberForm"


import { useModal } from '../../context/ModalContext'; // Importante para las alertas
import style from "./UsuariosAdmin.module.css";
import Papa from 'papaparse';


function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setcargando] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { showModal } = useModal();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarModalEdit, setMostrarModalEdit] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [modalVerAbierto, setModalVerAbierto] = useState(false);

  const columnas = [
    { label: "Nombre" }, { label: "Correo" }, { label: "Rol" },
    { label: "Estado" }, { label: "Último ingreso" }, { label: "Acciones" }
  ];

  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [erroresBackend, setErroresBackend] = useState({});
  const [mostrarModalCSV, setMostrarModalCSV] = useState(false);

  // 1. OBTENER Y FILTRAR DATOS (Igual que en GestionAdmin)
  const fetchDatos = useCallback(async () => {
    try {
      setcargando(true);
      // 1. Traemos ambos datos al tiempo
      const [data, logs] = await Promise.all([
        getUsuarios(),
        getLoginLogsService()
      ]);
      
      // 2. Filtramos los roles académicos
      const filtrados = data.filter(u => 
        u.rol.toLowerCase() === "profesor" || u.rol.toLowerCase() === "estudiante"
      );

      // 3. Cruzamos los datos (Lógica idéntica a GestionAdmin)
      const resultado = filtrados.map(usuario => {
        // Buscamos los logs de este usuario específico
        const logsDeEsteUsuario = logs.filter(l => 
          Number(l.usuario) === Number(usuario.id)
        );

        // Ordenamos para que el primero sea el más nuevo
        const logsOrdenados = logsDeEsteUsuario.sort((a, b) => 
          new Date(b.fecha) - new Date(a.fecha)
        );

        return {
          ...usuario,
          estado: Boolean(usuario.estado), // Manteniendo lo que ya hicimos
          // Si tiene logs, tomamos la fecha del primero, si no, null
          ultimo_ingreso_real: logsOrdenados.length > 0 ? logsOrdenados[0].fecha : null
        };
      });

      setUsuarios(resultado); 
    } catch (error) {
      console.error("Error al sincronizar logs:", error);
      showModal('error', 'No se pudo sincronizar el historial de ingresos.');
    } finally {
      setcargando(false);
    }
  }, [showModal]);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  // Se activa al presionar el lápiz naranja
  const handleAbrirEditar = (usuario) => {
      setUsuarioSeleccionado(usuario);
      setMostrarModalEdit(true);
  };

  // Se activa al cerrar el modal
  const handleCerrarEditar = () => {
      setUsuarioSeleccionado(null);
      setMostrarModalEdit(false);
  };

  // Función para procesar el guardado 
  const handleGuardarCambios = async (datosEditados) => {
    try {
      const idUsuario = usuarioSeleccionado.id;
      await actualizarUsuarioService(idUsuario, datosEditados);

      setMostrarModalEdit(false); 
      await fetchDatos(); // Recargamos la tabla para ver los cambios
      showModal('success', '¡Usuario actualizado con éxito!');
    } catch (error) {
      // Extraemos los detalles del error que envía el backend
      const serverError = error.detalles || error; 

      // 1. Error por Identificación Duplicada
      if (serverError && serverError.identificacion) {
        let msgId = Array.isArray(serverError.identificacion) 
          ? serverError.identificacion[0] 
          : serverError.identificacion;
        
        showModal('error', msgId.includes("already exists") 
          ? 'Esta identificación ya pertenece a otro usuario.' 
          : msgId);
      }
      // 2. Error por Correo Duplicado
      else if (serverError && serverError.correo) {
        let mensajeOriginal = Array.isArray(serverError.correo) 
          ? serverError.correo[0] 
          : serverError.correo;

        showModal('error', mensajeOriginal.includes("already exists") 
          ? 'Este correo electrónico ya está registrado.' 
          : mensajeOriginal);
      }
      // 3. Error General
      else {
        showModal('error', 'No se pudieron guardar los cambios. Inténtalo de nuevo.');
      }
    }
  };

  // Función para abrir el modal pasando el ID
  const handleAbrirVer = (id) => {
      setIdSeleccionado(id);
      setModalVerAbierto(true);
  };

  // Función para cerrar el modal y limpiar el ID
  const handleCerrarVer = () => {
      setModalVerAbierto(false);
      setIdSeleccionado(null);
  };

  // Lógica idéntica a GestionAdmin para activar/desactivar
  const handleToggleEstado = async (usuario) => {
      // Forzamos el booleano por si la DB manda 1/0
      const estadoActual = Boolean(usuario.estado); 
      const nuevoEstado = !estadoActual;
      
      try {
          // Enviamos el cambio al backend
          await actualizarUsuarioService(usuario.id, { estado: nuevoEstado });
          
          showModal('success', `Usuario ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
          
          // Refrescamos la tabla para ver el cambio de color de inmediato
          await fetchDatos(); 
      } catch (error) {
          showModal('error', "No se pudo cambiar el estado del usuario.");
      }
  };

  if (cargando) {
      return (
          <AdminLayout onSearch={setSearchTerm}>
              <div className={style.cargandoContainer}><p>Sincronizando con el servidor...</p></div>
          </AdminLayout>
      );
  }

  const handleGuardarNuevoUsuario = async (datosNuevoUsuario) => {
    setErroresBackend({}); 
    setGuardando(true);

    try {
        // --- SEGURO ANTI-ADMIN Y VALIDACIÓN DE ROL ---
        const datosFinales = {
            ...datosNuevoUsuario,
            // Si por error llega 'admin' o el campo está vacío, 
            // forzamos 'estudiante' ya que estamos en gestión académica.
            rol: (datosNuevoUsuario.rol === 'admin' || !datosNuevoUsuario.rol) 
                 ? 'estudiante' 
                 : datosNuevoUsuario.rol 
        };

        // Llamada al servicio de UsuariosService
        await crearNuevoUsuario(datosFinales); 
        
        showModal('success', '¡El nuevo usuario ha sido registrado y se le ha enviado su acceso!');
        cerrarModalYLimpiar();
        fetchDatos(); // Recarga la tabla para ver al nuevo integrante
    } catch (error) {
          if (error.detalles) {
              // Esto activará los bordes rojos en AddMemberForm
              setErroresBackend(error.detalles); 
              showModal('error', 'Por favor, corrige los errores resaltados.');
          } else {
              showModal('error', error.message || 'No se pudo completar el registro.');
          }
      } finally {
          setGuardando(false);
      }
  };


  const filteredUsuarios = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para cerrar el modal y limpiar alertas previas
  const cerrarModalYLimpiar = () => {
      setMostrarModalCrear(false);
      setErroresBackend({});
  };

  const handleSubirCSV = (event) => {
    const archivo = event.target.files[0];

    if (archivo) {
      Papa.parse(archivo, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: async (results) => {
          const usuariosBrutos = results.data;

          // 1. Filtrar solo filas con correo y omitir la fila de ejemplo del profesor
          const usuariosCargados = usuariosBrutos.filter(fila => {
            const correo = fila.correo?.toString().toLowerCase().trim();
            return correo && correo !== "profesor@ejemplo.com";
          });

          if (usuariosCargados.length === 0) {
            showModal('error', 'El archivo no contiene datos válidos de docentes para registrar.');
            return;
          }

          // 2. Validación de duplicados en el archivo
          const correosEnArchivo = new Set();
          const idsEnArchivo = new Set();
          
          for (const fila of usuariosCargados) {
            const correo = fila.correo?.toString().toLowerCase().trim();
            const id = String(fila.identificacion || '').trim();

            if (correosEnArchivo.has(correo)) {
              showModal('error', `El correo está repetido en el archivo: ${correo}`);
              return;
            }
            if (idsEnArchivo.has(id)) {
              showModal('error', `La identificación está repetida en el archivo: ${id}`);
              return;
            }
            correosEnArchivo.add(correo);
            idsEnArchivo.add(id);
          }

          setGuardando(true);
          let erroresEncontrados = [];

          try {
            for (const fila of usuariosCargados) {
              // Construimos el objeto forzando el rol 'profesor'
              const datosUsuario = {
                nombre: fila.nombre?.toString().trim(),
                correo: fila.correo?.toString().trim(),
                identificacion: String(fila.identificacion || '').trim(),
                institucion: fila.institucion?.toString().trim() || 'Fisikapp',
                rol: 'profesor' 
              };

              if (datosUsuario.nombre && datosUsuario.correo) {
                try {
                  await crearNuevoUsuario(datosUsuario);
                } catch (err) {
                  const mensajeError = err.detalles?.correo || err.detalles?.identificacion || err.message || "Error";
                  erroresEncontrados.push(`${datosUsuario.correo}: ${mensajeError}`);
                }
              }
            }

            // 3. Respuesta final enfocada solo en docentes
            if (erroresEncontrados.length > 0) {
              const resumen = erroresEncontrados.length === 1 
                ? `Error: ${erroresEncontrados[0]}`
                : `${erroresEncontrados[0]} (y ${erroresEncontrados.length - 1} errores más).`;
              
              showModal('error', `Carga terminada con observaciones: ${resumen}`);
            } else {
              showModal('success', '¡Excelente! Todos los docentes han sido registrados exitosamente.');
            }
            
            fetchDatos();
          } catch (error) {
            showModal('error', 'Hubo un fallo crítico al procesar el archivo de docentes.');
          } finally {
            setGuardando(false);
            event.target.value = ''; 
          }
        }
      });
    }
  };

  

  return (
    <AdminLayout onSearch={setSearchTerm}>
      <div className={style.layout}>
        <div className={style.headerSection}>
          <h2 className={style.title}>Administración de usuarios</h2>
          <div className={style.buttonsGroup}>
              {/* Input oculto que se activa por código */}
              <input 
                  type="file" 
                  accept=".csv" 
                  id="csvInput" 
                  style={{ display: 'none' }} 
                  onChange={handleSubirCSV} 
              />
              
              <AdminCreateButton 
                  icon={FileUp} 
                  text="Cargar CSV" 
                  onClick={() => setMostrarModalCSV(true)} 
                  disabled={guardando}
              />

              <AdminCreateButton 
                  icon={UserPlus} 
                  text="Añadir Usuario" 
                  onClick={() => setMostrarModalCrear(true)}
              />
          </div>
        </div>

        <AdminDataTable 
          columns={columnas} 
          data={filteredUsuarios}
          renderRow={(usuario) => (
            <tr key={usuario.id}>
              <td className={style.nameText}>{usuario.nombre}</td>
              <td>{usuario.correo}</td>
              <td>
                <span className={usuario.rol.toLowerCase() === "profesor" ? style.roleDocente : style.roleEstudiante}>
                  {usuario.rol.toLowerCase() === "profesor" ? "Profesor" : "Estudiante"}
                </span>
              </td>

              {/* LÓGICA DE ESTADO: Idéntica a GestionAdmin */}
              <td>
                <span className={usuario.estado ? style.statusActive : style.statusInactive}>
                  {usuario.estado ? "Activo" : "Inactivo"}
                </span>
              </td>

              {/* En el renderRow de tu AdminDataTable */}
              <td title={usuario.ultimo_ingreso_real ? new Date(usuario.ultimo_ingreso_real).toLocaleString() : "Sin ingresos"}>
                {usuario.ultimo_ingreso_real ? getRelativeTime(usuario.ultimo_ingreso_real) : "Nunca"}
              </td>

              <td className={style.actionsCell}>
                <AdminIconButton 
                  icon={Edit} 
                  type="edit" 
                  title="Editar" 
                  onClick={() => handleAbrirEditar(usuario)} // <--- Conexión aquí
                />
                
                <AdminIconButton 
                    icon={Eye} 
                    type="detail" 
                    title="Ver detalles" 
                    onClick={() => handleAbrirVer(usuario.id)} // <--- Conectado aquí
                />

                <AdminIconButton 
                  icon={usuario.estado ? UserX : UserCheck} 
                  type={usuario.estado ? "delete" : "success"} 
                  title={usuario.estado ? "Desactivar" : "Activar"} 
                  onClick={() => handleToggleEstado(usuario)} // <--- Conexión aquí
                />
              </td>
            </tr>
          )}
        />
      </div>
      {mostrarModalEdit && (
        <ModalEditarAdmin 
          usuario={usuarioSeleccionado} 
          onClose={handleCerrarEditar} 
          onSave={handleGuardarCambios} 
        />
      )}
      <ModalVerAdmin 
          id={idSeleccionado} 
          isOpen={modalVerAbierto} 
          onClose={handleCerrarVer} 
          titulo="Información del Usuario"
      />

      <ModalCargaCSVAdmin 
          isOpen={mostrarModalCSV}
          onClose={() => setMostrarModalCSV(false)}
          onArchivoSeleccionado={handleSubirCSV} 
          cargando={guardando}
      />

      <GenericModal 
          isOpen={mostrarModalCrear} 
          onClose={cerrarModalYLimpiar} 
          title="Registro de Nuevo Usuario"
      >
          <AddMemberForm 
              onSave={handleGuardarNuevoUsuario} 
              errores={erroresBackend}
              onCancel={cerrarModalYLimpiar} 
              cargando={guardando} 
              esGestionUsuarios={true} // <--- Activamos el filtro aquí
          />
      </GenericModal>

    </AdminLayout>
  );
}

export default UsuariosAdmin;