import GenericModal from "./GenericModal";
import style from "./ModalVerProgreso.module.css";

function ModalVerProgresoEstudiante({ isOpen, onClose, estudianteId }) {
  return (
    <GenericModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Progreso del Estudiante - Laboratorio de Física"
    >
      <div className={style.container}>
        {/* Cabecera con el ID */}
        <header className={style.infoUser}>
           <p>Revisando actividad del estudiante ID: <strong>{estudianteId}</strong></p>
        </header>

        {/* Tarjetas de Resumen (Estadísticas rápidas) */}
        <section className={style.stats}>
          <div className={style.card}>
            <span className={style.label}>Labs Completados</span>
            <span className={style.value}>4 / 6</span>
          </div>
          <div className={style.card}>
            <span className={style.label}>Promedio General</span>
            <span className={style.value}>4.5</span>
          </div>
        </section>

        {/* Tabla de Detalles */}
        <div className={style.details}>
          <h4>Calificaciones Recientes</h4>
          <table className={style.miniTable}>
            <thead>
              <tr>
                <th>Práctica</th>
                <th>Estado</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Caída Libre</td>
                <td><span className={style.completed}>Aprobado</span></td>
                <td>5.0</td>
              </tr>
              <tr>
                <td>Movimiento Circular</td>
                <td><span className={style.completed}>Aprobado</span></td>
                <td>4.0</td>
              </tr>
              <tr>
                <td>Leyes de Termodinámica</td>
                <td><span className={style.pending}>En progreso</span></td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </GenericModal>
  );
}

export default ModalVerProgresoEstudiante;