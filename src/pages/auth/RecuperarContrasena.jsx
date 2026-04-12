import AuthLayout from "../../layouts/AuthLayout";
import AuthForm from "../../components/UI/auth/AuthForm";
import AuthInput from "../../components/UI/auth/AuthInput";
import AuthButton from "../../components/UI/auth/AuthButton";
import AuthTextLink from "../../components/UI/auth/AuthTextLink";
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import style from "./RecuperarContrasena.module.css";


function RecuperarContrasena() {

    const { showModal } = useModal();
    const navigate = useNavigate();

    const handleRecuperar = (e) => {
        e.preventDefault();
        
        showModal(
            'success', 
            'Si el correo está registrado y activo, se enviará un enlace de recuperación en los próximos minutos. Revise la bandeja de entrada o correo no deseado.'
        );
        
        // Opcional: Redirigir al inicio después de unos segundos
        navigate('/'); 
    };

    return (
        <AuthLayout>
            <div className={style.ubicacion}>
                <AuthForm onSubmit={handleRecuperar}>
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