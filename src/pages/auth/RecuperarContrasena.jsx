import AuthLayout from "../../layouts/AuthLayout";
import AuthForm from "../../components/UI/AuthForm";
import AuthInput from "../../components/UI/AuthInput";
import AuthButton from "../../components/UI/AuthButton";
import AuthTextLink from "../../components/UI/AuthTextLink";
import style from "./RecuperarContrasena.module.css";


function RecuperarContrasena() {
    return (
        <AuthLayout>
            <div className={style.ubicacion}>
                <AuthForm>
                    <AuthInput label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" required></AuthInput>
                    <div className={style.espacio}>
                        <AuthButton type="submit">Enviar enlace de recuperación</AuthButton>
                    </div>
                    <AuthTextLink to="/">Volver a Inicio de sesión</AuthTextLink>
                </AuthForm>
            </div>
        </AuthLayout>
    );
}
export default RecuperarContrasena;