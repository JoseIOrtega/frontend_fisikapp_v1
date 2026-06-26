import React, { useState } from 'react';
import Sidebar from '../../layouts/DocenteSidebar';
import style from "./DashboardDocente.module.css"; 

function DashboardProfesor() {
  const [esSuperAdmin, setEsSuperAdmin] = useState(false);
  
  // 'fase1' = Resumen y Gráficos (imagen anterior) | 'fase2' = Tablas y Actividad (image_284400.png)
  const [faseActual, setFaseActual] = useState('fase1');

  // Datos simulados extraídos fielmente de la imagen image_284400.png
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
      
      {/* Componente de la Barra Lateral Reutilizado */}
      <Sidebar esSuperAdmin={esSuperAdmin} />

      {/* Contenedor Principal del Contenido del Profesor */}
      <div className={style.layout} style={{ flexGrow: 1, padding: '40px 30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Banner Principal de Bienvenida */}
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

        {/* Sub-header con Breadcrumbs y Paginador de Fases */}
        <div className={style.tableHeaderFlex} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '10px' }}>
          <div>
            <div className={style.breadcrumbText}>
              Admin <span className={style.breadcrumbDivider}>/</span> <span className={style.breadcrumbCurrent}>Academic Performance Overview</span>
            </div>
            <h2 className={style.panelSubtitle} style={{ fontSize: '26px', marginTop: '4px', color: '#111827' }}>
              {faseActual === 'fase1' ? 'Vista General del Semestre' : 'Reportes de Laboratorio Recientes'}
            </h2>
          </div>

          {/* Controlador de Paginación Estilizado */}
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

        {/* --- RENDERIZADO CONDICIONAL POR FASES --- */}
        
        {faseActual === 'fase1' ? (
          <>
            {/* Fila superior: Las 4 Mini Tarjetas de Métricas */}
            <div className={style.imgMetricsRow}>
              <div className={style.imgMiniCard}>
                <div className={style.imgCardTopFlex}>
                  <div className={`${style.imgIconWrapper} ${style.bgIconLightBlue}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <span className={style.imgBadgeGreen}>↗ +12%</span>
                </div>
                <div className={style.imgCardMetaLabel}>TOTAL ESTUDIANTES</div>
                <div className={style.imgCardValue}>1,284</div>
              </div>

              <div className={style.imgMiniCard}>
                <div className={style.imgCardTopFlex}>
                  <div className={`${style.imgIconWrapper} ${style.bgIconLightMint}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <path d="M10 2v8L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45L14 10V2z" />
                      <line x1="6" y1="2" x2="18" y2="2" />
                    </svg>
                  </div>
                  <span className={style.imgTextRightLabel}>Activos ahora</span>
                </div>
                <div className={style.imgCardMetaLabel}>LABS ACTIVOS</div>
                <div className={style.imgCardValue}>42</div>
              </div>

              <div className={style.imgMiniCard}>
                <div className={style.imgCardTopFlex}>
                  <div className={`${style.imgIconWrapper} ${style.bgIconLightPink}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <span className={style.imgBadgeCyan}>✓ Alta</span>
                </div>
                <div className={style.imgCardMetaLabel}>EFICIENCIA DE IA</div>
                <div className={style.imgCardValue}>94.8%</div>
              </div>

              <div className={style.imgMiniCard}>
                <div className={style.imgCardTopFlex}>
                  <div className={`${style.imgIconWrapper} ${style.bgIconLightGray}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <span className={style.imgTextRightLabel}>Promedio</span>
                </div>
                <div className={style.imgCardMetaLabel}>ÉXITO DE LAB</div>
                <div className={style.imgCardValue}>87.2%</div>
              </div>
            </div>

            {/* Fila Inferior: Tendencia y Estado de laboratorios */}
            <div className={style.imgBottomGrid}>
              <div className={style.imgBigCard}>
                <div className={style.imgGraphHeader}>
                  <h3 className={style.imgCardTitle}>Tendencia de Actividad en Laboratorio</h3>
                  <div className={style.imgLegendsGroup}>
                    <div className={style.imgLegendItem}>
                      <span className={`${style.legendDot} ${style.dotDarkBlue}`}></span>Completados
                    </div>
                    <div className={style.imgLegendItem}>
                      <span className={`${style.legendDot} ${style.dotMint}`}></span>En progreso
                    </div>
                  </div>
                </div>

                <div className={style.imgLineGraphArea}>
                  <svg viewBox="0 0 500 200" width="100%" height="100%">
                    <path d="M 30 150 Q 110 145, 190 120 T 350 95 T 470 70" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="190" cy="120" r="4" fill="#0f172a" />
                    <circle cx="470" cy="70" r="4" fill="#0f172a" />
                    <path d="M 30 170 Q 110 155, 190 140 T 350 125 T 470 110" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className={style.imgMonthsXAxis}>
                  <span>Enc</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span>
                </div>
              </div>

              <div className={style.imgBigCard} style={{ flex: '0 0 320px' }}>
                <h3 className={style.imgCardTitle}>Estado de Laboratorios</h3>
                <div className={style.imgCircleWrapperCenter}>
                  <svg width="150" height="150" viewBox="0 0 36 36" className={style.imgCircularSvg}>
                    <path className={style.imgCircleBack} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className={style.imgCircleFront} strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className={style.imgCircleTextInside}>
                    <div className={style.imgPercentNumber}>85%</div>
                    <div className={style.imgPercentSub}>En tiempo</div>
                  </div>
                </div>

                <div className={style.imgStatusList}>
                  <div className={style.imgStatusRow}>
                    <div><span className={`${style.legendDot} ${style.dotMint}`}></span> Activos</div>
                    <strong>28</strong>
                  </div>
                  <div className={style.imgStatusRow}>
                    <div><span className={`${style.legendDot} ${style.dotLila}`}></span> Completados</div>
                    <strong>142</strong>
                  </div>
                  <div className={style.imgStatusRow}>
                    <div><span className={`${style.legendDot} ${style.dotPink}`}></span> Vencidos</div>
                    <strong>12</strong>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ========================================================= */
          /* FASE 2: SECCIÓN IMPLEMENTADA DESDE image_284400.png      */
          /* ========================================================= */
          <div className={style.imgBottomGrid}>
            
            {/* Bloque Tabla: Reportes de Laboratorio Recientes */}
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

            {/* Bloque Panel Lateral: Actividad de Estudiantes */}
            <div className={style.imgBigCard} style={{ flex: '0 0 340px' }}>
              <h3 className={style.phase2CardTitle} style={{ marginBottom: '24px' }}>Actividad de Estudiantes</h3>
              
              <div className={style.activityFeedContainer}>
                {/* Actividad 1 */}
                <div className={style.activityFeedItem}>
                  <div className={`${style.activityIconBox} ${style.activityMintIcon}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <div className={style.activityTextContent}>
                    <p className={style.activityRowPara}><strong>Elena Marín</strong> completó el Lab de Electromagnetismo.</p>
                    <span className={style.activityTimeSpan}>Hace 12 minutos</span>
                  </div>
                </div>

                {/* Actividad 2 */}
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

                {/* Actividad 3 */}
                <div className={style.activityFeedItem}>
                  <div className={`${style.activityIconBox} ${style.activityRedIcon}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div className={style.activityTextContent}>
                    <p className={style.activityRowPara}><strong>3 Estudiantes</strong> tienen reportes vencidos.</p>
                    <span className={style.activityTimeSpan}>Hace 3 horas</span>
                  </div>
                </div>
              </div>

              {/* Botón Ver Historial Completo */}
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