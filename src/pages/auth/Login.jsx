import AuthLayout from "../../layouts/AuthLayout";
import AuthForm from "../../components/UI/AuthForm";
import AuthInput from "../../components/UI/AuthInput";
import AuthTextLink from "../../components/UI/AuthTextLink";
import AuthButton from "../../components/UI/AuthButton";
import style from './Login.module.css';
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/registrar-usuario'); 
    };


    return (
        <AuthLayout>
            <div className={style.ubicacion}>
                <AuthForm>
                    <AuthInput label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" required></AuthInput>
                    <AuthInput label="Contraseña" type="password" placeholder="***********" required></AuthInput>
                    
                    <AuthTextLink to="recuperar-contrasena">¿Olvidaste tu contraseña?</AuthTextLink>
            
                    <AuthButton type="submit">Inicia sesión</AuthButton>
                    <AuthButton type="button" onClick={handleRegisterClick} variant="secondary">Registrate</AuthButton>

                </AuthForm>
            </div>

        </AuthLayout>
    );
}
export default Login;
