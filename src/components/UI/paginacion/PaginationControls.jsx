import React from 'react';
import style from './PaginationControls.module.css';

function PaginationControls({ paginaActual, totalPaginas, onPaginaChange }) {
  // Si solo hay una página, no es necesario mostrar los controles
  if (totalPaginas <= 1) return null;

  return (
    <div className={style.paginationContainer}>
      {/* Botón para retroceder */}
      <button 
        onClick={() => onPaginaChange(paginaActual - 1)}
        disabled={paginaActual === 1}
        className={style.paginationButton}
      >
        Anterior
      </button>

      {/* Indicador de posición */}
      <span className={style.paginationInfo}>
        Página {paginaActual} de {totalPaginas}
      </span>

      {/* Botón para avanzar */}
      <button 
        onClick={() => onPaginaChange(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        className={style.paginationButton}
      >
        Siguiente
      </button>
    </div>
  );
}

export default PaginationControls;