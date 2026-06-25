import React, { useState } from 'react';
import Sidebar from '../../layouts/DocenteSidebar'; // Ruta corregida al layout Sidebar
import style from "./DashboardDocente.module.css"; 

function DashboardProfesor() {
  // Simulamos que el profesor no tiene permisos de súper administrador para el sidebar
  const [esSuperAdmin, setEsSuperAdmin] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7fc' }}>
      
      {/* Componente de la Barra Lateral Reutilizado */}
      <Sidebar esSuperAdmin={esSuperAdmin} />

      {/* Contenedor Principal del Contenido del Profesor */}
      <div className={style.layout} style={{ flexGrow: 1, padding: '40px 30px', gap: '24px' }}>
        
        {/* Banner Principal de Bienvenida (Referencia de la imagen) */}
        <div className={style.welcomeBannerContainer}>
          <h1 className={style.welcomeTitle}>¡Bienvenida de nuevo, Elena!</h1>
          <p className={style.welcomeSubtitle}>
            Tu resumen académico está listo. Tienes 4 reportes de laboratorio pendientes de validación esta mañana.
          </p>
          <div className={style.welcomeButtonGroup}>
            {/* Botón Verde Menta */}
            <button type="button" className={style.btnMint}>
              <svg className={style.iconSvg} viewBox="0 0 24 24" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" fill="none" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Revisar Pendientes
            </button>
            
            {/* Botón Oscuro Semitransparente */}
            <button type="button" className={style.btnDarkBorder}>
              Ver Calendario
            </button>
          </div>
        </div>

        {/* Sub-header con Breadcrumbs, Título y Filtros de Acción */}
        <div className={style.tableHeaderFlex} style={{ alignItems: 'flex-end', marginTop: '10px' }}>
          <div>
            <div className={style.breadcrumbText}>
              Admin <span className={style.breadcrumbDivider}>/</span> <span className={style.breadcrumbCurrent}>Academic Performance Overview</span>
            </div>
            <h2 className={style.panelSubtitle} style={{ fontSize: '26px', marginTop: '4px' }}>
              Vista General del Semestre
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Botón Filtro de Fecha */}
            <button type="button" className={style.btnActionFilter}>
              <svg className={style.iconSvg} viewBox="0 0 24 24" width="16" height="16">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" fill="none" />
                <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" />
                <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" />
                <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" />
              </svg>
              Últimos 30 días
            </button>

            {/* Botón Exportar */}
            <button type="button" className={style.btnActionFilter}>
              <svg className={style.iconSvg} viewBox="0 0 24 24" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" fill="none" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exportar
            </button>
          </div>
        </div>

        {/* Aquí puedes añadir la grilla o las tablas correspondientes a los reportes de los alumnos */}

      </div>
    </div>
  );
}

export default DashboardProfesor;