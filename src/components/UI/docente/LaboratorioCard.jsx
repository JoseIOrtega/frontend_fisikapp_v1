import React from 'react';
import { Beaker, ArrowRight, Trash2, Lock, RefreshCcw } from 'lucide-react';
import style from './LaboratorioCard.module.css';

function LaboratorioCard({ 
  laboratorio, 
  onIngresar, 
  onEliminar, 
  onToggleEstado, 
  onReutilizar, 
  esArchivado = false 
}) {
  // Desestructuramos directamente grado y jornada desde el objeto de la base de datos
  const { 
    id, 
    titulo_lab, 
    categoria_nombre, 
    codigo_lab, 
    estado, 
    inhabilitadoPorAdmin, 
    configurado_completo, 
    fecha_creacion,
    grado,       // Recibido directamente desde Django
    jornada      // Recibido directamente desde Django
  } = laboratorio;
  
  const isInactivo = estado === 'inactivo' || estado === false || inhabilitadoPorAdmin || esArchivado;

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
        
        {/* Switch: Activo / Inactivo */}
        {!esArchivado && !inhabilitadoPorAdmin ? (
          <label className={style.switch} title={estado === 'activo' || estado === true ? 'Desactivar' : 'Activar'}>
            <input 
              type="checkbox"
              title={estado === 'activo' || estado === true ? 'Desactivar' : 'Activar'} 
              checked={estado === true || estado === 'activo'}
              onChange={(e) => {
                e.stopPropagation(); 
                onToggleEstado(id); 
              }} 
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
        {/* Mostramos el título directo de la base de datos sin procesos de strings */}
        <h3 className={style.title} title={titulo_lab}>
          {titulo_lab}
        </h3>
        
        {/* Información escolar con los campos nativos */}
        <div className={style.schoolInfo}>
          {grado && <span className={style.badge}>{grado}</span>}
          {jornada && <span className={style.badge}>{jornada}</span>}
          
          {/* Pone el punto divisor si hay fecha de creación y además hay etiquetas antes */}
          {fecha_creacion && (grado || jornada) && (
            <span className={style.separator}>•</span>
          )}

          {fecha_creacion && (
            <span className={style.dateLabel}>
              {new Date(fecha_creacion).toLocaleDateString()}
            </span>
          )}
        </div>
        
        {/* Mensajes de estado dinámicos */}
        {inhabilitadoPorAdmin ? (
          <p className={style.adminMsg}>Inhabilitado por la administración</p>
        ) : esArchivado ? (
          <p className={style.inactiveMsg}>Proyecto en archivo</p>
        ) : isInactivo && configurado_completo ? (
          <p className={style.inactiveMsg}>Laboratorio pausado</p>
        ) : (
          <p className={style.category}>{categoria_nombre}</p>
        )}
      </div>

      {/* SECCIÓN DEL CÓDIGO DE ACCESO */}
      {esArchivado ? (
        <div className={`${style.codeSection} ${style.codeDisabled}`}>
          <span className={style.codeHint}>CÓDIGO DE ACCESO</span>
          <div className={style.codeValue}>--- ---</div>
        </div>
      ) : configurado_completo ? (
        <div className={`${style.codeSection} ${isInactivo ? style.codeDisabled : ''}`}>
          <span className={style.codeHint}>CÓDIGO DE ACCESO</span>
          <div className={style.codeValue}>{codigo_lab || "--- ---"}</div>
        </div>
      ) : (
        <div className={style.codeSectionPending}>
          <span className={style.codeHintPending}>ESTADO DEL LAB</span>
          <div className={style.codeValuePending}>Por configurar</div>
        </div>
      )}

      <footer className={style.actions}>
        <button 
          className={style.deleteBtn} 
          onClick={() => onEliminar(id)}
          title={esArchivado ? "Eliminar permanentemente" : "Eliminar"}
        >
          <Trash2 size={18} />
        </button>
        
        {esArchivado ? (
          <button className={style.reuseBtn} onClick={() => onReutilizar(id)}>
            Reutilizar
            <RefreshCcw size={16} />
          </button>
        ) : (
          <button 
            className={style.enterBtn} 
            disabled={inhabilitadoPorAdmin || isInactivo} 
            onClick={() => onIngresar(id)}
          >
            {inhabilitadoPorAdmin ? 'Bloqueado' : !configurado_completo ? 'Configurar' : isInactivo ? 'Pausado' : 'Ingresar'}
            <ArrowRight size={16} />
          </button>
        )}
      </footer>
    </div>
  );
}

export default LaboratorioCard;