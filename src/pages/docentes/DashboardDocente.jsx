import DocenteLayout from '../../layouts/DocenteLayout'
import style from './DashboardDocente.module.css'

function DashboardDocente() {
  return (
    <DocenteLayout>
        <div className={style["layout"]}>
            <h2>Dashboard Docente</h2>
        </div>
    </DocenteLayout>
  )
}

export default DashboardDocente