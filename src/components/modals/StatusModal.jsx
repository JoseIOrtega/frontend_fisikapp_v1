import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import style from './StatusModal.module.css';

function StatusModal({ type, message, isOpen, onClose }) {
  // Si el modal no debe estar abierto, no dibujamos nada
  if (!isOpen) return null;

  // Configuración de Iconos y Títulos según el "tipo"
  const config = {
    success: { 
        icon: <CheckCircle color="#05CD99" size={50} />, 
        title: "¡Logrado!" 
    },
    error: { 
        icon: <XCircle color="#EE5D50" size={50} />, 
        title: "Hubo un error" 
    },
    warning: { 
        icon: <AlertTriangle color="#FFBC11" size={50} />, 
        title: "Atención" 
    },
    info: { 
        icon: <Info color="#422AFB" size={50} />, 
        title: "Información" 
    }
  };

  // Elegimos la configuración actual o una por defecto (info)
  const { icon, title } = config[type] || config.info;

  return (
    <div className={style.overlay} onClick={onClose}>
      <div className={style.modal} onClick={(e) => e.stopPropagation()}>
        {/* Botón X para cerrar arriba a la derecha */}
        <button className={style.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>

        <div className={style.iconContainer}>{icon}</div>
        
        <h3 className={style.title}>{title}</h3>
        <p className={style.message}>{message}</p>
        
        <button 
          className={`${style.actionBtn} ${style[type]}`} 
          onClick={onClose}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

export default StatusModal;