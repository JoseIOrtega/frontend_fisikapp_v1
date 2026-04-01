import AdminLayout from "../../layouts/AdminLayout"
import style from './UsuariosAdmin.module.css'

function UsuariosAdmin() {
  return (
    <AdminLayout>
        <div className={style["layout"]}>
            <h2>Usuarios Admin</h2>
        </div>
    </AdminLayout>
  )
}

export default UsuariosAdmin