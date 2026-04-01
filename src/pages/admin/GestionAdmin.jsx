import AdminLayout from "../../layouts/AdminLayout";
import AdminDataTable from "../../components/UI/AdminDataTable";
import AdminIconButton from "../../components/UI/AdminIconButton";
import AdminCreateButton from "../../components/UI/AdminCreateButton";
import { UserPlus, Edit, Key, Eye, UserX, UserCheck } from 'lucide-react';
import style from './GestionAdmin.module.css';

function GestionAdmin() {

  const columns = [
    { label: "Nombre" },
    { label: "Correo" },
    { label: "Rol" },
    { label: "Estado" },
    { label: "Último ingreso" },
    { label: "Acciones", style: { textAlign: 'center' } }
  ];

  const admins = [
    { id: 1, nombre: "Juan Muñoz", correo: "juan@gmail.com", rol: "Admin", estado: "Activo", ultimoIngreso: "27/03/2026" },
    { id: 2, nombre: "Ana García", correo: "ana@fisikapp.com", rol: "SuperAdmin", estado: "Inactivo", ultimoIngreso: "15/02/2026" },
    { id: 3, nombre: "Carlos Rodríguez", correo: "carlos.fisica@gmail.com", rol: "Admin", estado: "Activo", ultimoIngreso: "30/03/2026" },
    { id: 4, nombre: "Elena Beltrán", correo: "elena@fisikapp.com", rol: "Admin", estado: "Inactivo", ultimoIngreso: "01/01/2026" },
    { id: 5, nombre: "Super Admin", correo: "root@fisikapp.com", rol: "SuperAdmin", estado: "Activo", ultimoIngreso: "Hoy" }
  ];

  return (
    <AdminLayout>
      <div className={style.layout}>
        <div className={style.headerSection}>
          <h2 className={style.title}>Administración</h2>
          <AdminCreateButton icon={UserPlus} text="Añadir Miembro" />
        </div>

        <AdminDataTable 
          columns={columns} 
          data={admins} 
          renderRow={(admin) => (
            <tr key={admin.id}>
              <td className={style.nameText}>{admin.nombre}</td>
              <td>{admin.correo}</td>
              <td><span className={style.roleBadge}>{admin.rol}</span></td>
              <td><span className={admin.estado === "Activo" ? style.statusActive : style.statusInactive}>{admin.estado}</span></td>
              <td>{admin.ultimoIngreso}</td>
              <td className={style.actionsCell}>
                <AdminIconButton icon={Edit} type="edit" title="Editar" />
                <AdminIconButton icon={Key} type="reset" title="Clave" />
                <AdminIconButton icon={Eye} type="detail" title="Ver" />
                <AdminIconButton icon={admin.estado === "Activo" ? UserX : UserCheck} type="delete" />
              </td>
            </tr>
          )}
        />
      </div>
    </AdminLayout>
  );
}

export default GestionAdmin;