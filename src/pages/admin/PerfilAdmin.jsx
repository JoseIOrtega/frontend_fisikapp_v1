import AdminLayout from "../../layouts/AdminLayout"
import style from './PerfilAdmin.module.css'

function PerfilAdmin() {
  return (
    <AdminLayout>
        <div className={style["layout"]}>
            <h2>Perfil Admin</h2>
        </div>
    </AdminLayout>
  )
}

export default PerfilAdmin