import AdminLayout from "../../layouts/AdminLayout";
import AdminDataTable from "../../components/UI/AdminDataTable";
import AdminIconButton from "../../components/UI/AdminIconButton";
import AdminCreateButton from "../../components/UI/AdminCreateButton";
import { UserPlus, Edit, Eye, UserX, UserCheck } from "lucide-react";
import { getRelativeTime } from '../../utils/dateHelpers';
import style from "./UsuariosAdmin.module.css";

function UsuariosAdmin() {

  const columns = [
    { label: "Nombre" },
    { label: "Correo" },
    { label: "Rol" },
    { label: "Estado" },
    { label: "Último ingreso" },
    { label: "Acciones", style: { textAlign: 'center' } }
  ];

  const usuarios = [
    { id: 1, nombre: "Laura Pérez", correo: "laura.perez@colegio.com", rol: "Estudiante", estado: "Activo", ultimoIngreso: "2026-04-02T14:20:00Z" },
    { id: 2, nombre: "Miguel Torres", correo: "miguel.torres@colegio.com", rol: "Docente", estado: "Activo", ultimoIngreso: "2026-03-28T09:15:00Z" },
    { id: 3, nombre: "Sofía Ramírez", correo: "sofia.ramirez@colegio.com", rol: "Estudiante", estado: "Inactivo", ultimoIngreso: "2026-02-10T16:45:00Z" },
    { id: 4, nombre: "Andrés López", correo: "andres.lopez@escuela.com", rol: "Docente", estado: "Activo", ultimoIngreso: "2026-03-31T11:00:00Z" },
    { id: 5, nombre: "Valentina Castro", correo: "valentina.castro@escuela.com", rol: "Estudiante", estado: "Activo", ultimoIngreso: new Date().toISOString() }
  ];

  return (
    <AdminLayout>
        <div className={style["layout"]}>

      
          <div className={style["headerSection"]}>
            <h2 className={style.title}>Usuarios</h2>
            <AdminCreateButton icon={UserPlus} text="Añadir Usuario" />      
        </div>

        <AdminDataTable 
          columns={columns} 
          data={usuarios}
          renderRow={(usuario) => (
            <tr key={usuario.id}>
              <td className={style.nameText}>{usuario.nombre}</td>
              <td>{usuario.correo}</td>
              <td><span className={style.roleBadge}>{usuario.rol}</span></td>
                  <td><span className={usuario.estado === "Activo" ? style.statusActive : style.statusInactive}>{usuario.estado}</span></td>
                  <td title={new Date(usuario.ultimoIngreso).toLocaleString()} style={{ cursor: 'help' }}>{getRelativeTime(usuario.ultimoIngreso)}</td>
                  <td className={style.actionsCell}>
                    <AdminIconButton icon={Edit} type="edit" title="editar"  />
                    <AdminIconButton icon={Eye} type="detail" title="ver" />
                    <AdminIconButton icon={usuario.estado === "Activo" ? UserX : UserCheck} type="delete" />
                  </td>
                </tr>
              )}
            />
      </div>
    </AdminLayout>
  );
}

export default UsuariosAdmin;