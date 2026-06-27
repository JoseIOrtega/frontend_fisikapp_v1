import React, { useState } from 'react';
import Sidebar from '../../layouts/DocenteSidebar';
import style from "./DashboardDocente.module.css"; 

function DashboardProfesor() {
  const [esSuperAdmin, setEsSuperAdmin] = useState(false);
  
  // Estado para controlar las pestañas: 'fase1' o 'fase2'
  const [faseActual, setFaseActual] = useState('fase1');

  // NUEVO: Estado para el filtro dinámico de tiempo
  const [filtroTiempo, setFiltroTiempo] = useState('mes');

  // Diccionario de datos interactivos para el gráfico SVG según la opción seleccionada
  const datosGrafico = {
    dia: {
      labelsX: ["00:00", "06:00", "12:00", "18:00", "24:00"],
      pathNegro: "M 30 140 Q 140 60, 250 130 T 470 50",
      pathCyan: "M 30 160 Q 140 90, 250 150 T 470 80"
    },
    semana: {
      labelsX: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      pathNegro: "M 30 120 Q 120 160, 230 70 T 470 90",
      pathCyan: "M 30 150 Q 120 180, 230 110 T 470 120"
    },
    mes: {
      labelsX: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
      pathNegro: "M 30 150 Q 110 145, 190 120 T 350 95 T 470 70",
      pathCyan: "M 30 170 Q 110 155, 190 140 T 350 125 T 470 110"
    },
    semestre: {
      labelsX: ["Mes 1", "Mes 2", "Mes 3", "Mes 4", "Mes 5", "Mes 6"],
      pathNegro: "M 30 80 Q 130 40, 220 150 T 470 60",
      pathCyan: "M 30 110 Q 130 70, 220 170 T 470 90"
    },
    anio: {
      labelsX: ["Ene-Mar", "Abr-Jun", "Jul-Sep", "Oct-Dic"],
      pathNegro: "M 30 160 Q 150 50, 270 110 T 470 40",
      pathCyan: "M 30 180 Q 150 80, 270 140 T 470 75"
    }
  };

  const datosActuales = datosGrafico[filtroTiempo];

  // Datos de la tabla Fase 2 (Se mantienen intactos)

  // Datos extraídos fielmente de la imagen image_284400.png
  const recientesReportes = [
    {
      id: "#LR-9821",
      initials: "MA",
      avatarClass: style.avatarMA,
      estudiante: "Marco Alonso",
      fecha: "Oct 12, 2023",
      laboratorio: "Electromagnetismo",
      estado: "PENDING",
      estadoClass: style.badgePending
    },
    {
      id: "#LR-9819",
      initials: "SR",
      avatarClass: style.avatarSR,
      estudiante: "Sofía Rodríguez",
      fecha: "Oct 11, 2023",
      laboratorio: "Dinámica de Fluidos",
      estado: "REVIEWED",
      estadoClass: style.badgeReviewed
    },
    {
      id: "#LR-9815",
      initials: "JV",
      avatarClass: style.avatarJV,
      estudiante: "Javier Vargas",
      fecha: "Oct 10, 2023",
      laboratorio: "Termodinámica",
      estado: "NEEDS FEEDBACK",
      estadoClass: style.badgeFeedback
    }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7fc' }}>
      
      <Sidebar esSuperAdmin={esSuperAdmin} />

      <div className={style.layout} style={{ flexGrow: 1, padding: '40px 30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Banner Principal */}
        <div className={style.welcomeBannerContainer}>
          <h1 className={style.welcomeTitle}>¡Bienvenida de nuevo, Elena!</h1>
          <p className={style.welcomeSubtitle}>
            Tu resumen académico está listo. Tienes 4 reportes de laboratorio pendientes de validación esta mañana.
          </p>
          <div className={style.welcomeButtonGroup}>
            <button type="button" className={style.btnMint}>
              <svg className={style.iconSvg} viewBox="0 0 24 24" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" fill="none" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Revisar Pendientes
            </button> 
            <button type="button" className={style.btnDarkBorder}>
              Ver Calendario
            </button>
          </div>
        </div>

        {/* Encabezado con el Paginador de Pestañas */}
        <div className={style.tableHeaderFlex} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '10px' }}>
          <div>
            <div className={style.breadcrumbText}>
              Admin <span className={style.breadcrumbDivider}>/</span> <span className={style.breadcrumbCurrent}>Academic Performance Overview</span>
            </div>
            <h2 className={style.panelSubtitle} style={{ fontSize: '26px', marginTop: '4px', color: '#111827' }}>
              {faseActual === 'fase1' ? 'Vista General del Semestre' : 'Panel de Control de Reportes'}
            </h2>
          </div>

          {/* Selector de Paginación */}
          <div className={style.paginationTabsContainer}>
            <button 
              type="button" 
              className={`${style.tabNavButton} ${faseActual === 'fase1' ? style.tabActive : ''}`}
              onClick={() => setFaseActual('fase1')}
            >
              1. Resumen y Estadísticas
            </button>
            <button 
              type="button" 
              className={`${style.tabNavButton} ${faseActual === 'fase2' ? style.tabActive : ''}`}
              onClick={() => setFaseActual('fase2')}
            >
              2. Reportes de Alumnos 
              <span className={style.tabBadgeNotification}>4</span>
            </button>
          </div>
        </div>

        {/* --- CONTROL INTERACTIVO DE FASES --- */}
        {faseActual === 'fase1' ? (
          <>
            {/* VISTA 1: MINI TARJETAS Y GRÁFICOS */}
            <div className={style.imgMetricsRow}>
              {/* Card 1: Total Estudiantes */}
              <div className={style.imgMiniCard}>
                <div className={style.imgCardTopFlex}>
                  <div className={`${style.imgIconWrapper} ${style.bgIconLightBlue}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                  <span className={style.imgBadgeGreen}>↗ +12%</span>
                </div>
                <div className={style.imgCardMetaLabel}>TOTAL ESTUDIANTES</div>
                <div className={style.imgCardValue}>1,284</div>
              </div>

              {/* Card 2: Labs Activos */}
              <div className={style.imgMiniCard}>
                <div className={style.imgCardTopFlex}>
                  <div className={`${style.imgIconWrapper} ${style.bgIconLightMint}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <path d="M10 2v8L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45L14 10V2z" />
                    </svg>
                  </div>
                  <span className={style.imgTextRightLabel}>Activos ahora</span>
                </div>
                <div className={style.imgCardMetaLabel}>LABS ACTIVOS</div>
                <div className={style.imgCardValue}>42</div>
              </div>

              {/* NUEVA Card 3: Total de Grupos */}
              <div className={style.imgMiniCard}>
                <div className={style.imgCardTopFlex}>
                  <div className={`${style.imgIconWrapper} ${style.bgIconLightPurple}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6 17h14M4 4.5A2.5 2.5 0 0 1 6 2h14v20H6a2.5 2.5 0 0 1-2.5-2.5V4.5z" />
                    </svg>
                  </div>
                  <span className={style.imgTextRightLabel}>Grados</span>
                </div>
                <div className={style.imgCardMetaLabel}>TOTAL DE GRUPOS</div>
                <div className={style.imgCardValue}>16</div>
              </div>

              {/* Card 4: Actividades Entregadas (Modificada) */}
              <div className={style.imgMiniCard}>
                <div className={style.imgCardTopFlex}>
                  <div className={`${style.imgIconWrapper} ${style.bgIconLightPink}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <span className={style.imgBadgeCyan}>✓ Alta</span>
                </div>
                <div className={style.imgCardMetaLabel}>ACTIVIDADES ENTREGADAS</div>
                <div className={style.imgCardValue}>94.8%</div>
              </div>

              {/* Card 5: Actividades Calificadas (Modificada) */}
              <div className={style.imgMiniCard}>
                <div className={style.imgCardTopFlex}>
                  <div className={`${style.imgIconWrapper} ${style.bgIconLightOrange}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <span className={style.imgTextRightLabel}>Promedio</span>
                </div>
                <div className={style.imgCardMetaLabel}>ACTIVIDADES CALIFICADAS</div>
                <div className={style.imgCardValue}>87.2%</div>
              </div>
            </div>

            {/* Gráficos */}
            <div className={style.imgBottomGrid}>
              <div className={style.imgBigCard}>
                <div className={style.imgGraphHeader}>
                  <h3 className={style.imgCardTitle}>Tendencia de Actividad en Laboratorio</h3>
                </div>
                <div className={style.imgLineGraphArea}>
                  <svg viewBox="0 0 500 200" width="100%" height="100%">
                    <path d="M 30 150 Q 110 145, 190 120 T 350 95 T 470 70" fill="none" stroke="#0f172a" strokeWidth="3" />
                    <path d="M 30 170 Q 110 155, 190 140 T 350 125 T 470 110" fill="none" stroke="#22d3ee" strokeWidth="2.5" />
                  </svg>
                </div>
              </div>

              {/* Tarjeta Derecha: Estado de Laboratorios (image_8a6c0a.png) */}
                <div className={style.imgBigCard} style={{ flex: '0 0 320px' }}>
                  <h3 className={style.imgCardTitle}>Estado de Laboratorios</h3>
                  
                  <div className={style.imgCircleWrapperCenter}>
                    {/* SVG Donut con los dos segmentos proporcionales acumulados */}
                    <svg width="150" height="150" viewBox="0 0 36 36" className={style.imgCircularSvg}>
                      {/* Fondo base gris */}
                      <circle className={style.donutBgBase} cx="18" cy="18" r="15.915" />
                      
                      {/* Segmento Completados (Verde/Mint): 75% -> strokeDasharray="75 100" */}
                      <circle 
                        className={style.donutSegmentCompleted} 
                        cx="18" 
                        cy="18" 
                        r="15.915" 
                        strokeDasharray="75 100" 
                        strokeDashoffset="25" 
                      />
                      
                      {/* Segmento Activos (Azul): 25% -> strokeDasharray="25 100" desplazado donde termina el verde */}
                      <circle 
                        className={style.donutSegmentActive} 
                        cx="18" 
                        cy="18" 
                        r="15.915" 
                        strokeDasharray="25 100" 
                        strokeDashoffset="50" 
                      />
                    </svg>
                    
                    {/* Textos Centrales en Absoluto */}
                    <div className={style.imgCircleTextInside}>
                      <div className={style.imgPercentNumber}>85%</div>
                      <div className={style.imgPercentSub}>En tiempo</div>
                    </div>
                  </div>

                  {/* Listado de Estados inferior sin la fila de Vencidos */}
                  <div className={style.imgStatusList}>
                    <div className={style.imgStatusRow}>
                      <div className={style.legendItemLeft}>
                        <span className={`${style.legendDot} ${style.dotMint}`}></span> 
                        <span className={style.legendName}>Completados</span>
                      </div>
                      <strong className={style.legendVal}>142</strong>
                    </div>
                    
                    <div className={style.imgStatusRow}>
                      <div className={style.legendItemLeft}>
                        <span className={`${style.legendDot} ${style.dotBlue}`}></span> 
                        <span className={style.legendName}>Activos</span>
                      </div>
                      <strong className={style.legendVal}>28</strong>
                    </div>
                  </div>
                </div>
            </div>
          </>
        ) : (
          /* VISTA 2: TABLA DE REPORTES Y PANEL DE ACTIVIDAD (image_284400.png) */
          <div className={style.imgBottomGrid}>
            
            {/* Contenedor Izquierdo: Tabla de Reportes */}
            <div className={style.imgBigCard} style={{ flex: '2 1 600px' }}>
              <div className={style.imgGraphHeader} style={{ marginBottom: '20px' }}>
                <h3 className={style.phase2CardTitle}>Reportes de Laboratorio Recientes</h3>
                <button type="button" className={style.btnLinkText}>Ver todos</button>
              </div>

              <div className={style.phase2TableWrapper}>
                <table className={style.phase2Table}>
                  <thead>
                    <tr>
                      <th>ID REPORTE</th>
                      <th>ESTUDIANTE</th>
                      <th>FECHA</th>
                      <th>LABORATORIO</th>
                      <th style={{ textAlign: 'center' }}>ESTADO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recientesReportes.map((item, index) => (
                      <tr key={index}>
                        <td className={style.tableTdId}>{item.id}</td>
                        <td>
                          <div className={style.studentUserFlex}>
                            <div className={`${style.studentAvatar} ${item.avatarClass}`}>
                              {item.initials}
                            </div>
                            <span className={style.studentNameText}>{item.estudiante}</span>
                          </div>
                        </td>
                        <td className={style.tableTdDate}>{item.fecha}</td>
                        <td className={style.tableTdLab}>{item.laboratorio}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`${style.pillStatusBase} ${item.estadoClass}`}>
                            {item.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Contenedor Derecho: Actividad de Estudiantes */}
            <div className={style.imgBigCard} style={{ flex: '0 0 340px' }}>
              <h3 className={style.phase2CardTitle} style={{ marginBottom: '24px' }}>Actividad de Estudiantes</h3>
              
              <div className={style.activityFeedContainer}>
                {/* Ítem 1 */}
                <div className={style.activityFeedItem}>
                  <div className={`${style.activityIconBox} ${style.activityMintIcon}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className={style.activityTextContent}>
                    <p className={style.activityRowPara}><strong>Elena Marín</strong> completó el Lab de Electromagnetismo.</p>
                    <span className={style.activityTimeSpan}>Hace 12 minutos</span>
                  </div>
                </div>

                {/* Ítem 2 */}
                <div className={style.activityFeedItem}>
                  <div className={`${style.activityIconBox} ${style.activityBlueIcon}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div className={style.activityTextContent}>
                    <p className={style.activityRowPara}><strong>Daniel Soto</strong> envió una consulta sobre Cinemática.</p>
                    <span className={style.activityTimeSpan}>Hace 1 hora</span>
                  </div>
                </div>

                {/* Ítem 3 */}
                <div className={style.activityFeedItem}>
                  <div className={`${style.activityIconBox} ${style.activityRedIcon}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                    </svg>
                  </div>
                  <div className={style.activityTextContent}>
                    <p className={style.activityRowPara}><strong>3 Estudiantes</strong> tienen reportes vencidos.</p>
                    <span className={style.activityTimeSpan}>Hace 3 horas</span>
                  </div>
                </div>
              </div>

              <button type="button" className={style.btnDottedHistory}>
                Ver Historial Completo
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default DashboardProfesor;