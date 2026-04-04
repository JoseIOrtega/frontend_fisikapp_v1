import AdminLayout from "../../layouts/AdminLayout";
import AdminDataTable from "../../components/UI/AdminDataTable";
import AdminIconButton from "../../components/UI/AdminIconButton";
import AdminCreateButton from "../../components/UI/AdminCreateButton";
import { UserPlus, Edit, Key, Eye, UserX, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { getRelativeTime } from '../../utils/dateHelpers';
import style from './GestionAdmin.module.css';


function GestionAdmin() {

  const [searchTerm, setSearchTerm] = useState("");

  const columns = [
    { label: "Nombre" },
    { label: "Correo" },
    { label: "Rol" },
    { label: "Estado" },
    { label: "Último ingreso" },
    { label: "Acciones", style: { textAlign: 'center' } }
  ];

  const admins = [
    { id: 1, nombre: "Juan Muñoz", correo: "juan@gmail.com", rol: "Admin", estado: "Activo", ultimoIngreso: "2026-03-27T10:00:00Z" },
    { id: 2, nombre: "Ana García", correo: "ana@gmail.com", rol: "Admin", estado: "Inactivo", ultimoIngreso: "2026-02-15T08:30:00Z" },
    { id: 3, nombre: "Carlos Rodríguez", correo: "carlos@hotmail.com", rol: "Admin", estado: "Activo", ultimoIngreso: "2026-03-30T15:45:00Z" },
    { id: 4, nombre: "Elena Beltrán", correo: "elena@gmail.com", rol: "Admin", estado: "Inactivo", ultimoIngreso: "2026-01-01T00:00:00Z" },
    { id: 5, nombre: "Victor García", correo: "Victor@hotmail.com", rol: "Admin", estado: "Activo", ultimoIngreso: new Date().toISOString() }
  ];

  // LÓGICA DE FILTRADO:
  const filteredAdmins = admins.filter((admin) =>
    admin.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.ultimoIngreso.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  return (
    <AdminLayout onSearch={setSearchTerm}>
      <div className={style.layout}>
        <div className={style.headerSection}>
          <h2 className={style.title}>Administración</h2>
          <AdminCreateButton icon={UserPlus} text="Añadir Miembro" />
        </div>

        <AdminDataTable 
          columns={columns} 
          data={filteredAdmins} 
          renderRow={(admin) => (
            <tr key={admin.id}>
              <td className={style.nameText}>{admin.nombre}</td>
              <td>{admin.correo}</td>
              <td><span className={style.roleBadge}>{admin.rol}</span></td>
              <td><span className={admin.estado === "Activo" ? style.statusActive : style.statusInactive}>{admin.estado}</span></td>
              
              <td title={new Date(admin.ultimoIngreso).toLocaleString()} style={{ cursor: 'help' }}>
                {getRelativeTime(admin.ultimoIngreso)}
              </td>

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