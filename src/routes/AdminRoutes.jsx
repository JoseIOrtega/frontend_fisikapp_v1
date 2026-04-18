import { Routes, Route, Navigate } from "react-router-dom";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import LabAuditoriaContenido from "../pages/admin/LabAuditoriaContenido";
import LabRepositorioDeLabs from "../pages/admin/LabRepositorioDeLabs";
import LabConfigurarLabs from "../pages/admin/LabConfigurarLabs";
import UsuariosAdmin from "../pages/admin/UsuariosAdmin";
import PerfilAdmin from "../pages/admin/PerfilAdmin";
import GestionAdmin from "../pages/admin/GestionAdmin";
import ConfiguracionAdmin from "../pages/admin/ConfiguracionAdmin";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<DashboardAdmin />} />
      <Route path="laboratorio" element={<Navigate to="laboratorio/repositorio_labs" />} />
      <Route path="laboratorio/auditoria_contenido" element={<LabAuditoriaContenido />} />
      <Route path="laboratorio/repositorio_labs" element={<LabRepositorioDeLabs />} />
      <Route path="laboratorio/configurar_labs" element={<LabConfigurarLabs />} />
      <Route path="usuarios" element={<UsuariosAdmin />} />
      <Route path="perfil" element={<PerfilAdmin />} />
      <Route path="gestionadmin" element={<GestionAdmin />} />
      <Route path="configuracion" element={<ConfiguracionAdmin />} />

      <Route path="/" element={<Navigate to="dashboard" />} />
    </Routes>
  )
}

export default AdminRoutes
