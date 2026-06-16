import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Info, Loader2, GraduationCap, Clock } from 'lucide-react'; 
import style from './ModalCrearTarjetaLaboratorio.module.css';
import { CrearTarjetaLaboratorio } from '../../../services/docente/CrearTarjetaLabService'; 

function ModalCrearTarjetaLaboratorio({ isOpen, onClose, onConfirm, categorias, plantillasRaw }) {
  const [categoriaSel, setCategoriaSel] = useState("");
  const [plantillasFiltradas, setPlantillasFiltradas] = useState([]);
  const [plantillaFinal, setPlantillaFinal] = useState(null);
  
  const [objetivosRaw, setObjetivosRaw] = useState([]); 
  const [textoObjetivo, setTextoObjetivo] = useState("");
  
  // Estados para capturar el grado y la jornada
  const [gradoSel, setGradoSel] = useState("");
  const [jornadaSel, setJornadaSel] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Cargar la lista completa de objetivos desde el endpoint
  useEffect(() => {
    if (isOpen) {
      const cargarObjetivos = async () => {
        try {
          const objs = await CrearTarjetaLaboratorio.obtenerObjetivos();
          if (objs && objs.results) {
            setObjetivosRaw(objs.results);
          } else if (Array.isArray(objs)) {
            setObjetivosRaw(objs);
          } else {
            setObjetivosRaw([]);
          }
        } catch (error) {
          console.error("Error al obtener los objetivos del sistema:", error);
          setObjetivosRaw([]);
        }
      };
      cargarObjetivos();
    }
  }, [isOpen]);

  // 2. Filtrar plantillas por área/categoría
  useEffect(() => {
    if (categoriaSel) {
      const idSeleccionado = parseInt(categoriaSel, 10);
      const filtradas = plantillasRaw.filter(p => {
        const idCategoriaPlantilla = p.categoria_id !== undefined ? p.categoria_id : p.categoria;
        if (idCategoriaPlantilla && typeof idCategoriaPlantilla === 'object') {
          return parseInt(idCategoriaPlantilla.id, 10) === idSeleccionado;
        }
        return parseInt(idCategoriaPlantilla, 10) === idSeleccionado;
      });
      setPlantillasFiltradas(filtradas);
      setPlantillaFinal(null); 
    } else {
      setPlantillasFiltradas([]);
      setPlantillaFinal(null);
    }
  }, [categoriaSel, plantillasRaw]);

  // 3. Buscar la descripción del objetivo
  useEffect(() => {
    if (plantillaFinal && plantillaFinal.objetivo) {
      const idObjetivoPlantilla = parseInt(plantillaFinal.objetivo, 10);
      const encontrado = objetivosRaw.find(obj => obj.id === idObjetivoPlantilla);
      if (encontrado) {
        setTextoObjetivo(encontrado.descripcion_objetivo || encontrado.descripcion || "Objetivo sin texto");
      } else {
        setTextoObjetivo(`ID Objetivo: ${plantillaFinal.objetivo} (Texto no cargado)`);
      }
    } else {
      setTextoObjetivo("");
    }
  }, [plantillaFinal, objetivosRaw]);

  // Limpiar el formulario y estados al cerrar
  useEffect(() => {
    if (!isOpen) {
      setCategoriaSel("");
      setPlantillasFiltradas([]);
      setPlantillaFinal(null);
      setTextoObjetivo("");
      setGradoSel("");     
      setJornadaSel("");   
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // MANEJADOR INTERNO CORREGIDO: Ahora incluye de forma obligatoria el ID de la plantilla base
  const handleFormSubmit = async () => {
    if (!plantillaFinal || isSubmitting) return;
    
    try {
      setIsSubmitting(true);

      // Agrupamos la información incluyendo el ID de la plantilla original (id_padre)
      const tarjetaNuevaData = {
        id_padre: plantillaFinal.id,           // ¡CAMPO CRÍTICO CLAVE QUE FALTABA!
        categoria: parseInt(categoriaSel, 10), // Guardamos el ID de la categoría por si acaso
        titulo_lab: plantillaFinal.titulo_lab,  // El nombre del experimento base
        grado: gradoSel || null,               
        jornada: jornadaSel || null            
      };

      // Pasamos el objeto adaptado al componente padre (MisLaboratoriosDocente)
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
                <option key={p.id} value={p.id}>{p.titulo_lab}</option>
              ))}
            </select>
          </div>

          {/* PASO 3: ASIGNACIÓN DE GRADO Y JORNADA */}
          <div className={`${style.rowInputs} ${(!plantillaFinal || isSubmitting) ? style.disabled : ''}`}>
            <div className={style.inputGroup}>
              <label className={style.labelWithIcon}>
                <GraduationCap size={14} /> Grado / Curso
              </label>
              <select
                disabled={!plantillaFinal || isSubmitting}
                value={gradoSel}
                onChange={(e) => setGradoSel(e.target.value)}
                className={style.select}
              >
                <option value="">Opcional...</option>
                <option value="10-A">10-A</option>
                <option value="10-B">10-B</option>
                <option value="11-A">11-A</option>
                <option value="11-B">11-B</option>
              </select>
            </div>

            <div className={style.inputGroup}>
              <label className={style.labelWithIcon}>
                <Clock size={14} /> Jornada
              </label>
              <select
                disabled={!plantillaFinal || isSubmitting}
                value={jornadaSel}
                onChange={(e) => setJornadaSel(e.target.value)}
                className={style.select}
              >
                <option value="">Opcional...</option>
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
                <option value="Noche">Noche</option>
              </select>
            </div>
          </div>

          {/* PASO 4: DETALLE DEL OBJETIVO */}
          {plantillaFinal && (
            <div className={style.infoBox}>
              <h4><Info size={14} /> Objetivo del Experimento</h4>
              <p>{textoObjetivo}</p>
            </div>
          )}
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