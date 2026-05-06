import { Routes, Route, Navigate } from "react-router-dom";
import DashboardDocente from "../pages/docentes/DashboardDocente";
import MisLaboratoriosDocente from "../pages/docentes/MisLaboratoriosDocente";
import MisEstudiantesDocente from "../pages/docentes/MisEstudiantesDocente";
import HistorialReportes from "../pages/docentes/HistorialReportesDocente";
import PerfilDocente from "../pages/docentes/PerfilDocente";
import ConfiguracionDocente from "../pages/docentes/ConfiguracionDocente";


function DocenteRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<DashboardDocente />} />
      <Route path="mis-laboratorios" element={<MisLaboratoriosDocente/>} />
      <Route path="mis-estudiantes" element={<MisEstudiantesDocente/>} />
      <Route path="reportes" element={<HistorialReportes/>} />
      <Route path="perfil" element={<PerfilDocente/>} />
      <Route path="configuracion" element={<ConfiguracionDocente />} />

      <Route path="/" element={<Navigate to="dashboard" />} />
    </Routes>
  );
}

export default DocenteRoutes;