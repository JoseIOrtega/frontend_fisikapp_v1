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
  // Traemos "fecha_creacion" del objeto que viene de la base de datos
  const { id, titulo_lab, categoria_nombre, codigo_lab, estado, inhabilitadoPorAdmin, configurado_completo, fecha_creacion } = laboratorio;
  
  // Consideramos inactivo si el string es 'inactivo', si el booleano es false, o si está bloqueado/archivado
  const isInactivo = estado === 'inactivo' || estado === false || inhabilitadoPorAdmin || esArchivado;

  // 🚀 LÓGICA DE EXTRACCIÓN: Separar título original de los corchetes [...]
  let nombreMostrar = titulo_lab;
  let gradoEtiqueta = "";
  let jornadaEtiqueta = "";

  const regexCorchetes = /\[(.*?)\]/;
  const match = titulo_lab.match(regexCorchetes);

  if (match) {
    // Extrae el título limpio sin los corchetes
    nombreMostrar = titulo_lab.replace(regexCorchetes, '').trim(); 
    
    // Separa el grado y la jornada mediante el guion
    const partes = match[1].split(' - ');
    gradoEtiqueta = partes[0] || "";
    jornadaEtiqueta = partes[1] || "";
  }

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
              title={estado === 'activo' || estado === true ? 'Desactivar' : 'Activar'} 
              checked={laboratorio.estado === true || laboratorio.estado === 'activo'}
              onChange={(e) => {
                e.stopPropagation(); // ¡Detiene el clic aquí y evita que afecte a toda la tarjeta!
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
        {/* Mostramos el nombre limpio sin los corchetes */}
        <h3 className={style.title} title={nombreMostrar}>
          {nombreMostrar}
        </h3>
        
        {/* 🚀 SECCIÓN ESCOLAR UNIFICADA (Aparecen juntos de corrido) */}
        <div className={style.schoolInfo}>
          {gradoEtiqueta && <span className={style.badge}>{gradoEtiqueta}</span>}
          {jornadaEtiqueta && <span className={style.badge}>{jornadaEtiqueta}</span>}
          
          {/* Pone el punto divisor si hay fecha de creación y además hay etiquetas de grado o jornada antes */}
          {fecha_creacion && (gradoEtiqueta || jornadaEtiqueta) && (
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

      {/* SECCIÓN DEL CENTRO REDISEÑADA */}
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
        {/* Eliminar siempre está disponible */}
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