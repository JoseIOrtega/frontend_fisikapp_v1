import React, { useState, useEffect } from 'react';
import Sidebar from '../../layouts/DocenteSidebar';
import style from "./DashboardDocente.module.css"; 

function DashboardProfesor() {
  const [esSuperAdmin, setEsSuperAdmin] = useState(false);
  const [faseActual, setFaseActual] = useState('fase1');
  
  // Estado para el filtro seleccionado ('dia', 'semana', 'mes')
  const [filtroTiempo, setFiltroTiempo] = useState('mes');
  // Estado para controlar la paginación dentro del gráfico
  const [paginaActual, setPaginaActual] = useState(0);

  // Reiniciar la página a cero cada vez que cambie el filtro de tiempo
  useEffect(() => {
    setPaginaActual(0);
  }, [filtroTiempo]);

  // Estructura de datos dinámica según la opción y la página actual
  const obtenerDatosGrafico = () => {
    if (filtroTiempo === 'mes') {
      if (paginaActual === 0) {
        return {
          labelsX: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
          labelsY: ["60", "50", "40", "30", "20", "10", "0"],
          pathCompletados: "M 10 120 Q 110 100, 190 70 T 330 60 T 430 40",
          pathProgreso: "M 10 140 Q 110 115, 190 95 T 330 85 T 430 70",
          nodoX: 190, nodoYCompletado: 70, nodoYProgreso: 95,
          tieneSiguiente: true, tieneAnterior: false
        };
      } else {
        return {
          labelsX: ["Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
          labelsY: ["60", "50", "40", "30", "20", "10", "0"],
          pathCompletados: "M 10 50 Q 110 80, 190 40 T 330 90 T 430 30",
          pathProgreso: "M 10 80 Q 110 110, 190 70 T 330 115 T 430 65",
          nodoX: 330, nodoYCompletado: 90, nodoYProgreso: 115,
          tieneSiguiente: false, tieneAnterior: true
        };
      }
    } 
    
    if (filtroTiempo === 'semana') {
      return {
        labelsX: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
        labelsY: ["60", "50", "40", "30", "20", "10", "0"],
        pathCompletados: "M 20 130 Q 140 40, 280 110 T 420 50",
        pathProgreso: "M 20 150 Q 140 70, 280 135 T 420 80",
        nodoX: 280, nodoYCompletado: 110, nodoYProgreso: 135,
        tieneSiguiente: false, tieneAnterior: false // No requiere paginación
      };
    }

    if (filtroTiempo === 'dia') {
      if (paginaActual === 0) {
        return {
          labelsX: ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00"],
          labelsY: ["60", "50", "40", "30", "20", "10", "0"],
          pathCompletados: "M 10 140 Q 110 60, 225 110 T 440 40",
          pathProgreso: "M 10 155 Q 110 85, 225 135 T 440 65",
          nodoX: 225, nodoYCompletado: 110, nodoYProgreso: 135,
          tieneSiguiente: true, tieneAnterior: false
        };
      } else {
        return {
          labelsX: ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
          labelsY: ["60", "50", "40", "30", "20", "10", "0"],
          pathCompletados: "M 10 40 Q 110 130, 225 60 T 440 120",
          pathProgreso: "M 10 65 Q 110 150, 225 85 T 440 145",
          nodoX: 225, nodoYCompletado: 60, nodoYProgreso: 85,
          tieneSiguiente: false, tieneAnterior: true
        };
      }
    }

    return {};
  };

  const datosActuales = obtenerDatosGrafico();

  // Manejadores de paginación lateral
  const manejarSiguiente = () => {
    if (datosActuales.tieneSiguiente) setPaginaActual(prev => prev + 1);
  };

  const manejarAnterior = () => {
    if (datosActuales.tieneAnterior) setPaginaActual(prev => prev - 1);
  };

  // Datos estáticos para reportes de la Fase 2
  const recientesReportes = [
    { id: "#LR-9821", initials: "MA", avatarClass: style.avatarMA, estudiante: "Marco Alonso", fecha: "Oct 12, 2023", laboratorio: "Electromagnetismo", estado: "PENDING", estadoClass: style.badgePending },
    { id: "#LR-9819", initials: "SR", avatarClass: style.avatarSR, estudiante: "Sofía Rodríguez", fecha: "Oct 11, 2023", laboratorio: "Dinámica de Fluidos", estado: "REVIEWED", estadoClass: style.badgeReviewed },
    { id: "#LR-9815", initials: "JV", avatarClass: style.avatarJV, estudiante: "Javier Vargas", fecha: "Oct 10, 2023", laboratorio: "Termodinámica", estado: "NEEDS FEEDBACK", estadoClass: style.badgeFeedback }
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
            <button type="button" className={style.btnDarkBorder}>Ver Calendario</button>
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

          <div className={style.paginationTabsContainer}>
            <button type="button" className={`${style.tabNavButton} ${faseActual === 'fase1' ? style.tabActive : ''}`} onClick={() => setFaseActual('fase1')}>
              1. Resumen y Estadísticas
            </button>
            <button type="button" className={`${style.tabNavButton} ${faseActual === 'fase2' ? style.tabActive : ''}`} onClick={() => setFaseActual('fase2')}>
              2. Reportes de Alumnos <span className={style.tabBadgeNotification}>4</span>
            </button>
          </div>
        </div>

        {faseActual === 'fase1' ? (
          <>
            {/* MINI TARJETAS */}
            <div className={style.imgMetricsRow}>
              <div className={style.imgMiniCard}>
                <div className={style.imgCardTopFlex}>
                  <div className={`${style.imgIconWrapper} ${style.bgIconLightBlue}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                  </div>
                  <span className={style.imgBadgeGreen}>↗ +12%</span>
                </div>
                <div className={style.imgCardMetaLabel}>TOTAL ESTUDIANTES</div>
                <div className={style.imgCardValue}>1,284</div>
              </div>

              <div className={style.imgMiniCard}>
                <div className={style.imgCardTopFlex}>
                  <div className={`${style.imgIconWrapper} ${style.bgIconLightMint}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M10 2v8L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45L14 10V2z" /></svg>
                  </div>
                  <span className={style.imgTextRightLabel}>Activos ahora</span>
                </div>
                <div className={style.imgCardMetaLabel}>LABS ACTIVOS</div>
                <div className={style.imgCardValue}>42</div>
              </div>

              <div className={style.imgMiniCard}>
                <div className={style.imgCardTopFlex}>
                  <div className={`${style.imgIconWrapper} ${style.bgIconLightPurple}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6 17h14M4 4.5A2.5 2.5 0 0 1 6 2h14v20H6a2.5 2.5 0 0 1-2.5-2.5V4.5z" /></svg>
                  </div>
                  <span className={style.imgTextRightLabel}>Grados</span>
                </div>
                <div className={style.imgCardMetaLabel}>TOTAL DE GRUPOS</div>
                <div className={style.imgCardValue}>16</div>
              </div>

              <div className={style.imgMiniCard}>
                <div className={style.imgCardTopFlex}>
                  <div className={`${style.imgIconWrapper} ${style.bgIconLightPink}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ee3280" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  </div>
                  <span className={style.imgBadgeCyan}>✓ Alta</span>
                </div>
                <div className={style.imgCardMetaLabel}>ACTIVIDADES ENTREGADAS</div>
                <div className={style.imgCardValue}>94.8%</div>
              </div>

              <div className={style.imgMiniCard}>
                <div className={style.imgCardTopFlex}>
                  <div className={`${style.imgIconWrapper} ${style.bgIconLightOrange}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                  </div>
                  <span className={style.imgTextRightLabel}>Promedio</span>
                </div>
                <div className={style.imgCardMetaLabel}>ACTIVIDADES CALIFICADAS</div>
                <div className={style.imgCardValue}>87.2%</div>
              </div>
            </div>

            {/* GRÁFICOS INTERACTIVOS */}
            <div className={style.imgBottomGrid}>
              <div className={style.imgBigCard}>
                <div className={style.imgGraphHeader}>
                  <h3 className={style.imgCardTitle}>Tendencia de Actividad en Laboratorio</h3>
                  
                  <div className={style.imgHeaderControlGroup}>
                    <div className={style.imgLegendsGroup}>
                      <div className={style.imgLegendItem}>
                        <span className={`${style.legendDot} ${style.dotPink}`}></span> Completados
                      </div>
                      <div className={style.imgLegendItem}>
                        <span className={`${style.legendDot} ${style.dotBlue}`}></span> En progreso
                      </div>
                    </div>

                    <div className={style.selectTimeContainer}>
                      <select 
                        className={style.selectTimeInput}
                        value={filtroTiempo}
                        onChange={(e) => setFiltroTiempo(e.target.value)}
                      >
                        <option value="dia">Día</option>
                        <option value="semana">Semana</option>
                        <option value="mes">Mes</option>
                      </select>
                      <span className={style.selectCustomArrow}>▼</span>
                    </div>
                  </div>
                </div>
                
                <div className={style.imgGraphContainerBox}>
                  <div className={style.imgGraphLayoutFlex}>
                    
                    {/* Plano / Eje Vertical Y (0 a 60 consecutivos de 10 en 10) */}
                    <div className={style.imgAxisY}>
                      {datosActuales.labelsY.map((label, idx) => (
                        <span key={idx} className={style.axisYLabel}>{label}</span>
                      ))}
                    </div>

                    <div className={style.paginationLayoutWrapper}>
                      {/* Flecha Izquierda de Paginación */}
                      <button 
                        type="button" 
                        className={`${style.arrowPageBtn} ${style.arrowLeft}`}
                        onClick={manejarAnterior}
                        disabled={!datosActuales.tieneAnterior}
                        style={{ opacity: datosActuales.tieneAnterior ? 1 : 0.3, cursor: datosActuales.tieneAnterior ? 'pointer' : 'not-allowed' }}
                      >
                        ‹
                      </button>

                      {/* Lienzo del Gráfico */}
                      <div className={style.imgCanvasWrapper}>
                        <div className={style.imgLineGraphArea}>
                          <svg viewBox="0 0 450 170" width="100%" height="100%" preserveAspectRatio="none">
                            {/* Cuadrícula Dinámica */}
                            <g stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4">
                              {/* Líneas Guías Horizontales correspondientes a 0, 10, 20, 30, 40, 50, 60 */}
                              <line x1="0" y1="5" x2="450" y2="5" />
                              <line x1="0" y1="31" x2="450" y2="31" />
                              <line x1="0" y1="57" x2="450" y2="57" />
                              <line x1="0" y1="83" x2="450" y2="83" />
                              <line x1="0" y1="109" x2="450" y2="109" />
                              <line x1="0" y1="135" x2="450" y2="135" />
                              <line x1="0" y1="162" x2="450" y2="162" />

                              {/* Líneas Guías Verticales según la cantidad de items en X */}
                              {datosActuales.labelsX.map((_, index) => {
                                const posX = 10 + (index * (430 / (datosActuales.labelsX.length - 1)));
                                return <line key={index} x1={posX} y1="0" x2={posX} y2="170" />;
                              })}
                            </g>

                            {/* Línea En progreso */}
                            <path d={datosActuales.pathProgreso} fill="none" stroke="#0083fe" strokeWidth="2.5" />
                            
                            {/* Línea Completados */}
                            <path d={datosActuales.pathCompletados} fill="none" stroke="#ee3280" strokeWidth="3" />
                            
                            {/* Nodos de Interacción */}
                            <circle cx={datosActuales.nodoX} cy={datosActuales.nodoYCompletado} r="5" fill="#ee3280" />
                            <circle cx={datosActuales.nodoX} cy={datosActuales.nodoYProgreso} r="4" fill="#0083fe" />
                          </svg>
                        </div>
                        
                        {/* Eje X Dinámico */}
                        <div className={style.imgMonthsXAxis}>
                          {datosActuales.labelsX.map((label, index) => (
                            <span key={index}>{label}</span>
                          ))}
                        </div>
                      </div>

                      {/* Flecha Derecha de Paginación */}
                      <button 
                        type="button" 
                        className={`${style.arrowPageBtn} ${style.arrowRight}`}
                        onClick={manejarSiguiente}
                        disabled={!datosActuales.tieneSiguiente}
                        style={{ opacity: datosActuales.tieneSiguiente ? 1 : 0.3, cursor: datosActuales.tieneSiguiente ? 'pointer' : 'not-allowed' }}
                      >
                        ›
                      </button>
                    </div>

                  </div>
                </div>
              </div>

              {/* Estado de Laboratorios */}
              <div className={style.imgBigCard} style={{ flex: '0 0 320px' }}>
                <h3 className={style.imgCardTitle}>Estado de Laboratorios</h3>
                <div className={style.imgCircleWrapperCenter}>
                  <svg width="150" height="150" viewBox="0 0 36 36" className={style.imgCircularSvg}>
                    <circle className={style.donutBgBase} cx="18" cy="18" r="15.915" />
                    <circle className={style.donutSegmentCompleted} cx="18" cy="18" r="15.915" strokeDasharray="75 100" strokeDashoffset="25" />
                    <circle className={style.donutSegmentActive} cx="18" cy="18" r="15.915" strokeDasharray="25 100" strokeDashoffset="50" />
                  </svg>
                  <div className={style.imgCircleTextInside}>
                    <div className={style.imgPercentNumber}>85%</div>
                    <div className={style.imgPercentSub}>En tiempo</div>
                  </div>
                </div>
                <div className={style.imgStatusList}>
                  <div className={style.imgStatusRow}>
                    <div className={style.legendItemLeft}>
                      <span className={`${style.legendDot} ${style.dotPink}`}></span> <span className={style.legendName}>Completados</span>
                    </div>
                    <strong className={style.legendVal}>142</strong>
                  </div>
                  <div className={style.imgStatusRow}>
                    <div className={style.legendItemLeft}>
                      <span className={`${style.legendDot} ${style.dotBlue}`}></span> <span className={style.legendName}>Activos</span>
                    </div>
                    <strong className={style.legendVal}>28</strong>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* VISTA 2: TABLA DE REPORTES RECIENTES */
          <div className={style.imgBottomGrid}>
            <div className={style.imgBigCard} style={{ flex: '2 1 600px' }}>
              <div className={style.imgGraphHeader} style={{ marginBottom: '20px' }}>
                <h3 className={style.phase2CardTitle}>Reportes de Laboratorio Recientes</h3>
                <button type="button" className={style.btnLinkText}>Ver todos</button>
              </div>
              <div className={style.phase2TableWrapper}>
                <table className={style.phase2Table}>
                  <thead>
                    <tr><th>ID REPORTE</th><th>ESTUDIANTE</th><th>FECHA</th><th>LABORATORIO</th><th style={{ textAlign: 'center' }}>ESTADO</th></tr>
                  </thead>
                  <tbody>
                    {recientesReportes.map((item, index) => (
                      <tr key={index}>
                        <td className={style.tableTdId}>{item.id}</td>
                        <td>
                          <div className={style.studentUserFlex}>
                            <div className={`${style.studentAvatar} ${item.avatarClass}`}>{item.initials}</div>
                            <span className={style.studentNameText}>{item.estudiante}</span>
                          </div>
                        </td>
                        <td className={style.tableTdDate}>{item.fecha}</td>
                        <td className={style.tableTdLab}>{item.laboratorio}</td>
                        <td style={{ textAlign: 'center' }}><span className={`${style.pillStatusBase} ${item.estadoClass}`}>{item.estado}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={style.imgBigCard} style={{ flex: '0 0 340px' }}>
              <h3 className={style.phase2CardTitle} style={{ marginBottom: '24px' }}>Actividad de Estudiantes</h3>
              <div className={style.activityFeedContainer}>
                <div className={style.activityFeedItem}>
                  <div className={`${style.activityIconBox} ${style.activityMintIcon}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                  </div>
                  <div className={style.activityTextContent}>
                    <p className={style.activityRowPara}><strong>Elena Marín</strong> completó el Lab de Electromagnetismo.</p>
                    <span className={style.activityTimeSpan}>Hace 12 minutos</span>
                  </div>
                </div>
                <div className={style.activityFeedItem}>
                  <div className={`${style.activityIconBox} ${style.activityBlueIcon}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  </div>
                  <div className={style.activityTextContent}>
                    <p className={style.activityRowPara}><strong>Daniel Soto</strong> envió una consulta sobre Cinemática.</p>
                    <span className={style.activityTimeSpan}>Hace 1 hora</span>
                  </div>
                </div>
              </div>
              <button type="button" className={style.btnDottedHistory}>Ver Historial Completo</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardProfesor;