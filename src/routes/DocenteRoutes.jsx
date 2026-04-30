import { Routes, Route, Navigate } from "react-router-dom";
import DashboardDocente from "../pages/docentes/DashboardDocente";
/* 
  import MisLaboratorios from "../pages/docentes/MisLaboratorios";
  import MisEstudiantes from "../pages/docentes/MisEstudiantes";
  import PerfilDocente from "../pages/docentes/PerfilDocente";
*/

function DocenteRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<DashboardDocente />} />
      {/* 
      <Route path="mis-laboratorios" element={<div>Vista de Mis Laboratorios (Próximamente)</div>} />
      <Route path="mis-estudiantes" element={<div>Gestión de Estudiantes (Próximamente)</div>} />
      <Route path="perfil" element={<div>Mi Perfil (Próximamente)</div>} />
      <Route path="configuracion" element={<div>Configuración (Próximamente)</div>} />   */}

      <Route path="/" element={<Navigate to="dashboard" />} />
    </Routes>
  );
}

export default DocenteRoutes;