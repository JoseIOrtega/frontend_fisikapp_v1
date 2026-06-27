import React, { useState, useEffect } from 'react';
import { X, PlusCircle } from 'lucide-react'; 
import style from './ModalCrearTarjetaLaboratorio.module.css';

function ModalCrearTarjetaLaboratorio({ isOpen, onClose, onConfirm, categorias, plantillasRaw }) {
  const [categoriaSel, setCategoriaSel] = useState("");
  const [plantillasFiltradas, setPlantillasFiltradas] = useState([]);
  const [plantillaFinal, setPlantillaFinal] = useState(null);

  // 1. Filtrar plantillas por área/categoría
  useEffect(() => {
    if (categoriaSel && plantillasRaw) {
      const idSeleccionado = parseInt(categoriaSel, 10);
      const filtradas = plantillasRaw.filter(p => parseInt(p.categoria, 10) === idSeleccionado);
      setPlantillasFiltradas(filtradas);
      setPlantillaFinal(null); 
    } else {
      setPlantillasFiltradas([]);
      setPlantillaFinal(null);
    }
  }, [categoriaSel, plantillasRaw]);

  // Limpiar estados al cerrar
  useEffect(() => {
    if (!isOpen) {
      setCategoriaSel("");
      setPlantillasFiltradas([]);
      setPlantillaFinal(null);
    }
  }, [isOpen]);

  // MANEJADOR SIMPLIFICADO: Solo enviamos la plantilla completa al padre
  const handleConfirmar = () => {
    if (plantillaFinal) {
      onConfirm(plantillaFinal);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <header className={style.header}>
          <div className={style.titleGroup}>
            <div className={style.iconBadge}><PlusCircle size={20} /></div>
            <h2>Nuevo Laboratorio</h2>
          </div>
          <button onClick={onClose} className={style.closeBtn}>
            <X size={20} />
          </button>
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

          {/* PASO 2: LABORATORIO */}
          <div className={`${style.inputGroup} ${!categoriaSel ? style.disabled : ''}`}>
            <label>2. Nombre del Laboratorio</label>
            <select 
              disabled={!categoriaSel}
              value={plantillaFinal?.id || ""} 
              onChange={(e) => {
                const p = plantillasFiltradas.find(item => item.id === parseInt(e.target.value, 10));
                setPlantillaFinal(p);
              }}
              className={style.select}
            >
              <option value="">{categoriaSel ? "Elige el experimento..." : "Primero elige un área"}</option>
              {plantillasFiltradas.map(p => (
                <option key={p.id} value={p.id}>{p.titulo}</option> 
              ))}
            </select>
          </div>
        </div>

        <footer className={style.footer}>
          <button onClick={onClose} className={style.cancelBtn}>
            Cancelar
          </button>
          <button 
            onClick={handleConfirmar} 
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