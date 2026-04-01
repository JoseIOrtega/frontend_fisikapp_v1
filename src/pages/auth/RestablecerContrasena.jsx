import AuthLayout from "../../layouts/AuthLayout";
import "./RestablecerContrasena.module.css";
import { Link} from "react-router-dom";

function RestablecerContrasena() {
    return (
        <AuthLayout>
            <p className="logo-frase">"dgfbdfgdgfhdghdfhf"</p>
            <Link className="boton-volver-iniciar-sesion" to="/">Volver a iniciar sesión</Link>
        </AuthLayout>
    );
}
export default RestablecerContrasena;