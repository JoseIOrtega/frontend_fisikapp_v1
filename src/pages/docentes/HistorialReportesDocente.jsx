import DocenteLayout from '../../layouts/DocenteLayout'
import style from './HistorialReportesDocente.module.css'

function HistorialReportesDocente() {
  return (
    <DocenteLayout>
        <div className={style["layout"]}>
            <h2>Historial de reportes</h2>
        </div>
    </DocenteLayout>
  )
}

export default HistorialReportesDocente