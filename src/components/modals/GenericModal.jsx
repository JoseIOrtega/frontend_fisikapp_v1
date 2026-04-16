import { X } from 'lucide-react';
import style from './GenericModal.module.css';

function GenericModal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    // Función para cerrar si se hace clic fuera de la tarjeta
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={style.overlay} onClick={handleOverlayClick}>
            <div className={style.modalCard}>
                <div className={style.header}>
                    <h3 className={style.title}>{title}</h3>
                    <button onClick={onClose} className={style.closeIcon} title="Cerrar">
                        <X size={20} />
                    </button>
                </div>
                <div className={style.body}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default GenericModal;