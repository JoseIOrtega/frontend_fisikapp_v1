import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Loader2 } from 'lucide-react'; 
import style from './ModalCrearTarjetaLaboratorio.module.css';
import { CrearTarjetaLaboratorio } from '../../../services/docente/CrearTarjetaLabService'; 

function ModalCrearTarjetaLaboratorio({ isOpen, onClose, onConfirm, categorias, plantillasRaw }) {
  const [categoriaSel, setCategoriaSel] = useState("");
  const [plantillasFiltradas, setPlantillasFiltradas] = useState([]);
  const [plantillaFinal, setPlantillaFinal] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Filtrar plantillas por área/categoría
  // 2. Filtrar plantillas por área/categoría
  useEffect(() => {
    if (categoriaSel && plantillasRaw) {
      const idSeleccionado = parseInt(categoriaSel, 10);
      
      const filtradas = plantillasRaw.filter(p => {
        // En tu JSON, el campo se llama simplemente 'categoria' y es un número
        const idCat = parseInt(p.categoria, 10);
        return idCat === idSeleccionado;
      });

      setPlantillasFiltradas(filtradas);
      setPlantillaFinal(null); 
    } else {
      setPlantillasFiltradas([]);
      setPlantillaFinal(null);
    }
  }, [categoriaSel, plantillasRaw]);

  // Limpiar el formulario y estados al cerrar
  useEffect(() => {
    if (!isOpen) {
      setCategoriaSel("");
      setPlantillasFiltradas([]);
      setPlantillaFinal(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // MANEJADOR INTERNO: Solo enviamos el ID de la plantilla
  const handleFormSubmit = async () => {
    if (!plantillaFinal || isSubmitting) return;
    
    try {
      setIsSubmitting(true);

      const tarjetaNuevaData = {
        id_padre: plantillaFinal.id
      };

      // Pasamos el objeto adaptado al componente padre
      await onConfirm(tarjetaNuevaData);
    } catch (err) {
      console.error("Error al confirmar la creación de la tarjeta:", err);
      setIsSubmitting(false);
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
          <button onClick={onClose} disabled={isSubmitting} className={style.closeBtn}>
            <X size={20} />
          </button>
        </header>

        <div className={style.body}>
          {/* PASO 1: CATEGORÍA */}
          <div className={style.inputGroup}>
            <label>1. Área / Categoría</label>
            <select 
              disabled={isSubmitting}
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
          <div className={`${style.inputGroup} ${(!categoriaSel || isSubmitting) ? style.disabled : ''}`}>
            <label>2. Nombre del Laboratorio</label>
            <select 
              disabled={!categoriaSel || isSubmitting}
              value={plantillaFinal?.id || ""} 
              onChange={(e) => {
                const p = plantillasFiltradas.find(item => item.id === parseInt(e.target.value, 10));
                setPlantillaFinal(p);
              }}
              className={style.select}
            >
              <option value="">{categoriaSel ? "Elige el experimento..." : "Primero elige un área"}</option>
              {plantillasFiltradas.map(p => (
                // AQUÍ ESTÁ EL CAMBIO: usa p.titulo en lugar de p.titulo_lab
                <option key={p.id} value={p.id}>{p.titulo}</option> 
              ))}
            </select>
          </div>
        </div>

        <footer className={style.footer}>
          <button onClick={onClose} disabled={isSubmitting} className={style.cancelBtn}>
            Cancelar
          </button>
          <button 
            onClick={handleFormSubmit} 
            className={style.confirmBtn}
            disabled={!plantillaFinal || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className={style.spinner} />
                Creando...
              </>
            ) : (
              "Crear Tarjeta"
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}

export default ModalCrearTarjetaLaboratorio;