import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; // Ahora esta ruta sí funcionará

const RutaProtegida = ({ children, rolesPermitidos }) => {
    const { usuario, cargando } = useAuth();

    console.log("Estado actual:", { usuario, cargando }); // Mira esto en la consola

    if (cargando) return <p>Cargando sesión...</p>;

    if (!usuario) {
        console.log("No hay usuario, redirigiendo a /");
        return <Navigate to="/" />;
    }

    const rolUsuario = usuario.rol.toLowerCase();
    const rolesNormalizados = rolesPermitidos.map(r => r.toLowerCase());

    if (!rolesNormalizados.includes(rolUsuario)) {
        // Redirección inteligente según el rol si intenta entrar donde no debe
        return <Navigate to={rolUsuario === 'profesor' ? "/profesor/mis-laboratorios" : "/admin/dashboard"} />;
    }

    return children;
};

export default RutaProtegida;