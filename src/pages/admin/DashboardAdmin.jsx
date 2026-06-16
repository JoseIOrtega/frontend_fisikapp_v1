import React, { useEffect, useState } from 'react';
import { API_CONFIG } from  "../../services/apiConfig";
import { useNavigate } from 'react-router-dom'; // 1. Importamos useNavigate para la redirección
import { 
  FlaskConical, 
  Users, 
  Bolt, 
  Pencil, 
  Eye, 
  CheckCircle2 
} from 'lucide-react'; 
import AdminLayout from "../../layouts/AdminLayout";
import AdminCardContainer from "../../components/UI/admin/AdminCardContainer";
import AdminDataTable from "../../components/UI/admin/AdminDataTable";
import AdminIconButton from "../../components/UI/admin/AdminIconButton";
import { getDashboardStats } from "../../services/admin/DashboardService";
import { getLaboratorios } from "../../services/admin/adminLab"; 
import style from "./DashboardAdmin.module.css";

function DashboardAdmin() {
  const navigate = useNavigate(); // 2. Inicializamos el hook de navegación
  
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
  
  const [laboratoriosReales, setLaboratoriosReales] = useState([]);
  const [loadingLabs, setLoadingLabs] = useState(true);

  const [perfil, setPerfil] = useState(null);

useEffect(() => {

  const cargarPerfil = async () => {

    try {

      const response = await fetch(
        API_CONFIG.ENDPOINTS.ADMIN.PERFIL,
        {
          headers: API_CONFIG.getHeaders()
        }
      );

      const data = await response.json();

      setPerfil(data);

    } catch (error) {
      console.error("Error cargando perfil:", error);
    }

  };

  cargarPerfil();

}, []);

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

  const fetchLaboratoriosReales = async (isSilent = false) => {
    try {
      if (!isSilent) {
        setLoadingLabs(true);
      }
      const data = await getLaboratorios();
      const ultimosConfigurados = data.slice(-3).reverse(); 
      setLaboratoriosReales(ultimosConfigurados);
    } catch (error) {
      console.error('Error al cargar laboratorios de la base de datos:', error);
    } finally {
      if (!isSilent) {
        setLoadingLabs(false);
      }
    }
  };

  useEffect(() => {
    fetchDashboardMetrics();
    fetchLaboratoriosReales(false);

    const intervalId = setInterval(() => {
      fetchDashboardMetrics();
      fetchLaboratoriosReales(true); 
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // --- COMPORTAMIENTO DE ACCIONES (INTEGRACIÓN) ---
  const handleEdit = (lab) => {
    // Guarda el objeto en localStorage idéntico a RepositorioDeLabs para no romper la edición de tu compañero
    localStorage.setItem("fisikapp_laboratorio_en_edicion", JSON.stringify(lab));
    navigate("/admin/laboratorio/configurar_labs");
  };

  const handleView = (lab) => {
    navigate(`/admin/laboratorio/repositorio_labs/${lab.id}`);
  };

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

  const formatearFecha = (fechaString) => {
    if (!fechaString) return "Sin fecha";
    try {
      const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-ES', opciones).replace('.', '');
    } catch (e) {
      return fechaString;
    }
  };

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
              <p>Laboratorios Activos</p>
              <h3>{dashboardMetrics.loading ? '...' : dashboardMetrics.activeLabsCount.toLocaleString()}</h3>
            </div>
            <div className={`${style.iconWrapper} ${style.bgLabActive}`}>
              <FlaskConical size={22} color="#00cc99" />
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
                  src={perfil?.foto_url || "/avatar-default.png"}
                  alt={perfil?.nombre}
                  className={style.avatarImg}
              />
              <CheckCircle2 className={style.statusBadgeIcon} size={20} />
            </div>
            <div className={style.profileInfo}>
              <h4>{perfil?.nombre || "Cargando..."}</h4>
              <p>{perfil?.rol === "admin" ? "Administrador" : perfil?.rol}</p>
            </div>
            <div className={style.profileFooter}>
              <div className={style.footerGroupLeft}>
                <span className={style.footerLabel}>Estado</span>
                  <span className={style.statusBadgeActive}>{
                      perfil?.estado ? "ACTIVO" : "INACTIVO"}
                  </span>
              </div>
              <div className={style.footerGroupRight}>
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
                  {dashboardMetrics.loading ? '...' : `${dashboardMetrics.activePercentage}%`}
                </span>
              </div>
              <div className={style.legendRow}>
                <div className={style.legendItemLeft}>
                  <span className={`${style.legendDot} ${style.dotInactive}`} />
                  <span className={style.legendName}>Inactivos</span>
                </div>
                <span className={style.legendVal}>
                  {dashboardMetrics.loading ? '...' : `${dashboardMetrics.inactivePercentage}%`}
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
            
            {loadingLabs ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#142050', fontWeight: 'bold' }}>
                Cargando laboratorios desde la base de datos...
              </div>
            ) : laboratoriosReales.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                No se encontraron laboratorios registrados.
              </div>
            ) : (
              <AdminDataTable 
                columns={columnasLabs}
                data={laboratoriosReales}
                renderRow={(lab) => (
                  <tr key={lab.id}>
                    <td className={style.nombreLab}>#lab-{lab.id}</td>
                    <td className={style.cellNameStyle}>{lab.nombre_de_laboratorio}</td>
                    <td className={style.cellDateStyle}>{formatearFecha(lab.fecha_creacion)}</td>
                    <td className={style.actionsCell}>
                      {/* CAMBIO: Botones con eventos onClick enlazados y control de estado de bloqueo */}
                      <AdminIconButton 
                        icon={Pencil} 
                        type="edit" 
                        title="editar" 
                        onClick={() => handleEdit(lab)}
                        disabled={lab.estado !== "Activo"} 
                      />
                      <AdminIconButton 
                        icon={Eye} 
                        type="detail" 
                        title="ver" 
                        onClick={() => handleView(lab)}
                      />
                    </td>
                  </tr>
                )}
              />
            )}
          </AdminCardContainer>
        </div>

      </div>
    </AdminLayout>
  );
}

export default DashboardAdmin;