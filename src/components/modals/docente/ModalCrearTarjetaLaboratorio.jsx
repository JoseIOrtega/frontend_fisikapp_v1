import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Info, Filter } from 'lucide-react';
import style from './ModalCrearTarjetaLaboratorio.module.css';

function ModalCrearTarjetaLaboratorio({ isOpen, onClose, onConfirm, categorias, plantillasRaw }) {
  const [categoriaSel, setCategoriaSel] = useState("");
  const [plantillasFiltradas, setPlantillasFiltradas] = useState([]);
  const [plantillaFinal, setPlantillaFinal] = useState(null);

  // Cada vez que cambie la categoría, filtramos las plantillas
  useEffect(() => {
    if (categoriaSel) {
        const filtradas = plantillasRaw.filter(p => p.categoria_id === parseInt(categoriaSel));
        setPlantillasFiltradas(filtradas);
        setPlantillaFinal(null); 
    } else {
        setPlantillasFiltradas([]);
        setPlantillaFinal(null);
    }
  }, [categoriaSel, plantillasRaw]);

  if (!isOpen) return null;

  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <header className={style.header}>
          <div className={style.titleGroup}>
            <div className={style.iconBadge}><PlusCircle size={20} /></div>
            <h2>Nuevo Laboratorio</h2>
          </div>
          <button onClick={onClose} className={style.closeBtn}><X size={20} /></button>
        </header>

        <div className={style.body}>
          {/* PASO 1: CATEGORÍA */}
          <div className={style.inputGroup}>
            <label>1. Área / Categoría</label>
            <select 
              value={categoriaSel} 
              onChange={(e) => setCategoriaSel(e.target.value)}
              className={style.select}
            >
              <option value="">Selecciona el área...</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          {/* PASO 2: LABORATORIO (Solo si hay categoría) */}
          <div className={`${style.inputGroup} ${!categoriaSel ? style.disabled : ''}`}>
            <label>2. Nombre del Laboratorio</label>
            <select 
              disabled={!categoriaSel}
              value={plantillaFinal?.id || ""} 
              onChange={(e) => {
                const p = plantillasFiltradas.find(item => item.id === parseInt(e.target.value));
                setPlantillaFinal(p);
              }}
              className={style.select}
            >
              <option value="">{categoriaSel ? "Elige el experimento..." : "Primero elige un área"}</option>
              {plantillasFiltradas.map(p => (
                <option key={p.id} value={p.id}>{p.titulo_lab}</option>
              ))}
            </select>
          </div>

          {/* PASO 3: VISTA PREVIA DE INFORMACIÓN */}
          {plantillaFinal && (
            <div className={style.infoBox}>
              <h4><Info size={14} /> Información de la Plantilla</h4>
              <p><strong>Descripción:</strong> {plantillaFinal.descripcion}</p>
              <p><strong>Objetivo:</strong> {plantillaFinal.objetivo_general}</p>
            </div>
          )}
        </div>

        <footer className={style.footer}>
          <button onClick={onClose} className={style.cancelBtn}>Cancelar</button>
          <button 
            onClick={() => onConfirm(plantillaFinal)} 
            className={style.confirmBtn}
            disabled={!plantillaFinal}
          >
            Crear Tarjeta
          </button>
        </footer>
      </div>
    </div>
  );
}
export default ModalCrearTarjetaLaboratorio;
