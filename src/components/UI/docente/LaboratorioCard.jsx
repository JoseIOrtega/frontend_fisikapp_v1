import { Beaker, ArrowRight, Trash2, Lock, RefreshCcw } from 'lucide-react';
import style from './LaboratorioCard.module.css';

function LaboratorioCard({ 
  laboratorio, 
  onIngresar, 
  onEliminar, 
  onToggleEstado, 
  onReutilizar, // Nueva función para clonar
  esArchivado = false // Prop para identificar la sección
}) {
  const { id, titulo_lab, categoria_nombre, codigo_lab, estado, inhabilitadoPorAdmin } = laboratorio;
  
  // En Archivados, consideramos que siempre está "pausado" visualmente
  const isInactivo = estado === 'inactivo' || inhabilitadoPorAdmin || esArchivado;

  return (
    <div className={`
      ${style.card} 
      ${isInactivo ? style.cardInactiva : ''} 
      ${esArchivado ? style.cardArchivada : ''}
    `}>
      <header className={style.header}>
        <div className={style.iconContainer}>
          <Beaker size={18} />
        </div>
        
        {/* Switch: Solo aparece si NO es archivado y NO está bloqueado por Admin */}
        {!esArchivado && !inhabilitadoPorAdmin ? (
          <label className={style.switch} title={estado === 'activo' ? 'Desactivar' : 'Activar'}>
            <input 
              type="checkbox" 
              checked={estado === 'activo'} 
              onChange={() => onToggleEstado(id)} 
            />
            <span className={style.slider}></span>
          </label>
        ) : inhabilitadoPorAdmin && (
          <div className={style.adminLock}>
            <Lock size={12} />
            <span>BLOQUEO ADMIN</span>
          </div>
        )}
      </header>

      <div className={style.content}>
        <h3 className={style.title} title={titulo_lab}>
          {titulo_lab}
        </h3>
        
        {/* Mensajes de estado dinámicos */}
        {inhabilitadoPorAdmin ? (
          <p className={style.adminMsg}>Inhabilitado por la administración</p>
        ) : esArchivado ? (
          <p className={style.inactiveMsg}>Proyecto en archivo</p>
        ) : isInactivo ? (
          <p className={style.inactiveMsg}>Laboratorio pausado</p>
        ) : (
          <p className={style.category}>{categoria_nombre}</p>
        )}
      </div>

      <div className={`${style.codeSection} ${isInactivo ? style.codeDisabled : ''}`}>
        <span className={style.codeHint}>CÓDIGO DE ACCESO</span>
        <div className={style.codeValue}>
          {esArchivado ? "--- ---" : (codigo_lab || "--- ---")}
        </div>
      </div>

      <footer className={style.actions}>
        {/* Eliminar siempre está disponible, pero en archivados es "Eliminar definitivo" */}
        <button 
          className={style.deleteBtn} 
          onClick={() => onEliminar(id)}
          title={esArchivado ? "Eliminar permanentemente" : "Eliminar"}
        >
          <Trash2 size={18} />
        </button>
        
        {/* Botón principal cambia según la sección */}
        {esArchivado ? (
          <button className={style.reuseBtn} onClick={() => onReutilizar(id)}>
            Reutilizar
            <RefreshCcw size={16} />
          </button>
        ) : (
          <button 
            className={style.enterBtn} 
            disabled={isInactivo} 
            onClick={() => onIngresar(id)}
          >
            {inhabilitadoPorAdmin ? 'Bloqueado' : isInactivo ? 'Habilitar' : 'Ingresar'}
            <ArrowRight size={16} />
          </button>
        )}
      </footer>
    </div>
  );
}

export default LaboratorioCard;