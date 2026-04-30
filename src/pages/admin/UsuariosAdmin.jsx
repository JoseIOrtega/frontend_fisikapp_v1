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
import { crearNuevoUsuarioDocente } from '../../services/admin/UsuariosService';
import { actualizarUsuarioService } from '../../services/admin/UsuariosService';
import ModalEditarAdmin from '../../components/modals/ModalEditarAdmin';
import ModalVerAdmin from '../../components/modals/ModalVerAdmin';
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
    console.log("Datos que salen del formulario:", datosNuevoUsuario);
    try {
        // --- SEGURO ANTI-ADMIN ---
        // Si por alguna razón el formulario envió "admin", aquí lo corregimos 
        // basándonos en lo que el usuario seleccionó o forzando un rol académico.
        const datosFinales = {
            ...datosNuevoUsuario,
            // Si el rol es admin o está vacío, lo forzamos a estudiante por seguridad
            rol: (datosNuevoUsuario.rol === 'admin' || !datosNuevoUsuario.rol) 
                 ? 'estudiante' 
                 : datosNuevoUsuario.rol 
        };

        await crearNuevoUsuarioDocente(datosFinales); // Enviamos los datos corregidos
        
        showModal('success', '¡El nuevo usuario ha sido registrado y se le ha enviado su acceso!');
        cerrarModalYLimpiar();
        fetchDatos(); 
    } catch (error) {
          if (error.detalles) {
              setErroresBackend(error.detalles); // Muestra los bordes rojos en los campos fallidos
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
          console.log("--- Iniciando lectura de CSV ---");
          Papa.parse(archivo, {
              header: true,
              skipEmptyLines: true,
              dynamicTyping: true,
              complete: async (results) => {
                  const usuariosCargados = results.data;
                  
                  // DIAGNÓSTICO 1: Ver qué leyó el programa
                  console.log("Datos detectados por PapaParse:", usuariosCargados);

                  if (usuariosCargados.length === 0) {
                      showModal('error', 'El archivo parece estar vacío.');
                      return;
                  }

                  setGuardando(true);
                  let erroresEncontrados = [];

                  try {
                      for (const [index, fila] of usuariosCargados.entries()) {
                          // DIAGNÓSTICO 2: Ver cada fila antes de enviarla
                          console.log(`Procesando fila ${index + 1}:`, fila);

                          const datosUsuario = {
                              nombre: fila.nombre?.toString().trim(),
                              correo: fila.correo?.toString().trim(),
                              rol: fila.rol?.toString().toLowerCase().trim() || 'estudiante',
                              identificacion: String(fila.identificacion || '').trim(),
                              institucion: fila.institucion?.toString().trim() || 'Fisikapp',
                              
                              // UNIMOS AMBOS CAMPOS: Aseguramos que el tipo de documento vaya en MAYÚSCULAS
                              // Esto generará algo como "TI10295740"
                              password: `${String(fila.tipo_documento || '').toUpperCase().trim()}${String(fila.identificacion || '').trim()}`,
                              clave: `${String(fila.tipo_documento || '').toUpperCase().trim()}${String(fila.identificacion || '').trim()}`
                          };

                          if (datosUsuario.nombre && datosUsuario.correo) {
                              try {
                                  await crearNuevoUsuarioDocente(datosUsuario);
                                  console.log(`✅ Usuario ${datosUsuario.correo} creado.`);
                              } catch (err) {
                                // Si el error tiene detalles (como los que configuramos en el Service)
                                const mensajeDetallado = err.detalles 
                                    ? JSON.stringify(err.detalles) 
                                    : err.message;

                                console.error(`❌ Error en fila ${index + 1} (${datosUsuario.correo}):`, mensajeDetallado);
                                erroresEncontrados.push(`${datosUsuario.correo}: ${mensajeDetallado}`);
                              }
                          } else {
                              console.warn(`⚠️ Fila ${index + 1} saltada por datos incompletos.`);
                          }
                      }

                      if (erroresEncontrados.length > 0) {
                          showModal('error', `Se cargaron algunos, pero hubo ${erroresEncontrados.length} errores. Revisa la consola (F12).`);
                      } else {
                          showModal('success', '¡Todos los usuarios han sido cargados con éxito!');
                      }
                      
                      fetchDatos();
                  } catch (error) {
                      console.error("Error crítico en el proceso:", error);
                      showModal('error', 'Error crítico al procesar el archivo.');
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
                  style={{ backgroundColor: '#4f46e5' }} 
                  onClick={() => document.getElementById('csvInput').click()} 
                  disabled={guardando} // Evitamos doble clic si está procesando
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
                  {usuario.rol.toLowerCase() === "profesor" ? "Docente" : "Estudiante"}
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