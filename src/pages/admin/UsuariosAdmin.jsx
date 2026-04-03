import AdminLayout from "../../layouts/AdminLayout";
import AdminDataTable from "../../components/UI/AdminDataTable";
import AdminIconButton from "../../components/UI/AdminIconButton";
import AdminCreateButton from "../../components/UI/AdminCreateButton";
import { UserPlus, Edit, Eye, UserX, UserCheck } from "lucide-react";
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
    { id: 1, nombre: "Juan Muñoz", correo: "juan@gmail.com", rol: "Estudiante", estado: "Activo", ultimoIngreso: "27/03/2026" },
    { id: 2, nombre: "Ana García", correo: "ana@fisikapp.com", rol: "Docente", estado: "Inactivo", ultimoIngreso: "15/02/2026" },
    { id: 3, nombre: "Carlos Rodríguez", correo: "carlos.fisica@gmail.com", rol: "Docente", estado: "Activo", ultimoIngreso: "30/03/2026" },
    { id: 4, nombre: "Elena Beltrán", correo: "elena@fisikapp.com", rol: "Estudiante", estado: "Inactivo", ultimoIngreso: "01/01/2026" },
    { id: 5, nombre: "Super Admin", correo: "root@fisikapp.com", rol: "Estudiante", estado: "Activo", ultimoIngreso: "Hoy" }
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
              <td>
                <span className={style.roleBadge}>
                  {usuario.rol}
                  </span>
                  </td>
                  <td>
                    <span className={
                      usuario.estado === "Activo" 
                      ? style.statusActive 
                      : style.statusInactive}>
                      {usuario.estado}
                    </span>
                    <span className={
                      usuario.rol === "Docente"
                      ? style.rolDocente
                      : style.rolEstudiante}>
                        {usuario.rol}
                    </span> 
                    
                  </td>
                  <td>{usuario.ultimoIngreso}</td>
                  <td className={style.actionsCell}>
                    <AdminIconButton icon={Edit} title="editar"  />
                    <AdminIconButton icon={Eye} title="ver" />
                    <AdminIconButton
                    icon={usuario.estado === "Activo" ? UserX : UserCheck}
                    />
                  </td>
                </tr>
              )}
            />
      </div>
    </AdminLayout>
  );
}

export default UsuariosAdmin;