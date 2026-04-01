import { Routes, Route, Navigate } from "react-router-dom";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import LaboratorioAdmin from "../pages/admin/LaboratorioAdmin";
import UsuariosAdmin from "../pages/admin/UsuariosAdmin";
import PerfilAdmin from "../pages/admin/PerfilAdmin";
import GestionAdmin from "../pages/admin/GestionAdmin";
import ConfiguracionAdmin from "../pages/admin/ConfiguracionAdmin";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<DashboardAdmin />} />
      <Route path="laboratorio" element={<LaboratorioAdmin />} />
      <Route path="usuarios" element={<UsuariosAdmin />} />
      <Route path="perfil" element={<PerfilAdmin />} />
      <Route path="gestionadmin" element={<GestionAdmin />} />
      <Route path="configuracion" element={<ConfiguracionAdmin />} />

      <Route path="/" element={<Navigate to="dashboard" />} />
    </Routes>
  )
}

export default AdminRoutes
