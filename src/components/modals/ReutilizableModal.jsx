import React from "react";
import styles from "./ReutilizableModal.module.css";

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  onConfirm,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        
        // Botón cerrar 
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        //contenido del modal
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>

        {/* Botones */}
        <div style={{ display: "flex", gap: "10px" }}>
          
          <button
            className={`${styles.actionBtn} ${styles[type]}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>

          <button
            className={styles.actionBtn}
            style={{ backgroundColor: "#ffffff" }}
            onClick={onClose}
          >
            {cancelText}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Modal;