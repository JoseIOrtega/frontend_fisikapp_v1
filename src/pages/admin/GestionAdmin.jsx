import AdminLayout from "../../layouts/AdminLayout";
import AdminDataTable from "../../components/UI/admin/AdminDataTable";
import AdminIconButton from "../../components/UI/admin/AdminIconButton";
import AdminCreateButton from "../../components/UI/admin/AdminCreateButton";
import { UserPlus, Edit, Key, Eye, UserX, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getRelativeTime } from '../../utils/dateHelpers';
import { getAdminsService,getLoginLogsService } from '../../services/admin/GestionAdminService';
import { useModal } from '../../context/ModalContext';

import GenericModal from '../../components/modals/GenericModal';
import AddMemberForm from '../../components/UI/admin/gestion_admins/AddMemberForm';
import { crearNuevoAdmin } from '../../services/admin/GestionAdminService'; // Asegúrate de tener esta función en tu service

import style from './GestionAdmin.module.css';

function GestionAdmin() {
  const [admins, setAdmins] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [cargando, setCargando] = useState(true);
  const { showModal } = useModal();
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const columnas = [
    {label: "Nombre"}, {label: "Correo"}, {label: "Rol"}, 
    {label: "Estado"}, {label: "Último Ingreso"}, {label: "Acciones"}
  ];

  // 1. MOVER LA FUNCIÓN AQUÍ (Afuera del useEffect para que sea visible)
  const fetchDatos = async () => {
    try {
      const [usuarios, logs] = await Promise.all([
        getAdminsService(),
        getLoginLogsService(),
      ]);

      const soloAdmins = usuarios.filter(u => u.rol === 'admin' || u.rol === 'superadmin');

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
      console.error("Error:", error);
      showModal('error', 'Error al cargar los datos');
    } finally {
      setCargando(false);
    }
  };

  // 2. EL USEEFFECT SOLO LA EJECUTA AL CARGAR LA PÁGINA
  useEffect(() => {
    fetchDatos();
  }, []);

  const filteredAdmins = admins.filter(admin => 
    admin.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGuardarNuevoAdmin = async (datosNuevoAdmin) => {
    setGuardando(true);
    try {
      await crearNuevoAdmin(datosNuevoAdmin);
      showModal('success', '¡Administrador creado con éxito!');
      setMostrarModalCrear(false);
      
      // ✅ AHORA SÍ FUNCIONA porque la función es visible aquí
      fetchDatos(); 

    } catch (error) {
      showModal('error', error.message || 'No se pudo crear el administrador.');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
      return (
          <AdminLayout onSearch={setSearchTerm}>
              <div className={style.loadingContainer}><p>Cargando administradores...</p></div>
          </AdminLayout>
      );
  }

  return (
    <AdminLayout onSearch={setSearchTerm}>
      <div className={style.layout}>
        <div className={style.headerSection}>
          <h2 className={style.title}>Administración</h2>
          <AdminCreateButton 
                icon={UserPlus} 
                text="Añadir Miembro" 
                onClick={() => setMostrarModalCrear(true)} // 1. Abrimos el modal
          />
        </div>

        <AdminDataTable 
          columns={columnas} 
          data={filteredAdmins} 
          renderRow={(admin) => (
            <tr key={admin.id}>
              <td className={style.nameText}>{admin.nombre}</td>
              <td>{admin.correo}</td>
              <td><span className={style.roleBadge}>{admin.rol}</span></td>
              
              {/* Ajuste: Usamos el booleano 'estado' que viene de Django */}
              <td>
                <span className={admin.estado ? style.statusActive : style.statusInactive}>
                  {admin.estado ? "Activo" : "Inactivo"}
                </span>
              </td>
              

              <td title={admin.ultimo_ingreso_real ? new Date(admin.ultimo_ingreso_real).toLocaleString() : "Sin registros"}>
                {admin.ultimo_ingreso_real ? getRelativeTime(admin.ultimo_ingreso_real) : "Nunca"}
              </td>


              <td className={style.actionsCell}>
                <AdminIconButton icon={Edit} type="edit" title="Editar" />
                <AdminIconButton icon={Key} type="reset" title="Clave" />
                <AdminIconButton icon={Eye} type="detail" title="Ver" />
                {/* El ícono cambia según el booleano 'estado' */}
                <AdminIconButton 
                  icon={admin.estado ? UserX : UserCheck} 
                  type={admin.estado ? "delete" : "success"} 
                />
              </td>
            </tr>
          )}
        />
      </div>

      {/* 2. El Modal Reutilizable */}
      <GenericModal 
          isOpen={mostrarModalCrear} 
          onClose={() => setMostrarModalCrear(false)} 
          title="Añadir Nuevo Miembro"
      >
          {/* 3. El Formulario Específico */}
          <AddMemberForm 
              onSave={handleGuardarNuevoAdmin} 
              onCancel={() => setMostrarModalCrear(false)} 
              cargando={guardando} 
          />
      </GenericModal>    



    </AdminLayout>
  );
}

export default GestionAdmin;