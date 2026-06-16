import DocenteLayout from "../../layouts/DocenteLayout";
import style from './SesionesDocente.module.css';

function SesionesDocente() {
  return (
    <DocenteLayout>
        <div className={style.container}>
            Sesiones Docente
        </div>
    </DocenteLayout>
  )
}

export default SesionesDocente