import AdminLayout from "../../layouts/AdminLayout"
import style from './DashboardAdmin.module.css'

function DashboardAdmin() {
  return (
    <AdminLayout>
        <div className={style["layout"]}>
            <h2>Dashboard Admin</h2>
        </div>
    </AdminLayout>
  )
}

export default DashboardAdmin