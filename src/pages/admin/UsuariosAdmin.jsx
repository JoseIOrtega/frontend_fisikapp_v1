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
    { id: 1, nombre: "Laura Pérez", correo: "laura.perez@hotmail.com", rol: "Estudiante", estado: "Activo", ultimoIngreso: "02/04/2026" },
    { id: 2, nombre: "Miguel Torres", correo: "miguel.torres@fisikapp.com", rol: "Docente", estado: "Activo", ultimoIngreso: "28/03/2026" },
    { id: 3, nombre: "Sofía Ramírez", correo: "sofia.ramirez@gmail.com", rol: "Estudiante", estado: "Inactivo", ultimoIngreso: "10/02/2026" },
    { id: 4, nombre: "Andrés López", correo: "andres.lopez@fisikapp.com", rol: "Docente", estado: "Activo", ultimoIngreso: "31/03/2026" },
    { id: 5, nombre: "Valentina Castro", correo: "valentina.castro@gmail.com", rol: "Estudiante", estado: "Activo", ultimoIngreso: "Hoy" }
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
                    
                  </td>
                  <td>{usuario.ultimoIngreso}</td>
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