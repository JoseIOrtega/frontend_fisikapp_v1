import AuthLayout from "../../layouts/AuthLayout";
import "./RecuperarContrasena.module.css";
import { Link} from "react-router-dom";

function RecuperarContrasena() {
    return (
        <AuthLayout>
            <p className="logo-frase">"dgfbdfgdgfhdghdfhf"</p>
            <Link className="boton-volver-iniciar-sesion" to="/">Volver a iniciar sesión</Link>
        </AuthLayout>
    );
}
export default RecuperarContrasena;