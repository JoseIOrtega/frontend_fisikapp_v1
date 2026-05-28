import React from 'react';
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
import style from "./DashboardAdmin.module.css";

function DashboardAdmin() {
  const ultimosLaboratorios = [
    { id: 1, nombre_de_laboratorio: "Química Avanzada II", categoria: "Química", fecha_creacion: "12 Oct 2023" },
    { id: 2, nombre_de_laboratorio: "Física Newtoniana", categoria: "Física", fecha_creacion: "10 Oct 2023" },
    { id: 3, nombre_de_laboratorio: "Biología Celular - Mitosis", categoria: "Biología", fecha_creacion: "08 Oct 2023" }
  ];

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
              <h3>124</h3>
            </div>
            <div className={`${style.iconWrapper} ${style.bgLab}`}>
              <FlaskConical size={22} color="#00cc99" />
            </div>
          </div>

          <div className={style.kpiCard}>
            <div className={style.kpiInfo}>
              <p>Usuarios Totales</p>
              <h3>1,240</h3>
            </div>
            <div className={`${style.iconWrapper} ${style.bgUsers}`}>
              <Users size={22} color="#5f6368" />
            </div>
          </div>

          <div className={style.kpiCard}>
            <div className={style.kpiInfo}>
              <p>Eficiencia IA</p>
              <h3>94%</h3>
            </div>
            <div className={`${style.iconWrapper} ${style.bgAi}`}>
              <Bolt size={22} color="#1a73e8" />
            </div>
          </div>

          <div className={style.kpiCard}>
            <div className={style.kpiInfo}>
              <p>Laboratorios Eliminados</p>
              <h3>3</h3>
            </div>
            <div className={`${style.iconWrapper} ${style.bgRed}`}>
              <Trash2 size={22} color="#d93025" />
            </div>
          </div>
        </div>

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
                <p className={style.chartPanelSub}>Crecimiento mensual acumulado</p>
              </div>
              <span className={style.growthPercentage}>↗ +14.2%</span>
            </div>
            
            <div className={style.linearChartWrapper}>
              <svg viewBox="0 0 500 150" className={style.svgLineChart}>
                <path
                  d="M0,120 Q30,110 60,115 T120,95 T180,110 T240,65 T300,90 T360,50 T420,15 T480,40 L500,40 L500,150 L0,150 Z"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3"
                  opacity="0.9"
                />
                <path
                  d="M0,120 Q30,110 60,115 T120,95 T180,110 T240,65 T300,90 T360,50 T420,15 T480,40 L500,40 L500,150 L0,150 Z"
                  fill="url(#chart-gradient)"
                  opacity="0.15"
                />
                <defs>
                  <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className={style.chartMonthsXAxis}>
                <span>Enero</span><span>Febrero</span><span>Marzo</span><span>Abril</span>
                <span>Mayo</span><span>Junio</span><span>Julio</span><span>Agosto</span>
                <span>Sept.</span><span>Oct.</span><span>Nov.</span><span>Dic.</span>
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
                    strokeDasharray="78 22" strokeDashoffset="0"
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
                <span className={style.legendVal}>78%</span>
              </div>
              <div className={style.legendRow}>
                <div className={style.legendItemLeft}>
                  <span className={`${style.legendDot} ${style.dotInactive}`} />
                  <span className={style.legendName}>Inactivos</span>
                </div>
                <span className={style.legendVal}>22%</span>
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