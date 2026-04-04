import AuthLayout from "../../layouts/AuthLayout";
import AuthForm from "../../components/UI/AuthForm";
import AuthInput from "../../components/UI/AuthInput";
import AuthTextLink from "../../components/UI/AuthTextLink";
import AuthButton from "../../components/UI/AuthButton";
import style from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext'; // 1. Importamos el control remoto

function Login() {
    const navigate = useNavigate();
    const { showModal } = useModal(); // 2. Activamos el acceso al almacén de modales

    const handleRegisterClick = () => {
        navigate('/registrar-usuario'); 
    };

    const handleInciarSesionClick = (e) => {
        // Evitamos que el formulario se recargue solo si usas type="submit"
        if (e) e.preventDefault();

        // SIMULACIÓN DE PRUEBA:
        // Supongamos que validamos las credenciales aquí
        const loginExitoso = true; // Cambia esto a true para probar el éxito

        if (loginExitoso) {
            navigate('/admin');
        } else {
            // 3. ¡Disparamos el modal global!
            showModal(
                'error', 
                'Correo o contraseña incorrectos. Por favor, verifica tus datos e inténtalo de nuevo.'
            );
        }
    };

    return (
        <AuthLayout>
            <div className={style.ubicacion}>
                <AuthForm>
                    <AuthInput label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" required />
                    <AuthInput label="Contraseña" type="password" placeholder="***********" required />
                    
                    <AuthTextLink to="recuperar-contrasena">¿Olvidaste tu contraseña?</AuthTextLink>
            
                    <AuthButton type="button" onClick={handleInciarSesionClick}>Inicia sesión</AuthButton>
                    <AuthButton type="button" onClick={handleRegisterClick} variant="secondary">Regístrate</AuthButton>
                </AuthForm>
            </div>
        </AuthLayout>
    );
}

export default Login;
