import React, { useEffect, useState } from 'react';
import { 
  FlaskConical, 
  Users, 
  Bolt, 
  Trash2, 
  Pencil, 
  Eye, 
  CheckCircle2 
} from 'lucide-react'; 
import AdminLayout from "../../layouts/AdminLayout";
import AdminCardContainer from "../../components/UI/admin/AdminCardContainer";
import AdminDataTable from "../../components/UI/admin/AdminDataTable";
import AdminIconButton from "../../components/UI/admin/AdminIconButton";
import { getDashboardStats } from "../../services/admin/DashboardService";
import style from "./DashboardAdmin.module.css";

function DashboardAdmin() {
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalLaboratorios: 0,
    totalUsuariosAdmin: 0,
    eficienciaIA: 0,
    laboratoriosEliminados: 0,
    activeLabsCount: 0,
    inactiveLabsCount: 0,
    activePercentage: 0,
    inactivePercentage: 100,
    trend: { yearlyCounts: {}, last12MonthCounts: [], last12MonthLabels: [], years: [] },
    loading: true,
  });
  const [dashboardError, setDashboardError] = useState(null);

  const fetchDashboardMetrics = async () => {
    try {
      setDashboardError(null);
      const metrics = await getDashboardStats();
      setDashboardMetrics({ ...metrics, loading: false });
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      setDashboardError('No se pudieron cargar los indicadores en tiempo real.');
      setDashboardMetrics((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchDashboardMetrics();
    const intervalId = setInterval(fetchDashboardMetrics, 30000);
    return () => clearInterval(intervalId);
  }, []);
  const ultimosLaboratorios = [
    { id: 1, nombre_de_laboratorio: "Química Avanzada II", categoria: "Química", fecha_creacion: "12 Oct 2023" },
    { id: 2, nombre_de_laboratorio: "Física Newtoniana", categoria: "Física", fecha_creacion: "10 Oct 2023" },
    { id: 3, nombre_de_laboratorio: "Biología Celular - Mitosis", categoria: "Biología", fecha_creacion: "08 Oct 2023" }
  ];

  const yearlyCounts = dashboardMetrics.trend?.yearlyCounts || {};
  const yearlyYears = dashboardMetrics.trend?.years || [];
  const yearlyValues = yearlyYears.map((year) => yearlyCounts[year] || 0);
  const yearlyMax = Math.max(1, ...yearlyValues);

  const monthlyLabels = dashboardMetrics.trend?.last12MonthLabels || [];
  const monthlyValues = dashboardMetrics.trend?.last12MonthCounts || [];
  const monthlyMax = Math.max(1, ...monthlyValues);

  const columnasLabs = [
    { label: "ID Plantilla" },
    { label: "Nombre de Laboratorio" },
    { label: "Fecha" },
    { label: "Acciones", style: { textAlign: 'center' } }
  ];

  return (
    <AdminLayout>
      <div className={style.layout}>
        
        {/* 1. SECCIÓN SUPERIOR: TARJETAS MÉTRICAS (KPIs) */}
        <div className={style.kpiGrid}>
          <div className={style.kpiCard}>
            <div className={style.kpiInfo}>
              <p>Total de Laboratorios</p>
              <h3>{dashboardMetrics.loading ? '...' : dashboardMetrics.totalLaboratorios.toLocaleString()}</h3>
            </div>
            <div className={`${style.iconWrapper} ${style.bgLab}`}>
              <FlaskConical size={22} color="#00cc99" />
            </div>
          </div>

          <div className={style.kpiCard}>
            <div className={style.kpiInfo}>
              <p>Usuarios Admin</p>
              <h3>{dashboardMetrics.loading ? '...' : dashboardMetrics.totalUsuariosAdmin.toLocaleString()}</h3>
            </div>
            <div className={`${style.iconWrapper} ${style.bgUsers}`}>
              <Users size={22} color="#5f6368" />
            </div>
          </div>

          <div className={style.kpiCard}>
            <div className={style.kpiInfo}>
              <p>Eficiencia IA</p>
              <h3>{dashboardMetrics.loading ? '...' : `${dashboardMetrics.eficienciaIA}%`}</h3>
            </div>
            <div className={`${style.iconWrapper} ${style.bgAi}`}>
              <Bolt size={22} color="#1a73e8" />
            </div>
          </div>

          <div className={style.kpiCard}>
            <div className={style.kpiInfo}>
              <p>Laboratorios Eliminados</p>
              <h3>{dashboardMetrics.loading ? '...' : dashboardMetrics.laboratoriosEliminados.toLocaleString()}</h3>
            </div>
            <div className={`${style.iconWrapper} ${style.bgRed}`}>
              <Trash2 size={22} color="#d93025" />
            </div>
          </div>
        </div>

        {dashboardError && (
          <div style={{ margin: '1rem 0', color: '#d93025', fontWeight: 500 }}>
            {dashboardError}
          </div>
        )}

        {/* 2. SECCIÓN CENTRAL: PERFIL + GRÁFICOS */}
        <div className={style.chartsSectionGrid}>
          
          {/* Tarjeta Perfil */}
          <div className={style.profileCard}>
            <div className={style.avatarWrapper}>
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" 
                alt="Ana García" 
                className={style.avatarImg}
              />
              <CheckCircle2 className={style.statusBadgeIcon} size={20} />
            </div>
            <div className={style.profileInfo}>
              <h4>Ana García</h4>
              <p>Administrador</p>
            </div>
            <div className={style.profileFooter}>
              <div className={style.footerGroupLeft}>
                <span className={style.footerLabel}>Estado</span>
                <span className={style.statusBadgeActive}>ACTIVO</span>
              </div>
              <div className={style.footerGroupRight}>
                {/* Error solucionado aquí: cambiado de styles a style */}
                <span className={style.footerLabel}>Sesión</span>
                <span className={style.sessionTime}>12:45h</span>
              </div>
            </div>
          </div>

          {/* Tarjeta Gráfico Tendencia */}
          <div className={style.chartTrendCard}>
            <div className={style.chartHeaderFlex}>
              <div>
                <h3 className={style.chartPanelTitle}>Tendencia de Laboratorios</h3>
                <p className={style.chartPanelSub}>Últimos 12 meses de creación</p>
              </div>
              <span className={style.growthPercentage}>↗ +14.2%</span>
            </div>
            
            <div className={style.linearChartWrapper}>
              <div className={style.trendChartsContainer}>
                <div className={style.yearlyChart}>
                  <div className={style.chartTitle}>Crear por año</div>
                  <svg viewBox="0 0 200 140" preserveAspectRatio="none" className={style.svgYearly}>
                    <rect x="0" y="0" width="200" height="140" fill="none" />
                    {
                      yearlyYears.map((year, i) => {
                        const value = yearlyValues[i] || 0;
                        const h = Math.round((value / yearlyMax) * 100);
                        const x = 16 + i * 24;
                        const y = 125 - h;
                        return (
                          <g key={year}>
                            <rect x={x} y={y} width={18} height={h} rx="5" fill="#4facfe" opacity="0.95" />
                            <text x={x + 9} y="132" fontSize="9" fill="#ffffff" textAnchor="middle">{String(year).slice(-2)}</text>
                            <text x={x + 9} y={y - 6} fontSize="8" fill="#dbeafe" textAnchor="middle">{value}</text>
                          </g>
                        );
                      })
                    }
                  </svg>
                </div>

                <div className={style.monthlyChart}>
                  <div className={style.chartTitle}>Últimos 12 meses</div>
                  <div className={style.monthlyRows}>
                    {monthlyLabels.length === 0 ? (
                      <div className={style.noData}>No hay datos registrados aun.</div>
                    ) : (
                      monthlyLabels.map((label, i) => {
                        const value = monthlyValues[i] || 0;
                        const width = Math.round((value / monthlyMax) * 220);
                        return (
                          <div className={style.monthlyRow} key={label}>
                            <span className={style.monthLabel}>{label}</span>
                            <div className={style.rowTrack}>
                              <div className={style.rowBar} style={{ width: `${width}px` }} />
                            </div>
                            <span className={style.monthValue}>{value}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta Estado Operativo */}
          <div className={style.operationalStatusCard}>
            <div>
              <h3 className={style.chartPanelTitle}>Estado Operativo</h3>
              <p className={style.chartPanelSub}>Labs Activos vs Inactivos</p>
            </div>
            <div className={style.donutContainer}>
              <div className={style.donutWrapper}>
                <svg viewBox="0 0 36 36" className={style.svgDonut}>
                  <circle cx="18" cy="18" r="15.91" fill="none" stroke="#e2e8f0" strokeWidth="4.2" />
                  <circle 
                    cx="18" cy="18" r="15.91" fill="none" 
                    stroke="url(#donut-gradient)" strokeWidth="4.5" 
                    strokeDasharray={`${dashboardMetrics.activePercentage} ${dashboardMetrics.inactivePercentage}`} 
                    strokeDashoffset="0"
                  />
                  <defs>
                    <linearGradient id="donut-gradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#00f2fe" />
                      <stop offset="100%" stopColor="#4facfe" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div className={style.legendWrapper}>
              <div className={style.legendRow}>
                <div className={style.legendItemLeft}>
                  <span className={`${style.legendDot} ${style.dotActive}`} />
                  <span className={style.legendName}>Activos</span>
                </div>
                <span className={style.legendVal}>
                  {dashboardMetrics.loading ? '...' : `${dashboardMetrics.activePercentage}% (${dashboardMetrics.activeLabsCount})`}
                </span>
              </div>
              <div className={style.legendRow}>
                <div className={style.legendItemLeft}>
                  <span className={`${style.legendDot} ${style.dotInactive}`} />
                  <span className={style.legendName}>Inactivos</span>
                </div>
                <span className={style.legendVal}>
                  {dashboardMetrics.loading ? '...' : `${dashboardMetrics.inactivePercentage}% (${dashboardMetrics.inactiveLabsCount})`}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 3. SECCIÓN INFERIOR: TABLA DE PLANTILLAS */}
        <div className={style.tableSection}>
          <AdminCardContainer>
            <div className={style.tableHeaderFlex}>
              <h3 className={style.panelSubtitle}>Últimas Plantillas Configuradas</h3>
              <button type="button" className={style.viewAllButton}>Ver todas</button>
            </div>
            <AdminDataTable 
              columns={columnasLabs}
              data={ultimosLaboratorios}
              renderRow={(lab) => (
                <tr key={lab.id}>
                  <td className={style.nombreLab}>#LAB-90{lab.id}2</td>
                  <td className={style.cellNameStyle}>{lab.nombre_de_laboratorio}</td>
                  <td className={style.cellDateStyle}>{lab.fecha_creacion}</td>
                  <td className={style.actionsCell}>
                    <AdminIconButton icon={Pencil} type="edit" title="editar" />
                    <AdminIconButton icon={Eye} type="detail" title="ver" />
                  </td>
                </tr>
              )}
            />
          </AdminCardContainer>
        </div>

      </div>
    </AdminLayout>
  );
}

export default DashboardAdmin;