import { FlaskConical, Users, ToggleLeft, FileText, Eye, Edit, Sparkles } from 'lucide-react';
import AdminLayout from "../../layouts/AdminLayout";
import AdminCardContainer from "../../components/UI/admin/AdminCardContainer";
import AdminDataTable from "../../components/UI/admin/AdminDataTable";
import AdminIconButton from "../../components/UI/admin/AdminIconButton";
import { getRelativeTime } from '../../utils/dateHelpers';
import style from "./DashboardAdmin.module.css";

function DashboardAdmin() {
  // Datos mockeados basados en tus archivos previos (LabRepositorioDeLabs y UsuariosAdmin)
  const ultimosLaboratorios = [
    { id: 1, nombre_de_laboratorio: "Cinemática del Punto", categoria: "Cinemática", fecha_creacion: "2026-05-15T14:20:00Z" },
    { id: 2, nombre_de_laboratorio: "Campos Magnéticos", categoria: "Electromagnetismo", fecha_creacion: "2026-05-10T09:15:00Z" },
    { id: 3, nombre_de_laboratorio: "Óptica Geométrica", categoria: "Física Óptica", fecha_creacion: "2026-05-01T16:45:00Z" }
  ];

  const columnasLabs = [
    { label: "Laboratorio Reciente" },
    { label: "Categoría" },
    { label: "Modificado" },
    { label: "Acciones", style: { textAlign: 'center' } }
  ];

  return (
    <AdminLayout>
      <div className={style.layout}>
        
        {/* HEADER SECTION */}
        <div className={style.headerSection}>
          <h2 className={style.title}>Panel de Control Administrativo</h2>
        </div>

        {/* 1. FILA DE TARJETAS (KPIs) */}
        <div className={style.kpiGrid}>
          <div className={style.kpiCard}>
            <div className={`${style.iconWrapper} ${style.bgLab}`}>
              <FlaskConical size={22} color="#18ffba" />
            </div>
            <div className={style.kpiInfo}>
              <h3>12</h3>
              <p>Total Laboratorios</p>
            </div>
          </div>

          <div className={style.kpiCard}>
            <div className={`${style.iconWrapper} ${style.bgActive}`}>
              <ToggleLeft size={22} color="#05cd99" />
            </div>
            <div className={style.kpiInfo}>
              <h3>10</h3>
              <p>Guías Activas</p>
            </div>
          </div>

          <div className={style.kpiCard}>
            <div className={`${style.iconWrapper} ${style.bgUsers}`}>
              <Users size={22} color="#422AFB" />
            </div>
            <div className={style.kpiInfo}>
              <h3>54</h3>
              <p>Usuarios Totales</p>
            </div>
          </div>

          <div className={style.kpiCard}>
            <div className={`${style.iconWrapper} ${style.bgAi}`}>
              <FileText size={22} color="#FFBC11" />
            </div>
            <div className={style.kpiInfo}>
              <h3>85%</h3>
              <p>Eficiencia IA</p>
            </div>
          </div>
        </div>

        {/* 2. DISTRIBUCIÓN PRINCIPAL (GRILLA DE DOS COLUMNAS) */}
        <div className={style.mainGrid}>
          
          {/* Bloque Izquierdo: Tabla de Guías Recientes */}
          <div className={style.tableSection}>
            <AdminCardContainer>
              <h3 className={style.panelSubtitle}>Últimas Plantillas Configuradas</h3>
              <AdminDataTable 
                columns={columnasLabs}
                data={ultimosLaboratorios}
                renderRow={(lab) => (
                  <tr key={lab.id}>
                    <td className={style.nombreLab}>{lab.nombre_de_laboratorio}</td>
                    <td><span className={style.categoriaBadge}>{lab.categoria}</span></td>
                    <td title={new Date(lab.fecha_creacion).toLocaleString()}>{getRelativeTime(lab.fecha_creacion)}</td>
                    <td className={style.actionsCell}>
                      <AdminIconButton icon={Eye} type="detail" title="ver" />
                      <AdminIconButton icon={Edit} type="edit" title="editar" />
                    </td>
                  </tr>
                )}
              />
            </AdminCardContainer>
          </div>

          {/* Bloque Derecho: Herramientas Rápidas de IA */}
          <div className={style.sideSection}>
            <div className={style.aiBanner}>
              <div className={style.aiHeader}>
                <Sparkles size={20} color="#18ffba" />
                <h4>Asistente de Contenido IA</h4>
              </div>
              <p>Optimiza la redacción de tus nuevas guías pedagógicas. Genera marcos teóricos y resúmenes automáticos al instante.</p>
              <button type="button" className={style.btnIaGradient}>
                ✨ Diseñar Nueva Guía
              </button>
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}

export default DashboardAdmin;