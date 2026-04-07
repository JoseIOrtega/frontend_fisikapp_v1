import AuthLayout from "../../layouts/AuthLayout";
import AuthForm from "../../components/UI/AuthForm";
import AuthInput from "../../components/UI/AuthInput"; 
import AuthTextLink from "../../components/UI/AuthTextLink";
import AuthButton from "../../components/UI/AuthButton";
import { useModal } from '../../context/ModalContext';
import { useNavigate } from 'react-router-dom'; // 1. Importación necesaria
import style from './RegistrarUsuario.module.css';

function RegistrarUsuario() {
    const { showModal } = useModal();
    const navigate = useNavigate(); // 2. Inicializamos el navegador

    const handleRegistro = (e) => {
        e.preventDefault();

        // 3. Simulación para pruebas (luego esto vendrá del backend)
        const registroExitoso = true; 
        const correoRepetido = false;
        const passwordDistinto = false;

        if (registroExitoso) {
            showModal('success', '¡Cuenta creada! Ya puedes iniciar sesión con tu correo.');
            navigate('/'); // Te manda al login
        } 
        else if (correoRepetido) {
            showModal('warning', 'Este correo ya tiene una cuenta. Intenta recuperar tu contraseña.');
        } 
        else if (passwordDistinto) {
            showModal('error', 'Las contraseñas no coinciden. Por favor, verifícalas.');
        }
    };

    return (
        <AuthLayout>
            <div className={style.ubicacion}>
                {/* 4. Agregamos el onSubmit aquí para que el botón funcione */}
                <AuthForm onSubmit={handleRegistro}>
                    <AuthInput label="Nombre completo" placeholder="Ej. Juan Pérez" required />
                    <AuthInput label="Número de Identificación" type="text" placeholder="Documento de identidad" required />
                    <AuthInput label="Fecha de Nacimiento" type="date" required />
                    <AuthInput label="Institución / Colegio" placeholder="Nombre de tu institución" required />
                    <AuthInput label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" required />
                    <AuthInput label="Contraseña" type="password" placeholder="••••••••" required />
                    <AuthInput label="Confirmar contraseña" type="password" placeholder="••••••••" required />
                    
                    <AuthTextLink to="/">¿Ya tienes cuenta? Inicia sesión</AuthTextLink>

                    <div className={style.buttonContainer}>
                        <AuthButton type="submit">Regístrate ahora</AuthButton>
                    </div>
                </AuthForm>
            </div>
        </AuthLayout>
    );
}

export default RegistrarUsuario;