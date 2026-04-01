import AuthForm from "../../components/UI/AuthForm";
import AuthLayout from "../../layouts/AuthLayout";
import AuthInput from "../../components/UI/AuthInput"
import AuthTextLink from "../../components/UI/AuthTextLink";
import AuthButton from "../../components/UI/AuthButton";
import style from './Login.module.css';

function Login() {
    return (
        <AuthLayout>
            <div className={style.ubicacion}>
                <AuthForm>
                    <AuthInput label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" required></AuthInput>
                    <AuthInput label="Contraseña" type="password" placeholder="*****" required></AuthInput>
                    <AuthTextLink to="registrar-usuario">¿No eres usuario? Registrate</AuthTextLink>
            
                    <div className={style.buttonContainer}>
                        <AuthButton type="submit">Inicia sesión</AuthButton>
                    </div>
                </AuthForm>
            </div>

        </AuthLayout>
    );
}
export default Login;
