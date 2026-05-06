import DocenteLayout from '../../layouts/DocenteLayout'
import style from './MisLaboratoriosDocente.module.css'

function MisLaboratoriosDocente() {
  return (
    <DocenteLayout>
        <div className={style["layout"]}>
            <h2>Mis Laboratorios</h2>
        </div>
    </DocenteLayout>
  )
}

export default MisLaboratoriosDocente