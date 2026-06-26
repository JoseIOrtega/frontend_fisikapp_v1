import React, { useState, useEffect } from 'react';
import { X, CalendarClock, Loader2 } from 'lucide-react';
import style from './ModalCrearSesion.module.css';

function ModalCrearSesion({ isOpen, onClose, onConfirm }) {
  // Estado inicial
  const [formData, setFormData] = useState({ 
    laboratorio: '', 
    grupo: '', 
    // jornada: '', 
    fecha_inicio: '', 
    fecha_final: '' 
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listaLaboratorios, setListaLaboratorios] = useState([]); // Aquí cargarás tus laboratorios

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onConfirm(formData);
    setIsSubmitting(false);
  };

  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <header className={style.header}>
          <div className={style.titleGroup}>
            <div className={style.iconBadge}><CalendarClock size={20} /></div>
            <h2>Programar Sesión</h2>
          </div>
          <button onClick={onClose} className={style.closeBtn}><X size={20} /></button>
        </header>

        <div className={style.body}>
          {/* 1. Selección del Laboratorio */}
          <div className={style.inputGroup}>
            <label>Laboratorio</label>
            <select className={style.select} onChange={(e) => setFormData({...formData, laboratorio: e.target.value})}>
              <option value="">Selecciona el laboratorio...</option>
              {/* Aquí mapearás tus laboratorios disponibles */}
            </select>
          </div>

          {/* 2. Grupo y Jornada (Uno al lado del otro) */}
          <div className={style.rowInputs}>
            <div className={style.inputGroup}>
              <label>Grupo</label>
              <select className={style.select} onChange={(e) => setFormData({...formData, grupo: e.target.value})}>
                <option value="">Selecciona el grupo...</option>
                {/* Aquí cargarás los grupos desde el backend */}
              </select>
            </div>
            {/* <div className={style.inputGroup}>
              <label>Jornada</label>
              <select className={style.select} onChange={(e) => setFormData({...formData, jornada: e.target.value})}>
                <option value="">Selecciona la jornada...</option>
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
                <option value="Única">Única</option>
              </select>
            </div> */}
          </div>

          {/* 3. Fechas (Uno al lado del otro) */}
          <div className={style.rowInputs}>
            <div className={style.inputGroup}>
              <label>Fecha Inicio</label>
              <input className={style.select} type="date" onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})} />
            </div>
            <div className={style.inputGroup}>
              <label>Fecha Fin</label>
              <input className={style.select} type="date" onChange={(e) => setFormData({...formData, fecha_final: e.target.value})} />
            </div>
          </div>
        </div>

        <footer className={style.footer}>
          <button onClick={onClose} className={style.cancelBtn}>Cancelar</button>
          <button onClick={handleSubmit} className={style.confirmBtn} disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className={style.spinner} /> Creando...</> : "Crear Sesión"}
          </button>
        </footer>
      </div>
    </div>
  );
}

export default ModalCrearSesion;