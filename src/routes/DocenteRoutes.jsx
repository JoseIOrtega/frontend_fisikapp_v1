import { Routes, Route, Navigate } from "react-router-dom";
import DashboardDocente from "../pages/docentes/DashboardDocente";
import MisLaboratoriosDocente from "../pages/docentes/MisLaboratoriosDocente";
import LaboratoriosArchivadosDocente from "../pages/docentes/LaboratoriosArchivadosDocente";
import MisEstudiantesDocente from "../pages/docentes/MisEstudiantesDocente";
import HistorialReportes from "../pages/admin/HistorialReportesDocente";
import PerfilDocente from "../pages/docentes/PerfilDocente";
import ConfiguracionDocente from "../pages/docentes/ConfiguracionDocente";
import DocenteLayout from "../layouts/DocenteLayout";

// 1. Importa tu nuevo componente/página para configurar el laboratorio
import ConfigurarLaboratorio from "../pages/docentes/ConfigurarLaboratorio"; 

function DocenteRoutes() {
  return (
    <Routes>
      <Route element={<DocenteLayout />}>
        <Route path="dashboard" element={<DashboardDocente />} />
        <Route path="mis-laboratorios" element={<MisLaboratoriosDocente/>} />
        <Route path="mis-estudiantes" element={<MisEstudiantesDocente/>} />
        <Route path="reportes" element={<HistorialReportes/>} />
        <Route path="perfil" element={<PerfilDocente/>} />
        <Route path="configuracion" element={<ConfiguracionDocente />} />
      <Route path="dashboard" element={<DashboardDocente />} />
      <Route path="mis-laboratorios" element={<MisLaboratoriosDocente />} />
      
      {/* 2. Nueva ruta anidada con el parámetro dinámico :id */}
      <Route path="mis-laboratorios/configurar/:id" element={<ConfigurarLaboratorio />} />

      <Route path="archivados" element={<LaboratoriosArchivadosDocente />} />
      <Route path="mis-estudiantes" element={<MisEstudiantesDocente />} />
      <Route path="reportes" element={<HistorialReportes />} />
      <Route path="perfil" element={<PerfilDocente />} />
      <Route path="configuracion" element={<ConfiguracionDocente />} />

        <Route path="/" element={<Navigate to="dashboard" />} />
      </Route>
    </Routes>
  );
}

export default DocenteRoutes;