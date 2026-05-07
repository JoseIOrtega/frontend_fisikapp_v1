import DocenteLayout from "../../layouts/DocenteLayout"
import style from './ConfiguracionDocente.module.css'

function ConfiguracionDocente() {
  return (
    <DocenteLayout>
        <div className={style["layout"]}>
            <h2>Configuración Docente</h2>
        </div>
    </DocenteLayout>
  )
}

export default ConfiguracionDocente