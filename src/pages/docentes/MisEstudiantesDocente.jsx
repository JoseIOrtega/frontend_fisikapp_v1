import DocenteLayout from '../../layouts/DocenteLayout'
import style from './MisEstudiantesDocente.module.css'

function MisEstudiantesDocente() {
  return (
    <DocenteLayout>
        <div className={style["layout"]}>
            <h2>Mis Estudiantes</h2>
        </div>
    </DocenteLayout>
  )
}

export default MisEstudiantesDocente