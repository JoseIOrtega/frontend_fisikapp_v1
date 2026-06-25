import { Routes, Route, Navigate } from "react-router-dom";
import DashboardDocente from "../pages/docentes/DashboardDocente";
import MisLaboratoriosDocente from "../pages/docentes/MisLaboratoriosDocente";
import MisEstudiantesDocente from "../pages/docentes/MisEstudiantesDocente";
import SesionesDocente from "../pages/docentes/SesionesDocente";
import HistorialReportes from "../pages/admin/HistorialReportesDocente";
import PerfilDocente from "../pages/docentes/PerfilDocente";
import ConfiguracionDocente from "../pages/docentes/ConfiguracionDocente";
import DocenteLayout from "../layouts/DocenteLayout";

// Componentes para configurar el laboratorio
import ConfigurarLaboratorio from "../pages/docentes/ConfigurarLaboratorio";
import ConfigurarEtapaConceptosBasicos from "../pages/docentes/ConfigurarEtapaConceptosBasicos"; 

function DocenteRoutes() {
  return (
    <Routes>
      {/* Contenedor padre del Layout */}
      <Route element={<DocenteLayout />}>
        {/* Rutas principales del Docente (Únicas) */}
        <Route path="dashboard" element={<DashboardDocente />} />
        <Route path="mis-laboratorios" element={<MisLaboratoriosDocente />} />
        <Route path="sesiones-docente" element={<SesionesDocente />} />
        <Route path="mis-estudiantes" element={<MisEstudiantesDocente />} />
        <Route path="reportes" element={<HistorialReportes />} />
        <Route path="perfil" element={<PerfilDocente />} />
        <Route path="configuracion" element={<ConfiguracionDocente />} />
        
        {/* Rutas dinámicas para la configuración de laboratorios */}
        <Route path="mis-laboratorios/configurar/:id" element={<ConfigurarLaboratorio />} />
        <Route path="mis-laboratorios/configurar/:id/etapa/:etapaId" element={<ConfigurarEtapaConceptosBasicos />} />

        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="dashboard" />} />
      </Route>
    </Routes>
  );
}

export default DocenteRoutes;