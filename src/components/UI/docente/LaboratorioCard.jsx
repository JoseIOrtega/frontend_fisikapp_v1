import React from 'react';
import { Beaker, ArrowRight, Trash2 } from 'lucide-react';
import style from './LaboratorioCard.module.css';

function LaboratorioCard({ 
  laboratorio, 
  onIngresar, 
  onEliminar, 
  onToggleEstado, 
  esArchivado = false 
}) {
  const { 
    id, 
    titulo_lab, 
    categoria_nombre, 
    codigo_lab, 
    estado, 
    inhabilitadoPorAdmin, 
    configurado_completo, 
    fecha_creacion, 
    grado 
  } = laboratorio;
  
  const isInactivo = !estado || inhabilitadoPorAdmin || esArchivado;

  // Función para formatear la fecha sin errores de zona horaria
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "";
    // Esto toma la parte de la fecha (YYYY-MM-DD) y la invierte a DD/MM/YYYY
    const [fecha] = fechaISO.split('T');
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className={`${style.card} ${isInactivo ? style.cardInactiva : ''}`}>
      <header className={style.header}>
        <div className={style.iconContainer}>
          <Beaker size={18} />
        </div>
        <label className={style.switch} title={estado ? 'Inactivo' : 'Activar'}>
          <input 
            type="checkbox" 
            checked={!!estado} 
            onChange={(e) => { 
              e.stopPropagation(); 
              onToggleEstado(id); 
            }} 
          />
          <span className={style.slider}></span>
        </label>
      </header>

      <div className={style.content}>
        {/* 1. Título destacado */}
        <h3 className={style.title} title={titulo_lab}>
          {titulo_lab}
        </h3>

        {/* 2. Categoría y fecha agrupadas verticalmente */}
        <div className={style.metaInfo}>
          <span className={style.category}>
            {categoria_nombre ? categoria_nombre : "Sin categoría"}
          </span>
          <span className={style.dateLabel}>
            {formatearFecha(fecha_creacion)}
          </span>
        </div>
      </div>

      {/* Sección del Código */}
      <div className={configurado_completo ? style.codeSection : style.codeSectionPending}>
        <span className={style.codeHint}>
          {configurado_completo ? 'CÓDIGO DE ACCESO' : 'ESTADO DEL LAB'}
        </span>
        <div className={style.codeValue}>
          {configurado_completo ? codigo_lab : 'Por configurar'}
        </div>
      </div>

      <footer className={style.actions}>
        {/* <button 
          className={style.deleteBtn} 
          onClick={() => onEliminar(id)}
          title="Eliminar"
        >
          <Trash2 size={18} />
        </button> */}
        
        <button 
          className={style.enterBtn} 
          onClick={() => onIngresar(id)}
        >
          {configurado_completo ? 'Ingresar' : 'Configurar'} 
          <ArrowRight size={16} />
        </button>
      </footer>
    </div>
  );
}

export default LaboratorioCard;