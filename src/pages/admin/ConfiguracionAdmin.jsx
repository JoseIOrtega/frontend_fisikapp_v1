import AdminLayout from "../../layouts/AdminLayout"
import style from './ConfiguracionAdmin.module.css'

function ConfiguracionAdmin() {
  return (
    <AdminLayout>
        <div className={style["layout"]}>
            <h2>Configuración Admin</h2>
        </div>
    </AdminLayout>
  )
}

export default ConfiguracionAdmin