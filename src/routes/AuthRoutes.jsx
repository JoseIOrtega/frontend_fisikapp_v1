import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import RegistrarUsuario from "../pages/auth/RegistrarUsuario";
import RecuperarContrasena from "../pages/auth/RecuperarContrasena";
import RestablecerContrasena from "../pages/auth/RestablecerContrasena";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registrar-usuario" element={<RegistrarUsuario/>} />
      <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
      <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
    </Routes>
  );
}

export default AuthRoutes;